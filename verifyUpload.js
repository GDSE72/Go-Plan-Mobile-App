"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const firestore_1 = require("firebase/firestore");
const firebaseConfig_1 = require("./firebaseConfig");
async function verify() {
    try {
        console.log("Verifying upload to 'sri_lanka_travel_data'...");
        console.log("Project ID (from env):", process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebaseConfig_1.db, "sri_lanka_travel_data"), (0, firestore_1.limit)(5));
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        if (querySnapshot.empty) {
            console.log("❌ No documents found in 'sri_lanka_travel_data'.");
        }
        else {
            console.log(`✅ Found ${querySnapshot.size} documents in 'sri_lanka_travel_data'.`);
            const withImages = querySnapshot.docs.filter(d => d.data().image_urls && d.data().image_urls.length > 0);
            console.log(`📸 Found ${withImages.length} documents with images.`);
            withImages.slice(0, 5).forEach((doc) => {
                console.log(`- ID: ${doc.id}, Name: ${doc.data().Name}, Images: ${doc.data().image_urls?.length}`);
                console.log(`  Url[0]: ${doc.data().image_urls[0]}`);
            });
        }
    }
    catch (error) {
        console.error("Error verification:", error);
    }
}
verify();
