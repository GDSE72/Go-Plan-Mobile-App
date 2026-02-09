import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Functions, getFunctions } from 'firebase/functions';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Debug: Check for missing keys
const missingKeys = [];
if (!firebaseConfig.apiKey) missingKeys.push("EXPO_PUBLIC_FIREBASE_API_KEY");
if (!firebaseConfig.projectId) missingKeys.push("EXPO_PUBLIC_FIREBASE_PROJECT_ID");
if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) missingKeys.push("EXPO_PUBLIC_GEMINI_API_KEY");

if (missingKeys.length > 0) {
  console.error("❌ MISSING API KEYS:", missingKeys.join(", "));
  console.error("Make sure you have a .env file and have restarted the metro bundler (npx expo start -c).");
} else {
  console.log("✅ Firebase & Gemini Config Loaded");
}

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth (Persistence handled automatically by default in newer SDKs or fallback to memory if needed)
export const auth = getAuth(app);

export const db: Firestore = getFirestore(app);
try {
  // @ts-ignore
  db._settings.experimentalForceLongPolling = true;
} catch (error) {
  // ignore
}

export const functions: Functions = getFunctions(app);