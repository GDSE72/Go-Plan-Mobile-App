import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";
import { TouristSpot } from "../types";

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, "travel_data"), limit(5));
        const querySnapshot = await getDocs(q);
        const data: TouristSpot[] = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as TouristSpot),
        }));
        // Shuffle or filter if needed, for now just take the first 5
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching featured destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <View className="h-48 items-center justify-center">
        <ActivityIndicator size="small" color="#0FA4E9" />
      </View>
    );
  }

  if (destinations.length === 0) {
    return null;
  }

  return (
    <View className="my-6">
      <View className="px-6 mb-4 flex-row justify-between items-end">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            Featured Places
          </Text>
          <Text className="text-gray-500 text-xs mt-1">Handpicked for you</Text>
        </View>
        <TouchableOpacity>
          <Text className="text-teal-600 font-bold text-sm">See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={destinations}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity className="mr-6 w-72 bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <View className="h-48 bg-gray-200 relative">
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
                transition={500}
              />
              <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center shadow-sm">
                <Text className="text-amber-500 text-xs mr-1">★</Text>
                <Text className="text-gray-900 text-xs font-bold">
                  {item.Grade || "4.5"}
                </Text>
              </View>
            </View>
            <View className="p-5">
              <View className="flex-row justify-between items-start mb-2">
                <Text
                  className="text-lg font-bold text-gray-900 flex-1 mr-2"
                  numberOfLines={1}
                >
                  {item.Name}
                </Text>
              </View>

              <View className="flex-row items-center mb-4">
                <Ionicons name="location-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                  {item.District}, Sri Lanka
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-teal-600 font-bold text-base">
                  $120
                  <Text className="text-gray-400 font-normal text-xs">
                    /Person
                  </Text>
                </Text>
                <View className="bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                  <Text className="text-teal-700 text-xs font-semibold">
                    Book Now
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
