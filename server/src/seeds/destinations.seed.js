import mongoose from "mongoose";
import Destination from "../models/destination.model.js";
import { connectDB } from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();

const destinations = [
  {
    name: "Paris, France",
    description:
      "The City of Light, known for its romantic atmosphere, iconic landmarks like the Eiffel Tower, and world-class museums. Paris offers a blend of historical architecture, magnificent art collections, and exquisite cuisine that embodies the essence of French culture.",
    location: {
      type: "Point",
      coordinates: [2.3522, 48.8566],
      address: "Paris",
      city: "Paris",
      country: "France",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      caption: "Eiffel Tower with Paris cityscape",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
        caption: "Eiffel Tower at sunset"
      },
      {
        url: "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f",
        caption: "Notre-Dame Cathedral"
      },
      {
        url: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b",
        caption: "Arc de Triomphe"
      },
      {
        url: "https://images.unsplash.com/photo-1568797629192-536885f3583f",
        caption: "Louvre Museum and Pyramid"
      },
      {
        url: "https://images.unsplash.com/photo-1508050919630-b135583b8a76",
        caption: "Charming Parisian cafe"
      },
      {
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
        caption: "Paris skyline at dusk"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Paris exceeded all my expectations! The food, the landmarks, the ambiance - everything was perfect. The Louvre is an absolute must-visit.",
        createdAt: new Date("2025-03-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Beautiful city with amazing architecture. The Eiffel Tower at night is magical. Just be prepared for crowds at popular spots.",
        createdAt: new Date("2025-02-12")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "A dream destination for couples. We had the most romantic weekend walking along the Seine and enjoying pastries at local cafes.",
        createdAt: new Date("2025-01-20")
      }
    ],
    tags: ["romantic", "cultural", "historic", "food", "art", "architecture"],
    thingsToDo: [
      "Visit the Eiffel Tower",
      "Explore the Louvre Museum",
      "Walk along the Seine River",
      "Visit Notre-Dame Cathedral",
      "Explore Montmartre and Sacré-Cœur",
      "Stroll through Luxembourg Gardens",
      "Shop on Champs-Élysées",
      "Visit Musée d'Orsay",
      "Explore the Latin Quarter"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "October",
    },
  },
  {
    name: "Tokyo, Japan",
    description:
      "A vibrant metropolis where traditional culture meets cutting-edge technology, offering unique experiences at every turn. Tokyo seamlessly blends ancient temples and gardens with futuristic skyscrapers and innovative entertainment, creating a captivating contrast that defines modern Japan.",
    location: {
      type: "Point",
      coordinates: [139.6917, 35.6895],
      address: "Tokyo",
      city: "Tokyo",
      country: "Japan",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
      caption: "Tokyo Skyline",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
        caption: "Shibuya Crossing"
      },
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
        caption: "Sensoji Temple"
      },
      {
        url: "https://images.unsplash.com/photo-1493997181344-712f2f19d87a",
        caption: "Cherry Blossoms in Tokyo"
      },
      {
        url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
        caption: "Tokyo Tower at night"
      },
      {
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
        caption: "Street food in Tokyo"
      }
    ],
    rating: 4.7,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Tokyo is incredible! The technology, food, and culture create an unforgettable experience. The subway system makes it easy to explore.",
        createdAt: new Date("2025-04-01")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "An amazing blend of tradition and futurism. Don't miss visiting during cherry blossom season if possible!",
        createdAt: new Date("2025-03-10")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "So many great neighborhoods to explore. The food was phenomenal, especially the ramen and sushi. Highly recommend!",
        createdAt: new Date("2025-02-15")
      }
    ],
    tags: ["modern", "cultural", "food", "shopping", "technology", "urban"],
    thingsToDo: [
      "Visit Shibuya Crossing",
      "Explore Senso-ji Temple",
      "Experience Akihabara Electric Town",
      "Visit Meiji Shrine",
      "Try authentic sushi and ramen",
      "Shop in Ginza",
      "Visit Tokyo Skytree",
      "Explore Harajuku",
      "Relax in Shinjuku Gyoen National Garden"
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "Santorini, Greece",
    description:
      "A stunning island in the Aegean Sea, known for its iconic white-washed buildings with blue domes, dramatic cliffs, and breathtaking sunsets. This Greek paradise offers pristine beaches, ancient ruins, and vibrant local culture that epitomizes Mediterranean charm.",
    location: {
      type: "Point",
      coordinates: [25.4615, 36.3932],
      address: "Santorini",
      city: "Thira",
      country: "Greece",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      caption: "Blue domes of Oia",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1561628898-2062d8ce0729",
        caption: "Sunset in Santorini"
      },
      {
        url: "https://images.unsplash.com/photo-1555688505-a42a848cf8df",
        caption: "Santorini coastline"
      },
      {
        url: "https://images.unsplash.com/photo-1536625994371-2ecb9eddccc6",
        caption: "Red Beach"
      },
      {
        url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
        caption: "Oia village at sunset"
      },
      {
        url: "https://images.unsplash.com/photo-1555688505-a42a848cf8df",
        caption: "Santorini beach view"
      }
    ],
    rating: 4.9,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "The most beautiful place I've ever seen. The views are incredible and the sunsets in Oia are unforgettable.",
        createdAt: new Date("2025-03-20")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Absolutely stunning! We loved exploring the charming villages and beaches. Perfect for couples and photographers.",
        createdAt: new Date("2025-02-25")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "A dream destination with unparalleled views. Just be prepared for crowds and higher prices during peak season.",
        createdAt: new Date("2025-01-15")
      }
    ],
    tags: ["romantic", "beaches", "scenic", "islands", "luxury", "photography"],
    thingsToDo: [
      "Watch the sunset in Oia",
      "Swim at Red Beach and Black Beach",
      "Take a boat tour of the caldera",
      "Visit Ancient Thera archaeological site",
      "Wine tasting at local vineyards",
      "Explore the village of Fira",
      "Visit Akrotiri archaeological site",
      "Hike from Fira to Oia",
      "Try local Greek cuisine"
    ],
    bestTimeToVisit: {
      from: "May",
      to: "September",
    },
  },
  {
    name: "Bali, Indonesia",
    description:
      "Known as the Island of the Gods, Bali enchants with its dramatic volcanic landscapes, lush rice terraces, stunning beaches, and vibrant spiritual culture. This Indonesian paradise offers a perfect blend of relaxation, adventure, and cultural immersion.",
    location: {
      type: "Point",
      coordinates: [115.1889, -8.4095],
      address: "Bali",
      city: "Denpasar",
      country: "Indonesia",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1573790387438-4da905039392",
      caption: "Rice terraces in Ubud",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1537996194471-e8c2327f4e0e",
        caption: "Temple by the lake"
      },
      {
        url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
        caption: "Bali beaches"
      },
      {
        url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47",
        caption: "Waterfall in Bali"
      },
      {
        url: "https://images.unsplash.com/photo-1573790387438-4da905039392",
        caption: "Bali rice fields"
      },
      {
        url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
        caption: "Bali sunset"
      }
    ],
    rating: 4.7,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Magical Bali! From stunning temples to lush landscapes, it's truly a paradise. The warmth of the locals made our trip even more special.",
        createdAt: new Date("2025-04-05")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "Beautiful beaches and amazing food. The spiritual atmosphere is unique. Recommend staying in Ubud for a few days to experience authentic Bali culture.",
        createdAt: new Date("2025-03-12")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4,
        content: "Great destination for both relaxation and adventure. Some tourist areas are crowded, but it's easy to find quiet spots if you venture out.",
        createdAt: new Date("2025-01-30")
      }
    ],
    tags: ["beaches", "spiritual", "nature", "adventure", "culture", "wellness"],
    thingsToDo: [
      "Visit sacred temples like Uluwatu and Tanah Lot",
      "Explore Ubud's monkey forest and rice terraces",
      "Relax on Kuta, Seminyak, or Nusa Dua beaches",
      "Hike Mount Batur for sunrise",
      "Take a Balinese cooking class",
      "Experience traditional dance performances",
      "Visit the Tegallalang Rice Terraces",
      "Surf in Canggu or Uluwatu",
      "Spa treatments and yoga retreats"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "October",
    },
  },
  {
    name: "Barcelona, Spain",
    description:
      "A vibrant Mediterranean city famous for Antoni Gaudí's whimsical architecture, lively culture, beautiful beaches, and delicious Catalan cuisine. Barcelona blends cosmopolitan urban experiences with easy access to nature, from coastal walks and surf beaches to nearby national parks, all under the famously blue Australian skies.",
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
    images: [
      {
        url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
        caption: "Park Güell"
      },
      {
        url: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216",
        caption: "Barcelona Beach"
      },
      {
        url: "https://images.unsplash.com/photo-1509840841025-8ca42a06a826",
        caption: "La Rambla"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Barcelona has it all - amazing architecture, vibrant culture, delicious food, and beautiful beaches. Sagrada Familia is a must-see!",
        createdAt: new Date("2025-03-25")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Loved exploring the Gothic Quarter and experiencing the tapas culture. Gaudí's architecture is truly one-of-a-kind.",
        createdAt: new Date("2025-02-20")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Perfect city break destination with something for everyone. The food scene is fantastic and surprisingly affordable.",
        createdAt: new Date("2025-01-10")
      }
    ],
    tags: ["architecture", "beaches", "food", "cultural", "urban", "art"],
    thingsToDo: [
      "Marvel at Sagrada Familia",
      "Explore Park Güell",
      "Stroll down La Rambla",
      "Visit Casa Batlló and Casa Milà",
      "Relax on Barceloneta Beach",
      "Experience the food scene at La Boqueria Market",
      "Explore the Gothic Quarter",
      "Visit the Picasso Museum",
      "Watch a FC Barcelona match at Camp Nou"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "June",
    },
  },
  {
    name: "Kyoto, Japan",
    description:
      "The cultural heart of Japan, known for its classical Buddhist temples, gardens, imperial palaces, traditional wooden houses, and geisha culture. Kyoto offers an immersive experience in Japanese traditions, from tea ceremonies to seasonal festivals that have been preserved for centuries.",
    location: {
      type: "Point",
      coordinates: [135.7681, 35.0116],
      address: "Kyoto",
      city: "Kyoto",
      country: "Japan",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      caption: "Cherry Blossoms in Kyoto",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1493997181344-712f2f19d87a",
        caption: "Fushimi Inari Shrine"
      },
      {
        url: "https://images.unsplash.com/photo-1528360983277-0c3cb6fa808d",
        caption: "Kinkaku-ji (Golden Pavilion)"
      },
      {
        url: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d",
        caption: "Arashiyama Bamboo Grove"
      }
    ],
    rating: 4.9,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Kyoto is like stepping back in time. The temples and gardens are incredibly peaceful, and seeing geisha in Gion was unforgettable.",
        createdAt: new Date("2025-03-18")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Absolutely magical place. Fushimi Inari at sunrise with no crowds was a highlight of our entire Japan trip. Allow plenty of time to explore.",
        createdAt: new Date("2025-02-22")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Beautiful city rich in tradition. The temples can get crowded but are still worth visiting. Renting bikes is a great way to see the city.",
        createdAt: new Date("2025-01-15")
      }
    ],
    tags: ["cultural", "historic", "temples", "traditional", "gardens", "spiritual"],
    thingsToDo: [
      "Visit Fushimi Inari Shrine",
      "Explore Kinkaku-ji (Golden Pavilion)",
      "Walk through Arashiyama Bamboo Grove",
      "Experience a traditional tea ceremony",
      "Visit Kiyomizu-dera Temple",
      "Explore Gion district and spot geisha",
      "Tour the Imperial Palace",
      "Visit Nishiki Market",
      "Day trip to nearby Nara"
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "New York City, USA",
    description:
      "A global metropolis known for its iconic skyline, Broadway shows, diverse neighborhoods, world-class museums, and vibrant energy. New York City offers endless possibilities for urban exploration, from Central Park's green spaces to the cutting-edge galleries of Chelsea and the historic streets of Lower Manhattan.",
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128],
      address: "New York",
      city: "New York City",
      country: "United States",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1496442226666-8d504e8d37d8",
      caption: "New York Skyline"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1534270804882-a3cd7c5a6650",
        caption: "Central Park"
      },
      {
        url: "https://images.unsplash.com/photo-1581005781786-27bbe53b7d56",
        caption: "Brooklyn Bridge"
      },
      {
        url: "https://images.unsplash.com/photo-1564658724721-b648af45ca4d",
        caption: "Times Square"
      },
      {
        url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25",
        caption: "Statue of Liberty"
      },
      {
        url: "https://images.unsplash.com/photo-1485871983421-1e5952736ba8",
        caption: "Empire State Building"
      },
      {
        url: "https://images.unsplash.com/photo-1485872299829-c673f5194813",
        caption: "Manhattan Skyline at night"
      }
    ],
    rating: 4.7,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "NYC has an energy unlike anywhere else. The food scene is incredible - from $1 pizza slices to Michelin-starred restaurants. Make time for neighborhoods beyond Manhattan!",
        createdAt: new Date("2025-04-05")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4,
        content: "Amazing city with endless things to do. Can be expensive and overwhelming, but the diversity and culture make it worth it. Try to explore at least one borough beyond Manhattan.",
        createdAt: new Date("2025-03-10")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "A must-visit destination. The museums alone could keep you busy for weeks, and every neighborhood feels like a different world. The High Line was a highlight!",
        createdAt: new Date("2025-02-15")
      }
    ],
    tags: ["urban", "cultural", "food", "museums", "shopping", "nightlife", "architecture"],
    thingsToDo: [
      "See the view from Empire State Building or Top of the Rock",
      "Walk across Brooklyn Bridge",
      "Explore Central Park",
      "Visit the Metropolitan Museum of Art",
      "Experience Times Square",
      "Walk the High Line",
      "Visit the 9/11 Memorial & Museum",
      "Take in a Broadway show",
      "Explore diverse neighborhoods like Chinatown, Little Italy, and Harlem"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "June",
    },
  },
  {
    name: "Cape Town, South Africa",
    description:
      "A stunning coastal city where dramatic mountains meet the ocean, offering a perfect blend of urban sophistication, natural beauty, and rich cultural history. Cape Town combines outdoor adventures, from hiking Table Mountain to penguin encounters, with world-class dining, vibrant markets, and profound historical sites.",
    location: {
      type: "Point",
      coordinates: [18.4241, -33.9249],
      address: "Cape Town",
      city: "Cape Town",
      country: "South Africa",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
      caption: "Table Mountain"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1528370967721-0ed2d070f4e9",
        caption: "Boulders Beach Penguins"
      },
      {
        url: "https://images.unsplash.com/photo-1547190998-1fbecd04cd9c",
        caption: "Cape Point"
      },
      {
        url: "https://images.unsplash.com/photo-1642748531578-de633a64af1f",
        caption: "Bo-Kaap Colorful Houses"
      },
      {
        url: "https://images.unsplash.com/photo-1520250497590-4509e771c1c4",
        caption: "Kirstenbosch Botanical Gardens"
      },
      {
        url: "https://images.unsplash.com/photo-1547190998-1fbecd04cd9c",
        caption: "Chapman's Peak Drive"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Cape Town exceeded all expectations! The landscapes are breathtaking, and the mix of cultures makes it feel like several destinations in one. Don't miss the wine regions just outside the city.",
        createdAt: new Date("2025-04-02")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "One of the most beautiful cities I've visited. Table Mountain views are incredible, and the beaches are stunning. Robben Island was a moving experience everyone should have.",
        createdAt: new Date("2025-03-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Amazing city with something for everyone - hiking, beaches, wildlife, wine tasting, and rich history. The food scene is fantastic and surprisingly affordable.",
        createdAt: new Date("2025-02-26")
      }
    ],
    tags: ["nature", "beaches", "mountains", "wildlife", "cultural", "wine", "history"],
    thingsToDo: [
      "Hike or take the cable car up Table Mountain",
      "Visit Cape Point and the Cape of Good Hope",
      "See the penguins at Boulders Beach",
      "Take the ferry to Robben Island",
      "Explore the Victoria & Alfred Waterfront",
      "Visit the colorful Bo-Kaap neighborhood",
      "Go wine tasting in Stellenbosch",
      "Visit Kirstenbosch Botanical Gardens",
      "Take a drive along Chapman's Peak"
    ],
    bestTimeToVisit: {
      from: "October",
      to: "April",
    },
  },
  {
    name: "Marrakech, Morocco",
    description:
      "An ancient imperial city that dazzles visitors with its maze-like medina, vibrant souks, ornate palaces, and rich sensory experiences. Marrakech offers a bewitching blend of traditional Moroccan culture and architecture with modern luxury, from its historic riads to contemporary art galleries and designer boutiques.",
    location: {
      type: "Point",
      coordinates: [-7.9811, 31.6295],
      address: "Marrakech",
      city: "Marrakech",
      country: "Morocco",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1597212618440-806262de4f6c",
      caption: "Jemaa el-Fnaa Market"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1539020140153-e8c2327f4e0e",
        caption: "Majorelle Garden"
      },
      {
        url: "https://images.unsplash.com/photo-1594614271360-0ed2d070f4e9",
        caption: "Bahia Palace"
      },
      {
        url: "https://images.unsplash.com/photo-1561642769-373656ddb2ac",
        caption: "Moroccan Spices"
      },
      {
        url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
        caption: "Traditional Moroccan Riad"
      },
      {
        url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2",
        caption: "Atlas Mountains view"
      }
    ],
    rating: 4.7,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Marrakech is a feast for the senses! Getting lost in the medina was the highlight - so many hidden gems around every corner. Staying in a traditional riad enhanced the experience.",
        createdAt: new Date("2025-03-28")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Such a vibrant city! The architecture is stunning and the food is delicious. Be prepared for lots of attention from vendors in the souks - learning to haggle is part of the experience.",
        createdAt: new Date("2025-02-18")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "Beautiful city with so much culture and history. The Majorelle Garden was my favorite spot - so peaceful compared to the bustling medina. Take a day trip to the Atlas Mountains if possible.",
        createdAt: new Date("2025-01-25")
      }
    ],
    tags: ["cultural", "historic", "markets", "architecture", "food", "shopping", "exotic"],
    thingsToDo: [
      "Explore the ancient medina and its souks",
      "Visit Jardin Majorelle and YSL Museum",
      "Experience Jemaa el-Fnaa square at sunset",
      "Tour the Bahia Palace",
      "Visit the Saadian Tombs",
      "Relax in a traditional hammam",
      "Take a cooking class to learn Moroccan cuisine",
      "Day trip to the Atlas Mountains",
      "Stay in a traditional riad"
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "Sydney, Australia",
    description:
      "A spectacular harbor city known for its iconic Opera House, golden beaches, and outdoor lifestyle. Sydney blends cosmopolitan urban experiences with easy access to nature, from coastal walks and surf beaches to nearby national parks, all under the famously blue Australian skies.",
    location: {
      type: "Point",
      coordinates: [151.2093, -33.8688],
      address: "Sydney",
      city: "Sydney",
      country: "Australia",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5",
      caption: "Sydney Opera House and Harbour"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1548997169-6e399b6d27e9",
        caption: "Copacabana Beach"
      },
      {
        url: "https://images.unsplash.com/photo-1546268060-2592fda517a47",
        caption: "Sydney Harbour Bridge"
      },
      {
        url: "https://images.unsplash.com/photo-1523428096881-5bd71ffdb2d0",
        caption: "The Rocks District"
      },
      {
        url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25",
        caption: "Manly Beach"
      },
      {
        url: "https://images.unsplash.com/photo-1485871983421-1e5952736ba8",
        caption: "Blue Mountains"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Sydney is spectacular! The harbor views never get old, and the combination of city, beaches, and nature is perfect. Don't miss the coastal walks - Bondi to Coogee was breathtaking.",
        createdAt: new Date("2025-03-26")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "Beautiful city with a fantastic quality of life. Great food scene, especially seafood, and the outdoor lifestyle is wonderful. People are friendly and the harbor is even more stunning in person.",
        createdAt: new Date("2025-02-14")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "One of the world's great cities. Taking the ferry to Manly offers the best views of the harbor and Opera House. Give yourself plenty of time to explore the different neighborhoods and beaches.",
        createdAt: new Date("2025-01-20")
      }
    ],
    tags: ["beaches", "urban", "harbor", "architecture", "nature", "outdoor", "food"],
    thingsToDo: [
      "Visit the Sydney Opera House",
      "Climb or walk across the Harbour Bridge",
      "Relax on Bondi Beach",
      "Walk the Bondi to Coogee coastal path",
      "Take a ferry to Manly",
      "Explore The Rocks historic district",
      "Visit Taronga Zoo for amazing city views",
      "Tour the Royal Botanic Garden",
      "Day trip to the Blue Mountains"
    ],
    bestTimeToVisit: {
      from: "September",
      to: "November",
    },
  },
  {
    name: "Rio de Janeiro, Brazil",
    description:
      "The Marvelous City where mountains meet the sea, known for its stunning landscapes, vibrant culture, and famous beaches. Rio offers an intoxicating blend of natural beauty and urban energy, from the iconic Christ the Redeemer statue to the rhythms of samba and the legendary Copacabana and Ipanema beaches.",
    location: {
      type: "Point",
      coordinates: [-43.1729, -22.9068],
      address: "Rio de Janeiro",
      city: "Rio de Janeiro",
      country: "Brazil",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1483729558449-6b5048b1c1fc",
      caption: "Christ the Redeemer and Rio Skyline",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1548997169-6e399b6d27e9",
        caption: "Copacabana Beach"
      },
      {
        url: "https://images.unsplash.com/photo-1554768707-a470b9964682",
        caption: "Sugarloaf Mountain"
      },
      {
        url: "https://images.unsplash.com/photo-1564658724721-b648af45ca4d",
        caption: "Selaron Steps"
      },
      {
        url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25",
        caption: "Ipanema Beach"
      },
      {
        url: "https://images.unsplash.com/photo-1485871983421-1e5952736ba8",
        caption: "Tijuca Forest"
      }
    ],
    rating: 4.6,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Rio is breathtaking! The views from Christ the Redeemer and Sugarloaf Mountain are unforgettable. The beach culture is so fun, and the caipirinhas are dangerously good.",
        createdAt: new Date("2025-04-06")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "One of the most naturally beautiful cities in the world. The combination of mountains, forests, and beaches within the city is unique. Be aware of your surroundings but don't let safety concerns stop you from visiting.",
        createdAt: new Date("2025-03-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4,
        content: "Incredible city with so much energy and beauty. Watching the sunset from Arpoador between Copacabana and Ipanema was magical. Try to learn a few Portuguese phrases - locals appreciate it!",
        createdAt: new Date("2025-02-08")
      }
    ],
    tags: ["beaches", "nature", "mountains", "cultural", "nightlife", "food", "adventure"],
    thingsToDo: [
      "Visit Christ the Redeemer",
      "Take the cable car to Sugarloaf Mountain",
      "Relax on Copacabana and Ipanema beaches",
      "Explore the Tijuca National Forest",
      "Visit the colorful Selaron Steps",
      "Experience a local samba club",
      "Hang glide over the city",
      "Explore Santa Teresa neighborhood",
      "Visit the Museum of Tomorrow"
    ],
    bestTimeToVisit: {
      from: "May",
      to: "October",
    },
  },
  {
    name: "Prague, Czech Republic",
    description:
      "A fairy-tale city of spires, medieval architecture, and cobblestone streets, often called the 'City of a Hundred Spires.' Prague offers remarkably preserved historic neighborhoods, stunning Gothic and Baroque buildings, world-famous beer culture, and a rich artistic heritage that has influenced Europe for centuries.",
    location: {
      type: "Point",
      coordinates: [14.4378, 50.0755],
      address: "Prague",
      city: "Prague",
      country: "Czech Republic",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef",
      caption: "Prague Castle and Charles Bridge",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541849546738-65ddcdfd017b",
        caption: "Old Town Square"
      },
      {
        url: "https://images.unsplash.com/photo-1569399080931-02ed52793273",
        caption: "Astronomical Clock"
      },
      {
        url: "https://images.unsplash.com/photo-1592367896873-5aabfd279737",
        caption: "Dancing House"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Prague is like walking into a fairy tale! The entire historic center feels like an open-air museum. The architecture is stunning, and the city is very walkable. Don't miss Prague Castle at sunset.",
        createdAt: new Date("2025-03-30")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Absolutely magical city, especially in the evening when the crowds thin and the buildings are lit up. The beer is excellent and affordable. Try to explore beyond the main tourist areas too.",
        createdAt: new Date("2025-02-28")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Beautiful historic city with amazing architecture around every corner. Try to visit Charles Bridge early morning to avoid crowds. The local food is hearty and pairs perfectly with Czech beer.",
        createdAt: new Date("2025-01-17")
      }
    ],
    tags: ["historic", "architecture", "cultural", "beer", "romantic", "walkable", "affordable"],
    thingsToDo: [
      "Explore Prague Castle complex",
      "Walk across Charles Bridge",
      "Visit Old Town Square and watch the Astronomical Clock",
      "Explore the Jewish Quarter",
      "Visit St. Vitus Cathedral",
      "Try traditional Czech food and beer",
      "Take in the view from Petřín Hill",
      "See the John Lennon Wall",
      "Take a Vltava River cruise"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "October",
    },
  },
  {
    name: "Bangkok, Thailand",
    description:
      "A vibrant, chaotic, and fascinating metropolis where traditional Thai culture meets modern urban life. Bangkok enthralls visitors with its ornate temples and palaces, bustling markets, world-renowned street food, luxury shopping malls, and energetic nightlife, all connected by a network of canals and modern transit systems.",
    location: {
      type: "Point",
      coordinates: [100.5018, 13.7563],
      address: "Bangkok",
      city: "Bangkok",
      country: "Thailand",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5",
      caption: "Grand Palace",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1598970605070-a8fd1c313361",
        caption: "Wat Arun Temple"
      },
      {
        url: "https://images.unsplash.com/photo-1559608568-ac925a41f899",
        caption: "Bangkok Skyline"
      },
      {
        url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
        caption: "Floating Market"
      }
    ],
    rating: 4.6,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Bangkok is a sensory overload in the best way! The street food is incredible - don't be afraid to try it. The contrast between ancient temples and ultramodern skyscrapers is fascinating.",
        createdAt: new Date("2025-03-22")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4,
        content: "Amazing city with so much energy. It can be overwhelming at first, but once you adjust to the pace, it's incredible. The temples are stunning, and the food is some of the best I've ever had.",
        createdAt: new Date("2025-02-19")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "Bangkok offers amazing value - luxury accommodations and exceptional food at reasonable prices. Getting around is easy with the BTS and metro. Don't miss a boat trip on the Chao Phraya River!",
        createdAt: new Date("2025-01-08")
      }
    ],
    tags: ["temples", "food", "markets", "shopping", "urban", "nightlife", "affordable"],
    thingsToDo: [
      "Visit the Grand Palace and Wat Phra Kaew",
      "Explore Wat Arun (Temple of Dawn)",
      "Shop at Chatuchak Weekend Market",
      "Take a boat tour through the canals (klongs)",
      "Experience the street food at Yaowarat (Chinatown)",
      "Visit Jim Thompson House",
      "Explore Wat Pho and see the Reclining Buddha",
      "Shop at modern malls like Siam Paragon",
      "Take a day trip to Ayutthaya"
    ],
    bestTimeToVisit: {
      from: "November",
      to: "February",
    },
  },
  {
    name: "Rome, Italy",
    description:
      "The Eternal City where ancient history comes alive around every corner, offering a unique journey through more than two millennia of art, architecture, and culinary tradition. Rome captivates visitors with its archaeological treasures, Renaissance masterpieces, charming piazzas, passionate locals, and renowned Italian cuisine.",
    location: {
      type: "Point",
      coordinates: [12.4964, 41.9028],
      address: "Rome",
      city: "Rome",
      country: "Italy",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1531572753322-ad063cecc140",
      caption: "Colosseum",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-155992828-ca4dbe41d294",
        caption: "Vatican and St. Peter's Basilica"
      },
      {
        url: "https://images.unsplash.com/photo-1525874684015-58379d421a52",
        caption: "Trevi Fountain"
      },
      {
        url: "https://images.unsplash.com/photo-1560179406-1c6c69e6ad45",
        caption: "Roman Forum"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Rome is an open-air museum! The history is literally everywhere, and the food is divine. Walking is the best way to explore - you'll discover something amazing around every corner.",
        createdAt: new Date("2025-04-10")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Incredible city that exceeds expectations. The ancient ruins alongside busy modern life is something special. Book Vatican and Colosseum tickets in advance to avoid long lines.",
        createdAt: new Date("2025-03-05")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Rome has so many layers of history to discover. The food is fantastic - try different neighborhoods for authentic Roman cuisine. Early morning is best for photos without crowds.",
        createdAt: new Date("2025-02-07")
      }
    ],
    tags: ["historic", "cultural", "architecture", "food", "art", "ancient", "romantic"],
    thingsToDo: [
      "Explore the Colosseum and Roman Forum",
      "Visit the Vatican Museums and St. Peter's Basilica",
      "Throw a coin in the Trevi Fountain",
      "Visit the Pantheon",
      "Explore Villa Borghese gardens and gallery",
      "Wander through Trastevere neighborhood",
      "Climb the Spanish Steps",
      "Try authentic Roman pasta dishes",
      "Take a day trip to Ostia Antica"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "June",
    },
  },
  {
    name: "Queenstown, New Zealand",
    description:
      "A picturesque resort town nestled between mountains and Lake Wakatipu, known as the adventure capital of the world. Queenstown offers year-round outdoor activities from skiing and snowboarding to bungee jumping, jet boating, and some of New Zealand's most spectacular hiking trails, all surrounded by the breathtaking landscapes featured in The Lord of the Rings films.",
    location: {
      type: "Point",
      coordinates: [168.6626, -45.0312],
      address: "Queenstown",
      city: "Queenstown",
      country: "New Zealand",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1589196728602-5b21d35d65e9",
      caption: "Queenstown with The Remarkables mountain range",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
        caption: "Mountain views near Queenstown"
      },
      {
        url: "https://images.unsplash.com/photo-1531301677242-05b9c1ad37a8",
        caption: "Milford Sound day trip"
      },
      {
        url: "https://images.unsplash.com/photo-1535430069278-549d819fa886",
        caption: "Bungy jumping in Queenstown"
      },
      {
        url: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
        caption: "Autumn colors in Arrowtown near Queenstown"
      },
      {
        url: "https://images.unsplash.com/photo-1515259387367-2c6c122bf145",
        caption: "Hiking in Queenstown"
      }
    ],
    rating: 4.9,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Queenstown is an adrenaline junkie's paradise! The scenery is absolutely magical, like something from a movie. We did the Nevis bungy jump and it was terrifying but worth it!",
        createdAt: new Date("2025-04-05")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Simply the most beautiful place I've ever visited. Whether you love adventure sports or just want to enjoy stunning views with a great meal and wine, Queenstown has it all.",
        createdAt: new Date("2025-03-10")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Amazing winter experience! Skiing at The Remarkables was incredible and the town has such a vibrant atmosphere. It's expensive, but the views alone are worth every penny.",
        createdAt: new Date("2025-02-20")
      }
    ],
    tags: ["adventure", "mountains", "nature", "hiking", "winter", "scenic", "luxury"],
    thingsToDo: [
      "Go bungee jumping at the Kawarau Bridge or Nevis",
      "Take the Skyline Gondola for panoramic views",
      "Enjoy winter sports at The Remarkables or Coronet Peak",
      "Take a day trip to Milford Sound",
      "Try jet boating on the Shotover River",
      "Sample wines from Central Otago region",
      "Hike the Ben Lomond Track",
      "Explore historic Arrowtown",
      "Take a scenic flight over the Southern Alps"
    ],
    bestTimeToVisit: {
      from: "December",
      to: "February",
    },
  },
  {
    name: "Istanbul, Turkey",
    description:
      "A transcontinental metropolis bridging Europe and Asia, where centuries of history meet contemporary life. Istanbul captivates visitors with its magnificent Byzantine and Ottoman architecture, bustling bazaars, delicious cuisine, and vibrant neighborhoods, all straddling the stunning Bosphorus Strait.",
    location: {
      type: "Point",
      coordinates: [28.9784, 41.0082],
      address: "Istanbul",
      city: "Istanbul",
      country: "Turkey",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1527838832700-5059252407fa",
      caption: "Blue Mosque and Hagia Sophia",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b",
        caption: "Inside the Grand Bazaar"
      },
      {
        url: "https://images.unsplash.com/photo-1564565562150-46e25eb31626",
        caption: "Interior of Hagia Sophia"
      },
      {
        url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b",
        caption: "Turkish cuisine and tea"
      },
      {
        url: "https://images.unsplash.com/photo-1599394022918-6c2776530abb",
        caption: "Colorful streets of Istanbul"
      },
      {
        url: "https://images.unsplash.com/photo-1647594931749-9f39a3247a99",
        caption: "Bosphorus cruise view"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Istanbul is magical! The blend of cultures, religions, and architectural styles creates a unique atmosphere you won't find anywhere else. The food is incredible and people are so welcoming.",
        createdAt: new Date("2025-04-01")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "What a fascinating city where East meets West. The Blue Mosque and Hagia Sophia are breathtaking, and the Grand Bazaar is an experience in itself. Try to stay near Sultanahmet for easy access to main sights.",
        createdAt: new Date("2025-03-12")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "One of the most historically rich cities I've visited. Take a Bosphorus cruise for the best views of the city. The street food is amazing - don't miss trying simit and fresh fish sandwiches by the Galata Bridge!",
        createdAt: new Date("2025-02-22")
      }
    ],
    tags: ["historical", "culture", "food", "architecture", "markets", "mosques", "bosphorus"],
    thingsToDo: [
      "Visit the Hagia Sophia and Blue Mosque",
      "Explore the Grand Bazaar and Spice Market",
      "Take a Bosphorus cruise",
      "Tour Topkapi Palace",
      "Visit the underground Basilica Cistern",
      "Walk across the Galata Bridge",
      "Experience a traditional Turkish bath (hamam)",
      "Explore the trendy Karaköy neighborhood",
      "Enjoy Turkish coffee and baklava in a traditional café"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "June",
    },
  },
  {
    name: "Dubrovnik, Croatia",
    description:
      "A stunning medieval walled city perched on the Adriatic coastline, known for its distinctive orange roofs and limestone streets. Dubrovnik's perfectly preserved Old Town, surrounded by massive stone walls, offers visitors a journey through centuries of history, alongside crystal-clear waters, nearby islands, and the dramatic backdrop that served as King's Landing in Game of Thrones.",
    location: {
      type: "Point",
      coordinates: [18.0944, 42.6507],
      address: "Dubrovnik",
      city: "Dubrovnik",
      country: "Croatia",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1555990536-2d0c9498e13e",
      caption: "Dubrovnik Old Town and Adriatic Sea",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1508787428419-f2391863deee",
        caption: "View from the City Walls"
      },
      {
        url: "https://images.unsplash.com/photo-1514729439985-8ca42a06a966",
        caption: "Lokrum Island near Dubrovnik"
      },
      {
        url: "https://images.unsplash.com/photo-1555990538-94ec37f9d3c0",
        caption: "Dubrovnik beaches"
      },
      {
        url: "https://images.unsplash.com/photo-1596396289005-0689c239dc54",
        caption: "Sunset over Dubrovnik"
      },
      {
        url: "https://images.unsplash.com/photo-1542295669297-4d352b042bca",
        caption: "Game of Thrones filming location"
      }
    ],
    rating: 4.7,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Dubrovnik is like stepping into a fairy tale! Walking the city walls offers incredible views at every turn. It does get very crowded in summer though - early morning or evening visits are best.",
        createdAt: new Date("2025-03-25")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Absolutely stunning city with so much history. The clear blue waters are perfect for swimming. If you're a Game of Thrones fan, you'll recognize many filming locations throughout the Old Town.",
        createdAt: new Date("2025-02-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Beautiful but very crowded and can be expensive. Visit in May or September for better experience. Taking the cable car up Mount Srđ for sunset views is a must-do!",
        createdAt: new Date("2025-01-20")
      }
    ],
    tags: ["medieval", "coastal", "historical", "architecture", "gameofthrones", "beaches", "walled city"],
    thingsToDo: [
      "Walk the ancient City Walls",
      "Explore the limestone streets of the Old Town",
      "Take the cable car to Mount Srđ for panoramic views",
      "Visit Rector's Palace and Franciscan Monastery",
      "Take a boat trip to Lokrum Island",
      "Go on a Game of Thrones filming locations tour",
      "Swim in the crystal-clear Adriatic Sea",
      "Enjoy fresh seafood at a waterfront restaurant",
      "Take a day trip to the Elafiti Islands"
    ],
    bestTimeToVisit: {
      from: "May",
      to: "September",
    },
  },
  {
    name: "Machu Picchu, Peru",
    description:
      "A 15th-century Inca citadel perched high in the Andes Mountains, recognized as one of the New Seven Wonders of the World. This archaeological marvel reveals the incredible engineering skills of the Inca civilization, with its terraced fields, temples, and astronomical alignments, all surrounded by cloud forests and dramatic mountain peaks that create an almost mystical atmosphere.",
    location: {
      type: "Point",
      coordinates: [-72.5450, -13.1631],
      address: "Machu Picchu",
      city: "Urubamba Province",
      country: "Peru",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1526392060635-1782f1c5f971",
      caption: "Classic Machu Picchu View",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1517105274840-437c83485e6c",
        caption: "Terraces of Machu Picchu"
      },
      {
        url: "https://images.unsplash.com/photo-1553253837-2fb1c6b3aca3",
        caption: "Inca Trail to Machu Picchu"
      },
      {
        url: "https://images.unsplash.com/photo-1631771017444-fda9b88ad2bc",
        caption: "Detailed stonework"
      },
      {
        url: "https://images.unsplash.com/photo-1580943943067-2f30e9d00b48",
        caption: "Sacred Valley landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1562982228-38728932de8a",
        caption: "Mountain peaks surrounding Machu Picchu"
      }
    ],
    rating: 4.9,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "A truly spiritual experience. The engineering genius of the Incas is mind-blowing, and the setting is beyond spectacular. Hiking the Inca Trail to reach Machu Picchu was challenging but rewarding beyond words.",
        createdAt: new Date("2025-04-10")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Lives up to the hype! The misty mountains surrounding the ruins create an almost mystical atmosphere. Book your entry tickets well in advance and try to be one of the first visitors in the morning.",
        createdAt: new Date("2025-03-05")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "Absolutely incredible site. Consider spending two days there if possible - one for the classic views and one for hiking Huayna Picchu for a different perspective. The altitude can be challenging, so acclimatize in Cusco first.",
        createdAt: new Date("2025-02-12")
      }
    ],
    tags: ["unesco", "ruins", "hiking", "mountains", "archaeological", "inca", "wonder"],
    thingsToDo: [
      "Explore the main archaeological site with a guide",
      "Hike up Huayna Picchu for spectacular views",
      "Trek the classic Inca Trail (book months in advance)",
      "Visit the Temple of the Sun and Intihuatana stone",
      "See the agricultural terraces",
      "Spot local wildlife like llamas and chinchillas",
      "Learn about Inca astronomy and engineering",
      "Visit nearby hot springs in Aguas Calientes",
      "Explore other ruins in the Sacred Valley"
    ],
    bestTimeToVisit: {
      from: "May",
      to: "September",
    },
  },
  {
    name: "Dubai, United Arab Emirates",
    description:
      "A futuristic metropolis rising from the Arabian Desert, known for its ultramodern architecture, luxury shopping, and ambitious man-made attractions. Dubai seamlessly blends cutting-edge innovation with traditional Arabian culture, offering visitors experiences from scaling the world's tallest building to desert safaris, all while showcasing how vision can transform a fishing village into a global city in just a few decades.",
    location: {
      type: "Point",
      coordinates: [55.2708, 25.2048],
      address: "Dubai",
      city: "Dubai",
      country: "United Arab Emirates",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1512453979798-6b5048b1c1fc",
      caption: "Dubai Skyline with Burj Khalifa",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1582672223566-503571de7a1d",
        caption: "Dubai Mall and Fountains"
      },
      {
        url: "https://images.unsplash.com/photo-1568659777876-f77db15e74bb",
        caption: "Traditional Dubai Creek area"
      },
      {
        url: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc",
        caption: "Desert safari experience"
      },
      {
        url: "https://images.unsplash.com/photo-1549944850-84e00be4203b",
        caption: "Dubai Marina at night"
      },
      {
        url: "https://images.unsplash.com/photo-1570748042380-4395a9317611",
        caption: "Burj Al Arab luxury hotel"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Dubai is like nowhere else on earth! The architecture is mind-blowing, especially the Burj Khalifa. Everything is designed to impress, from the massive malls to the dancing fountains. The contrast between ultra-modern and traditional areas adds interesting dimension.",
        createdAt: new Date("2025-04-08")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "Amazing city that showcases what human ambition can accomplish. The shopping is world-class and the food scene is incredibly diverse. The desert safari was a highlight - try the evening option with dinner under the stars!",
        createdAt: new Date("2025-03-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Spectacular modern city with endless photo opportunities. Visit during winter months as summer is extremely hot. For a more authentic experience, explore the old Dubai area around the Creek and the spice and gold souks.",
        createdAt: new Date("2025-02-25")
      }
    ],
    tags: ["luxury", "architecture", "shopping", "desert", "futuristic", "beaches", "skyscrapers"],
    thingsToDo: [
      "Visit the observation deck of Burj Khalifa",
      "Shop at The Dubai Mall and see the fountain show",
      "Experience a desert safari with dune bashing",
      "Explore the historic Al Fahidi district",
      "Visit the Palm Jumeirah and Atlantis resort",
      "Tour the Dubai Marina and JBR beach",
      "Experience the traditional gold and spice souks",
      "Visit the Dubai Frame",
      "Try indoor skiing at Ski Dubai"
    ],
    bestTimeToVisit: {
      from: "November",
      to: "March",
    },
  },
  {
    name: "Bora Bora, French Polynesia",
    description:
      "A stunning tropical paradise in the South Pacific, known for its crystal-clear turquoise lagoon, overwater bungalows, and pristine white sand beaches. Surrounded by a coral reef and volcanic mountains rising from the sea, Bora Bora offers an idyllic escape with world-class snorkeling, diving, and romantic sunset views that epitomize the perfect island getaway.",
    location: {
      type: "Point",
      coordinates: [-151.7413, -16.5004],
      address: "Bora Bora",
      city: "Bora Bora",
      country: "French Polynesia",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1598954554961-c2f16ac3245c",
      caption: "Overwater bungalows in Bora Bora",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1627321896786-df3280796c95",
        caption: "Snorkeling in coral reefs"
      },
      {
        url: "https://images.unsplash.com/photo-1501426026826-3b6fa6167081",
        caption: "Sunset views over Mount Otemanu"
      },
      {
        url: "https://images.unsplash.com/photo-1551366782-3b6fa6167081",
        caption: "Pristine white sand beaches"
      },
      {
        url: "https://images.unsplash.com/photo-1573848855919-90a87ecc00fe",
        caption: "Tropical drinks on the beach"
      },
      {
        url: "https://images.unsplash.com/photo-1620219365994-f451bdb5f226",
        caption: "Luxury resort experience"
      }
    ],
    rating: 4.9,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Bora Bora completely lived up to our expectations for our honeymoon. Staying in an overwater bungalow was magical - waking up to those turquoise waters every morning felt surreal. The snorkeling was incredible with so many colorful fish!",
        createdAt: new Date("2025-04-02")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "The most beautiful water I've ever seen - photos don't do it justice. Yes, it's expensive, but worth every penny. The service at the resorts is impeccable and the fresh seafood was amazing.",
        createdAt: new Date("2025-03-06")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Truly a bucket list destination. The marine life in the lagoon is spectacular, and the views of Mount Otemanu are breathtaking. Be prepared for very high prices though, especially for food and activities.",
        createdAt: new Date("2025-02-15")
      }
    ],
    tags: ["luxury", "beaches", "romantic", "snorkeling", "islands", "overwater", "honeymoon"],
    thingsToDo: [
      "Stay in an overwater bungalow",
      "Snorkel or dive in the coral gardens",
      "Take a lagoon tour to swim with sharks and rays",
      "Enjoy a Polynesian cultural show",
      "Hike Mount Pahia for incredible views",
      "Go on a sunset cruise",
      "Try paddleboarding or kayaking in the lagoon",
      "Have a romantic dinner on the beach",
      "Take a helicopter tour of the island"
    ],
    bestTimeToVisit: {
      from: "May",
      to: "October",
    },
  },
  {
    name: "Petra, Jordan",
    description:
      "An ancient archaeological site carved into rose-colored stone cliffs, often called the 'Rose City'. This UNESCO World Heritage Site features elaborate facades, tombs, and temples dating back to the 1st century BC, with the famous Treasury (Al-Khazneh) as its most iconic structure. Petra represents the impressive achievements of the Nabataean civilization and offers visitors a journey through a dramatic desert landscape steeped in history.",
    location: {
      type: "Point",
      coordinates: [35.4444, 30.3285],
      address: "Petra",
      city: "Wadi Musa",
      country: "Jordan",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1563177118-a2594fd4cf49",
      caption: "The Treasury (Al-Khazneh)",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c",
        caption: "Rose-colored cliffs of Petra"
      },
      {
        url: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca",
        caption: "Royal Tombs"
      },
      {
        url: "https://images.unsplash.com/photo-1579606032821-4e6b5034f4b3",
        caption: "View from above Petra"
      },
      {
        url: "https://images.unsplash.com/photo-1638967806286-936e6283bda7",
        caption: "Local Bedouin culture"
      },
      {
        url: "https://images.unsplash.com/photo-1565332179425-7d5c867c9f9f",
        caption: "Camel rides in Petra"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Absolutely breathtaking! Walking through the narrow Siq and seeing the Treasury appear before you is an experience I'll never forget. The scale and detail of the carved structures is mind-blowing when you consider when they were created.",
        createdAt: new Date("2025-03-20")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Petra exceeded all expectations. It's so much more than just the Treasury - the entire site is massive with hundreds of tombs and structures. Don't miss hiking up to the Monastery for fewer crowds and equally impressive views.",
        createdAt: new Date("2025-02-10")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 4.5,
        content: "A true wonder of the world that deserves at least a full day to explore. The Petra by Night experience with candlelight is magical and worth the extra cost. Wear good walking shoes and bring plenty of water - the site is enormous!",
        createdAt: new Date("2025-01-15")
      }
    ],
    tags: ["historical", "archaeological", "unesco", "ancient", "hiking", "desert", "wonder"],
    thingsToDo: [
      "Walk through the Siq to the Treasury",
      "Hike up to the Monastery (Ad Deir)",
      "Visit the Royal Tombs",
      "Experience Petra by Night",
      "Explore the Great Temple",
      "Climb to the High Place of Sacrifice",
      "Visit Little Petra nearby",
      "Learn about Nabataean history in the Petra Museum",
      "Take in the view from the viewpoint above the Treasury"
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "Kyoto, Japan",
    description:
      "Japan's former capital city and cultural heart, known for its classical Buddhist temples, imperial palaces, Shinto shrines, and traditional wooden houses. Kyoto preserves much of traditional Japan with its refined cuisine, geisha district of Gion, meticulous gardens, and tea ceremony traditions, offering visitors an immersive experience in Japanese aesthetics and culture spanning more than a millennium.",
    location: {
      type: "Point",
      coordinates: [135.7681, 35.0116],
      address: "Kyoto",
      city: "Kyoto",
      country: "Japan",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1545569107-1782f1c5f971",
      caption: "Kinkaku-ji (Golden Pavilion)",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f",
        caption: "Arashiyama Bamboo Grove"
      },
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
        caption: "Spring blossoms in Kyoto"
      },
      {
        url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
        caption: "Traditional tea ceremony"
      },
      {
        url: "https://images.unsplash.com/photo-1600077163342-13b9689b996b",
        caption: "Kiyomizu-dera Temple"
      },
      {
        url: "https://images.unsplash.com/photo-1553292770-c3d98516d119",
        caption: "Traditional Kyoto street"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Kyoto is like stepping back in time to traditional Japan. The temples and shrines are incredible, especially Fushimi Inari with its thousands of torii gates. Early morning is the best time to visit popular sites before the crowds arrive.",
        createdAt: new Date("2025-04-05")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "A beautiful city that balances modern and traditional Japan perfectly. The fall colors were spectacular at temples like Tofuku-ji. Don't miss a traditional kaiseki dinner for an authentic culinary experience.",
        createdAt: new Date("2025-03-10")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Magical city, especially during cherry blossom season. The Philosopher's Path and Arashiyama bamboo grove were highlights. Renting a bicycle is a great way to explore the city and avoid crowded public transport.",
        createdAt: new Date("2025-02-20")
      }
    ],
    tags: ["cultural", "temples", "historic", "traditional", "gardens", "spirituality", "cuisine"],
    thingsToDo: [
      "Visit Fushimi Inari Shrine and walk through the torii gates",
      "See Kinkaku-ji (Golden Pavilion) and Ginkaku-ji (Silver Pavilion)",
      "Experience the Arashiyama Bamboo Grove",
      "Explore Kiyomizu-dera Temple and the surrounding Higashiyama district",
      "Wander through Gion in hopes of spotting a geisha",
      "Visit Nijo Castle and its nightingale floors",
      "Participate in a traditional tea ceremony",
      "Take a day trip to nearby Nara to see the deer and great Buddha",
      "Shop for traditional crafts on Shijo Street"
    ],
    bestTimeToVisit: {
      from: "March",
      to: "May",
    },
  },
  {
    name: "Serengeti National Park, Tanzania",
    description:
      "A vast ecosystem in East Africa famous for its annual migration of over 1.5 million wildebeest and hundreds of thousands of zebras. The Serengeti's endless plains provide the setting for one of nature's most impressive wildlife spectacles, with abundant predators including lions, leopards, and cheetahs. This UNESCO World Heritage Site offers visitors unparalleled safari experiences across diverse landscapes from riverine forests to acacia woodlands and sweeping grasslands.",
    location: {
      type: "Point",
      coordinates: [34.8333, -2.3333],
      address: "Serengeti National Park",
      city: "Arusha",
      country: "Tanzania",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1607355739828-0bf365440db5",
      caption: "Lion on the Serengeti plains",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1612296727710-d6b0b6f1f1a7",
        caption: "Great Migration of wildebeest"
      },
      {
        url: "https://images.unsplash.com/photo-1612296727710-d6b0b6f1f1a7",
        caption: "Elephants at sunset"
      },
      {
        url: "https://images.unsplash.com/photo-1612296727710-d6b0b6f1f1a7",
        caption: "Cheetah on the hunt"
      },
      {
        url: "https://images.unsplash.com/photo-1612296727710-d6b0b6f1f1a7",
        caption: "Baobab tree at sunset"
      },
      {
        url: "https://images.unsplash.com/photo-1612296727710-d6b0b6f1f1a7",
        caption: "Hot air balloon safari"
      }
    ],
    rating: 4.9,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "The most incredible wildlife experience of my life. Seeing the great migration was breathtaking - thousands of animals moving together across the plains.",
        createdAt: new Date("2025-03-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Unforgettable safari experience. Our guide was incredibly knowledgeable and we saw all the Big Five within two days. The landscapes are stunningly beautiful.",
        createdAt: new Date("2025-02-12")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "A must-visit for any wildlife enthusiast. The sheer number of animals is astounding. The hot air balloon ride at sunrise was worth every penny.",
        createdAt: new Date("2025-01-20")
      }
    ],
    tags: ["wildlife", "safari", "nature", "migration", "africa", "photography", "big five"],
    thingsToDo: [
      "Experience the Great Migration (timing varies by season)",
      "Game drives to see the Big Five (lion, leopard, rhino, elephant, buffalo)",
      "Hot air balloon safari at sunrise",
      "Visit a Maasai village to learn about local culture",
      "Bird watching - over 500 species recorded",
      "Photography safari with expert guides",
      "Stay in luxury tented camps under the stars",
      "Visit the Seronera River Valley for excellent wildlife viewing",
      "Explore the Moru Kopjes with ancient rock paintings"
    ],
    bestTimeToVisit: {
      from: "June",
      to: "October",
    },
  },
  {
    name: "Venice, Italy",
    description:
      "A unique city built on a lagoon, famous for its intricate canal system, Gothic architecture, and romantic ambiance. Venice's car-free historic center is a maze of narrow streets, ornate bridges, and hidden piazzas, where magnificent structures like St. Mark's Basilica and the Doge's Palace showcase the city's former glory as a maritime republic. From glassblowing on Murano to gondola rides along the Grand Canal, Venice offers visitors an enchanting journey through art, history, and Italian culture.",
    location: {
      type: "Point",
      coordinates: [12.3155, 45.4408],
      address: "Venice",
      city: "Venice",
      country: "Italy",
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f",
      caption: "Grand Canal with gondolas",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1605185189315-82ffe395be4f",
        caption: "St. Mark's Square"
      },
      {
        url: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216",
        caption: "Rialto Bridge"
      },
      {
        url: "https://images.unsplash.com/photo-1523906921802-b5d2d899e93b",
        caption: "Colorful houses of Burano"
      },
      {
        url: "https://images.unsplash.com/photo-1514890536905-0fb85a2ec412",
        caption: "Gondola ride through small canals"
      },
      {
        url: "https://images.unsplash.com/photo-1518730518541-d0843268c287",
        caption: "St. Mark's Basilica interior"
      },
      {
        url: "https://images.unsplash.com/photo-1518557985416-234d0a61cb92",
        caption: "Venetian masks"
      },
      {
        url: "https://images.unsplash.com/photo-1525874684015-58379d421a52",
        caption: "Venice at dusk"
      },
      {
        url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
        caption: "Murano glass art"
      }
    ],
    rating: 4.7,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Venice is simply magical - there's nowhere else like it. Getting lost in the maze of small streets and canals is part of the experience. Take a water taxi from the airport for the most spectacular arrival!",
        createdAt: new Date("2025-03-28")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "A truly unique city. Visit the popular spots early morning or evening to avoid crowds. Don't miss the islands of Burano for colorful houses and Murano for glass factories. A gondola ride is expensive but worth doing once.",
        createdAt: new Date("2025-02-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4,
        content: "Beautiful but can be very crowded and expensive. The Doge's Palace and Scuola Grande di San Rocco have incredible art. Try cicchetti (Venetian tapas) and explore the less touristy Cannaregio and Dorsoduro neighborhoods.",
        createdAt: new Date("2025-01-20")
      }
    ],
    tags: ["romantic", "canals", "architecture", "history", "art", "gondolas", "islands"],
    thingsToDo: [
      "Take a gondola ride through the canals",
      "Visit St. Mark's Basilica and Square",
      "Tour the Doge's Palace and Bridge of Sighs",
      "Cross the Rialto Bridge and explore the market",
      "Take a vaporetto down the Grand Canal",
      "Visit the colorful islands of Burano and Murano",
      "See masterpieces at the Gallerie dell'Accademia",
      "Experience the Venetian Carnival (seasonal)",
      "Enjoy aperitivo with locals in a bacaro (wine bar)"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "May",
    },
  }
];

const seedDestinations = async () => {
  try {
    await connectDB();

    // Delete existing destinations
    await Destination.deleteMany({});

    // Add destinations
    await Destination.insertMany(destinations);

    console.log("Destinations seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding destinations:", error);
    process.exit(1);
  }
};

seedDestinations();
