import React from 'react';
import { LocationIcon, FuelIcon, PriceIcon, PlusCircleIcon, XCircleIcon } from './Icons';

interface TripInputFormProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  stops: string[];
  setStops: (value: string[]) => void;
  fuelEfficiency: string;
  setFuelEfficiency: (value: string) => void;
  fuelPrice: string;
  setFuelPrice: (value: string) => void;
  isRoundTrip: boolean;
  setIsRoundTrip: (value: boolean) => void;
  onCalculate: () => void;
  isLoading: boolean;
}

const InputField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
}> = ({ id, label, value, onChange, placeholder, type = 'text', icon }) => (
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {icon}
        </span>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
        />
    </div>
  </div>
);

const TripInputForm: React.FC<TripInputFormProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  stops,
  setStops,
  fuelEfficiency,
  setFuelEfficiency,
  fuelPrice,
  setFuelPrice,
  isRoundTrip,
  setIsRoundTrip,
  onCalculate,
  isLoading,
}) => {

  const handleAddStop = () => {
      setStops([...stops, '']);
  };

  const handleRemoveStop = (index: number) => {
      setStops(stops.filter((_, i) => i !== index));
  };

  const handleStopChange = (index: number, value: string) => {
      const newStops = [...stops];
      newStops[index] = value;
      setStops(newStops);
  };

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
                id="origin"
                label="Origem"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="ex: São Paulo, SP"
                icon={<LocationIcon className="w-5 h-5" />}
            />
            <InputField 
                id="destination"
                label="Destino"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="ex: Rio de Janeiro, RJ"
                icon={<LocationIcon className="w-5 h-5" />}
            />
        </div>

        <div className="space-y-4">
            {stops.map((stop, index) => (
                <div key={index} className="relative">
                     <label htmlFor={`stop-${index}`} className="block text-sm font-medium text-slate-300 mb-1">
                        Parada {index + 1}
                     </label>
                    <div className="relative flex items-center">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <LocationIcon className="w-5 h-5" />
                        </span>
                        <input
                            id={`stop-${index}`}
                            type="text"
                            value={stop}
                            onChange={(e) => handleStopChange(index, e.target.value)}
                            placeholder="ex: Campinas, SP"
                            className="w-full pl-10 pr-10 py-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                        />
                         <button
                            onClick={() => handleRemoveStop(index)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-red-400 transition-colors"
                            aria-label={`Remover Parada ${index + 1}`}
                        >
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
            <button
                onClick={handleAddStop}
                className="w-full flex justify-center items-center py-2 px-4 border-2 border-dashed border-slate-600 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 font-medium rounded-lg transition-colors duration-200"
            >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Adicionar Parada
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
                id="fuelEfficiency"
                label="Eficiência do Carro (km/L)"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
                placeholder="ex: 15"
                type="number"
                icon={<FuelIcon className="w-5 h-5" />}
            />
            <InputField 
                id="fuelPrice"
                label="Preço da Gasolina (por Litro)"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                placeholder="ex: 5.50"
                type="number"
                icon={<PriceIcon className="w-5 h-5" />}
            />
        </div>
        
        <div className="flex items-center justify-center pt-2">
            <label htmlFor="roundTrip" className="flex items-center cursor-pointer select-none text-slate-300">
                <input
                    type="checkbox"
                    id="roundTrip"
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full flex items-center transition-colors duration-300 ${isRoundTrip ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${isRoundTrip ? 'translate-x-5' : 'translate-x-1'}`}></div>
                </div>
                <span className="ml-3 font-medium">Calcular Ida e Volta</span>
            </label>
        </div>

        <button
            onClick={onCalculate}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
            {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculando...
            </>
            ) : (
            'Calcular Viagem'
            )}
        </button>
    </div>
  );
};

export default TripInputForm;