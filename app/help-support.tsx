import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpSupport() {
  const router = useRouter();

  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@goplan.com");
  };

  const faqs = [
    {
      question: "How is the trip plan generated?",
      answer:
        "We use advanced AI to analyze your preferences, budget, and travel style to create a personalized itinerary just for you.",
    },
    {
      question: "Can I edit my saved trips?",
      answer:
        "Currently, you can view your saved trips. Generating a new plan is the best way to get an updated itinerary.",
    },
    {
      question: "Is the app free to use?",
      answer:
        "Yes, the core features of Go-Plan are simplified and free for all travelers.",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900">Help & Support</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </Text>
          <View className="space-y-4">
            {faqs.map((faq, index) => (
              <View
                key={index}
                className="bg-gray-50 p-4 rounded-xl border border-gray-100"
              >
                <Text className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </Text>
                <Text className="text-gray-600 leading-5">{faq.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Contact Us
          </Text>
          <View className="bg-teal-50 p-6 rounded-2xl items-center text-center">
            <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="mail-outline" size={24} color="#0D9488" />
            </View>
            <Text className="text-gray-900 font-bold text-lg mb-2">
              Need more help?
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Our support team is available 24/7 to assist you with any issues.
            </Text>
            <TouchableOpacity
              onPress={handleEmailSupport}
              className="bg-teal-600 px-6 py-3 rounded-xl w-full items-center"
            >
              <Text className="text-white font-bold">Email Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
