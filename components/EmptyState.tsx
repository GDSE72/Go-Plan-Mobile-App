import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function EmptyState() {
  return (
    <View className="items-center justify-center py-20">
      <View className="bg-gradient-to-br from-indigo-50 to-purple-50 w-24 h-24 rounded-3xl items-center justify-center mb-6 border border-indigo-200">
        <MaterialCommunityIcons
          name="map-search"
          size={56}
          color="#A78BFA"
        />
      </View>
      <Text className="text-lg font-bold text-gray-900 text-center mb-2">
        Ready to Explore?
      </Text>
      <Text className="text-sm text-gray-600 text-center max-w-xs leading-5">
        Fill in your trip details above to discover amazing places in Sri Lanka
      </Text>
    </View>
  );
}
