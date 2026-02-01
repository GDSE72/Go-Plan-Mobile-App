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
    <View className="px-6 py-2">
      <View className="bg-white rounded-[30px] p-5 shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Plan your trip
        </Text>

        {/* Budget */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">
            BUDGET ($)
          </Text>
          <View
            className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border ${focusedInput === "budget" ? "border-teal-500 bg-teal-50/10" : "border-gray-100"}`}
          >
            <MaterialCommunityIcons
              name="currency-usd"
              size={20}
              color={focusedInput === "budget" ? "#0D9488" : "#9CA3AF"}
            />
            <TextInput
              className="flex-1 ml-2 text-base font-semibold text-gray-900"
              placeholder="Ex: 500"
              placeholderTextColor="#D1D5DB"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
              onFocus={() => setFocusedInput("budget")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>

        {/* Destination */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">
            DESTINATION
          </Text>
          <View
            className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border ${focusedInput === "destinations" ? "border-teal-500 bg-teal-50/10" : "border-gray-100"}`}
          >
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color={focusedInput === "destinations" ? "#0D9488" : "#9CA3AF"}
            />
            <TextInput
              className="flex-1 ml-2 text-base font-semibold text-gray-900"
              placeholder="Ex: Galle, Kandy"
              placeholderTextColor="#D1D5DB"
              value={destinations}
              onChangeText={setDestinations}
              onFocus={() => setFocusedInput("destinations")}
              onBlur={() => setFocusedInput(null)}
              cursorColor="#0D9488"
              selectionColor="#0D9488"
              caretHidden={false}
            />
          </View>
        </View>

        {/* Days */}
        <View className="mb-6">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5 ml-1">
            DURATION (DAYS)
          </Text>
          <View
            className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border ${focusedInput === "days" ? "border-teal-500 bg-teal-50/10" : "border-gray-100"}`}
          >
            <MaterialCommunityIcons
              name="calendar-range"
              size={20}
              color={focusedInput === "days" ? "#0D9488" : "#9CA3AF"}
            />
            <TextInput
              className="flex-1 ml-2 text-base font-semibold text-gray-900"
              placeholder="Ex: 3"
              placeholderTextColor="#D1D5DB"
              keyboardType="numeric"
              value={days}
              onChangeText={setDays}
              onFocus={() => setFocusedInput("days")}
              onBlur={() => setFocusedInput(null)}
              cursorColor="#0D9488"
              selectionColor="#0D9488"
              caretHidden={false}
            />
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          className={`rounded-2xl py-4 flex-row items-center justify-center ${
            loading ? "bg-gray-300" : "bg-teal-600 shadow-lg shadow-teal-200"
          }`}
          onPress={onPlanTrip}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg tracking-wide">
              Plan My Trip
            </Text>
          )}
        </TouchableOpacity>
      </View>

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
