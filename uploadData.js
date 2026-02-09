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
const normalizeForLookup = (name) => {
    return name.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
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
        console.log("Starting upload process...");
        // Delete existing data
        await deleteCollection("sri_lanka_travel_data");
        console.log("Starting upload...");
        const filePath = path.join(__dirname, 'Big_Sri_Lanka_Travel_Data.json');
        // const filePath = path.join(__dirname, 'Small_Big_Sri_Lanka_Travel_Data.json');
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const imageFilePath = path.join(__dirname, 'All_Travel_Data_With_Images.json');
        const imageMap = new Map();
        if (fs.existsSync(imageFilePath)) {
            console.log("Loading image data...");
            const rawImageData = fs.readFileSync(imageFilePath, 'utf-8');
            const imageData = JSON.parse(rawImageData);
            imageData.forEach(item => {
                if (item.Name && item.image_urls) {
                    imageMap.set(normalizeForLookup(item.Name), item.image_urls);
                }
            });
            console.log(`Loaded ${imageMap.size} image mappings.`);
        }
        else {
            console.warn("Warning: All_Travel_Data_With_Images.json not found. Skipping image merge.");
        }
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const provinces = JSON.parse(rawData);
        console.log(`Found ${provinces.length} provinces. Flattening data...`);
        const itemsToUpload = [];
        for (const province of provinces) {
            const pName = province.province_name;
            for (const district of province.districts) {
                const dName = district.district_name;
                for (const city of district.cities) {
                    const cName = city.city_name;
                    for (const place of city.traveling_places) {
                        if (!place.name)
                            continue;
                        // Lookup images
                        const images = imageMap.get(normalizeForLookup(place.name)) || [];
                        const item = {
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
            const batch = (0, firestore_1.writeBatch)(firebaseConfig_1.db);
            const chunk = itemsToUpload.slice(i, i + BATCH_SIZE);
            chunk.forEach((item) => {
                const docId = sanitizeId(item.Name + "_" + item.City); // Ensure uniqueness
                const docRef = (0, firestore_1.doc)(firebaseConfig_1.db, "sri_lanka_travel_data", docId);
                batch.set(docRef, item);
            });
            await batch.commit();
            batchCount++;
            console.log(`Batch ${batchCount} committed. (${Math.min(i + BATCH_SIZE, itemsToUpload.length)}/${itemsToUpload.length})`);
        }
        console.log(`Upload Complete! Successfully uploaded ${itemsToUpload.length} items.`);
        process.exit(0);
    }
    catch (error) {
        console.error("Error uploading data:", error);
        process.exit(1);
    }
}
upload();
