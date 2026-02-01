import { useRouter } from "expo-router";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebaseConfig";
import "../../global.css";
import {
  generateTravelPlan,
  resolveDestinationNames,
} from "../../services/aiService";
import { TravelData, TravelPlan } from "../../types";

import FeaturedDestinations from "../../components/FeaturedDestinations";
import HomeHeader from "../../components/HomeHeader";
import TripInputForm from "../../components/TripInputForm";

export default function App() {
  const router = useRouter();
  const [budget, setBudget] = useState<string>("");
  const [destinations, setDestinations] = useState<string>("Galle");
  const [days, setDays] = useState<string>("2");

  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handlePlanTrip = async () => {
    if (!budget || !destinations || !days) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTravelPlan(null);
    setStatus("Analyzing destination names...");

    try {
      // 1. Resolve/Correct names using AI (e.g. "Mathara" -> "Matara")
      const rawDestinations = destinations.split(",").map((d) => d.trim());
      const correctedNames = await resolveDestinationNames(rawDestinations);

      const destArray = correctedNames
        .map((d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()) // Correct casing
        .slice(0, 10);

      setStatus(`Searching database for: ${destArray.join(", ")}...`);

      const q = query(
        collection(db, "travel_data"),
        where("District", "in", destArray),
        limit(50),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("No Data", "No places found. Try checking your spelling.");
        setLoading(false);
        setStatus("");
        return;
      }

      const contextData: TravelData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          Name: data.Name,
          Type: data.Type,
          Address: data.Address,
          District: data.District,
          Grade: data.Grade || "Standard",
          image_urls: data.image_urls || [],
          "AGA Division": data["AGA Division"],
          "PS/MC/UC": data["PS/MC/UC"],
          SourceFile: data.SourceFile,
        };
      });

      setStatus(
        `Found ${contextData.length} spots. Generating your itinerary...`,
      );

      const plan = await generateTravelPlan(
        budget,
        days,
        destArray,
        contextData,
      );

      if (plan) {
        setStatus("");
        router.push({
          pathname: "/trip-details",
          params: { plan: JSON.stringify(plan) },
        });
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      console.error("Error:", errorMessage);
      Alert.alert("Planning Failed", "Could not connect to the AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <HomeHeader />

          <TripInputForm
            budget={budget}
            setBudget={setBudget}
            destinations={destinations}
            setDestinations={setDestinations}
            days={days}
            setDays={setDays}
            focusedInput={focusedInput}
            setFocusedInput={setFocusedInput}
            loading={loading}
            status={status}
            onPlanTrip={handlePlanTrip}
          />

          <FeaturedDestinations />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
