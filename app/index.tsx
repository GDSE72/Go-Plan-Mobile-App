import "../global.css"
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { generateTravelPlan } from "../services/aiService";
import { TravelData, TravelPlan } from "../types";

import TripHeader from "../components/TripHeader";
import TripInputForm from "../components/TripInputForm";
import ResultsDisplay from "../components/ResultsDisplay";
import EmptyState from "../components/EmptyState";

export default function App() {
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
    setStatus("Searching local database...");

    try {
      const destArray = destinations
        .split(",")
        .map((d) => d.trim())
        .map((d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase())
        .slice(0, 10);

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
        };
      });

      setStatus(`Found ${contextData.length} spots. Generating your itinerary...`);

      const plan = await generateTravelPlan(
        budget,
        days,
        destArray,
        contextData,
      );

      if (plan) {
        setTravelPlan(plan);
        setStatus("");
      }
    } catch (e: any) {
      console.error("Error:", e);
      Alert.alert("Planning Failed", "Could not connect to the AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <TripHeader />

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

          {travelPlan ? (
            <ResultsDisplay
              travelPlan={travelPlan}
              onPlanAnother={() => setTravelPlan(null)}
            />
          ) : (
            !loading && <EmptyState />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
