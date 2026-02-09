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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const createSmallData = () => {
    console.log("Creating Small Data Subsets...");
    const targetCities = new Set(["kandy", "galle", "colombo", "ella", "sigiriya"]);
    const MAX_ITEMS = 100;
    // 1. Process Big Data (Feed)
    const bigDataPath = path.join(__dirname, 'Big_Sri_Lanka_Travel_Data.json');
    if (fs.existsSync(bigDataPath)) {
        const bigData = JSON.parse(fs.readFileSync(bigDataPath, 'utf-8'));
        const smallBigData = [];
        let itemCount = 0;
        for (const province of bigData) {
            const smallProvince = { ...province, districts: [] };
            let hasProvinceItems = false;
            for (const district of province.districts) {
                const smallDistrict = { ...district, cities: [] };
                let hasDistrictItems = false;
                for (const city of district.cities) {
                    const cityNameNorm = city.city_name.toLowerCase();
                    // Keep if it's a target city OR if we still need items and it's somewhat populated
                    const isTarget = targetCities.has(cityNameNorm);
                    if (isTarget || itemCount < 20) { // Ensure we get at least some items
                        smallDistrict.cities.push(city);
                        itemCount += city.traveling_places.length;
                        hasDistrictItems = true;
                    }
                }
                if (hasDistrictItems) {
                    smallProvince.districts.push(smallDistrict);
                    hasProvinceItems = true;
                }
            }
            if (hasProvinceItems) {
                smallBigData.push(smallProvince);
            }
            if (itemCount > MAX_ITEMS)
                break;
        }
        fs.writeFileSync(path.join(__dirname, 'Small_Big_Sri_Lanka_Travel_Data.json'), JSON.stringify(smallBigData, null, 2));
        console.log(`Created Small_Big_Sri_Lanka_Travel_Data.json with approx ${itemCount} items.`);
    }
    // 2. Process All Data (Trip Planner)
    const allDataPath = path.join(__dirname, 'All_Travel_Data_With_Images.json');
    if (fs.existsSync(allDataPath)) {
        const allData = JSON.parse(fs.readFileSync(allDataPath, 'utf-8'));
        // Filter: Included if Name or City matches target, or random fill up to MAX
        const smallAllData = allData.filter(item => {
            const name = (item.Name || "").toLowerCase();
            const city = (item.City || "").toLowerCase();
            return [...targetCities].some(t => name.includes(t) || city.includes(t));
        });
        // Fill up to MAX with random others
        let remaining = MAX_ITEMS - smallAllData.length;
        if (remaining > 0) {
            const others = allData.filter(item => !smallAllData.includes(item));
            // Shuffle others simply
            const shuffled = others.sort(() => 0.5 - Math.random());
            smallAllData.push(...shuffled.slice(0, remaining));
        }
        fs.writeFileSync(path.join(__dirname, 'Small_All_Travel_Data.json'), JSON.stringify(smallAllData, null, 2));
        console.log(`Created Small_All_Travel_Data.json with ${smallAllData.length} items.`);
    }
};
createSmallData();
