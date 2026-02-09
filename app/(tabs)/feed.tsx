import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { collection, getDocs, limit, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebaseConfig";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2 - 24; // 2 columns with padding

interface FeedItem {
  id: string;
  uniqueId: string; // Unique key for FlatList
  url: string;
  name: string;
  district: string;
}

export default function Feed() {
  const router = useRouter();
  const [data, setData] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      const q = query(collection(db, "sri_lanka_travel_data"), limit(50));

      console.log("Fetching feed data...");
      // Timeout promise
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(new Error("Request timed out. Check internet connection.")),
          15000,
        ),
      );

      const snapshot = (await Promise.race([getDocs(q), timeout])) as any;
      console.log(`Snapshot received. Docs: ${snapshot.docs.length}`);
      const feedItems: FeedItem[] = [];

      snapshot.forEach((doc) => {
        const item = doc.data() as any;
        // Debug Log
        // console.log(`Doc ${doc.id}:`, item.Name, item.image_urls?.length);

        if (
          item.image_urls &&
          Array.isArray(item.image_urls) &&
          item.image_urls.length > 0
        ) {
          // Flatten: One item per image
          item.image_urls.forEach((url: string, index: number) => {
            feedItems.push({
              id: doc.id,
              uniqueId: `${doc.id}-${index}`,
              url: url,
              name: item.Name || "Unknown Place",
              district: item.District || "Sri Lanka",
            });
          });
        }
      });

      console.log(
        `Parsed ${feedItems.length} feed items from ${snapshot.docs.length} docs.`,
      );

      if (feedItems.length === 0) {
        console.warn("No images found in fetched documents!");
        // potential fallback logic here?
      }

      // Shuffle using modern random sort (Schwartzian transform approximation for simple use case)
      const shuffled = feedItems
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      setData(shuffled);
    } catch (error) {
      console.error("Error fetching feed:", error);
      Alert.alert(
        "Feed Error",
        "Could not load feed data. " + (error as any).message,
      );
    } finally {
      setLoading(false);
    }
  };

  // Optimize renderItem with useCallback to prevent re-creation
  const renderFeedItem = React.useCallback(
    ({ item }: { item: FeedItem }) => (
      <TouchableOpacity
        className="mb-4 bg-white rounded-2xl shadow-sm overflow-hidden"
        style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 1.5 }}
        onPress={() =>
          router.push(
            `/destination-details/${item.id}?mainImage=${encodeURIComponent(
              item.url,
            )}` as any,
          )
        }
      >
        <Image
          source={{ uri: item.url }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200} // Reduced transition time
          cachePolicy="memory-disk"
        />
        <View className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 pt-6">
          <Text className="text-white font-bold text-xs" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header - Simple title, no back button */}
      <View className="px-5 py-4 bg-white border-b border-gray-100 mb-2">
        <Text className="text-2xl font-bold text-gray-900">Explore Feed</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.uniqueId}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          windowSize={5}
          maxToRenderPerBatch={5}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-400">No images found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
