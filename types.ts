export interface TripDetails {
  distance: number;
  duration: string;
  fuelConsumption: number;
  fuelCost: number;
  tollCost?: number;
  totalCost: number;
}

export interface SavedTrip {
  id: number;
  origin: string;
  destination: string;
  stops: string[];
  fuelEfficiency: string;
  fuelPrice: string;
  details: TripDetails;
  timestamp: number;
  isRoundTrip: boolean;
}