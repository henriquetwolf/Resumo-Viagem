import React, { useState, useCallback, useEffect } from 'react';
import { TripDetails, SavedTrip } from './types';
import { getTripDetails } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import TripInputForm from './components/TripInputForm';
import TripResult from './components/TripResult';
import SavedTripsList from './components/SavedTripsList';
import LoginScreen from './components/LoginScreen';
import { CarIcon, LogoIcon } from './components/Icons';

// Helper para mapear dados do Supabase (snake_case) para o estado da aplicação (camelCase)
const mapSupabaseTripToSavedTrip = (supabaseTrip: any): SavedTrip => {
    return {
        id: supabaseTrip.id,
        origin: supabaseTrip.origin,
        destination: supabaseTrip.destination,
        stops: supabaseTrip.stops,
        fuelEfficiency: supabaseTrip.fuel_efficiency,
        fuelPrice: supabaseTrip.fuel_price,
        details: supabaseTrip.details,
        timestamp: supabaseTrip.timestamp,
        isRoundTrip: supabaseTrip.is_round_trip,
    };
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>('São Paulo, SP');
  const [destination, setDestination] = useState<string>('Rio de Janeiro, RJ');
  const [stops, setStops] = useState<string[]>([]);
  const [fuelEfficiency, setFuelEfficiency] = useState<string>('12');
  const [fuelPrice, setFuelPrice] = useState<string>('5.50');
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [isFetchingTrips, setIsFetchingTrips] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsFetchingTrips(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
        setError(`Não foi possível carregar as viagens salvas: ${error.message}`);
      } else if (data) {
        setSavedTrips(data.map(mapSupabaseTripToSavedTrip));
      }
      setIsFetchingTrips(false);
    };

    if (isAuthenticated) {
      fetchTrips();
    }
  }, [isAuthenticated]);
  
  const handleLogin = (password: string): boolean => {
    if (password === '124412') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleCalculate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTripDetails(null);

    const efficiency = parseFloat(fuelEfficiency);
    const price = parseFloat(fuelPrice);
    const validStops = stops.every(stop => stop.trim() !== '');

    if (!origin || !destination || !validStops || isNaN(efficiency) || isNaN(price) || efficiency <= 0 || price <= 0) {
      setError('Por favor, preencha todos os campos com valores válidos, incluindo as paradas.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await getTripDetails(origin, destination, stops, efficiency, price, isRoundTrip);
      setTripDetails(result);
    } catch (e) {
      console.error(e);
      setError('Falha ao calcular os detalhes da viagem. O modelo pode não conseguir encontrar os locais ou calcular a rota. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [origin, destination, stops, fuelEfficiency, fuelPrice, isRoundTrip]);

  const handleSaveTrip = useCallback(async () => {
    if (!tripDetails) return;
    
    // Mapeia do estado (camelCase) para as colunas do Supabase (snake_case)
    const newTripData = {
        origin,
        destination,
        stops,
        fuel_efficiency: fuelEfficiency,
        fuel_price: fuelPrice,
        details: tripDetails,
        timestamp: Date.now(),
        is_round_trip: isRoundTrip,
    };

    const { data, error } = await supabase
        .from('trips')
        .insert([newTripData])
        .select()
        .single();

    if (error) {
        console.error('Error saving trip:', error);
        setError(`Falha ao salvar a viagem: ${error.message}`);
    } else if (data) {
        // Mapeia de volta para camelCase para atualizar o estado da UI
        setSavedTrips(prevTrips => [mapSupabaseTripToSavedTrip(data), ...prevTrips]);
    }
  }, [tripDetails, origin, destination, stops, fuelEfficiency, fuelPrice, isRoundTrip]);

  const handleDeleteTrip = useCallback(async (id: number) => {
      const originalTrips = [...savedTrips];
      // Atualização otimista da UI
      setSavedTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));

      const { error } = await supabase
          .from('trips')
          .delete()
          .match({ id: id });

      if (error) {
          console.error('Error deleting trip:', error);
          setError(`Falha ao excluir a viagem: ${error.message}`);
          setSavedTrips(originalTrips); // Reverte em caso de erro
      }
  }, [savedTrips]);

  const handleLoadTrip = useCallback((trip: SavedTrip) => {
      setOrigin(trip.origin);
      setDestination(trip.destination);
      setStops(trip.stops || []);
      setFuelEfficiency(trip.fuelEfficiency);
      setFuelPrice(trip.fuelPrice);
      setIsRoundTrip(trip.isRoundTrip ?? false);
      setTripDetails(null);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6">
      <header className="w-full max-w-2xl text-center mb-8">
        <p className="text-lg font-medium text-slate-300 mb-2">VOLL Pilates Group</p>
        <div className="flex items-center justify-center gap-4 mb-2">
            <LogoIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">Calculadora de Combustível</h1>
        </div>
        <p className="text-slate-400">Estime o custo e os recursos da sua jornada com precisão de IA.</p>
      </header>

      <main className="w-full max-w-2xl">
        <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8">
          <TripInputForm
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            stops={stops}
            setStops={setStops}
            fuelEfficiency={fuelEfficiency}
            setFuelEfficiency={setFuelEfficiency}
            fuelPrice={fuelPrice}
            setFuelPrice={setFuelPrice}
            isRoundTrip={isRoundTrip}
            setIsRoundTrip={setIsRoundTrip}
            onCalculate={handleCalculate}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
              {error}
            </div>
          )}

          {tripDetails ? (
            <TripResult 
              details={tripDetails} 
              onSave={handleSaveTrip} 
              isRoundTrip={isRoundTrip}
              origin={origin}
              destination={destination}
              stops={stops}
            />
          ) : (
            !isLoading && (
              <div className="mt-8 text-center text-slate-500 flex flex-col items-center gap-4 p-8 border-2 border-dashed border-slate-700 rounded-lg">
                  <CarIcon className="w-16 h-16 text-slate-600"/>
                  <p>Os detalhes da sua viagem aparecerão aqui após o cálculo.</p>
              </div>
            )
          )}
        </div>

        <SavedTripsList 
          trips={savedTrips} 
          onLoad={handleLoadTrip} 
          onDelete={handleDeleteTrip} 
          isLoading={isFetchingTrips} 
        />

      </main>
      
      <footer className="mt-8 text-center text-sm text-slate-500">
        <p>Desenvolvido com Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;