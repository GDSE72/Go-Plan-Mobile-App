import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ResultsDisplay from "../components/ResultsDisplay";
import { TravelPlan } from "../types";

export default function TripDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  let travelPlan: TravelPlan | null = null;

  if (params.plan) {
    try {
      travelPlan = JSON.parse(params.plan as string);
    } catch (e) {
      console.error("Failed to parse trip plan", e);
    }
  }

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
      />
    </SafeAreaView>
  );
}
