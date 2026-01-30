import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // Fallback to Auth data if Firestore doc missing
          setUserData({
            name: user.displayName || "User",
            email: user.email,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0FA4E9" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-8">Profile</Text>

        <View className="items-center mb-10">
          <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl font-bold text-primary-600">
              {userData?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">
            {userData?.name || "User"}
          </Text>
          <Text className="text-gray-500">{userData?.email}</Text>
        </View>

        <View className="bg-gray-50 rounded-2xl p-4 mb-20 space-y-4">
          <TouchableOpacity className="flex-row items-center justify-between p-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-white items-center justify-center rounded-full mr-3 shadow-sm">
                <Ionicons name="settings-outline" size={20} color="#64748B" />
              </View>
              <Text className="text-gray-700 font-medium">Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity className="flex-row items-center justify-between p-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-white items-center justify-center rounded-full mr-3 shadow-sm">
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#64748B"
                />
              </View>
              <Text className="text-gray-700 font-medium">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-50 h-14 rounded-2xl"
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 font-bold ml-2">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
