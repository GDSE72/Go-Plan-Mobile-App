const fs = require("fs");
const path = require("path");

const bigDataPath = path.join(__dirname, "Big_Sri_Lanka_Travel_Data.json");
const allDataPath = path.join(__dirname, "All_Travel_Data_With_Images.json");

const updates = {
  Colombo: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650030/colombo-sri-lanka-drone-view-1.jpg_bdpkl5.webp",
  ],
  "Sri Jayawardenepura Kotte": [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650034/sri_jayawardana_pura_kotte_qcb3rw.jpg",
  ],
  Dehiwala: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650029/Dehiwala_mkjqpz.jpg",
  ],
  "Ja-Ela": [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650030/Ja-Ela_beqypz.webp",
  ],
  Moratuwa: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650029/Moratuwa_ai5yh8.jpg",
  ],
  Maharagama: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650024/Maharagama_m0cblw.jpg",
  ],
  Nugegoda: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650021/Nugegoda_resort_p0m0ev.avif",
  ],
  Homagama: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650017/Homagama_hotel_grand_minaro_rt2dqf.jpg",
  ],
  Beruwala: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650014/Beruwala-Fish-Harbour_m5ghla.jpg",
  ],
  Peradeniya: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650014/Peradeniya_kolonnawa_oil_train_qsao7e.jpg",
  ],
  Kaduwela: [
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650013/kaduwela_hotel_wrb4eg.jpg",
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650005/kaduwela_places_ofhg6z.jpg",
    "https://res.cloudinary.com/dg1ehhf6h/image/upload/v1770650005/kaduwela_hotel_pool_lut9vc.jpg",
  ],
};

// Normalize Helper
const normalize = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
};

// Read Files
console.log("Reading files...");
let bigData = JSON.parse(fs.readFileSync(bigDataPath, "utf8"));
let allData = JSON.parse(fs.readFileSync(allDataPath, "utf8"));

console.log("Processing updates...");

const cityDistrictMap = {};

// 1. Build Map & Update BigData
bigData.forEach((province) => {
  province.districts.forEach((district) => {
    district.cities.forEach((city) => {
      const normName = normalize(city.city_name);
      cityDistrictMap[normName] = district.district_name;

      // Check if this city is in our update list
      // We iterate updates to find a match
      Object.keys(updates).forEach((target) => {
        const normTarget = normalize(target);
        if (
          normName === normTarget ||
          normName.includes(normTarget) ||
          normTarget.includes(normName)
        ) {
          // Update City Object
          city.image_urls = updates[target];

          // Ensure place exists
          let placeFound = false;
          if (!city.traveling_places) city.traveling_places = [];

          city.traveling_places.forEach((place) => {
            if (
              normalize(place.name) === normTarget ||
              normalize(place.name) === normName
            ) {
              place.image_urls = updates[target];
              placeFound = true;
            }
          });

          if (!placeFound) {
            console.log(
              `Adding place '${city.city_name}' to BigData city list.`,
            );
            city.traveling_places.unshift({
              name: city.city_name,
              type: "City",
              description: city.description || `City of ${city.city_name}`,
              address: `${city.city_name}, ${district.district_name}`,
              image_urls: updates[target],
            });
          }
        }
      });
    });
  });
});

// 2. Update All Data
Object.keys(updates).forEach((target) => {
  const normTarget = normalize(target);
  const imageUrls = updates[target];
  let found = false;

  // Search existing
  for (let i = 0; i < allData.length; i++) {
    if (normalize(allData[i].Name) === normTarget) {
      allData[i].image_urls = imageUrls;
      found = true;
      break;
    }
  }

  if (!found) {
    // Try to find correct district from map
    // Iterate map keys to find match
    let district = "Unknown";
    Object.keys(cityDistrictMap).forEach((k) => {
      if (k.includes(normTarget) || normTarget.includes(k)) {
        district = cityDistrictMap[k];
      }
    });

    console.log(`Adding '${target}' to AllData (District: ${district}).`);
    allData.push({
      Name: target,
      District: district,
      Type: "City",
      image_urls: imageUrls,
    });
  }
});

// Save Files
console.log("Saving files...");
fs.writeFileSync(bigDataPath, JSON.stringify(bigData, null, 4));
fs.writeFileSync(allDataPath, JSON.stringify(allData, null, 4)); // Save All_Travel_Data too!

console.log("Done!");
