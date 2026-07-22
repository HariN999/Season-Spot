// Comprehensive pre-compiled dataset for Indian States & Seasons
// Enables instant (<50ms) offline-capable responses for Season-Spot

export const VIBES = [
  "All",
  "Hill Station",
  "Beach",
  "Heritage",
  "Wildlife",
  "Backwaters",
  "Culinary",
  "Snow"
];

export const SEASONS = ["Monsoon", "Winter", "Spring", "Summer"];

export const SEASONAL_DATA = {
  "Telangana": {
    "Monsoon": {
      vibe: "Heritage",
      suitabilityScore: 8.8,
      tempRange: "24°C - 30°C",
      weatherDesc: "Pleasant showers cooling down the Deccan plateau with lush greenery.",
      food: [
        { name: "Mirchi Bajji", desc: "Spicy deep-fried chili fritters served with tangy tamarind chutney.", tag: "Street Food", imageQuery: "mirchi bajji hyderabad" },
        { name: "Hyderabadi Marag", desc: "A rich, velvety mutton soup flavored with cashew paste & cardamom.", tag: "Soup / Starter", imageQuery: "hyderabadi marag soup" },
        { name: "Pachi Pulusu", desc: "Raw tamarind & roasted chili stew served cold with hot rice.", tag: "Traditional", imageQuery: "pachi pulusu" }
      ],
      locations: [
        { name: "Ananthagiri Hills", highlight: "Lush coffee plantations & misty trekking trails near Vikarabad.", bestTime: "Morning", imageQuery: "ananthagiri hills monsoons" },
        { name: "Kuntala Waterfall", highlight: "Telangana's highest waterfall cascading in full glory inside Sahyadri ranges.", bestTime: "Afternoon", imageQuery: "kuntala waterfall adilabad" },
        { name: "Golconda Fort", highlight: "Drizzle transforms the ancient acoustic fort into a dramatic vista.", bestTime: "Evening", imageQuery: "golconda fort rain" }
      ],
      travelTips: ["Carry light rain gear for day treks", "Try local roadside tea stalls near Charminar", "Beware of slippery rocks near waterfalls"]
    },
    "Winter": {
      vibe: "Culinary",
      suitabilityScore: 9.6,
      tempRange: "15°C - 28°C",
      weatherDesc: "Crisp, pleasant breezes ideal for heritage walks & nocturnal food tours.",
      food: [
        { name: "Hyderabadi Dum Biryani", desc: "Aromatic basmati rice cooked on dum with marinated meat & saffron.", tag: "Iconic", imageQuery: "hyderabadi dum biryani" },
        { name: "Double Ka Meetha", desc: "Fried bread dessert soaked in saffron-infused milk and nuts.", tag: "Dessert", imageQuery: "double ka meetha" },
        { name: "Qubani Ka Meetha", desc: "Traditional stewed apricot dessert topped with fresh cream.", tag: "Dessert", imageQuery: "qubani ka meetha" }
      ],
      locations: [
        { name: "Charminar & Laad Bazaar", highlight: "Bustling night shopping for bangles, pearls & hot irani chai.", bestTime: "Night", imageQuery: "charminar night view" },
        { name: "Ramoji Film City", highlight: "World's largest film studio complex with winter carnival shows.", bestTime: "Full Day", imageQuery: "ramoji film city hyderabad" },
        { name: "Warangal Fort & Thousand Pillar Temple", highlight: "Kakatiya dynasty marvels under sunny skies.", bestTime: "Daytime", imageQuery: "thousand pillar temple warangal" }
      ],
      travelTips: ["Book Biryani hotspots in advance", "Comfortable walking shoes for heritage walks", "Light jacket for cool winter evenings"]
    },
    "Summer": {
      vibe: "Heritage",
      suitabilityScore: 6.5,
      tempRange: "30°C - 42°C",
      weatherDesc: "Hot dry summer days; perfect for indoor museums & sunset lake drives.",
      food: [
        { name: "Falooda", desc: "Chilled dessert drink with rose syrup, vermicelli & sweet basil seeds.", tag: "Cooler", imageQuery: "hyderabadi falooda" },
        { name: "Raw Mango Rice (Mamidikaya Pulihora)", desc: "Tangy rice dish infused with grated raw mango & mustard seeds.", tag: "Seasonal", imageQuery: "mamidikaya pulihora" }
      ],
      locations: [
        { name: "Salar Jung Museum", highlight: "Air-conditioned treasure trove of global artifacts.", bestTime: "Midday", imageQuery: "salar jung museum" },
        { name: "Hussain Sagar Lake", highlight: "Sunset boat rides around the iconic Buddha statue.", bestTime: "Sunset", imageQuery: "hussain sagar lake sunset" }
      ],
      travelTips: ["Stay hydrated with sugarcane juice", "Plan outdoor activities before 10 AM or after 5 PM", "Wear breathable cotton clothing"]
    },
    "Spring": {
      vibe: "Heritage",
      suitabilityScore: 8.5,
      tempRange: "20°C - 33°C",
      weatherDesc: "Warm pleasant spring days with flowering neem & jacaranda trees across Hyderabad.",
      food: [
        { name: "Ugadi Pachadi", desc: "Traditional 6-flavor dish symbolizing the six emotions of life.", tag: "Festive", imageQuery: "ugadi pachadi" },
        { name: "Irani Chai & Osmania Biscuits", desc: "Rich boiled milk tea paired with melt-in-mouth salted cookies.", tag: "Snack", imageQuery: "irani chai osmania biscuit" }
      ],
      locations: [
        { name: "NTR Gardens & Lumbini Park", highlight: "Blooming flower gardens & musical fountain light show.", bestTime: "Evening", imageQuery: "lumbini park hyderabad" },
        { name: "Bhongir Fort", highlight: "Monolithic rock fort climb for panoramic spring countryside views.", bestTime: "Early Morning", imageQuery: "bhongir fort monolithic" }
      ],
      travelTips: ["Visit during Ugadi festival for authentic sweets", "Great season for photography around heritage monuments"]
    }
  },

  "Goa": {
    "Monsoon": {
      vibe: "Nature & Greenery",
      suitabilityScore: 9.0,
      tempRange: "24°C - 29°C",
      weatherDesc: "Lush green countryside, roaring waterfalls & tranquil uncrowded beaches.",
      food: [
        { name: "Fish Curry Rice", desc: "Fresh catch cooked in coconut curry with spicy kokum.", tag: "Seafood", imageQuery: "goan fish curry rice" },
        { name: "Pork Vindaloo", desc: "Fiery sour & spicy gravy infused with palm vinegar and garlic.", tag: "Iconic", imageQuery: "pork vindaloo goa" }
      ],
      locations: [
        { name: "Dudhsagar Waterfalls", highlight: "Four-tiered majestic white waterfall at peak power.", bestTime: "Full Day", imageQuery: "dudhsagar waterfall monsoon" },
        { name: "Mhadei Wildlife Sanctuary", highlight: "Rainforest jungle treks & birdwatching.", bestTime: "Morning", imageQuery: "mhadei wildlife sanctuary" }
      ],
      travelTips: ["Swimming in sea is restricted during heavy tides", "Rent a scooter and ride through spice plantations", "Carry high-quality waterproof covers for cameras"]
    },
    "Winter": {
      vibe: "Beach",
      suitabilityScore: 9.8,
      tempRange: "20°C - 31°C",
      weatherDesc: "Sunny blue skies, gentle ocean breezes, sunbeds & vibrant nightlife.",
      food: [
        { name: "Prawn Balchão", desc: "Tangy pickled prawn delicacy cooked in chili paste.", tag: "Seafood", imageQuery: "goan prawn balchao" },
        { name: "Bebinca", desc: "Traditional 7-layer baked Goan dessert made with coconut milk & nutmeg.", tag: "Dessert", imageQuery: "goan bebinca" }
      ],
      locations: [
        { name: "Palolem & Arambol Beach", highlight: "Pristine white sand beaches, water sports & sunset shacks.", bestTime: "Sunset", imageQuery: "palolem beach sunset" },
        { name: "Fontainhas (Latin Quarter)", highlight: "Heritage walk past colorful Portuguese villas in Panjim.", bestTime: "Morning", imageQuery: "fontainhas goa panjim" }
      ],
      travelTips: ["Book beach shacks & stays 2 months in advance for Dec/Jan", "Try sunset kayaking at Palolem beach"]
    },
    "Summer": {
      vibe: "Beach",
      suitabilityScore: 7.2,
      tempRange: "26°C - 35°C",
      weatherDesc: "Warm coastal days; great for budget travel, water sports & quiet beaches.",
      food: [
        { name: "Cashew Feni Cocktail", desc: "Refreshing local spirit distilled from ripe cashew apples.", tag: "Beverage", imageQuery: "cashew feni cocktail" },
        { name: "Sol Kadhi", desc: "Cooling digestive drink made from kokum extract and fresh coconut milk.", tag: "Cooler", imageQuery: "sol kadhi goa" }
      ],
      locations: [
        { name: "Grand Island Scuba", highlight: "Clear spring waters ideal for diving & dolphin spotting.", bestTime: "Morning", imageQuery: "grand island goa scuba" },
        { name: "Anjuna Flea Market", highlight: "Bargain shopping for bohemian clothes & handicrafts.", bestTime: "Late Afternoon", imageQuery: "anjuna flea market" }
      ],
      travelTips: ["High SPF sunscreen is mandatory", "Avail massive off-season resort discounts"]
    },
    "Spring": {
      vibe: "Beach",
      suitabilityScore: 9.2,
      tempRange: "22°C - 32°C",
      weatherDesc: "Pleasant spring climate with the vibrant Shigmo carnival parade across cities.",
      food: [
        { name: "Goan Crab Xacuti", desc: "Crab curry cooked with heavily roasted spices and grated coconut.", tag: "Seafood", imageQuery: "crab xacuti goa" }
      ],
      locations: [
        { name: "Panaji Carnival Streets", highlight: "Colorful float parades, music & dance during Shigmo उत्सव.", bestTime: "Evening", imageQuery: "shigmo festival goa" },
        { name: "Agonda Beach", highlight: "Quiet turtle-nesting sanctuary beach with turquoise waters.", bestTime: "Full Day", imageQuery: "agonda beach goa" }
      ],
      travelTips: ["Check dates for Shigmo Festival street parades", "Great time for calm sea swimming"]
    }
  },

  "Himachal Pradesh": {
    "Winter": {
      vibe: "Snow",
      suitabilityScore: 9.7,
      tempRange: "-5°C - 10°C",
      weatherDesc: "Snowfall transforming Himalayan pine forests into magical winter wonderlands.",
      food: [
        { name: "Dham", desc: "Traditional festive feast of lentils, rajma & curd rice served on leaf plates.", tag: "Thali", imageQuery: "himachali dham" },
        { name: "Siddu", desc: "Steamed wheat bread stuffed with roasted poppy seeds & walnuts, served with ghee.", tag: "Comfort Food", imageQuery: "himachali siddu" },
        { name: "Chha Gosht", desc: "Marinated lamb cooked slowly in buttermilk & aromatic spices.", tag: "Non-Veg", imageQuery: "chha gosht" }
      ],
      locations: [
        { name: "Manali & Solang Valley", highlight: "Skiing, snowboarding & snowmobiling over fresh powder snow.", bestTime: "Daytime", imageQuery: "solang valley snow skiing" },
        { name: "Shimla Mall Road", highlight: "Colonial town covered in snow under glowing street lamps.", bestTime: "Evening", imageQuery: "shimla mall road snow" },
        { name: "Spiti Valley (Winter Expedition)", highlight: "Frozen lakes & snow leopard trail expeditions for hardcore adventurers.", bestTime: "Full Day", imageQuery: "winter spiti valley snow" }
      ],
      travelTips: ["Heavy thermal layers, water-resistant snow boots & gloves required", "Keep tire chains handy if driving through mountain passes"]
    },
    "Summer": {
      vibe: "Hill Station",
      suitabilityScore: 9.9,
      tempRange: "12°C - 25°C",
      weatherDesc: "Cool alpine breezes, blooming apple orchards & escape from plains heat.",
      food: [
        { name: "Babru", desc: "Deep-fried flatbread stuffed with spiced black gram paste.", tag: "Snack", imageQuery: "himachali babru" },
        { name: "Mittha", desc: "Sweet rice dish garnished with raisins, almonds & saffron.", tag: "Dessert", imageQuery: "himachali mittha sweet" }
      ],
      locations: [
        { name: "Dharamshala & McLeod Ganj", highlight: "Tibetan monasteries, Dalai Lama temple & Triund trekking.", bestTime: "Full Day", imageQuery: "mcleod ganj dharamshala" },
        { name: "Kasol & Parvati Valley", highlight: "Scenic riverside cafes, pine forests & serene village trails.", bestTime: "Daytime", imageQuery: "kasol parvati valley river" },
        { name: "Khajjiar", highlight: "Mini Switzerland of India with emerald green meadows surrounded by cedars.", bestTime: "Daytime", imageQuery: "khajjiar meadow champhai" }
      ],
      travelTips: ["Book toy train from Kalka to Shimla in advance", "Ideal weather for camping & high altitude trekking"]
    },
    "Monsoon": {
      vibe: "Nature & Greenery",
      suitabilityScore: 6.2,
      tempRange: "15°C - 22°C",
      weatherDesc: "Misty clouds hovering over green valleys; landslide caution advised on highways.",
      food: [
        { name: "Patande", desc: "Himachali sweet pancakes made from wheat flour & ghee.", tag: "Breakfast", imageQuery: "himachali patande" }
      ],
      locations: [
        { name: "Spiti Valley (Rain Shadow Region)", highlight: "Spiti remains dry & clear while lower Himalayas receive rain.", bestTime: "Full Day", imageQuery: "spiti valley landscape summer" }
      ],
      travelTips: ["Avoid steep roads due to risk of landslides during peak rain", "Check weather advisories before traveling"]
    },
    "Spring": {
      vibe: "Hill Station",
      suitabilityScore: 9.4,
      tempRange: "8°C - 20°C",
      weatherDesc: "Apple blossoms filling the valleys with pink flowers under crisp sunny mountain skies.",
      food: [
        { name: "Tudkiya Bhath", desc: "Spiced rice dish cooked with lentils, potatoes & yogurt.", tag: "Rice Dish", imageQuery: "tudkiya bhath" }
      ],
      locations: [
        { name: "Kinnaur Valley", highlight: "Breathtaking views of blooming apple orchards & snow peaks.", bestTime: "Full Day", imageQuery: "kinnaur valley apple blossom" }
      ],
      travelTips: ["Great season for landscape photography", "Pack light woolens for mornings and evenings"]
    }
  },

  "Kerala": {
    "Monsoon": {
      vibe: "Backwaters",
      suitabilityScore: 9.6,
      tempRange: "23°C - 29°C",
      weatherDesc: "Romantic rains monsoon rejuvenating coconut palm groves & ancient Ayurveda retreats.",
      food: [
        { name: "Karimeen Pollichathu", desc: "Pearl spot fish marinated in spicy masalas and grilled inside banana leaf.", tag: "Seafood", imageQuery: "karimeen pollichathu" },
        { name: "Karkidaka Kanzi", desc: "Medicinal herbal rice porridge consumed during monsoon month for immunity.", tag: "Ayurvedic", imageQuery: "karkidaka kanji" }
      ],
      locations: [
        { name: "Alleppey (Alappuzha) Houseboat", highlight: "Gliding through misty rain-soaked backwaters on a luxury houseboat.", bestTime: "Overnight", imageQuery: "alleppey houseboat monsoon rain" },
        { name: "Athirappilly Waterfalls", highlight: "India's Niagara Falls roaring in full monsoon power.", bestTime: "Daytime", imageQuery: "athirappilly waterfalls monsoon" }
      ],
      travelTips: ["Prime season for authentic Ayurvedic massages & therapies", "Enjoy rain watching from tea estate homestays in Munnar"]
    },
    "Winter": {
      vibe: "Backwaters",
      suitabilityScore: 9.9,
      tempRange: "18°C - 30°C",
      weatherDesc: "Pleasant sunny days, calm ocean waves & crisp cool hill station air.",
      food: [
        { name: "Appam with Mutton Stew", desc: "Soft fluffy rice pancakes served with coconut milk aromatic stew.", tag: "Breakfast", imageQuery: "appam mutton stew kerala" },
        { name: "Kerala Beef Fry (Ularthiyathu)", desc: "Slow-roasted tender beef chunks tossed with coconut slices & curry leaves.", tag: "Iconic", imageQuery: "kerala beef fry coconut" }
      ],
      locations: [
        { name: "Munnar Tea Gardens", highlight: "Rolling misty tea hills, Eravikulam National Park & Nilgiri Tahr.", bestTime: "Morning", imageQuery: "munnar tea estate winter" },
        { name: "Varkala Cliff Beach", highlight: "Red laterite cliffs overlooking Arabian sea with seaside cafes.", bestTime: "Sunset", imageQuery: "varkala cliff sunset beach" },
        { name: "Wayanad Wildlife Sanctuary", highlight: "Elephant safari amidst lush tropical spice plantations.", bestTime: "Early Morning", imageQuery: "wayanad wildlife sanctuary" }
      ],
      travelTips: ["Book houseboat overnight stays at least a month prior", "Taste fresh toddy paired with spicy tapioca at local shacks"]
    },
    "Summer": {
      vibe: "Hill Station",
      suitabilityScore: 7.5,
      tempRange: "25°C - 35°C",
      weatherDesc: "Warm along coast; cool and misty up in western ghat hill stations.",
      food: [
        { name: "Puttu and Kadala Curry", desc: "Steamed cylinders of ground rice and coconut served with black chickpea curry.", tag: "Traditional", imageQuery: "puttu kadala curry" }
      ],
      locations: [
        { name: "Vagamon & Thekkady", highlight: "Cool pine forests, spice plantations & Periyar lake boat safari.", bestTime: "Full Day", imageQuery: "thekkady spice plantation" }
      ],
      travelTips: ["Head straight to high altitude hill towns like Munnar & Vagamon", "Hydrate with tender coconut water sold everywhere"]
    },
    "Spring": {
      vibe: "Backwaters",
      suitabilityScore: 9.1,
      tempRange: "22°C - 32°C",
      weatherDesc: "Vibrant season with temple festivals, elephant pageants & blooming cassia flowers.",
      food: [
        { name: "Kerala Sadya", desc: "Grand 26-item vegetarian feast served on a banana leaf during Vishu.", tag: "Feast", imageQuery: "kerala sadya banana leaf" }
      ],
      locations: [
        { name: "Thrissur Pooram Temple Grounds", highlight: "Spectacular traditional drum ensemble (Panchavadyam) & caparisoned elephants.", bestTime: "Full Day", imageQuery: "thrissur pooram festival" }
      ],
      travelTips: ["Check local temple festival schedules (Pooram)", "Try local tropical fruits like jackfruit and mangoes"]
    }
  },

  "Rajasthan": {
    "Winter": {
      vibe: "Heritage",
      suitabilityScore: 9.9,
      tempRange: "8°C - 24°C",
      weatherDesc: "Sunny clear desert days with cool winter nights; royal festivals & desert safaris.",
      food: [
        { name: "Dal Baati Churma", desc: "Hard wheat balls baked over coal, dipped in ghee, served with lentils & sweet churma.", tag: "Royal Thali", imageQuery: "dal baati churma" },
        { name: "Laal Maas", desc: "Royal spicy mutton curry cooked with Mathania red chilies & yogurt.", tag: "Iconic Non-Veg", imageQuery: "laal maas rajasthan" },
        { name: "Ghevar", desc: "Honeycomb dessert soaked in sugar syrup and topped with rabri & pistachio.", tag: "Royal Sweet", imageQuery: "ghevar dessert" }
      ],
      locations: [
        { name: "Jaisalmer Thar Desert", highlight: "Camel safari, luxury desert glamping & folk music under starry skies.", bestTime: "Night", imageQuery: "jaisalmer desert camp night" },
        { name: "Jaipur Amber Fort & Hawa Mahal", highlight: "Exploring grand pink city palaces under mild winter sun.", bestTime: "Daytime", imageQuery: "amber fort jaipur" },
        { name: "Udaipur Lake Palace & Pichola Lake", highlight: "Romantic boat ride past white marble palaces at sunset.", bestTime: "Sunset", imageQuery: "lake pichola udaipur sunset" }
      ],
      travelTips: ["Pack warm winter coats for desert cold nights", "Book Jaisalmer Desert Festival tickets in advance"]
    },
    "Summer": {
      vibe: "Heritage",
      suitabilityScore: 5.0,
      tempRange: "30°C - 45°C",
      weatherDesc: "Extreme desert heat; travel recommended only in high-altitude Mount Abu.",
      food: [
        { name: "Ker Sangri", desc: "Wild desert beans and berries cooked with tangy mustard oil spices.", tag: "Traditional", imageQuery: "ker sangri rajasthan" }
      ],
      locations: [
        { name: "Mount Abu", highlight: "Rajasthan's only hill station with Dilwara marble temples & Nakki lake.", bestTime: "Daytime", imageQuery: "mount abu nakki lake" }
      ],
      travelTips: ["Avoid desert interior cities like Jodhpur/Jaisalmer in May/June", "Drink plenty of buttermilk (Chaach)"]
    },
    "Monsoon": {
      vibe: "Heritage",
      suitabilityScore: 8.4,
      tempRange: "24°C - 33°C",
      weatherDesc: "Peacocks dancing, dry lakes filling up & green transforming dry desert landscapes.",
      food: [
        { name: "Pyaz Ki Kachori", desc: "Flaky deep-fried pastry filled with spicy onion garlic mix.", tag: "Snack", imageQuery: "pyaz ki kachori jaipur" }
      ],
      locations: [
        { name: "Udaipur (City of Lakes)", highlight: "Lakes overflowing, lush monsoon palace views atop Bansdara hill.", bestTime: "Full Day", imageQuery: "monsoon palace udaipur" }
      ],
      travelTips: ["Experience Teej festival swing celebrations in Jaipur", "Beautiful season for photography in Udaipur"]
    },
    "Spring": {
      vibe: "Heritage",
      suitabilityScore: 9.2,
      tempRange: "18°C - 30°C",
      weatherDesc: "Pleasant warm days filled with Holi color celebrations and Gangaur procession.",
      food: [
        { name: "Gatte Ki Sabzi", desc: "Gram flour dumplings cooked in rich tangy yogurt gravy.", tag: "Traditional", imageQuery: "gatte ki sabzi" }
      ],
      locations: [
        { name: "Pushkar Lake & Brahma Temple", highlight: "Serene sacred lake ghats and spring cultural fairs.", bestTime: "Morning", imageQuery: "pushkar lake ghats" }
      ],
      travelTips: ["Experience royal Holi celebrations in Jaipur/Udaipur", "Great season for fort shopping"]
    }
  },

  "Tamil Nadu": {
    "Winter": {
      vibe: "Heritage",
      suitabilityScore: 9.6,
      tempRange: "20°C - 29°C",
      weatherDesc: "Pleasant breezy coastlines, temple car festivals & Margazhi music season.",
      food: [
        { name: "Chettinad Chicken Curry", desc: "Fiery aromatic chicken dish made with freshly ground stone masalas.", tag: "Iconic", imageQuery: "chettinad chicken curry" },
        { name: "Pongal & Vadai", desc: "Rice & moong dal cooked with ghee, pepper & cashews paired with crunchy lentil donut.", tag: "Festive", imageQuery: "ven pongal medu vada" }
      ],
      locations: [
        { name: "Madurai Meenakshi Amman Temple", highlight: "Towering colorful Gopurams & illuminated night processions.", bestTime: "Evening", imageQuery: "meenakshi temple madurai" },
        { name: "Mahabalipuram Shore Temple", highlight: "UNESCO rock-cut relief sculptures along sunny ocean waves.", bestTime: "Morning", imageQuery: "mahabalipuram shore temple" }
      ],
      travelTips: ["Visit Chennai during Dec-Jan for classical music & dance festival", "Dress respectfully when visiting ancient temples"]
    },
    "Summer": {
      vibe: "Hill Station",
      suitabilityScore: 8.5,
      tempRange: "15°C - 25°C (Hills)",
      weatherDesc: "Escape hot plains to cool Nilgiri hill stations Ooty and Kodaikanal.",
      food: [
        { name: "Jigarthanda", desc: "Famous Madurai cooling dessert drink made with almond gum, milk & ice cream.", tag: "Cooler", imageQuery: "madurai jigarthanda" }
      ],
      locations: [
        { name: "Ooty Nilgiri Toy Train", highlight: "Riding heritage steam train through mountain tunnels & tea gardens.", bestTime: "Full Day", imageQuery: "ooty toy train mountain" },
        { name: "Kodaikanal Lake & Coaker's Walk", highlight: "Misty pedal boating & pine forest walks.", bestTime: "Daytime", imageQuery: "kodaikanal lake pedal boat" }
      ],
      travelTips: ["Book Nilgiri mountain railway tickets well in advance", "Pack light sweaters for hill stations"]
    },
    "Monsoon": {
      vibe: "Nature",
      suitabilityScore: 7.8,
      tempRange: "24°C - 31°C",
      weatherDesc: "Northeast monsoon showers bringing life to southern rivers and waterfalls.",
      food: [
        { name: "Kothu Parotta", desc: "Shredded layered flatbread stir-fried with eggs, meat, and spicy salna gravy.", tag: "Street Food", imageQuery: "kothu parotta" }
      ],
      locations: [
        { name: "Courtallam Waterfalls", highlight: "Medicinal waterfall baths in Tenkasi district.", bestTime: "Daytime", imageQuery: "courtallam waterfalls" }
      ],
      travelTips: ["Carry sturdy umbrellas during Oct-Nov coastal rain", "Try piping hot filter coffee at highway stalls"]
    },
    "Spring": {
      vibe: "Heritage",
      suitabilityScore: 8.9,
      tempRange: "22°C - 33°C",
      weatherDesc: "Bright sunny spring weather ideal for exploring temple architecture.",
      food: [
        { name: "Filter Kaapi", desc: "Strong chicory-infused dark coffee frothed with thick boiled milk.", tag: "Beverage", imageQuery: "south indian filter coffee" }
      ],
      locations: [
        { name: "Thanjavur Brihadeeswarar Temple", highlight: "Grand Chola dynasty granite temple marvel.", bestTime: "Late Afternoon", imageQuery: "thanjavur big temple chola" }
      ],
      travelTips: ["Visit temple sites before midday heat", "Explore local handloom silk saree weaver villages"]
    }
  },

  "West Bengal": {
    "Winter": {
      vibe: "Culture & Culinary",
      suitabilityScore: 9.8,
      tempRange: "12°C - 24°C",
      weatherDesc: "Crisp sunny days, colonial heritage walks, street food fairs & Darjeeling tea peak season.",
      food: [
        { name: "Kolkata Mutton Biryani", desc: "Fragrant saffron rice served with tender meat, soft boiled egg & spiced potato.", tag: "Iconic", imageQuery: "kolkata mutton biryani potato" },
        { name: "Nolen Gurer Sandesh", desc: "Delicate cottage cheese sweet made with fresh date palm jaggery available only in winter.", tag: "Seasonal Sweet", imageQuery: "nolen gurer sandesh" },
        { name: "Kosha Mangsho with Luchi", desc: "Rich slow-cooked dark mutton curry served with puffed fried bread.", tag: "Festive", imageQuery: "kosha mangsho luchi" }
      ],
      locations: [
        { name: "Darjeeling Mall & Tiger Hill", highlight: "Sunrise view over Kanchenjunga snow peaks & tea garden walks.", bestTime: "Early Morning", imageQuery: "darjeeling tiger hill sunrise snow" },
        { name: "Kolkata Victoria Memorial & Park Street", highlight: "Colonial architecture, Christmas lighting & street food strolls.", bestTime: "Evening", imageQuery: "victoria memorial kolkata" },
        { name: "Sundarbans National Park", highlight: "Mangrove boat cruise searching for Royal Bengal Tigers & saltwater crocodiles.", bestTime: "Full Day", imageQuery: "sundarbans mangrove cruise" }
      ],
      travelTips: ["Do not miss tasting fresh Nolen Gur sweets", "Book Darjeeling Toy Train rides early"]
    },
    "Monsoon": {
      vibe: "Nature",
      suitabilityScore: 8.2,
      tempRange: "25°C - 31°C",
      weatherDesc: "Romantic heavy rains over Gangetic plains & misty tea gardens in Dooars.",
      food: [
        { name: "Ilish Macher Jhol (Hilsa Curry)", desc: "Monsoon favorite fish cooked in mustard paste & green chilies.", tag: "Seafood Legend", imageQuery: "hilsa fish curry bengal" },
        { name: "Khichuri & Beguni", desc: "Lentil rice comfort dish served with crispy fried eggplant slices.", tag: "Rainy Day Classic", imageQuery: "khichuri beguni bengal" }
      ],
      locations: [
        { name: "Dooars Rainforests", highlight: "Lush green tea gardens & elephant sightings in Gorumara.", bestTime: "Daytime", imageQuery: "dooars tea garden monsoon" }
      ],
      travelTips: ["Attend local Hilsa food festivals in Kolkata", "Pack waterproof boots for rainforest visits"]
    },
    "Summer": {
      vibe: "Hill Station",
      suitabilityScore: 7.9,
      tempRange: "14°C - 23°C (Darjeeling)",
      weatherDesc: "Escape city humidity to cool high altitude retreats like Kalimpong & Darjeeling.",
      food: [
        { name: "Mishti Doi", desc: "Traditional sweetened fermented yogurt served in earthen clay pots.", tag: "Sweet", imageQuery: "mishti doi clay pot" }
      ],
      locations: [
        { name: "Kalimpong & Mirik Lake", highlight: "Orchid nurseries, serene lake boating & peaceful monasteries.", bestTime: "Daytime", imageQuery: "mirik lake darjeeling" }
      ],
      travelTips: ["Head directly up into North Bengal hill towns", "Try authentic Tibetan Momos & Thukpa in hill cafes"]
    },
    "Spring": {
      vibe: "Culture",
      suitabilityScore: 9.3,
      tempRange: "20°C - 30°C",
      weatherDesc: "Vibrant season with Basanta Utsav (Holi festival of colors) at Shantiniketan.",
      food: [
        { name: "Roshogolla", desc: "Spongy cottage cheese balls soaked in clear sugar syrup.", tag: "World Famous", imageQuery: "kolkata roshogolla" }
      ],
      locations: [
        { name: "Shantiniketan (Rabindranath Tagore University)", highlight: "Spring Rabindra Sangeet music, folk Baul singers & open-air yellow gulal festivities.", bestTime: "Full Day", imageQuery: "shantiniketan basanta utsav" }
      ],
      travelTips: ["Book accommodation at Shantiniketan months prior for Basanta Utsav", "Explore local terracotta craft villages in Bishnupur"]
    }
  }
};

