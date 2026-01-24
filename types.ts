// 1. Interface matching your Firestore Data exactly
export interface TouristSpot {
  Name: string;
  Type: string;
  Address: string;
  District: string;
  Grade: string | null;  // Grade can be null in your data
  "AGA Division"?: string; // Optional: Has space in key
  "PS/MC/UC"?: string;     // Optional: Has special chars
}

// 2. Type for a list of these spots
export type TravelData = TouristSpot[];

// 3. Interfaces for the AI Travel Plan Response
export interface TripItineraryItem {
  day: number;
  location: string;
  hotel: string;
  activity: string;
}

export interface TravelPlan {
  summary: string;
  estimatedCost: string;
  vehicleRecommendation: string;
  itinerary: TripItineraryItem[];
}