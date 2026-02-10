import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";
import { auth } from "../firebaseConfig";
import "../global.css";
import { store } from "../store";

export default function Layout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log("Layout: Checking auth...");
    if (!auth) {
      console.error("Layout: Auth is undefined!");
      return;
    }
    const subscriber = onAuthStateChanged(auth, (user) => {
      console.log(
        "Layout: Auth state changed. User:",
        user ? user.uid : "null",
      );
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (initializing) return;

    // If we're on the login or signup page
    const inAuthScreen =
      (segments[0] as string) === "login" ||
      (segments[0] as string) === "signup" ||
      (segments[0] as string) === "index";

    if (user && inAuthScreen) {
      // Redirect to home if logged in and trying to access login/signup
      router.replace("/(tabs)/home");
    } else if (!user && !inAuthScreen) {
      // Redirect to login if not logged in and not on a public screen
      router.replace("/login");
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trip-details" />
      </Stack>
    </Provider>
  );
}
