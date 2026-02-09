const fs = require("fs");
const path = require("path");

const bigDataPath = path.join(__dirname, "Big_Sri_Lanka_Travel_Data.json");
const allDataPath = path.join(__dirname, "All_Travel_Data_With_Images.json");

// Normalize Helper
const normalize = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
};

// 1. Load Data
console.log("Loading data...");
let bigData = JSON.parse(fs.readFileSync(bigDataPath, "utf8"));
let allData = JSON.parse(fs.readFileSync(allDataPath, "utf8"));

// 2. Collect all unique URLs from AllData
console.log("Collecting URLs...");
const uniqueUrls = new Set();
allData.forEach((item) => {
  if (item.image_urls && Array.isArray(item.image_urls)) {
    item.image_urls.forEach((url) => uniqueUrls.add(url));
  }
});
console.log(`Found ${uniqueUrls.size} unique URLs to scan.`);

// 3. Identification Logic
const cityUpdates = {}; // { normalizedCityName: [url1, url2] }

bigData.forEach((province) => {
  province.districts.forEach((district) => {
    district.cities.forEach((city) => {
      const cityName = city.city_name;
      const normCityName = normalize(cityName);

      // Skip if name is too short/generic?
      // e.g. "Kandy" is fine. "Colombo" is fine.
      if (normCityName.length < 3) return;

      const matchedUrls = [];
      uniqueUrls.forEach((url) => {
        // Check if filename contains city name
        // Decode URI component just in case
        try {
          const filename = decodeURIComponent(
            url.split("/").pop().toLowerCase(),
          );
          // Logic: exact match of city name as a token in filename?
          // e.g. "colombo-sri-lanka.jpg" contains "colombo"
          // "kandy_perahara.jpg" contains "kandy"
          // "nuwaraeliya_tea.jpg" contains "nuwaraeliya" (if normalized)

          const normFilename = normalize(filename);
          if (normFilename.includes(normCityName)) {
            matchedUrls.push(url);
          }
        } catch (e) {
          // ignore malformed
        }
      });

      if (matchedUrls.length > 0) {
        console.log(`Found ${matchedUrls.length} images for ${cityName}`);
        cityUpdates[normCityName] = matchedUrls;

        // Update Big Data City Entry directly
        if (!city.image_urls) city.image_urls = [];
        // Add unique
        const currentSet = new Set(city.image_urls);
        matchedUrls.forEach((u) => currentSet.add(u));
        city.image_urls = Array.from(currentSet);

        // Ensure "City" place exists
        let placeFound = false;
        if (!city.traveling_places) city.traveling_places = [];

        city.traveling_places.forEach((place) => {
          if (normalize(place.name) === normCityName) {
            place.image_urls = city.image_urls; // Sync
            placeFound = true;
          }
        });

        if (!placeFound) {
          city.traveling_places.unshift({
            name: city.city_name,
            type: "City",
            description: city.description || `City of ${city.city_name}`,
            address: `${city.city_name}, ${district.district_name}`,
            image_urls: city.image_urls,
          });
        }
      }
    });
  });
});

// 4. Backward Sync to AllData
// If we found images for a city, ensure there is a City entry in AllData
console.log("Syncing back to AllData...");
Object.keys(cityUpdates).forEach((normCity) => {
  const urls = cityUpdates[normCity];

  // Find entry in AllData
  let found = false;
  for (let item of allData) {
    if (normalize(item.Name) === normCity) {
      // Merge URLs
      const current = new Set(item.image_urls || []);
      urls.forEach((u) => current.add(u));
      item.image_urls = Array.from(current);
      found = true;
      break;
    }
  }

  if (!found) {
    // Need to add new entry.
    // We need real Name and District.
    // Iterate BigData to find them... this is slow but accurate
    let realName = normCity; // fallback
    let realDistrict = "Unknown";

    bigData.forEach((p) =>
      p.districts.forEach((d) =>
        d.cities.forEach((c) => {
          if (normalize(c.city_name) === normCity) {
            realName = c.city_name;
            realDistrict = d.district_name;
          }
        }),
      ),
    );

    allData.push({
      Name: realName,
      District: realDistrict,
      Type: "City",
      image_urls: urls,
    });
  }
});

// 5. Save
console.log("Saving files...");
fs.writeFileSync(bigDataPath, JSON.stringify(bigData, null, 4));
fs.writeFileSync(allDataPath, JSON.stringify(allData, null, 4));
console.log("Harvest complete.");
