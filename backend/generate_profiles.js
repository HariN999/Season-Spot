const fs = require('fs');
const path = require('path');

// Read seasonalData.js and replace "export const" with "module.exports ="
let seasonalDataContent = fs.readFileSync('../frontend/src/data/seasonalData.js', 'utf8');
seasonalDataContent = seasonalDataContent.replace(/export const/g, 'const');
seasonalDataContent += '\nmodule.exports = { VIBES, SEASONS, SEASONAL_DATA };';

let stateImagesContent = fs.readFileSync('../frontend/src/data/stateImages.js', 'utf8');
stateImagesContent = stateImagesContent.replace(/export const/g, 'const');
stateImagesContent += '\nmodule.exports = { STATE_IMAGES, SEASON_HERO_IMAGES, DEFAULT_IMAGE };';

// Write temp commonjs files to require them
fs.writeFileSync('./temp_seasonal.js', seasonalDataContent);
fs.writeFileSync('./temp_images.js', stateImagesContent);

const { SEASONAL_DATA } = require('./temp_seasonal.js');
const { STATE_IMAGES } = require('./temp_images.js');

const stateNames = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

for (const state of stateNames) {
  // Check if JSON file already exists and skip (keep handcrafted Andhra Pradesh, Kerala, Telangana profiles!)
  const snakeName = state.toLowerCase().replace(/ /g, '_');
  const targetPath = path.join(__dirname, 'app/database/knowledge/states', `${snakeName}.json`);
  if (fs.existsSync(targetPath)) {
    console.log(`Skipping existing detailed state file: ${state}`);
    continue;
  }

  const sData = SEASONAL_DATA[state] || {};
  const heroImage = STATE_IMAGES[state] || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80";

  const temperature = {};
  const rainfall = {};
  const seasonsDict = {};

  const allSeasons = ["Winter", "Spring", "Summer", "Monsoon"];
  allSeasons.forEach(seasonName => {
    const seasonObj = sData[seasonName] || {
      vibe: "Nature",
      suitabilityScore: 8.0,
      tempRange: "20°C - 30°C",
      weatherDesc: `Pleasant weather conditions in ${state} during ${seasonName}.`,
      food: [],
      locations: [],
      travelTips: []
    };

    temperature[seasonName] = seasonObj.tempRange || "20°C - 30°C";
    rainfall[seasonName] = seasonName === "Monsoon" ? "Heavy" : "Low";
    
    // Normalize food structure
    const normalizedFood = (seasonObj.food || []).map(f => ({
      name: f.name || "Local Dish",
      desc: f.desc || `Traditional culinary specialty of ${state}.`,
      tag: f.tag || "Cuisine"
    }));

    // Normalize locations structure
    const normalizedLocs = (seasonObj.locations || []).map(l => ({
      name: l.name || "Local Attraction",
      highlight: l.highlight || `Stunning scenic spot in ${state} during ${seasonName}.`,
      bestTime: l.bestTime || "Daytime"
    }));

    seasonsDict[seasonName] = {
      vibe: seasonObj.vibe || "Scenic",
      suitabilityScore: seasonObj.suitabilityScore || 8.0,
      tempRange: seasonObj.tempRange || "20°C - 30°C",
      weatherDesc: seasonObj.weatherDesc || `Beautiful weather conditions in ${state}.`,
      food: normalizedFood,
      locations: normalizedLocs,
      travelTips: seasonObj.travelTips || ["Plan day trips in advance", "Try local tea and street vendors"]
    };
  });

  const stateCuisine = [];
  const stateDestinations = [];
  const stateTravelTips = [];

  const seenFoods = new Set();
  const seenDestinations = new Set();

  allSeasons.forEach(sn => {
    const sObj = seasonsDict[sn];
    sObj.food.forEach(f => {
      if (!seenFoods.has(f.name.toLowerCase())) {
        seenFoods.add(f.name.toLowerCase());
        stateCuisine.push(f);
      }
    });
    sObj.locations.forEach(l => {
      if (!seenDestinations.has(l.name.toLowerCase())) {
        seenDestinations.add(l.name.toLowerCase());
        stateDestinations.push(l);
      }
    });
    sObj.travelTips.forEach(t => {
      if (!stateTravelTips.includes(t)) {
        stateTravelTips.push(t);
      }
    });
  });

  const stateProfile = {
    name: state,
    capital: `${state} Capital`,
    description: `Discover the breathtaking seasonal beauty, rich cultural heritage, and legendary gastronomy of ${state}.`,
    heroImage: heroImage,
    gallery: [heroImage],
    coordinates: {
      latitude: 20.0,
      longitude: 77.0
    },
    bestMonths: ["October", "November", "December", "January", "February"],
    worstMonths: ["May", "June"],
    temperature: temperature,
    rainfall: rainfall,
    crowdLevel: "Moderate",
    travelScore: 8.5,
    budgetLevel: "Moderate",
    tripDuration: "4-5 Days",
    airports: [`Local Airport (LKO)`],
    railwayStations: [`Central Railway Station`],
    nearbyStates: [],
    languages: ["Hindi", "English"],
    cuisine: stateCuisine.slice(0, 3),
    streetFood: [],
    desserts: [],
    festivals: [
      {
        name: `${state} Festival`,
        desc: "A vibrant regional celebration of culture and heritage.",
        month: "November"
      }
    ],
    hiddenGems: [],
    topDestinations: stateDestinations.slice(0, 3),
    packingList: ["Comfortable shoes", "Light cotton clothes", "Camera", "Sunscreen"],
    travelTips: stateTravelTips.slice(0, 4),
    emergencyNumbers: {
      "Police": "100",
      "Ambulance": "102"
    },
    seasons: seasonsDict,
    weatherWarnings: [],
    accessibility: {
      wheelchairAccess: true,
      comments: "Mostly accessible heritage points and city centers."
    },
    photographySpots: []
  };

  fs.writeFileSync(targetPath, JSON.stringify(stateProfile, null, 2));
  console.log(`Successfully generated dynamic profile for state: ${state}`);
}

// Cleanup temp files
fs.unlinkSync('./temp_seasonal.js');
fs.unlinkSync('./temp_images.js');
console.log("Profile generation script execution complete!");
