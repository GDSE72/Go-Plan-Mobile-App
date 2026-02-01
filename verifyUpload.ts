import 'dotenv/config';
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function verify() {
    try {
        console.log("Verifying upload to 'sri_lanka_travel_data'...");

        // Check Project ID based on env vars
        console.log("Project ID (from env):", process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);

        const q = query(collection(db, "sri_lanka_travel_data"), limit(5));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("❌ No documents found in 'sri_lanka_travel_data'.");
        } else {
            console.log(`✅ Found ${querySnapshot.size} documents in 'sri_lanka_travel_data'.`);
            querySnapshot.forEach((doc) => {
                console.log(`- ID: ${doc.id}, Name: ${doc.data().Name}, Images: ${doc.data().image_urls?.length || 0}`);
            });
        }
    } catch (error) {
        console.error("Error verification:", error);
    }
}

verify();
