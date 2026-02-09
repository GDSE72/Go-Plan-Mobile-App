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
  // Prevent crash by not initializing with bad config
} else {
  console.log("✅ Firebase & Gemini Config Loaded");
}

let app: FirebaseApp;
let authAuth: any;
let dbStore: Firestore;
let functionsFunc: Functions;

try {
  if (missingKeys.length === 0) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authAuth = getAuth(app);
    dbStore = getFirestore(app);
    try {
      // @ts-ignore
      dbStore._settings.experimentalForceLongPolling = true;
    } catch (ignore) { }
    functionsFunc = getFunctions(app);
  } else {
    console.warn("Firebase not initialized due to missing keys.");
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export const auth = authAuth;
export const db = dbStore!;
export const functions = functionsFunc!;
