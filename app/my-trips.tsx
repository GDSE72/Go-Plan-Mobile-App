import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";
import { TravelPlan } from "../types";

interface SavedTrip {
  id: string;
  tripDetails: TravelPlan;
  destination: string;
  createdAt: any;
}

export default function MyTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "user_trips"),
        where("userId", "==", user.uid),
      );
      const querySnapshot = await getDocs(q);
      const fetchedTrips: SavedTrip[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTrips.push({
          id: doc.id,
          tripDetails: data.tripDetails,
          destination: data.destination,
          createdAt: data.createdAt,
        });
      });

      // Sort by date desc (if not done in query)
      fetchedTrips.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

      setTrips(fetchedTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTripPress = (trip: SavedTrip) => {
    router.push({
      pathname: "/trip-details",
      params: { plan: JSON.stringify(trip.tripDetails) },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">My Saved Trips</Text>
      </View>

      {trips.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="map-outline" size={64} color="#CBD5E1" />
          <Text className="text-gray-500 text-lg mt-4 text-center">
            You haven't saved any trips yet.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="mt-6 bg-teal-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Plan a Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleTripPress(item)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
            >
              <View className="h-32 bg-gray-200">
                {item.tripDetails.itinerary[0]?.image_url ? (
                  <Image
                    source={{ uri: item.tripDetails.itinerary[0].image_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="image-outline" size={32} color="#94A3B8" />
                  </View>
                )}
                <View className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
                  <Text className="text-xs font-bold text-teal-700">
                    {item.tripDetails.itinerary.length} Days
                  </Text>
                </View>
              </View>

              <View className="p-4">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {item.destination}
                </Text>
                <Text
                  className="text-gray-500 text-sm leading-5"
                  numberOfLines={2}
                >
                  {item.tripDetails.summary}
                </Text>
                <View className="flex-row items-center mt-3 pt-3 border-t border-gray-50">
                  <Ionicons name="calendar-outline" size={14} color="#64748B" />
                  <Text className="text-xs text-gray-500 ml-1">
                    Saved on{" "}
                    {new Date(item.createdAt?.toDate()).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
