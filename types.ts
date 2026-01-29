// 1. Interface matching your Firestore Data exactly
export interface TouristSpot {
  Name: string;
  Type: string | null;
  Address: string | null;
  District: string | null;
  Grade: string | null;  // Grade can be null in your data
  "AGA Division"?: string; // Optional: Has space in key
  "PS/MC/UC"?: string;     // Optional: Has special chars
  SourceFile?: string;
  image_urls?: string[];
}

// 2. Type for a list of these spots
export type TravelData = TouristSpot[];

// 3. Interfaces for the AI Travel Plan Response
export interface TripItineraryItem {
  day: number;
  location: string;
  hotel: string;
  activity: string;
  image_url?: string;
}

export interface TravelPlan {
  summary: string;
  estimatedCost: string;
  vehicleRecommendation: string;
  itinerary: TripItineraryItem[];
}