import 'dotenv/config';
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import * as fs from 'fs';
import * as path from 'path';
import { db } from "./firebaseConfig";

// Interface for the Source Data
interface TripDataItem {
    Type: string;
    Name: string;
    Address: string;
    District: string;
    "AGA Division": string;
    "PS/MC/UC": string;
    SourceFile: string;
    image_urls?: string[];
    Grade?: string; // Some items might not have it, but we should handle it
}

const sanitizeId = (id: string) => {
    return id.replace(/[^a-zA-Z0-9]/g, "_").trim();
};

const deleteCollection = async (collectionPath: string) => {
    console.log(`Deleting existing documents in ${collectionPath}...`);
    const collectionRef = collection(db, collectionPath);
    const querySnapshot = await getDocs(collectionRef);

    if (querySnapshot.empty) {
        console.log(`Collection ${collectionPath} is already empty.`);
        return;
    }

    const docs = querySnapshot.docs;
    console.log(`Found ${docs.length} documents to delete.`);

    const BATCH_SIZE = 400;
    let batchCount = 0;

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
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

async function upload(): Promise<void> {
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
        const items: TripDataItem[] = JSON.parse(rawData);

        console.log(`Found ${items.length} items. Uploading...`);

        // Batch Upload
        const BATCH_SIZE = 400;
        let batchCount = 0;
        let uploadedCount = 0;

        for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const batch = writeBatch(db);
            const chunk = items.slice(i, i + BATCH_SIZE);

            chunk.forEach((item) => {
                // ID: Name + District to be safe, or just Name if unique enough.
                // Let's use Name + District
                if (!item.Name) return;

                const docId = sanitizeId(item.Name + "_" + item.District);
                // Ensure strictly unique ID if duplicates exist?
                // Firestore batch set will overwrite if ID exists, which is fine (deduplication).

                const docRef = doc(db, "travel_data", docId);
                batch.set(docRef, item);
            });

            await batch.commit();
            batchCount++;
            uploadedCount += chunk.length;
            console.log(`Batch ${batchCount} committed. (${Math.min(i + BATCH_SIZE, items.length)}/${items.length})`);
        }

        console.log(`Upload Complete! Processed ${items.length} items.`);
        process.exit(0);

    } catch (error) {
        console.error("Error uploading data:", error);
        process.exit(1);
    }
}

upload();