// Fallback generator for states not explicitly hardcoded
export const getFallbackStateData = (stateName, seasonName) => {
  return {
    vibe: "Heritage & Nature",
    suitabilityScore: 8.5,
    tempRange: "20°C - 30°C",
    weatherDesc: `Pleasant weather in ${stateName} during ${seasonName}, ideal for exploring cultural landmarks and sampling local cuisine.`,
    food: [
      { name: `${stateName} Regional Thali`, desc: "Authentic platter featuring seasonal vegetable curries, local grains & homemade pickles.", tag: "Traditional", imageQuery: `${stateName} traditional food thali` },
      { name: "Seasonal Sweet Delicacy", desc: "Traditional regional dessert made with milk, nuts, and natural cane sugar.", tag: "Dessert", imageQuery: `${stateName} traditional sweet` }
    ],
    locations: [
      { name: `${stateName} Capital & Old Town`, highlight: "Historic architecture, bustling local bazaars & cultural centers.", bestTime: "Morning", imageQuery: `${stateName} tourism landmark` },
      { name: "Scenic Nature Sanctuary", highlight: "Lush green parklands and scenic sunrise points.", bestTime: "Sunset", imageQuery: `${stateName} natural landscape` }
    ],
    travelTips: ["Carry lightweight cotton clothing and comfortable walking shoes", "Sample street food from recommended long-standing local vendors", "Respect local cultural customs when visiting religious sites"]
  };
};

export const getStateSeasonData = (state, season) => {
  if (SEASONAL_DATA[state] && SEASONAL_DATA[state][season]) {
    return SEASONAL_DATA[state][season];
  }
  return getFallbackStateData(state, season);
};

export const TOP_SPOTLIGHTS = [
  { state: "Goa", season: "Winter", title: "Sun-Kissed Beaches & Nightlife", score: 9.8, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80" },
  { state: "Himachal Pradesh", season: "Winter", title: "Snow Paradises & Ski Slopes", score: 9.7, image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80" },
  { state: "Kerala", season: "Monsoon", title: "Misty Backwaters & Ayurveda", score: 9.6, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80" },
  { state: "Rajasthan", season: "Winter", title: "Royal Forts & Desert Camps", score: 9.9, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80" }
];
