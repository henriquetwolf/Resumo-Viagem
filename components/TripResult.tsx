import React from 'react';
import { jsPDF } from 'jspdf';
import { TripDetails } from '../types';
import { DistanceIcon, DurationIcon, FuelIcon, CostIcon, TollIcon, SaveIcon, RoundTripIcon, TotalCostIcon, DownloadIcon } from './Icons';

interface TripResultProps {
  details: TripDetails;
  onSave: () => void;
  isRoundTrip: boolean;
  origin: string;
  destination: string;
  stops: string[];
}

const ResultCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    unit: string;
    color: string;
}> = ({ icon, label, value, unit, color }) => (
    <div className={`flex-1 p-4 bg-slate-700/50 rounded-lg flex items-center gap-4 border-l-4 ${color}`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="text-xl font-bold text-slate-100">
                <span className="text-base font-normal text-slate-300">{unit}</span> {value}
            </p>
        </div>
    </div>
);


const TripResult: React.FC<TripResultProps> = ({ details, onSave, isRoundTrip, origin, destination, stops }) => {
  
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let currentY = 0;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Resumo da Viagem', pageWidth / 2, 20, { align: 'center' });
    currentY = 30;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, currentY);
    doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5);
    currentY += 15;

    // Route Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Rota', margin, currentY);
    currentY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Origem: ${origin}`, margin, currentY);
    currentY += 7;
    if (stops.length > 0) {
        const stopsText = doc.splitTextToSize(`Paradas: ${stops.join(', ')}`, pageWidth - (margin * 2));
        doc.text(stopsText, margin, currentY);
        currentY += (stopsText.length * 5);
    }
    doc.text(`Destino: ${destination}`, margin, currentY);
    currentY += 7;
    if (isRoundTrip) {
      doc.setFont('helvetica', 'italic');
      doc.text('(Viagem de Ida e Volta)', margin, currentY);
      currentY += 7;
    }

    currentY += 5; // Extra space
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Costs and Metrics
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Detalhes e Custos', margin, currentY);
    currentY += 10;

    const createRow = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(label, margin, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, pageWidth / 2, currentY);
      currentY += 8;
    };

    createRow('Distância Total:', `${details.distance.toFixed(1)} km`);
    createRow('Duração Estimada:', details.duration);
    createRow('Combustível Necessário:', `${details.fuelConsumption.toFixed(2)} Litros`);
    createRow('Custo do Combustível:', `R$ ${details.fuelCost.toFixed(2)}`);
    if (details.tollCost && details.tollCost > 0) {
      createRow('Custo dos Pedágios:', `R$ ${details.tollCost.toFixed(2)}`);
    }

    currentY += 5;
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 12;

    // Total Cost
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('CUSTO TOTAL:', margin, currentY);
    doc.text(`R$ ${details.totalCost.toFixed(2)}`, pageWidth / 2, currentY);

    // Footer
    const footerY = pageHeight - 15;
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('Gerado pela Calculadora de Combustível com Google Gemini', pageWidth / 2, footerY, { align: 'center' });

    doc.save('resumo-viagem.pdf');
  };

  return (
    <div className="mt-8 animate-fade-in">
        <div className="p-6 bg-slate-800/50 rounded-lg">
            <div className="flex justify-center items-center mb-6">
                <h2 className="text-2xl font-bold text-cyan-400">Resumo da Viagem</h2>
                {isRoundTrip && (
                    <span className="ml-3 flex items-center text-sm font-medium bg-slate-700 text-cyan-300 px-3 py-1 rounded-full">
                        <RoundTripIcon className="w-4 h-4 mr-1.5" />
                        Ida e Volta
                    </span>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultCard 
                    icon={<DistanceIcon className="w-8 h-8 text-indigo-400"/>}
                    label="Distância Total"
                    value={details.distance.toFixed(1)}
                    unit="km"
                    color="border-indigo-500"
                />
                <ResultCard 
                    icon={<DurationIcon className="w-8 h-8 text-sky-400"/>}
                    label="Duração Estimada"
                    value={details.duration}
                    unit=""
                    color="border-sky-500"
                />
                <ResultCard 
                    icon={<FuelIcon className="w-8 h-8 text-amber-400"/>}
                    label="Combustível Necessário"
                    value={details.fuelConsumption.toFixed(2)}
                    unit="Litros"
                    color="border-amber-500"
                />
                <ResultCard 
                    icon={<CostIcon className="w-8 h-8 text-emerald-400"/>}
                    label="Custo Combustível"
                    value={details.fuelCost.toFixed(2)}
                    unit="R$"
                    color="border-emerald-500"
                />
                {details.tollCost && details.tollCost > 0 && (
                     <ResultCard 
                        icon={<TollIcon className="w-8 h-8 text-rose-400"/>}
                        label="Custo Pedágios"
                        value={details.tollCost.toFixed(2)}
                        unit="R$"
                        color="border-rose-500"
                    />
                )}
                 <div className="sm:col-span-2 mt-2">
                    <div className="flex-1 p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center gap-4 border-l-4 border-emerald-400">
                        <div className="text-3xl text-emerald-300">
                            <TotalCostIcon className="w-8 h-8"/>
                        </div>
                        <div>
                            <p className="text-slate-300 text-sm font-semibold">CUSTO TOTAL DA VIAGEM</p>
                            <p className="text-3xl font-bold text-white">
                                <span className="text-xl font-normal text-slate-300 align-baseline">R$ </span>{details.totalCost.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button
                onClick={onSave}
                className="flex items-center justify-center py-2 px-5 bg-slate-700 hover:bg-slate-600 text-cyan-300 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
                <SaveIcon className="w-5 h-5 mr-2" />
                Salvar Viagem
            </button>
            <button
                onClick={handleDownloadPdf}
                className="flex items-center justify-center py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Baixar PDF
            </button>
        </div>
    </div>
  );
};

export default TripResult;