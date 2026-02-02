import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";
import { TouristSpot } from "../../types";

export default function DestinationDetails() {
  const { id, mainImage } = useLocalSearchParams();
  const router = useRouter();
  const [destination, setDestination] = useState<TouristSpot | null>(null);
  const [loading, setLoading] = useState(true);

  // Decode mainImage if present
  const heroImage = mainImage
    ? decodeURIComponent(mainImage as string)
    : destination?.image_urls?.[0];

  useEffect(() => {
    if (id) {
      fetchDestinationDetails();
    }
  }, [id]);

  const fetchDestinationDetails = async () => {
    try {
      const docRef = doc(db, "sri_lanka_travel_data", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDestination(docSnap.data() as TouristSpot);
      } else {
        console.log("No such destination!");
      }
    } catch (error) {
      console.error("Error fetching destination details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  if (!destination) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-lg">Destination not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-teal-600 font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Image */}
        <View className="relative w-full h-80">
          <Image
            source={
              heroImage
                ? { uri: heroImage }
                : {
                    uri: "https://images.unsplash.com/photo-1546708773-e57c17d29198?q=80&w=2670&auto=format&fit=crop",
                  }
            }
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={500}
          />

          {/* Back Button */}
          <TouchableOpacity
            className="absolute top-12 left-5 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Rating Badge */}
          <View className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center shadow-lg">
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text className="text-gray-900 text-sm font-bold ml-1">
              {destination.Grade || "4.5"}
            </Text>
          </View>
        </View>

        <View className="px-6 -mt-8 bg-white rounded-t-[32px] pt-8">
          {/* Title & Location */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 leading-tight mb-2">
              {destination.Name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={18} color="#0D9488" />
              <Text className="text-gray-600 text-base ml-1 font-medium">
                {destination.City || destination.District}, Sri Lanka
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-2">About</Text>
            <Text className="text-gray-500 leading-6 text-base">
              {destination.Description ||
                "Explore this amazing destination in Sri Lanka. Experience the rich culture, beautiful scenery, and warm hospitality."}
            </Text>
          </View>

          {/* Info Grid */}
          <View className="flex-row flex-wrap justify-between bg-gray-50 p-4 rounded-2xl mb-8">
            <View className="w-[48%] mb-4">
              <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
                Type
              </Text>
              <Text className="text-gray-800 font-semibold">
                {destination.Type || "Attraction"}
              </Text>
            </View>
            <View className="w-[48%] mb-4">
              <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
                District
              </Text>
              <Text className="text-gray-800 font-semibold">
                {destination.District || "-"}
              </Text>
            </View>
            {destination.Address && (
              <View className="w-full">
                <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
                  Address
                </Text>
                <Text className="text-gray-800 font-semibold">
                  {destination.Address}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 pb-8 flex-row items-center justify-between shadow-2xl">
        <View>
          <Text className="text-gray-400 text-xs font-bold">Price</Text>
          <Text className="text-2xl font-bold text-teal-600">
            $120
            <Text className="text-sm font-normal text-gray-400">/person</Text>
          </Text>
        </View>
        <TouchableOpacity
          className="bg-teal-600 px-8 py-4 rounded-2xl shadow-lg shadow-teal-200"
          activeOpacity={0.8}
          onPress={() => alert("Added to your plan!")}
        >
          <Text className="text-white font-bold text-lg">Add to Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
