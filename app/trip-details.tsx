import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ResultsDisplay from "../components/ResultsDisplay";
import { auth, db } from "../firebaseConfig";
import { RootState } from "../store";

export default function TripDetails() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const travelPlan = useSelector((state: RootState) => state.trip.currentPlan);

  const handleSaveTrip = async () => {
    if (!travelPlan) return;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Login Required", "You must be logged in to save trips.");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "user_trips"), {
        userId: user.uid,
        tripDetails: travelPlan, // Save the entire plan object
        createdAt: new Date(),
        summary: travelPlan.summary, // Duplicate for easier list display
        destination: travelPlan.itinerary[0]?.location || "Sri Lanka Trip",
      });

      Alert.alert("Success", "Trip saved to favorites!");
    } catch (error) {
      console.error("Error saving trip:", error);
      Alert.alert("Error", "Failed to save trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!travelPlan) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>No trip plan found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary-500">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Custom Header */}
      <View className="px-4 py-3 flex-row items-center border-b border-gray-100 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Trip Details</Text>
      </View>

      <ResultsDisplay
        travelPlan={travelPlan}
        onPlanAnother={() => router.replace("/home")}
        onSave={handleSaveTrip}
        isSaving={isSaving}
      />
    </SafeAreaView>
  );
}
