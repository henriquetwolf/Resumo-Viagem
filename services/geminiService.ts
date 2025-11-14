import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { TripDetails } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const presentTripDetailsFunctionDeclaration: FunctionDeclaration = {
    name: 'apresentar_detalhes_viagem',
    description: "Formata e retorna os detalhes de uma viagem de carro, incluindo distância, duração, consumo de combustível, custo de combustível, pedágios e custo total.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            distance: {
                type: Type.NUMBER,
                description: "Distância total da viagem em quilômetros."
            },
            duration: {
                type: Type.STRING,
                description: "Tempo de viagem estimado em formato legível, ex: '2 horas e 30 minutos'."
            },
            fuelConsumption: {
                type: Type.NUMBER,
                description: "Combustível total necessário para a viagem em litros."
            },
            fuelCost: {
                type: Type.NUMBER,
                description: "Custo total do combustível para a viagem na moeda especificada."
            },
            tollCost: {
                type: Type.NUMBER,
                description: "Custo total estimado com pedágios para a viagem. Retornar 0 se não houver pedágios."
            },
            totalCost: {
                type: Type.NUMBER,
                description: "Custo total da viagem, que é a soma do custo do combustível e do custo dos pedágios."
            }
        },
        required: ["distance", "duration", "fuelConsumption", "fuelCost", "tollCost", "totalCost"]
    }
};

export const getTripDetails = async (
    origin: string,
    destination: string,
    stops: string[],
    fuelEfficiency: number, // km/L
    fuelPrice: number, // price per Liter
    isRoundTrip: boolean
): Promise<TripDetails> => {

    const stopsInstruction = stops.length > 0
        ? `A rota deve incluir as seguintes paradas nesta ordem: ${stops.join(', ')}.`
        : "";

    const roundTripInstruction = isRoundTrip
        ? "Calcule esta como uma viagem de IDA E VOLTA. Isso significa que a distância, o consumo de combustível, o custo do combustível e os custos de pedágio devem ser o DOBRO do valor de uma viagem só de ida. A duração também deve refletir a viagem completa."
        : "";

    const prompt = `
        Primeiro, usando seu conhecimento sobre rotas e mapas, encontre a distância de carro mais provável (em km), a duração da viagem e o custo total estimado de pedágios para uma viagem de ${origin} para ${destination}.
        ${stopsInstruction}
        ${roundTripInstruction}
        Depois, com base nesses dados, calcule o consumo de combustível e o custo do combustível.
        Considere que a eficiência do carro é de ${fuelEfficiency} km/L e o preço do combustível é R$ ${fuelPrice} por litro.
        Calcule também o custo total da viagem, que é a soma do custo de combustível e do custo de pedágio.
        Finalmente, chame a função 'apresentar_detalhes_viagem' com todos os valores que você encontrou e calculou.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "Você é um assistente de cálculo de viagens. Seu único propósito é usar as ferramentas fornecidas para calcular e apresentar os detalhes da viagem. Você deve chamar a função `apresentar_detalalhes_viagem` e não fornecer uma resposta em texto livre.",
                tools: [{ functionDeclarations: [presentTripDetailsFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall && functionCall.name === 'apresentar_detalhes_viagem') {
            const { distance, duration, fuelConsumption, fuelCost, tollCost, totalCost } = functionCall.args;
            
            if (typeof distance !== 'number' || typeof duration !== 'string' || typeof fuelConsumption !== 'number' || typeof fuelCost !== 'number' || typeof tollCost !== 'number' || typeof totalCost !== 'number') {
                console.error("Invalid data types from function call args:", functionCall.args);
                throw new Error("Tipos de dados inválidos retornados da Chamada de Função do Gemini.");
            }

            return {
                distance,
                duration,
                fuelConsumption,
                fuelCost,
                tollCost,
                totalCost
            };
        } else {
            console.error("Gemini did not return the expected function call. Full response:", JSON.stringify(response, null, 2));
            throw new Error("O Gemini não retornou a chamada de função esperada.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Falha ao buscar os detalhes da viagem da API Gemini.");
    }
};