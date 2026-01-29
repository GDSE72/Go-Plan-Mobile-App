import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Login() {
  const router = useRouter();

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
            <View className="bg-primary-50 p-4 rounded-full mb-6 relative">
              <View className="absolute inset-0 bg-primary-200 rounded-full opacity-20 transform scale-125" />
              <Ionicons name="location" size={40} color="#0FA4E9" />
            </View>
            <Text className="text-4xl font-bold text-gray-900 tracking-tight">GoPlan</Text>
            <Text className="text-gray-500 mt-2 text-base">Trip Planner</Text>
          </View>

          <View className="space-y-5">
            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">Email Address</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#94A3B8" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 font-medium"
                  placeholder="name@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">Password</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 font-medium"
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity>
                <Text className="text-primary-600 font-semibold">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-primary-500 h-14 rounded-2xl items-center justify-center shadow-lg shadow-primary-200"
              activeOpacity={0.8}
              onPress={() => router.replace("/home")}
            >
              <Text className="text-white font-bold text-lg tracking-wide">Sign In</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-gray-100" />
            <Text className="mx-4 text-gray-400 font-medium text-sm">Or continue with</Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-200 h-14 rounded-2xl mb-6 shadow-sm"
            activeOpacity={0.8}
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
                <Text className="text-primary-600 font-bold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
