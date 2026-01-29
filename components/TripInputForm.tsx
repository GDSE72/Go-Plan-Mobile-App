"use client";

import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface TripInputFormProps {
  budget: string;
  setBudget: (value: string) => void;
  destinations: string;
  setDestinations: (value: string) => void;
  days: string;
  setDays: (value: string) => void;
  focusedInput: string | null;
  setFocusedInput: (value: string | null) => void;
  loading: boolean;
  status: string;
  onPlanTrip: () => void;
}

export default function TripInputForm({
  budget,
  setBudget,
  destinations,
  setDestinations,
  days,
  setDays,
  focusedInput,
  setFocusedInput,
  loading,
  status,
  onPlanTrip,
}: TripInputFormProps) {
  return (
    <View className="px-4 py-6">
      <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-3">
          <View className="bg-gradient-to-r from-blue-500 to-blue-600 w-8 h-8 rounded-lg items-center justify-center">
            <MaterialCommunityIcons
              name="currency-usd"
              size={18}
              color="#FFFFFF"
            />
          </View>
          <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-3">
            Budget
          </Text>
        </View>
        <TextInput
          className={`text-base font-semibold px-3 py-3 rounded-lg border-2 ${
            focusedInput === "budget"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-gray-50"
          }`}
          placeholder="$500"
          placeholderTextColor="#CBD5E1"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
          onFocus={() => setFocusedInput("budget")}
          onBlur={() => setFocusedInput(null)}
        />
      </View>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-3">
            <View className="bg-gradient-to-r from-purple-500 to-purple-600 w-8 h-8 rounded-lg items-center justify-center">
              <MaterialCommunityIcons
                name="map-marker"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-3">
              Destinations
            </Text>
          </View>
          <TextInput
            className={`text-base font-semibold px-3 py-3 rounded-lg border-2 ${
              focusedInput === "destinations"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="Galle, Kandy"
            placeholderTextColor="#CBD5E1"
            value={destinations}
            onChangeText={setDestinations}
            onFocus={() => setFocusedInput("destinations")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View className="w-20 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-3">
            <View className="bg-gradient-to-r from-pink-500 to-pink-600 w-8 h-8 rounded-lg items-center justify-center">
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                color="#FFFFFF"
              />
            </View>
          </View>
          <TextInput
            className={`text-base font-semibold px-2 py-3 rounded-lg border-2 text-center ${
              focusedInput === "days"
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="3"
            placeholderTextColor="#CBD5E1"
            keyboardType="numeric"
            value={days}
            onChangeText={setDays}
            onFocus={() => setFocusedInput("days")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      </View>

      <TouchableOpacity
        className={`rounded-xl py-4 px-6 flex-row items-center justify-center mb-4 ${
          loading
            ? "bg-gray-400"
            : "bg-primary-500 shadow-lg shadow-primary-200"
        }`}
        onPress={onPlanTrip}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <>
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-bold text-base tracking-wide">
              Generating Plan...
            </Text>
          </>
        ) : (
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="creation"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-bold text-base tracking-wide">
              Plan My Trip
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {status && (
        <View className="bg-blue-50 rounded-xl p-4 flex-row items-center border-l-4 border-blue-500 mb-4">
          <ActivityIndicator
            size="small"
            color="#3B82F6"
            style={{ marginRight: 12 }}
          />
          <Text className="text-blue-700 font-medium text-sm flex-1">
            {status}
          </Text>
        </View>
      )}
    </View>
  );
}
