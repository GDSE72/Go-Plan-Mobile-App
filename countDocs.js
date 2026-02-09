const {
  getFirestore,
  collection,
  getCountFromServer,
} = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
require("dotenv/config");

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function count() {
  try {
    const collections = ["sri_lanka_travel_data", "travel_data"];
    for (const colName of collections) {
      const coll = collection(db, colName);
      const snapshot = await getCountFromServer(coll);
      console.log(`TOTAL_DOCS in '${colName}':`, snapshot.data().count);
    }
  } catch (e) {
    console.error("Error counting:", e);
  }
}
count();
