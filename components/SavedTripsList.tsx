import React from 'react';
import { SavedTrip } from '../types';
import { TrashIcon, LoadIcon, RoundTripIcon } from './Icons';

interface SavedTripsListProps {
  trips: SavedTrip[];
  onLoad: (trip: SavedTrip) => void;
  onDelete: (id: string) => void;
}

const SavedTripsList: React.FC<SavedTripsListProps> = ({ trips, onLoad, onDelete }) => {
  if (trips.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mt-12">
      <h2 className="text-2xl font-bold text-slate-100 mb-4 text-center sm:text-left">Viagens Salvas</h2>
      <ul className="space-y-4">
        {trips.map(trip => {
          const totalCost = trip.details.totalCost ?? ((trip.details.fuelCost ?? 0) + (trip.details.tollCost ?? 0));
          const stopsText = trip.stops && trip.stops.length > 0
            ? <span className="text-slate-500 font-normal mx-1 text-sm">(via {trip.stops.join(', ')})</span>
            : null;

          return (
            <li 
              key={trip.id} 
              className="bg-slate-800/70 rounded-lg p-4 transition-all duration-300 hover:bg-slate-700/80 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-100 text-lg">
                            {trip.origin} <span className="text-slate-400 font-normal mx-1">→</span> {trip.destination}
                        </h3>
                        {stopsText}
                        {trip.isRoundTrip && (
                           <span className="flex-shrink-0 flex items-center text-xs font-medium bg-slate-700/80 text-cyan-400 px-2 py-0.5 rounded-full">
                                <RoundTripIcon className="w-3 h-3 mr-1" />
                                Ida e Volta
                           </span>
                        )}
                    </div>
                    <div className="text-sm text-slate-400 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                            Custo Total: <span className="font-semibold text-emerald-400">R$ {totalCost.toFixed(2)}</span>
                        </span>
                        <span>
                            Distância: <span className="font-semibold text-slate-200">{trip.details.distance.toFixed(1)} km</span>
                        </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button 
                        onClick={() => onLoad(trip)} 
                        title="Carregar Rota"
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 rounded-full hover:bg-slate-700"
                    >
                        <LoadIcon className="w-5 h-5"/>
                    </button>
                    <button 
                        onClick={() => onDelete(trip.id)} 
                        title="Excluir Rota"
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors duration-200 rounded-full hover:bg-slate-700"
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-right">
                Salvo em: {new Date(trip.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SavedTripsList;