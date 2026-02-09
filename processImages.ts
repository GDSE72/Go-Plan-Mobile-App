import * as fs from 'fs';
import * as path from 'path';

// Interfaces
interface TripDataItem {
    Name: string;
    image_urls?: string[];
    [key: string]: any;
}

interface RawPlace {
    name: string;
    image_urls?: string[];
    [key: string]: any;
}

interface RawCity {
    city_name: string;
    traveling_places: RawPlace[];
    image_urls?: string[];
    [key: string]: any;
}

interface RawDistrict {
    district_name: string;
    cities: RawCity[];
    [key: string]: any;
}

interface RawProvince {
    province_name: string;
    districts: RawDistrict[];
    [key: string]: any;
}

const normalize = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const tokenize = (text: string): Set<string> => {
    const tokens = text.toLowerCase().split(/[^a-z0-9]+/);
    return new Set(tokens.filter(t => t.length > 2));
};

// Slightly less aggressive cleaning to preserve potential names in URL for checking
const cleanFilenameLower = (url: string): string => {
    try {
        const filename = url.split('/').pop() || "";
        return decodeURIComponent(filename).toLowerCase();
    } catch (e) {
        return "";
    }
};

const processImages = () => {
    console.log("Processing images: EXHAUSTIVE Exclusion Logic...");

    const imagesPath = path.join(__dirname, 'images');
    if (!fs.existsSync(imagesPath)) {
        console.error("images file not found");
        return;
    }

    const imageUrls = fs.readFileSync(imagesPath, 'utf-8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.startsWith('http'));

    console.log(`Found ${imageUrls.length} source images.`);
    const sourceImageSet = new Set(imageUrls);

    // 1. Build Forbidden Tokens List from ALL Data
    const forbiddenTokens = new Set<string>();

    // From Big Data
    const bigDataPath = path.join(__dirname, 'Big_Sri_Lanka_Travel_Data.json');
    if (fs.existsSync(bigDataPath)) {
        const bigData: RawProvince[] = JSON.parse(fs.readFileSync(bigDataPath, 'utf-8'));
        bigData.forEach(p => {
            if (p.province_name) tokenize(p.province_name).forEach(t => forbiddenTokens.add(t));
            p.districts.forEach(d => {
                if (d.district_name) tokenize(d.district_name).forEach(t => forbiddenTokens.add(t));
                d.cities.forEach(c => {
                    if (c.city_name) tokenize(c.city_name).forEach(t => forbiddenTokens.add(t));
                    c.traveling_places.forEach(tp => {
                        if (tp.name) tokenize(tp.name).forEach(t => forbiddenTokens.add(t));
                    });
                });
            });
        });
    }

    // From All Data
    const allDataPath = path.join(__dirname, 'All_Travel_Data_With_Images.json');
    if (fs.existsSync(allDataPath)) {
        const allData: TripDataItem[] = JSON.parse(fs.readFileSync(allDataPath, 'utf-8'));
        allData.forEach(item => {
            if (item.Name) tokenize(item.Name).forEach(t => forbiddenTokens.add(t));
        });
    }

    // Remove very common generic words from forbidden tokens?
    // Actually, random pool should be VERY safe. If "temple" is in forbidden, 
    // then "temple_view.jpg" won't be in generic. That is OKAY. Safety first.
    // But we might run out of images.
    // Let's remove only extremely common noise words from Forbidden list, 
    // so we don't ban valid generic images because they contain "view" or "lanka".

    const allowedGenericTerms = new Set(["sri", "lanka", "view", "hotel", "restaurant", "resort", "park", "beach", "road", "lake", "mountain", "safari", "tour", "travel"]);
    allowedGenericTerms.forEach(t => forbiddenTokens.delete(t));

    console.log(`Built list of ${forbiddenTokens.size} forbidden tokens from dataset names.`);

    // 2. Classify Images
    const specificImages: { url: string, tokens: Set<string> }[] = [];
    const genericImages: string[] = [];

    imageUrls.forEach(url => {
        const lowerUrl = cleanFilenameLower(url);
        const urlTokens = tokenize(lowerUrl); // basic tokens from filename

        let isContaminated = false;
        for (const token of urlTokens) {
            if (forbiddenTokens.has(token)) {
                isContaminated = true;
                break;
            }
        }

        if (isContaminated) {
            specificImages.push({ url, tokens: urlTokens });
        } else {
            genericImages.push(url);
        }
    });

    console.log(`Categorized Images: ${specificImages.length} Specific (contain potential entity names), ${genericImages.length} Generic (Clean).`);

    if (genericImages.length < 10) {
        console.warn("WARNING: Generic pool is very small! Assignments might be repetitive.");
    }

    const getRandomGenericImage = () => {
        if (genericImages.length === 0) return imageUrls[0];
        const idx = Math.floor(Math.random() * genericImages.length);
        return genericImages[idx];
    };

    const ignoredTokens = new Set(["sri", "lanka", "hotel", "restaurant", "resort", "park", "view"]);

    const findMatches = (entityName: string): string[] => {
        if (!entityName) return [];

        const entityTokens = tokenize(entityName);
        const significantTokens = new Set([...entityTokens].filter(t => !ignoredTokens.has(t)));

        if (significantTokens.size === 0) return [];

        const matches: string[] = [];

        // Only match against SPECIFIC images array
        specificImages.forEach(img => {
            let allFound = true;
            for (const token of significantTokens) {
                if (!img.tokens.has(token)) {
                    allFound = false;
                    break;
                }
            }

            if (allFound) {
                matches.push(img.url);
            }
        });
        return matches;
    };

    // --- Update All_Travel_Data_With_Images.json ---
    if (fs.existsSync(allDataPath)) {
        console.log("Updating All_Travel_Data_With_Images.json...");
        const allData: TripDataItem[] = JSON.parse(fs.readFileSync(allDataPath, 'utf-8'));
        let cleanedCount = 0;
        let updateCount = 0;
        let randomCount = 0;

        allData.forEach(item => {
            // 1. Cleanup
            if (item.image_urls) {
                const originalLen = item.image_urls.length;
                item.image_urls = item.image_urls.filter(url => !sourceImageSet.has(url));
                if (item.image_urls.length < originalLen) cleanedCount++;
            }

            // 2. Match
            if (!item.Name) return;
            const matches = findMatches(item.Name);

            if (matches.length > 0) {
                if (!item.image_urls) item.image_urls = [];
                matches.forEach(img => {
                    if (!item.image_urls?.includes(img)) {
                        item.image_urls?.push(img);
                    }
                });
                updateCount++;
            }

            // 3. Random Assignment
            if (!item.image_urls || item.image_urls.length === 0) {
                item.image_urls = [getRandomGenericImage()];
                randomCount++;
            }
        });

        fs.writeFileSync(allDataPath, JSON.stringify(allData, null, 4));
        console.log(`All_Travel_Data: Cleaned ${cleanedCount}, Matched ${updateCount}, Random Assigned ${randomCount}.`);
    }

    // --- Update Big_Sri_Lanka_Travel_Data.json ---
    if (fs.existsSync(bigDataPath)) {
        console.log("Updating Big_Sri_Lanka_Travel_Data.json...");
        const bigData: RawProvince[] = JSON.parse(fs.readFileSync(bigDataPath, 'utf-8'));
        let cleanedCount = 0;
        let updateCount = 0;
        let randomCount = 0;

        const updateEntity = (entity: { name?: string, city_name?: string, image_urls?: string[] }) => {
            // 1. Cleanup
            if (entity.image_urls) {
                const originalLen = entity.image_urls.length;
                entity.image_urls = entity.image_urls.filter(url => !sourceImageSet.has(url));
                if (entity.image_urls.length < originalLen) cleanedCount++;
            }

            // 2. Match
            const name = entity.name || entity.city_name;
            if (!name) return;

            const matches = findMatches(name);

            if (matches.length > 0) {
                if (!entity.image_urls) entity.image_urls = [];
                matches.forEach(img => {
                    if (!entity.image_urls?.includes(img)) {
                        entity.image_urls?.push(img);
                    }
                });
                updateCount++;
            }

            // 3. Random Assignment
            if (!entity.image_urls || entity.image_urls.length === 0) {
                entity.image_urls = [getRandomGenericImage()];
                randomCount++;
            }
        };

        bigData.forEach(province => {
            province.districts.forEach(district => {
                district.cities.forEach(city => {
                    updateEntity(city);
                    city.traveling_places.forEach(place => {
                        updateEntity(place);
                    });
                });
            });
        });

        fs.writeFileSync(bigDataPath, JSON.stringify(bigData, null, 4));
        console.log(`Big Data: Cleaned ${cleanedCount}, Matched ${updateCount}, Random Assigned ${randomCount}.`);
    }
};

processImages();
