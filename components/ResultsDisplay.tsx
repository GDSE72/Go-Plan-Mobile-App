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
    <ScrollView className="px-4 py-6" showsVerticalScrollIndicator={false}>
      <View className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-6 border-l-4 border-indigo-600">
        <Text className="text-lg font-bold text-gray-900 mb-3">
          ✨ Your Perfect Itinerary
        </Text>
        <Text className="text-sm text-gray-700 leading-6">
          {travelPlan.summary}
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-3">
          Trip Overview
        </Text>

        <View className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 mb-3 flex-row items-center border-l-4 border-green-500">
          <View className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-xl items-center justify-center">
            <MaterialCommunityIcons
              name="currency-usd"
              size={24}
              color="#FFFFFF"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Estimated Budget
            </Text>
            <Text className="text-2xl font-bold text-green-700">
              ${travelPlan.estimatedCost}
            </Text>
          </View>
        </View>

        <View className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 flex-row items-center border-l-4 border-blue-500">
          <View className="bg-gradient-to-r from-blue-500 to-cyan-600 w-12 h-12 rounded-xl items-center justify-center">
            <MaterialCommunityIcons name="car" size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Recommended Transport
            </Text>
            <Text className="text-lg font-bold text-blue-700">
              {travelPlan.vehicleRecommendation}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          📅 Day-by-Day Plan
        </Text>

        {travelPlan.itinerary.map((day, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm"
          >
            {/* Day Header */}
            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-200">
              <View className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-lg">{day.day}</Text>
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-bold text-gray-900">
                  {day.location}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {index === travelPlan.itinerary.length - 1
                    ? "Final destination"
                    : `Stop ${index + 1}`}
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <View className="flex-row items-start">
                <View className="bg-orange-100 w-8 h-8 rounded-lg items-center justify-center mr-3 mt-1">
                  <MaterialCommunityIcons
                    name="bed"
                    size={16}
                    color="#EA580C"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Stay
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800 leading-5">
                    {day.hotel}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="bg-cyan-100 w-8 h-8 rounded-lg items-center justify-center mr-3 mt-1">
                  <MaterialCommunityIcons
                    name="star-circle"
                    size={16}
                    color="#0891B2"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Activity
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800 leading-5">
                    {day.activity}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        className="bg-white border-2 border-indigo-600 rounded-xl py-4 flex-row items-center justify-center mb-8"
        onPress={onPlanAnother}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="plus-circle"
          size={20}
          color="#4F46E5"
          style={{ marginRight: 8 }}
        />
        <Text className="text-indigo-600 font-bold text-base tracking-wide">
          Plan Another Trip
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
