import 'dotenv/config';
import { doc, writeBatch } from "firebase/firestore";
import * as fs from 'fs';
import * as path from 'path';
import { db } from "./firebaseConfig";

// Interfaces for the Nested JSON structure
interface RawPlace {
  name: string;
  type: string | null;
  description?: string;
  address?: string;
}

interface RawCity {
  city_name: string;
  description: string;
  traveling_places: RawPlace[];
}

interface RawDistrict {
  district_name: string;
  description: string;
  cities: RawCity[];
}

interface RawProvince {
  province_name: string;
  description: string;
  districts: RawDistrict[];
}

// Interface for the Image Lookup Data
interface ImageLookupItem {
  Name: string;
  image_urls?: string[];
}

// Interface for the Flat Firestore Data (matching types.ts mostly)
interface TouristSpot {
  Name: string;
  Type: string | null;
  Description: string | null;
  Address: string | null;
  District: string | null;
  City: string | null;
  Province: string | null;
  Grade: string | null; // Defaulting to something or null
  // Extra fields for search/filtering
  Keywords?: string[];
  image_urls?: string[];
}

const sanitizeId = (id: string) => {
  return id.replace(/[^a-zA-Z0-9]/g, "_").trim();
};

const normalizeForLookup = (name: string) => {
  return name.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
};

async function upload(): Promise<void> {
  try {
    console.log("Starting upload...");

    const filePath = path.join(__dirname, 'Big_Sri_Lanka_Travel_Data.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const imageFilePath = path.join(__dirname, 'All_Travel_Data_With_Images.json');
    const imageMap = new Map<string, string[]>();

    if (fs.existsSync(imageFilePath)) {
      console.log("Loading image data...");
      const rawImageData = fs.readFileSync(imageFilePath, 'utf-8');
      const imageData: ImageLookupItem[] = JSON.parse(rawImageData);
      imageData.forEach(item => {
        if (item.Name && item.image_urls) {
          imageMap.set(normalizeForLookup(item.Name), item.image_urls);
        }
      });
      console.log(`Loaded ${imageMap.size} image mappings.`);
    } else {
      console.warn("Warning: All_Travel_Data_With_Images.json not found. Skipping image merge.");
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const provinces: RawProvince[] = JSON.parse(rawData);

    console.log(`Found ${provinces.length} provinces. Flattening data...`);

    const itemsToUpload: TouristSpot[] = [];

    for (const province of provinces) {
      const pName = province.province_name;
      for (const district of province.districts) {
        const dName = district.district_name;
        for (const city of district.cities) {
          const cName = city.city_name;
          for (const place of city.traveling_places) {
            if (!place.name) continue;

            // Lookup images
            const images = imageMap.get(normalizeForLookup(place.name)) || [];

            const item: TouristSpot = {
              Name: place.name,
              Type: place.type || "Unknown",
              Description: place.description || null,
              Address: place.address || null,
              District: dName,
              City: cName,
              Province: pName,
              Grade: "4.5", // Default grade as not in JSON
              image_urls: images
            };
            itemsToUpload.push(item);
          }
        }
      }
    }

    console.log(`Prepared ${itemsToUpload.length} items for upload.`);

    // Batch Upload
    const BATCH_SIZE = 400; // Safe limit under 500
    let batchCount = 0;

    for (let i = 0; i < itemsToUpload.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = itemsToUpload.slice(i, i + BATCH_SIZE);

      chunk.forEach((item) => {
        const docId = sanitizeId(item.Name + "_" + item.City); // Ensure uniqueness
        const docRef = doc(db, "sri_lanka_travel_data", docId);
        batch.set(docRef, item);
      });

      await batch.commit();
      batchCount++;
      console.log(`Batch ${batchCount} committed. (${Math.min(i + BATCH_SIZE, itemsToUpload.length)}/${itemsToUpload.length})`);
    }

    console.log(`Upload Complete! Successfully uploaded ${itemsToUpload.length} items.`);
    process.exit(0);

  } catch (error) {
    console.error("Error uploading data:", error);
    process.exit(1);
  }
}

upload();
