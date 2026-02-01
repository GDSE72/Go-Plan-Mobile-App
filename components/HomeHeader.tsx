import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function HomeHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Traveler";
  const photoUrl = user?.photoURL;

  return (
    <View className="px-6 pt-4 pb-4">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full">
          <Ionicons name="location-sharp" size={16} color="#0D9488" />
          <Text className="text-xs font-semibold text-gray-700 ml-1">
            Sri Lanka
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          className="active:opacity-70"
        >
          <View className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
            {photoUrl ? (
              <Image
                source={{ uri: photoUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <View className="w-full h-full bg-teal-100 items-center justify-center">
                <Text className="text-teal-600 font-bold text-sm">
                  {displayName?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View>
        <Text className="text-gray-500 font-medium text-base">
          Hello,{" "}
          <Text className="font-bold text-gray-900">{displayName}</Text>
        </Text>
        <Text className="text-3xl font-bold text-gray-900 mt-1 leading-tight">
          Let's explore <Text className="text-teal-600">Sri Lanka!</Text>
        </Text>
      </View>
    </View>
  );
}
