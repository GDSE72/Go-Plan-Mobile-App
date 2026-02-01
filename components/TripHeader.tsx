import React from "react";
import { Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function TripHeader() {
  return (
    <View className="bg-white px-5 pt-6 pb-8 border-b border-gray-200">
      <View className="flex-row items-center justify-center mb-4">
        <MaterialCommunityIcons name="compass" size={40} color="#0D9488" />
      </View>

      <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
        Explore Sri Lanka
      </Text>

      <Text className="text-base text-center text-teal-600 font-medium">
        Plan your perfect getaway
      </Text>

      <Text className="text-sm text-center text-gray-500 mt-2">
        Enter your budget, destinations & days to discover amazing places
      </Text>
    </View>
  );
}
