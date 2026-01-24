'use client';

import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { generateTravelPlan } from "../services/aiService";
import { TravelData, TravelPlan } from "../types";

export default function App() {
  const [budget, setBudget] = useState<string>("");
  const [destinations, setDestinations] = useState<string>("Galle");
  const [days, setDays] = useState<string>("2");

  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handlePlanTrip = async () => {
    if (!budget || !destinations || !days) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTravelPlan(null);
    setStatus("🔍 Searching local database...");

    try {
      const destArray = destinations
        .split(",")
        .map((d) => d.trim())
        .map((d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase())
        .slice(0, 10);

      const q = query(
        collection(db, "travel_data"),
        where("District", "in", destArray),
        limit(50),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("No Data", "No places found. Try checking your spelling.");
        setLoading(false);
        setStatus("");
        return;
      }

      const contextData: TravelData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          Name: data.Name,
          Type: data.Type,
          Address: data.Address,
          District: data.District,
          Grade: data.Grade || "Standard",
        };
      });

      setStatus(`☁️ Found ${contextData.length} spots. Contacting AI Agent...`);

      const plan = await generateTravelPlan(
        budget,
        days,
        destArray,
        contextData,
      );

      if (plan) {
        setTravelPlan(plan);
        setStatus("");
      }
    } catch (e: any) {
      console.error("Error:", e);
      Alert.alert("Planning Failed", "Could not connect to the AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Text style={styles.emoji}>🌍</Text>
            <Text style={styles.mainHeader}>Ceylon Explorer</Text>
            <Text style={styles.tagline}>Plan your perfect Sri Lanka getaway</Text>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.inputCard}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelIcon}>💰</Text>
                <Text style={styles.cardLabel}>Budget</Text>
              </View>
              <TextInput
                style={[
                  styles.modernInput,
                  focusedInput === "budget" && styles.inputFocused,
                ]}
                placeholder="$500"
                placeholderTextColor="#B0B0B0"
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
                onFocus={() => setFocusedInput("budget")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputCard, { flex: 1 }]}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelIcon}>📍</Text>
                  <Text style={styles.cardLabel}>Destinations</Text>
                </View>
                <TextInput
                  style={[
                    styles.modernInput,
                    focusedInput === "destinations" && styles.inputFocused,
                  ]}
                  placeholder="Galle, Kandy"
                  placeholderTextColor="#B0B0B0"
                  value={destinations}
                  onChangeText={setDestinations}
                  onFocus={() => setFocusedInput("destinations")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              <View style={[styles.inputCard, { flex: 0.35, marginLeft: 12 }]}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelIcon}>📅</Text>
                  <Text style={styles.cardLabel}>Days</Text>
                </View>
                <TextInput
                  style={[
                    styles.modernInput,
                    focusedInput === "days" && styles.inputFocused,
                  ]}
                  placeholder="3"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="numeric"
                  value={days}
                  onChangeText={setDays}
                  onFocus={() => setFocusedInput("days")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handlePlanTrip}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.buttonText}>Generating Plan...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonIcon}>✨</Text>
                  <Text style={styles.buttonText}>Plan My Trip</Text>
                </View>
              )}
            </TouchableOpacity>

            {status && (
              <View style={styles.statusCard}>
                <ActivityIndicator
                  size="small"
                  color="#1E88E5"
                  style={styles.statusLoader}
                />
                <Text style={styles.statusText}>{status}</Text>
              </View>
            )}
          </View>

          {travelPlan && (
            <View style={styles.resultsSection}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>✨ Your Itinerary</Text>
                <Text style={styles.summaryText}>{travelPlan.summary}</Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>💵</Text>
                  <Text style={styles.statLabel}>Est. Cost</Text>
                  <Text style={styles.statValue}>
                    ${travelPlan.estimatedCost}
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>🚗</Text>
                  <Text style={styles.statLabel}>Transport</Text>
                  <Text style={styles.statValue}>
                    {travelPlan.vehicleRecommendation}
                  </Text>
                </View>
              </View>

              <Text style={styles.itineraryHeader}>📍 Day-by-Day Plan</Text>
              {travelPlan.itinerary.map((day, index) => (
                <View key={index} style={styles.dayCard}>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayNumber}>{day.day}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dayTitle}>{day.location}</Text>
                      <Text style={styles.daySubtitle}>
                        {index === travelPlan.itinerary.length - 1
                          ? "Final stop"
                          : "Stop " + (index + 1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dayContent}>
                    <View style={styles.dayItem}>
                      <Text style={styles.itemIcon}>🏨</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemLabel}>Stay</Text>
                        <Text style={styles.itemValue}>{day.hotel}</Text>
                      </View>
                    </View>

                    <View style={styles.dayItem}>
                      <Text style={styles.itemIcon}>🎯</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemLabel}>Activity</Text>
                        <Text style={styles.itemValue}>{day.activity}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setTravelPlan(null)}
              >
                <Text style={styles.secondaryButtonText}>Plan Another Trip</Text>
              </TouchableOpacity>
            </View>
          )}

          {!travelPlan && !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🗺️</Text>
              <Text style={styles.emptyText}>
                Fill in your trip details to get started
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollContent: {
    paddingBottom: 40,
  },

  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  mainHeader: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0D1B2A",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: "#677D8F",
    fontWeight: "500",
  },

  inputSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#677D8F",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modernInput: {
    fontSize: 16,
    color: "#0D1B2A",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E8EEF5",
    fontWeight: "500",
  },
  inputFocused: {
    borderColor: "#1E88E5",
    backgroundColor: "#F0F7FF",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  primaryButton: {
    backgroundColor: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1E88E5",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: "#1E88E5",
    fontSize: 14,
    fontWeight: "700",
  },

  // Status
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#1E88E5",
  },
  statusLoader: {
    marginRight: 10,
  },
  statusText: {
    color: "#1565C0",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  resultsSection: {
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: "linear-gradient(135deg, #F5F7FA 0%, #E8EEF5 100%)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#1E88E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D1B2A",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: "#677D8F",
    lineHeight: 20,
    fontWeight: "500",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: "#677D8F",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E88E5",
  },

  itineraryHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D1B2A",
    marginBottom: 12,
  },
  dayCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEF5",
  },
  dayBadge: {
    backgroundColor: "#1E88E5",
    borderRadius: 24,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D1B2A",
  },
  daySubtitle: {
    fontSize: 12,
    color: "#677D8F",
    marginTop: 2,
  },
  dayContent: {
    gap: 12,
  },
  dayItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  itemLabel: {
    fontSize: 11,
    color: "#677D8F",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    color: "#0D1B2A",
    fontWeight: "600",
    lineHeight: 18,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#677D8F",
    fontWeight: "500",
  },
});
