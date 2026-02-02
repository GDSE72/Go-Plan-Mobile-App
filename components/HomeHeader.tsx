import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native"; // Import View explicitly
import { auth } from "../firebaseConfig";

export default function HomeHeader() {
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
        {/* Location Badge */}
        <View className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full">
          <Ionicons name="location-sharp" size={16} color="#0D9488" />
          <Text className="text-xs font-semibold text-gray-700 ml-1">
            Sri Lanka
          </Text>
        </View>

        {/* Profile Link */}
        <Link href="/(tabs)/profile" asChild>
          <TouchableOpacity className="active:opacity-70">
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
        </Link>
      </View>

      {/* Styled Intro Box */}
      <View className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 mt-1">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider">
              {getGreeting()},
            </Text>
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-gray-900 mr-2">
                {displayName}
              </Text>
              <Ionicons name="hand-left" size={24} color="#F59E0B" />
            </View>
            <Text className="text-lg text-gray-500 mt-1">
              Ready to explore{" "}
              <Text className="text-teal-600 font-bold">Sri Lanka?</Text>
            </Text>
          </View>
          {/* Decorative Icon Circle */}
          <View className="bg-teal-50 h-12 w-12 rounded-full items-center justify-center border border-teal-100">
            <Ionicons name="compass-outline" size={24} color="#0D9488" />
          </View>
        </View>
      </View>
    </View>
  );
}
