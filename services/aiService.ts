// services/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TravelData, TravelPlan } from '../types';
// NOTE: For production, use an environment variable or a proxy.
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
export const generateTravelPlan = async (
  budget: string,
  days: string,
  selectedDestinations: string[],
  firestoreData: TravelData
): Promise<TravelPlan | null> => {

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Act as a Sri Lankan Travel Planner.
      Duration: ${days} Days.
      Destinations: ${selectedDestinations.join(", ")}.
      
      AVAILABLE DATA (Strictly use this):
      ${JSON.stringify(firestoreData)}
      
      TASK:
      Create a detailed itinerary JSON.
      Format:
      {
        "summary": "String",
        "estimatedCost": "String",
        "vehicleRecommendation": "String",
        "itinerary": [
          { "day": 1, "location": "String", "hotel": "String", "activity": "String" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedPlan: TravelPlan = JSON.parse(responseText);

    return parsedPlan;

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};