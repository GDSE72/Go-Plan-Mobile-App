const fs = require("fs");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  limit,
  query,
} = require("firebase/firestore");
require("dotenv").config();

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

async function check() {
  let output = "";
  try {
    output += "Checking collections...\n";

    // Check sri_lanka_travel_data
    output += "\n--- sri_lanka_travel_data sample ---\n";
    const col1 = collection(db, "sri_lanka_travel_data");
    const q1 = query(col1, limit(1));
    const snap1 = await getDocs(q1);
    if (snap1.empty) {
      output += "No docs found.\n";
    } else {
      snap1.forEach((doc) => {
        output += "ID: " + doc.id + "\n";
        output += "Data: " + JSON.stringify(doc.data(), null, 2) + "\n";
      });
    }

    // Check travel_data
    output += "\n--- travel_data sample ---\n";
    const col2 = collection(db, "travel_data");
    const q2 = query(col2, limit(1));
    const snap2 = await getDocs(q2);
    if (snap2.empty) {
      output += "No docs found.\n";
    } else {
      snap2.forEach((doc) => {
        output += "ID: " + doc.id + "\n";
        output += "Data: " + JSON.stringify(doc.data(), null, 2) + "\n";
      });
    }
  } catch (error) {
    output += "Error checking collections: " + error + "\n";
  } finally {
    fs.writeFileSync("output.txt", output);
    console.log("Done writing to output.txt");
    process.exit(0);
  }
}

check();
