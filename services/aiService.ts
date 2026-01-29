// services/aiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TravelData, TravelPlan } from '../types';
//For production, use an environment variable or a proxy.
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
      Budget: ${budget} (Estimate costs based on logical assumptions as prices are missing in data).
      
      AVAILABLE DATA (Strictly use this):
      ${JSON.stringify(firestoreData.map(d => ({ Name: d.Name, Type: d.Type, Grade: d.Grade, District: d.District })))}
      
      TASK:
      Create a detailed itinerary JSON.
      - Since the dataset lacks prices, ESTIMATE the "estimatedCost" based on the "Grade" (A/B/C) and "Type" of places selected.
      - IMPORTANT: Use the exact "Name" from AVAILABLE DATA for "location" or "hotel" fields so we can match images later.
      
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
    // Simple cleanup to remove markdown code blocks if present
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedPlan: TravelPlan = JSON.parse(cleanedText);

    //Attach images from local data to the plan
    parsedPlan.itinerary = parsedPlan.itinerary.map(item => {
      // Try to find a match for the location or hotel in our firestoreData
      const match = firestoreData.find(d =>
        (d.Name && item.location && d.Name.toLowerCase() === item.location.toLowerCase()) ||
        (d.Name && item.hotel && d.Name.toLowerCase() === item.hotel.toLowerCase()) ||
        (d.Name && item.activity && item.activity.toLowerCase().includes(d.Name.toLowerCase()))
      );

      return {
        ...item,
        // Pick a random image from the available array to ensure variety
        image_url: match?.image_urls && match.image_urls.length > 0
          ? match.image_urls[Math.floor(Math.random() * match.image_urls.length)]
          : undefined
      };
    });

    return parsedPlan;

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

export const resolveDestinationNames = async (inputs: string[]): Promise<string[]> => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are a Sri Lankan geography expert.
      Task: Correct the spelling of the following Sri Lankan cities/districts to their standard English format (as used in official records/databases).
      
      Input: ${JSON.stringify(inputs)}
      
      Instructions:
      - Return ONLY a JSON array of strings.
      - If a name is already correct, keep it.
      - If a name is unrecognizable or not in Sri Lanka, keep it as is.
      - Example: ["Mathara", "Colambo"] -> ["Matara", "Colombo"]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const correctedNames: string[] = JSON.parse(cleanedText);

    return correctedNames;
  } catch (error) {
    console.error("Error resolving names:", error);
    return inputs; // Fallback to original inputs on error
  }
};