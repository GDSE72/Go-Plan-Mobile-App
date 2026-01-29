import 'dotenv/config';
import { doc, setDoc } from "firebase/firestore";
import * as fs from 'fs';
import * as path from 'path';
import { db } from "./firebaseConfig";

// Define the interface for the JSON data
interface TravelDataItem {
  "Type": string | null;
  "Name": string;
  "Address": string | null;
  "Grade"?: string | null;
  "District": string | null;
  "AGA Division": string | null;
  "PS/MC/UC": string | null;
  "SourceFile"?: string;
  "image_urls"?: string[];
}

// Function to sanitize document IDs (remove invalid characters)
const sanitizeId = (id: string) => {
  return id.replace(/\//g, "_").replace(/\./g, "_").trim();
};

async function upload(): Promise<void> {
  try {
    console.log("Starting upload...");

    const filePath = path.join(__dirname, 'All_Travel_Data_With_Images.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const travelData: TravelDataItem[] = JSON.parse(rawData);

    console.log(`Found ${travelData.length} items to upload.`);

    let count = 0;
    for (const item of travelData) {
      if (!item.Name) {
        console.warn("Skipping item with no Name:", item);
        continue;
      }

      const docId = sanitizeId(item.Name);

      // Upload to 'travel_data' collection
      await setDoc(doc(db, "travel_data", docId), item);

      count++;
      if (count % 50 === 0) {
        console.log(`Uploaded ${count} items...`);
      }
    }
    console.log(`Upload Complete! Successfully uploaded ${count} items.`);
    process.exit(0);

  } catch (error) {
    console.error("Error uploading data:", error);
    process.exit(1);
  }
}

upload();
