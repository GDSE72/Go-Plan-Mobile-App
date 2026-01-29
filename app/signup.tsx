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

export default function Signup() {
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
          <View className="items-center mb-8">
            <View className="bg-primary-50 p-4 rounded-full mb-6 relative">
               <View className="absolute inset-0 bg-primary-200 rounded-full opacity-20 transform scale-125" />
              <Ionicons name="person-add" size={32} color="#0FA4E9" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</Text>
            <Text className="text-gray-500 mt-2">Join us to start your journey</Text>
          </View>

          <View className="space-y-5">
            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">Full Name</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons name="person-outline" size={20} color="#94A3B8" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 font-medium"
                  placeholder="John Doe"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

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
                  placeholder="Create a password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">Confirm Password</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons name="shield-checkmark-outline" size={20} color="#94A3B8" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 font-medium"
                  placeholder="Confirm your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              className="bg-primary-500 h-14 rounded-2xl items-center justify-center shadow-lg shadow-primary-200 mt-4"
              activeOpacity={0.8}
              onPress={() => router.replace("/home")}
            >
              <Text className="text-white font-bold text-lg tracking-wide">Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-8 mb-8">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary-600 font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
