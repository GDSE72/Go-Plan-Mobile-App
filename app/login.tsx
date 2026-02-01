import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebaseConfig";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state listener in _layout or protected routes will handle navigation,
      // but for now we explicit navigate to be sure.
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Login Error:", error);
      Alert.alert("Login Failed", "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-6"
        >
          <View className="items-center mb-10">
            <View className="bg-teal-50 p-4 rounded-full mb-6 relative">
              <View className="absolute inset-0 bg-teal-200 rounded-full opacity-20 transform scale-125" />
              <Ionicons name="location" size={40} color="#0D9488" />
            </View>
            <Text className="text-4xl font-bold text-gray-900 tracking-tight">
              GoPlan
            </Text>
            <Text className="text-gray-500 mt-2 text-base">Trip Planner</Text>
          </View>

          <View className="space-y-5">
            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">
                Email Address
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#94A3B8" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 font-medium h-full py-0"
                  placeholder="name@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  cursorColor="#0D9488"
                  selectionColor="#0D9488"
                  caretHidden={false}
                  textAlignVertical="center"
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">
                Password
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#94A3B8"
                />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 font-medium h-full py-0"
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  cursorColor="#0D9488"
                  selectionColor="#0D9488"
                  caretHidden={false}
                  textAlignVertical="center"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity>
                <Text className="text-teal-600 font-semibold">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-teal-600 h-14 rounded-2xl items-center justify-center shadow-lg shadow-teal-200"
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg tracking-wide">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-gray-100" />
            <Text className="mx-4 text-gray-400 font-medium text-sm">
              Or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-200 h-14 rounded-2xl mb-6 shadow-sm opacity-50"
            activeOpacity={1}
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Google Login is temporarily disabled.",
              )
            }
          >
            <Ionicons name="logo-google" size={22} color="#DB4437" />
            <Text className="ml-3 text-gray-700 font-bold text-base">
              Sign in with Google
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4 mb-8">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text className="text-teal-600 font-bold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
