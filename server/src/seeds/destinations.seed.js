import mongoose from "mongoose";
import Destination from "../models/destination.model.js";
import dotenv from "dotenv";

dotenv.config();

const destinations = [
  {
    name: "Paris, France",
    description:
      "The City of Light, known for its romantic atmosphere, iconic landmarks like the Eiffel Tower, and world-class museums.",
    location: {
      type: "Point",
      coordinates: [2.3522, 48.8566],
      address: "Paris",
      city: "Paris",
      country: "France",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      caption: "Eiffel Tower at sunset",
    },
    rating: 4.8,
    tags: ["romantic", "cultural", "historic", "food"],
    thingsToDo: [
      "Visit the Eiffel Tower",
      "Explore the Louvre Museum", 
      "Walk along the Seine River",
      "Visit Notre-Dame Cathedral",
      "Explore Montmartre",
    ],
    bestTimeToVisit: {
      from: "April",
      to: "October",
    },
  },
  {
    name: "Tokyo, Japan",
    description:
      "A vibrant metropolis where traditional culture meets cutting-edge technology, offering unique experiences at every turn.",
    location: {
      type: "Point",
      coordinates: [139.6917, 35.6895],
      address: "Tokyo",
      city: "Tokyo",
      country: "Japan",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      caption: "Shibuya Crossing",
    },
    rating: 4.7,
    tags: ["modern", "cultural", "food", "shopping"],
    thingsToDo: [
      "Visit Shibuya Crossing",
      "Explore Senso-ji Temple",
      "Experience Akihabara",
      "Visit Meiji Shrine",
      "Try authentic sushi",
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "New York City, USA",
    description:
      "The city that never sleeps, offering world-famous landmarks, diverse cultures, and endless entertainment options.",
    location: {
      type: "Point",
      coordinates: [-74.006, 40.7128],
      address: "New York",
      city: "New York City",
      country: "USA",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1499092348529-297b507fb90f",
      caption: "Times Square at night",
    },
    rating: 4.6,
    tags: ["urban", "cultural", "shopping", "entertainment"],
    thingsToDo: [
      "Visit Times Square",
      "Walk through Central Park",
      "See the Statue of Liberty",
      "Visit the Metropolitan Museum of Art",
      "Explore Broadway",
    ],
    bestTimeToVisit: {
      from: "April",
      to: "June",
    },
  },
  {
    name: "Rome, Italy",
    description:
      "The Eternal City, home to ancient ruins, Renaissance art, and delicious Italian cuisine.",
    location: {
      type: "Point",
      coordinates: [12.4964, 41.9028],
      address: "Rome",
      city: "Rome",
      country: "Italy",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
      caption: "Colosseum at sunset",
    },
    rating: 4.7,
    tags: ["historic", "cultural", "food", "art"],
    thingsToDo: [
      "Visit the Colosseum",
      "Explore the Vatican City",
      "Throw a coin in Trevi Fountain",
      "Visit the Roman Forum",
      "Try authentic Italian gelato",
    ],
    bestTimeToVisit: {
      from: "April",
      to: "June",
    },
  },
  {
    name: "Bali, Indonesia",
    description:
      "A tropical paradise known for its stunning beaches, lush landscapes, and rich cultural heritage.",
    location: {
      type: "Point",
      coordinates: [115.1889, -8.4095],
      address: "Bali",
      city: "Denpasar",
      country: "Indonesia",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      caption: "Bali rice terraces",
    },
    rating: 4.8,
    tags: ["beach", "nature", "cultural", "relaxation"],
    thingsToDo: [
      "Visit Ubud Monkey Forest",
      "Explore rice terraces",
      "Relax on Kuta Beach",
      "Visit Tanah Lot Temple",
      "Try Balinese cuisine",
    ],
    bestTimeToVisit: {
      from: "April",
      to: "October",
    },
  },
  {
    name: "Dubai, UAE",
    description:
      "A futuristic city in the desert, known for its luxury shopping, ultramodern architecture, and vibrant nightlife.",
    location: {
      type: "Point",
      coordinates: [55.2708, 25.2048],
      address: "Dubai",
      city: "Dubai",
      country: "UAE",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1512453979798-5ea892f1e3be",
      caption: "Burj Khalifa at night",
    },
    rating: 4.6,
    tags: ["modern", "luxury", "shopping", "desert"],
    thingsToDo: [
      "Visit Burj Khalifa",
      "Shop at Dubai Mall",
      "Experience desert safari",
      "Visit Palm Jumeirah",
      "Explore Dubai Marina",
    ],
    bestTimeToVisit: {
      from: "November",
      to: "March",
    },
  },
  {
    name: "Sydney, Australia",
    description:
      "A vibrant coastal city known for its iconic Opera House, beautiful beaches, and laid-back lifestyle.",
    location: {
      type: "Point",
      coordinates: [151.2093, -33.8688],
      address: "Sydney",
      city: "Sydney",
      country: "Australia",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
      caption: "Sydney Opera House",
    },
    rating: 4.7,
    tags: ["beach", "urban", "nature", "cultural"],
    thingsToDo: [
      "Visit Sydney Opera House",
      "Walk across Harbour Bridge",
      "Relax at Bondi Beach",
      "Explore the Rocks",
      "Visit Taronga Zoo",
    ],
    bestTimeToVisit: {
      from: "September",
      to: "November",
    },
  },
  {
    name: "Cape Town, South Africa",
    description:
      "A stunning coastal city with dramatic landscapes, rich history, and diverse wildlife.",
    location: {
      type: "Point",
      coordinates: [18.4241, -33.9249],
      address: "Cape Town",
      city: "Cape Town",
      country: "South Africa",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5",
      caption: "Table Mountain",
    },
    rating: 4.7,
    tags: ["nature", "adventure", "wildlife", "beach"],
    thingsToDo: [
      "Hike Table Mountain",
      "Visit Cape of Good Hope",
      "Explore Robben Island",
      "Visit Kirstenbosch Gardens",
      "Go on a safari",
    ],
    bestTimeToVisit: {
      from: "November",
      to: "March",
    },
  },
  {
    name: "Barcelona, Spain",
    description: 
      "A city celebrated for its unique architecture, vibrant culture, and Mediterranean charm.",
    location: {
      type: "Point",
      coordinates: [2.1734, 41.3851],
      address: "Barcelona",
      city: "Barcelona",
      country: "Spain",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
      caption: "Sagrada Familia",
    },
    rating: 4.8,
    tags: ["architecture", "cultural", "beach", "food"],
    thingsToDo: [
      "Visit Sagrada Familia",
      "Explore Park Güell",
      "Walk Las Ramblas",
      "Visit Casa Batlló",
      "Enjoy tapas in Gothic Quarter",
    ],
    bestTimeToVisit: {
      from: "May",
      to: "September",
    },
  },
  {
    name: "Kyoto, Japan",
    description:
      "Japan's cultural heart, featuring centuries-old temples, traditional gardens, and geisha districts.",
    location: {
      type: "Point",
      coordinates: [135.7681, 35.0116],
      address: "Kyoto",
      city: "Kyoto",
      country: "Japan",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      caption: "Fushimi Inari Shrine",
    },
    rating: 4.9,
    tags: ["cultural", "historic", "temples", "traditional"],
    thingsToDo: [
      "Visit Fushimi Inari Shrine",
      "Explore Arashiyama Bamboo Grove",
      "See Kinkaku-ji Temple",
      "Experience tea ceremony",
      "Visit Gion district",
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "Santorini, Greece",
    description:
      "A stunning volcanic island known for its white-washed buildings, blue domes, and spectacular sunsets.",
    location: {
      type: "Point", 
      coordinates: [25.4615, 36.3932],
      address: "Santorini",
      city: "Thira",
      country: "Greece",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      caption: "Oia sunset",
    },
    rating: 4.8,
    tags: ["romantic", "beach", "scenic", "wine"],
    thingsToDo: [
      "Watch sunset in Oia",
      "Visit black sand beaches",
      "Wine tasting",
      "Explore Akrotiri ruins",
      "Boat tour to volcano",
    ],
    bestTimeToVisit: {
      from: "June",
      to: "September",
    },
  },
  {
    name: "Machu Picchu, Peru",
    description:
      "An ancient Incan city set high in the Andes Mountains, offering breathtaking views and rich history.",
    location: {
      type: "Point",
      coordinates: [-72.5450, -13.1631],
      address: "Machu Picchu",
      city: "Cusco Region",
      country: "Peru",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1526392060635-9d6019884377",
      caption: "Machu Picchu ruins",
    },
    rating: 4.9,
    tags: ["historic", "adventure", "nature", "cultural"],
    thingsToDo: [
      "Explore the ancient ruins",
      "Hike Huayna Picchu",
      "Visit the Sun Gate",
      "Take the Inca Trail",
      "Visit Temple of the Sun",
    ],
    bestTimeToVisit: {
      from: "May",
      to: "October",
    },
  },
  {
    name: "Venice, Italy",
    description:
      "A unique city built on water, famous for its canals, Gothic architecture, and romantic atmosphere.",
    location: {
      type: "Point",
      coordinates: [12.3155, 45.4408],
      address: "Venice",
      city: "Venice",
      country: "Italy",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0",
      caption: "Grand Canal",
    },
    rating: 4.7,
    tags: ["romantic", "historic", "cultural", "architecture"],
    thingsToDo: [
      "Gondola ride on Grand Canal",
      "Visit St. Mark's Basilica",
      "Tour Doge's Palace",
      "Visit Rialto Bridge",
      "Explore Murano Island",
    ],
    bestTimeToVisit: {
      from: "April",
      to: "October",
    },
  },
  {
    name: "Queenstown, New Zealand",
    description:
      "An adventure sports capital surrounded by mountains and lakes, offering year-round outdoor activities.",
    location: {
      type: "Point",
      coordinates: [168.6626, -45.0312],
      address: "Queenstown",
      city: "Queenstown",
      country: "New Zealand",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1589196728426-4482b895cc15",
      caption: "Lake Wakatipu",
    },
    rating: 4.8,
    tags: ["adventure", "nature", "sports", "scenic"],
    thingsToDo: [
      "Bungee jumping",
      "Ski at Coronet Peak",
      "Lake Wakatipu cruise",
      "Skyline Gondola ride",
      "Wine tasting in Central Otago",
    ],
    bestTimeToVisit: {
      from: "December",
      to: "February",
    },
  },
  {
    name: "Marrakech, Morocco",
    description:
      "A vibrant city known for its historic medina, colorful souks, and rich cultural heritage.",
    location: {
      type: "Point",
      coordinates: [-7.9811, 31.6295],
      address: "Marrakech",
      city: "Marrakech",
      country: "Morocco",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1597211684565-dca64d72c4e6",
      caption: "Djemaa el-Fna",
    },
    rating: 4.6,
    tags: ["cultural", "historic", "shopping", "food"],
    thingsToDo: [
      "Explore Djemaa el-Fna",
      "Visit Jardin Majorelle",
      "Shop in the souks",
      "Visit Bahia Palace",
      "Experience hammam",
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "Reykjavik, Iceland",
    description:
      "Gateway to Iceland's natural wonders, offering northern lights, geothermal springs, and unique landscapes.",
    location: {
      type: "Point",
      coordinates: [-21.9426, 64.1466],
      address: "Reykjavik",
      city: "Reykjavik",
      country: "Iceland",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1490080886466-6ea0a78bae16",
      caption: "Northern Lights",
    },
    rating: 4.7,
    tags: ["nature", "adventure", "scenic", "unique"],
    thingsToDo: [
      "Blue Lagoon visit",
      "Northern Lights tour",
      "Golden Circle tour",
      "Whale watching",
      "Visit Hallgrímskirkja",
    ],
    bestTimeToVisit: {
      from: "June",
      to: "August",
    },
  },
  {
    name: "Petra, Jordan",
    description:
      "An ancient city carved into rose-colored rock faces, featuring stunning architecture and rich history.",
    location: {
      type: "Point",
      coordinates: [35.4444, 30.3285],
      address: "Petra",
      city: "Ma'an Governorate",
      country: "Jordan",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1563177978-4c5ebf35e37f",
      caption: "The Treasury",
    },
    rating: 4.9,
    tags: ["historic", "archaeological", "cultural", "adventure"],
    thingsToDo: [
      "Visit The Treasury",
      "Hike to Monastery",
      "Explore Street of Facades",
      "Night tour by candlelight",
      "Visit High Place of Sacrifice",
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "Havana, Cuba",
    description:
      "A city frozen in time, known for its vintage cars, colonial architecture, and vibrant music scene.",
    location: {
      type: "Point",
      coordinates: [-82.3666, 23.1136],
      address: "Havana",
      city: "Havana",
      country: "Cuba",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1500759285222-a95626b934cb",
      caption: "Old Havana street",
    },
    rating: 4.6,
    tags: ["cultural", "historic", "music", "architecture"],
    thingsToDo: [
      "Walk through Old Havana",
      "Visit El Capitolio",
      "Ride in classic car",
      "Visit Malecón",
      "Experience salsa dancing",
    ],
    bestTimeToVisit: {
      from: "December",
      to: "May",
    },
  },
  {
    name: "Serengeti National Park, Tanzania",
    description:
      "One of Africa's premier safari destinations, famous for its annual wildebeest migration.",
    location: {
      type: "Point",
      coordinates: [34.8888, -2.1540],
      address: "Serengeti",
      city: "Arusha Region",
      country: "Tanzania",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
      caption: "Wildlife safari",
    },
    rating: 4.9,
    tags: ["wildlife", "nature", "safari", "adventure"],
    thingsToDo: [
      "Wildlife safari",
      "Watch Great Migration",
      "Hot air balloon ride",
      "Visit Maasai villages",
      "Sunset game drives",
    ],
    bestTimeToVisit: {
      from: "June",
      to: "October",
    },
  },
  {
    name: "Maldives",
    description:
      "A tropical nation of islands known for crystal clear waters, overwater bungalows, and marine life.",
    location: {
      type: "Point",
      coordinates: [73.5093, 4.1755],
      address: "Male",
      city: "Male",
      country: "Maldives",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
      caption: "Overwater bungalows",
    },
    rating: 4.9,
    tags: ["beach", "luxury", "romantic", "water-sports"],
    thingsToDo: [
      "Snorkeling",
      "Stay in overwater villa",
      "Sunset cruise",
      "Island hopping",
      "Underwater restaurant",
    ],
    bestTimeToVisit: {
      from: "November",
      to: "April",
    },
  },
];

const seedDestinations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log("Cleared existing destinations");

    // Insert new destinations
    const createdDestinations = await Destination.insertMany(destinations);
    console.log(
      `Successfully seeded ${createdDestinations.length} destinations`
    );

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding destinations:", error);
    process.exit(1);
  }
};

seedDestinations();
