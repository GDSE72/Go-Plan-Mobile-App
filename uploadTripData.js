"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const firestore_1 = require("firebase/firestore");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const firebaseConfig_1 = require("./firebaseConfig");
const sanitizeId = (id) => {
    return id.replace(/[^a-zA-Z0-9]/g, "_").trim();
};
const deleteCollection = async (collectionPath) => {
    console.log(`Deleting existing documents in ${collectionPath}...`);
    const collectionRef = (0, firestore_1.collection)(firebaseConfig_1.db, collectionPath);
    const querySnapshot = await (0, firestore_1.getDocs)(collectionRef);
    if (querySnapshot.empty) {
        console.log(`Collection ${collectionPath} is already empty.`);
        return;
    }
    const docs = querySnapshot.docs;
    console.log(`Found ${docs.length} documents to delete.`);
    const BATCH_SIZE = 400;
    let batchCount = 0;
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = (0, firestore_1.writeBatch)(firebaseConfig_1.db);
        const chunk = docs.slice(i, i + BATCH_SIZE);
        chunk.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        batchCount++;
        console.log(`Deleted batch ${batchCount} (${Math.min(i + BATCH_SIZE, docs.length)}/${docs.length})`);
    }
    console.log("Deletion complete.");
};
async function upload() {
    try {
        console.log("Starting Trip Data upload process...");
        // Delete existing data
        await deleteCollection("travel_data");
        console.log("Starting upload...");
        const filePath = path.join(__dirname, 'All_Travel_Data_With_Images.json');
        // const filePath = path.join(__dirname, 'Small_All_Travel_Data.json');
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const items = JSON.parse(rawData);
        console.log(`Found ${items.length} items. Uploading...`);
        // Batch Upload
        const BATCH_SIZE = 400;
        let batchCount = 0;
        let uploadedCount = 0;
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const batch = (0, firestore_1.writeBatch)(firebaseConfig_1.db);
            const chunk = items.slice(i, i + BATCH_SIZE);
            chunk.forEach((item) => {
                // ID: Name + District to be safe, or just Name if unique enough.
                // Let's use Name + District
                if (!item.Name)
                    return;
                const docId = sanitizeId(item.Name + "_" + item.District);
                // Ensure strictly unique ID if duplicates exist?
                // Firestore batch set will overwrite if ID exists, which is fine (deduplication).
                const docRef = (0, firestore_1.doc)(firebaseConfig_1.db, "travel_data", docId);
                batch.set(docRef, item);
            });
            await batch.commit();
            batchCount++;
            uploadedCount += chunk.length;
            console.log(`Batch ${batchCount} committed. (${Math.min(i + BATCH_SIZE, items.length)}/${items.length})`);
        }
        console.log(`Upload Complete! Processed ${items.length} items.`);
        process.exit(0);
    }
    catch (error) {
        console.error("Error uploading data:", error);
        process.exit(1);
    }
}
upload();
