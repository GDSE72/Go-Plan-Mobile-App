// functions/src/index.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HttpsError, onCall } from "firebase-functions/v2/https";

interface TripRequestData {
  destinations: string[];
  availableData: any; // Using 'any' for the large JSON blob, or re-use types if shared
}

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const planTrip = onCall<TripRequestData>(async (request) => {
  // 1. Validation
  if (!API_KEY) {
    throw new HttpsError("internal", "API Key not found");
  }

  const { destinations, availableData } = request.data;

  if (!destinations || destinations.length === 0) {
    throw new HttpsError("invalid-argument", "Destinations are required");
  }

  // 2. AI Logic
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Act as a Sri Lankan Travel Assistant.
    User Destinations: ${destinations.join(", ")}
    
    Context Data (Strictly use this):
    ${JSON.stringify(availableData)}
    
    Task: Create a JSON travel plan (summary, itinerary array, estimatedCost, vehicleRecommendation).
    Do not use Markdown. Return RAW JSON only.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up Markdown if strictly necessary, though instructions say RAW JSON
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return { plan: cleanText };
  } catch (err) {
    console.error(err);
    throw new HttpsError("internal", "Failed to generate plan");
  }
});