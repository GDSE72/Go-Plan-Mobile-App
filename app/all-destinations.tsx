import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { collection, getDocs, limit, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebaseConfig";
import { TouristSpot } from "../types";

export default function AllDestinations() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDestinations();
  }, []);

  const fetchAllDestinations = async () => {
    try {
      // Fetch destinations, limited to 50 for performance
      const q = query(collection(db, "sri_lanka_travel_data"), limit(50));
      const querySnapshot = await getDocs(q);
      const data: TouristSpot[] = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as TouristSpot),
        id: doc.id,
      }));
      setDestinations(data);
    } catch (error) {
      console.error("Error fetching all destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: TouristSpot }) => (
    <TouchableOpacity
      className="bg-white rounded-[20px] shadow-sm border border-gray-100 mb-5 overflow-hidden"
      activeOpacity={0.9}
      onPress={() =>
        item.id && router.push(`/destination-details/${item.id}` as any)
      }
    >
      <View className="h-56 bg-gray-200 relative">
        <Image
          source={
            item.image_urls && item.image_urls.length > 0
              ? { uri: item.image_urls[0] }
              : {
                  uri: "https://images.unsplash.com/photo-1546708773-e57c17d29198?q=80&w=2670&auto=format&fit=crop",
                }
          }
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={300}
        />
        <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center shadow-sm">
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text className="text-gray-900 text-xs font-bold ml-1">
            {item.Grade || "4.5"}
          </Text>
        </View>
      </View>

      <View className="p-5">
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className="text-xl font-bold text-gray-900 flex-1 mr-2"
            numberOfLines={1}
          >
            {item.Name}
          </Text>
          <Text className="text-teal-600 font-bold text-lg">$120</Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Ionicons name="location-outline" size={16} color="#9CA3AF" />
          <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
            {item.District}, Sri Lanka
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row flex-1 mr-4">
            {/* Categories or Tags could go here */}
            {item.Category && (
              <View className="bg-gray-100 px-2 py-1 rounded-md">
                <Text className="text-gray-500 text-xs">{item.Category}</Text>
              </View>
            )}
          </View>

          <View className="bg-teal-50 px-4 py-2 rounded-xl border border-teal-100">
            <Text className="text-teal-700 font-semibold text-sm">
              View Details
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100 mb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">
          All Destinations
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      ) : (
        <FlatList
          data={destinations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-400">No destinations found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
