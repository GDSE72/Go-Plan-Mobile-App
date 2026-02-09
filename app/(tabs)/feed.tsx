import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { collection, getDocs, limit, query } from "firebase/firestore";
import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebaseConfig";
import { AppDispatch, RootState } from "../../store";
import {
  FeedItem,
  fetchFeedFailure,
  fetchFeedStart,
  fetchFeedSuccess,
} from "../../store/slices/feedSlice";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2 - 24; // 2 columns with padding

export default function Feed() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: data,
    loading,
    error,
    lastFetched,
  } = useSelector((state: RootState) => state.feed);

  useEffect(() => {
    // Cache strategy: only fetch if empty or it's been a while (e.g. 5 minutes)
    const fiveMinutes = 5 * 60 * 1000;
    const isStale = !lastFetched || Date.now() - lastFetched > fiveMinutes;

    if (data.length === 0 || isStale) {
      fetchFeedData();
    }
  }, [data.length, lastFetched]);

  const fetchFeedData = async () => {
    dispatch(fetchFeedStart());
    try {
      const q = query(collection(db, "sri_lanka_travel_data"), limit(50));

      console.log("Fetching feed data (Redux)...");
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(new Error("Request timed out. Check internet connection.")),
          15000,
        ),
      );

      const snapshot = (await Promise.race([getDocs(q), timeout])) as any;
      const feedItems: FeedItem[] = [];

      snapshot.forEach((doc: any) => {
        const item = doc.data();

        if (
          item.image_urls &&
          Array.isArray(item.image_urls) &&
          item.image_urls.length > 0
        ) {
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

      // Shuffle logic (same as before)
      const shuffled = feedItems
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      dispatch(fetchFeedSuccess(shuffled));
    } catch (error: any) {
      console.error("Error fetching feed:", error);
      dispatch(fetchFeedFailure(error.message));
      Alert.alert("Feed Error", "Could not load feed. " + error.message);
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
