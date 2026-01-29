import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TravelPlan } from "../types";

interface ResultsDisplayProps {
  travelPlan: TravelPlan;
  onPlanAnother: () => void;
}

export default function ResultsDisplay({
  travelPlan,
  onPlanAnother,
}: ResultsDisplayProps) {
  return (
    <ScrollView className="px-5 py-6 bg-gray-50 flex-1" showsVerticalScrollIndicator={false}>
      {/* 1. Itinerary Summary Card */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons name="sparkles" size={24} color="#0FA4E9" />
            <Text className="text-xl font-bold text-gray-900 ml-2">
            Your Perfect Itinerary
            </Text>
        </View>
        <Text className="text-base text-gray-600 leading-7">
          {travelPlan.summary}
        </Text>
      </View>

      {/* 2. Trip Overview (Stats) - New Grid Layout */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-4 ml-1">
          Trip Overview
        </Text>

        <View className="flex-col gap-4">
          {/* Budget Card */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center">
            <View className="bg-primary-50 rounded-full p-3 mr-4">
                <MaterialCommunityIcons
                name="wallet-outline"
                size={24}
                color="#0FA4E9"
                />
            </View>
            <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500 mb-1">
                Estimated Cost
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                ${travelPlan.estimatedCost}
                </Text>
            </View>
          </View>

          {/* Transport Card */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row items-center">
             <View className="bg-primary-50 rounded-full p-3 mr-4">
                <MaterialCommunityIcons name="car-side" size={24} color="#0FA4E9" />
             </View>
             <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500 mb-1">
                Transport
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                {travelPlan.vehicleRecommendation}
                </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Day-by-Day Plan */}
      <View className="mb-8">
        <Text className="text-xl font-bold text-gray-900 mb-4 ml-1">
          Day-by-Day Plan
        </Text>

        {travelPlan.itinerary.map((day, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm"
          >
            {/* Day Header */}
            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100">
              <View className="bg-primary-100 px-4 py-2 rounded-xl items-center justify-center">
                <Text className="text-primary-700 font-bold text-base">Day {day.day}</Text>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-lg font-bold text-gray-900">
                  {day.location}
                </Text>
              </View>
            </View>

            {/* Day Details */}
            <View className="space-y-4">
              <View className="flex-row">
                <MaterialCommunityIcons
                    name="bed-outline"
                    size={20}
                    color="#64748B"
                    style={{ marginTop: 2 }}
                />
                <View className="ml-3 flex-1">
                    <Text className="text-sm font-semibold text-gray-900">Where to Stay</Text>
                    <Text className="text-sm text-gray-600 mt-0.5 leading-5">
                    {day.hotel}
                    </Text>
                </View>
              </View>

              <View className="flex-row">
                <MaterialCommunityIcons
                    name="star-outline"
                    size={20}
                    color="#64748B"
                    style={{ marginTop: 2 }}
                />
                <View className="ml-3 flex-1">
                    <Text className="text-sm font-semibold text-gray-900">Activity</Text>
                    <Text className="text-sm text-gray-600 mt-0.5 leading-5">
                    {day.activity}
                    </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 4. Action Button */}
      <TouchableOpacity
        className="bg-white border-2 border-primary-500 rounded-xl py-4 flex-row items-center justify-center mb-10"
        onPress={onPlanAnother}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="refresh"
          size={22}
          color="#0FA4E9"
          style={{ marginRight: 8 }}
        />
        <Text className="text-primary-600 font-bold text-base">
          Plan Another Trip
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
