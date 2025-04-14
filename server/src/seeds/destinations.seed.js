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
      url: "https://as2.ftcdn.net/v2/jpg/02/06/81/61/1000_F_206816115_Ze6kdKXpjJYgvfq6YxI1Pu36KZoqbHM1.jpg",
      caption: "Eiffel Tower with Paris cityscape",
    },
    images: [
      {
        url: "https://www.cuddlynest.com/blog/wp-content/uploads/2024/03/arc-de-triomphe-history.jpg",
        caption: "Arc de Triomphe"
      },
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
      url: "https://media.istockphoto.com/id/1131743616/photo/aerial-view-of-tokyo-cityscape-with-fuji-mountain-in-japan.jpg?s=612x612&w=0&k=20&c=0QcSwnyzP__YpBewnQ6_-OZkn0XDtq-mXyvLSSakjZE=",
      caption: "Tokyo Skyline",
    },
    images: [
      {
        url: "https://cdn.cheapoguides.com/wp-content/uploads/sites/2/2020/05/sensoji-temple-iStock-1083328636-1024x600.jpg",
        caption: "Sensoji Temple"
      },
      {
        url: "https://www.gotokyo.org/en/story/guide/hanami-guide/images/sg009_1376_202.jpg",
        caption: "Cherry Blossoms in Tokyo"
      },
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
      url: "https://www.thireasuites.com/blog/user/pages/01.home/05.santorini-blue-domes/santorini-blue-domes01b.jpg",
      caption: "Blue domes of Oia",
    },
    images: [
      {
        url: "https://media.istockphoto.com/id/541132240/photo/oia-at-sunset.jpg?s=612x612&w=0&k=20&c=kql4X3tMkOmYsa4PX45WK7-vHzpOk__IeAaHiz4VfyA=",
        caption: "Sunset in Santorini"
      },
      {
        url: "https://www.ankor.gr/wp-content/uploads/2019/06/santorini-red-beach-1.jpg",
        caption: "Red Beach"
      },
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
      url: "https://cdn.britannica.com/15/194815-050-08B5E7D1/Nativity-facade-Sagrada-Familia-cathedral-Barcelona-Spain.jpg",
      caption: "Sagrada Familia",
    },
    images: [
      {
        url: "https://thingstodoinbarcelona.com/wp-content/uploads/f-la-rambla-panoramic.jpg",
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
      url: "https://gaijinpot.scdn3.secure.raxcdn.com/app/uploads/sites/6/2016/05/Philosophers-Path.jpg",
      caption: "Cherry Blossoms in Kyoto",
    },
    images: [
      {
        url: "https://dskyoto.s3.amazonaws.com/gallery/full/8514/5559/7797/08-20131216_FushimiInari_Mainspot-307.jpg",
        caption: "Fushimi Inari Shrine"
      },
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
      url: "https://media.tacdn.com/media/attractions-splice-spp-674x446/15/59/36/95.jpg",
      caption: "New York Skyline"
    },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg/800px-Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg",
        caption: "Central Park"
      },
      {
        url: "https://www.exp1.com/wp-content/uploads/sites/7/2020/06/Times-Square-1-1.jpg",
        caption: "Times Square"
      },
      {
        url: "https://cdn.britannica.com/82/183382-050-D832EC3A/Detail-head-crown-Statue-of-Liberty-New.jpg",
        caption: "Statue of Liberty"
      },
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
      url: "https://upload.wikimedia.org/wikipedia/commons/7/79/Djemaa_el_Fna.jpg",
      caption: "Jemaa el-Fnaa Market"
    },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Bahia_Palace_large_court.jpg",
        caption: "Bahia Palace"
      },
      {
        url: "https://www.story-rabat.com/wp-content/uploads/2024/04/Moroccan-spices.webp",
        caption: "Moroccan Spices"
      },
      {
        url: "https://media-cdn.tripadvisor.com/media/photo-s/12/70/66/5a/view-of-the-atlas-mountains.jpg",
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
      url: "https://miro.medium.com/v2/resize:fit:1400/1*83jfdXDadli-xA3Ppv1qyg.jpeg",
      caption: "Sydney Opera House and Harbour"
    },
    images: [
      {
        url: "https://www.washingtonwine.org/wp-content/uploads/2021/05/The-Rocks-District_1-scaled.jpg",
        caption: "The Rocks District"
      },
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
      url: "https://cdn.britannica.com/54/150754-050-5B93A950/statue-Christ-the-Redeemer-Rio-de-Janeiro.jpg",
      caption: "Christ the Redeemer and Rio Skyline",
    },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Praia_de_Copacabana_-_Rio_de_Janeiro%2C_Brasil.jpg/800px-Praia_de_Copacabana_-_Rio_de_Janeiro%2C_Brasil.jpg",
        caption: "Copacabana Beach"
      },
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
      url: "https://images.squarespace-cdn.com/content/v1/5cd57d59ca525b7e9eae595c/1559933314094-9G3N0X3SE3ZYXNANDPIF/_MG_2882.jpg",
      caption: "Prague Castle and Charles Bridge",
    },
    images: [
      {
        url: "https://cdn.praguecitytourism.city/2024/03/13101933/01-stm-radnice-0288ret-m.jpg",
        caption: "Old Town Square"
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
      url: "https://static.wixstatic.com/media/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg/v1/fill/w_640,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/2cc94a_f41bf7cbf0d34a2faaf7f0e27aabb3b3~mv2.jpg",
      caption: "Grand Palace",
    },
    images: [
      {
        url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhu4YkkapGaVVFdaRXfZypzqcekONZ2bNNd4orvZDpq3xY9q5Vo6SAbKbZfYTjcJ8AI-ZqrSRcj_Yi2LoxPmHmCm3DS8N8K6Z9Qn6tRs1xzkjSf7FVAUoHhRKBdnQGAt_cUVOj32a2lSxp6xmyUvwcRA-DM2mzZDrcn7SDHwuNRds7ejMSg4TmFjVJKig/s1600/Wat%20Arun-14.jpg",
        caption: "Wat Arun Temple"
      },
      {
        url: "https://www.pelago.com/img/products/TH-Thailand/thaka-thailand-s-most-authentic-floating-market/f0467b85-d8cc-422c-8d95-804d12735568_thaka-thailand-s-most-authentic-floating-market.jpg",
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
      url: "https://www.worldhistory.org/img/c/p/1200x900/950.jpg",
      caption: "Colosseum",
    },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg/1200px-Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg",
        caption: "Vatican and St. Peter's Basilica"
      },
      {
        url: "https://cdn.britannica.com/77/187677-138-73F32D16/buildings-Rome-Roman-Forum.jpg?w=800&h=450&c=crop",
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
      url: "https://upload.wikimedia.org/wikipedia/commons/8/86/The_Remarkables_%281126885451%29.jpg",
      caption: "Queenstown with The Remarkables mountain range",
    },
    images: [
      {
        url: "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_929,q_75,w_1400/v1/clients/queenstownnz/Queenstown_Aerial_Winter_Views_2008_18_1__b5d88790-e1fa-49aa-9c93-b5eb83d6001c.jpg",
        caption: "Mountain views near Queenstown"
      },
      {
        url: "https://media.tacdn.com/media/attractions-splice-spp-674x446/12/63/c8/93.jpg",
        caption: "Milford Sound day trip"
      },
      {
        url: "https://redballoon.com.au/dw/image/v2/BCRD_PRD/on/demandware.static/-/Sites-rb-nz-catalog/default/images/products/AJH806-M/movycd4sksdzvh9vd6el.jpg?sw=540&sh=302&q=70",
        caption: "Bungy jumping in Queenstown"
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
      url: "https://hagiasophiaturkey.com/wp-content/uploads/2023/04/Blue-Mosque-and-Hagia-Sophia-Small-Group-Tour-7-1024x683.jpg",
      caption: "Blue Mosque and Hagia Sophia",
    },
    images: [
      {
        url: "https://cdn-gaecj.nitrocdn.com/JMwuRIbFKRytZpZBQQGkRvqmTfGyKhHA/assets/images/optimized/rev-2ccb7ab/turkeytravelplanner.com/wp-content/uploads/2022/06/Shopping-in-Turkey-What-to-Buy-scaled.jpg",
        caption: "Inside the Grand Bazaar"
      },
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
      url: "https://www.myluxoria.com/storage/app/uploads/public/5d4/342/cb7/5d4342cb779ec155545882.jpg",
      caption: "Dubrovnik Old Town and Adriatic Sea",
    },
    images: [
      {
        url: "https://twoupriders.com/wp-content/uploads/2016/05/Dubrovnik-Croatia_0121.jpg",
        caption: "View from the City Walls"
      },
      {
        url: "https://mindfulmermaid.com/wp-content/uploads/2018/06/Banje-Beach-Dubrovnik-Croatia-1024x691.jpg",
        caption: "Dubrovnik beaches"
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
      url: "https://www.daveshowalter.com/images/large/machu-classic.jpg",
      caption: "Classic Machu Picchu View",
    },
    images: [
      {
        url: "https://www.boletomachupicchu.com/gutblt/wp-content/uploads/2022/12/terrazas-andenes-agricolas-machu-picchu.jpg",
        caption: "Terraces of Machu Picchu"
      },
      {
        url: "https://www.arroway-textures.ch/wp-content/uploads/2024/12/stonework-1v2_update.jpg",
        caption: "Detailed stonework"
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
      url: "https://www.visitdubai.com/-/media/images/leisure/campaigns/accessible-dubai/pod-itinerary/pod-itinerary-1-day-burj-khalifa.jpg?rev=d6e57669e03c456e896a22d6d2340d59&cx=0.5&cy=0.5",
      caption: "Dubai Skyline with Burj Khalifa",
    },
    images: [
      {
        url: "https://www.dayoutdubai.ae/blog/wp-content/uploads/2019/12/1-1.jpg",
        caption: "Dubai Mall and Fountains"
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
      url: "https://farandawayadventures.com/wp-content/uploads/2024/03/e029cc68thumbnail.jpeg",
      caption: "Overwater bungalows in Bora Bora",
    },
    images: [
      {
        url: "https://www.tropicalsnorkeling.com/wp-content/uploads/2022/04/coral-triangle-snorkeling-reef-fish.jpg",
        caption: "Snorkeling in coral reefs"
      },
      {
        url: "https://www.dreamdestinations.in/wp-content/uploads/2024/06/inner-banner-img01.jpg",
        caption: "Sunset views over Mount Otemanu"
      },
      {
        url: "https://www.travelandleisure.com/thmb/3tWYJuG9aRBu-ByiH5eNaqkEjG0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/navagio-shipwreck-beach-zakynthos-greece-WHITESAND1017-79e2467bf28e4553abf09dc9e312d7d9.jpg",
        caption: "Pristine white sand beaches"
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
      url: "https://madainproject.com/content/media/collect/khazneh_82378.jpg",
      caption: "The Treasury (Al-Khazneh)",
    },
    images: [
      {
        url: "https://www.insightvacations.com/wp-content/uploads/2025/02/Large-Petra-1021850730-1.jpg",
        caption: "Rose-colored cliffs of Petra"
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
      url: "https://gaijinpot.scdn3.secure.raxcdn.com/app/uploads/sites/6/2016/05/kinkakuji-kyoto-golden-pavilion-1024x576.jpg",
      caption: "Kinkaku-ji (Golden Pavilion)",
    },
    images: [
      {
        url: "https://photos.smugmug.com/i-hFcX6RC/0/1c58ee68/L/famous-bamboo-grove-arashiyama-L.jpg",
        caption: "Arashiyama Bamboo Grove"
      },
      {
        url: "https://kyoto.travel/en/nt8q320000004ac3-img/33.jpg",
        caption: "Spring blossoms in Kyoto"
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
      url: "https://www.lakemanyaranationalparks.com/wp-content/uploads/2022/03/32118265865_a2e4b2fc21_b.jpg",
      caption: "Lion on the Serengeti plains",
    },
    images: [
      {
        url: "https://www.serengeti.com/assets/img/wildlife-spectacle-great-migration-tanzania.jpg",
        caption: "Great Migration of wildebeest"
      },
      {
        url: "https://media.istockphoto.com/id/2148595463/photo/african-elephant-in-wilderness-at-sunset.jpg?s=612x612&w=0&k=20&c=WmZfQYFpQOKTIyB95U6NQ6h8WQM-Pjp9TCMvF63-Xf4=",
        caption: "Elephants at sunset"
      },
      {
        url: "https://cheetah.org/canada/wp-content/uploads/sites/5/2021/01/RunningCheetah_1000-563.jpg",
        caption: "Cheetah on the hunt"
      },
      {
        url: "https://yellowzebrasafaris.com/media/15462/kmb-271.jpg?rxy=0.5066666666666667%2C0.3165680473372781&width=2048&height=1024&format=jpg&v=1dab8c4183af9f0",
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
      url: "https://cdn.getyourguide.com/img/tour/645a63ac81921.jpeg/146.jpg",
      caption: "Grand Canal with gondolas",
    },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Piazza_San_Marco_%28Venice%29_at_night-msu-2021-6449-.jpg/800px-Piazza_San_Marco_%28Venice%29_at_night-msu-2021-6449-.jpg",
        caption: "St. Mark's Square"
      },
      {
        url: "https://csengineermag.com/wp-content/uploads/2022/11/AdobeStock_232079420.jpeg",
        caption: "Rialto Bridge"
      },
      {
        url: "https://www.homeinitaly.com/_data/magazine/articles/2020-12-burano-the-most-colorful-island-of-italy/burano-the-most-colorful-island-of-italy-5.jpeg",
        caption: "Colorful houses of Burano"
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
  },
  {
    name: "Amsterdam, Netherlands",
    description:
      "A charming city of canals, historic architecture, and world-class museums, known for its artistic heritage, elaborate canal system, and narrow houses with gabled facades. Amsterdam's bicycle-friendly streets, vibrant cultural scene, and progressive atmosphere make it a unique European destination where history meets modern living.",
    location: {
      type: "Point",
      coordinates: [4.8952, 52.3702],
      address: "Amsterdam",
      city: "Amsterdam",
      country: "Netherlands",
    },
    coverImage: {
      url: "https://i.pinimg.com/736x/f3/8e/65/f38e655034f2f3ba707b0596d2d2cc8e.jpg",
      caption: "Amsterdam canals at sunset",
    },
    images: [
      {
        url: "https://wallpapers.com/images/hd/amsterdam-canal-houses-reflection-w0771pr973vlx2qu.jpg",
        caption: "Canal houses reflection"
      },
      {
        url: "https://media.istockphoto.com/id/621815458/photo/the-rijksmuseum-and-i-amsterdam-sign-long-exposure.jpg?s=612x612&w=0&k=20&c=YywFawjEQILtpgyzr_UHhZePjNloG-ycZL3N56zIFto=",
        caption: "Rijksmuseum and I Amsterdam sign"
      },
      {
        url: "https://www.annefrank.org/media/filer_public_thumbnails/filer_public/55/fa/55fa0123-0597-4803-bf21-a7a45ff00ea7/draaikast_ctoala20180613_185.jpg__2160x926_q85_crop_subject_location-2828%2C1814_subsampling-2_upscale.jpg",
        caption: "Anne Frank House"
      },
      {
        url: "https://www.amsterdamobile.com/images/easyblog_articles/205/20220524_134734.jpg",
        caption: "Bloemenmarkt flower market"
      }
    ],
    rating: 4.6,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Amsterdam is a beautiful city with so much character. The canals are stunning, especially at night when they're lit up. Renting a bike is the best way to explore like a local!",
        createdAt: new Date("2025-03-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "The museums are world-class, especially the Van Gogh Museum and Rijksmuseum. The city is very walkable and the public transport is excellent. Don't miss the Jordaan neighborhood for authentic Dutch charm.",
        createdAt: new Date("2025-02-20")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Amazing city with a great mix of history and modern culture. The canal cruise is a must-do, and the food scene is surprisingly diverse. Visit in spring for the tulips and better weather.",
        createdAt: new Date("2025-01-10")
      }
    ],
    tags: ["canals", "museums", "bicycles", "art", "history", "architecture", "culture"],
    thingsToDo: [
      "Take a canal cruise",
      "Visit the Van Gogh Museum",
      "Explore the Rijksmuseum",
      "Tour the Anne Frank House",
      "Rent a bicycle and explore",
      "Visit the Bloemenmarkt",
      "Explore the Jordaan neighborhood",
      "See the Royal Palace on Dam Square",
      "Visit the Albert Cuyp Market"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "September",
    },
  },
  {
    name: "Maldives",
    description:
      "A tropical paradise in the Indian Ocean, known for its crystal-clear waters, white sandy beaches, and luxurious overwater bungalows. The Maldives is a collection of 26 atolls featuring stunning coral reefs, abundant marine life, and some of the world's most exclusive resorts, making it the ultimate destination for relaxation, romance, and underwater adventures.",
    location: {
      type: "Point",
      coordinates: [73.2207, 3.2028],
      address: "Maldives",
      city: "Malé",
      country: "Maldives",
    },
    coverImage: {
      url: "https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F3ed37434-ce45-478d-bd3e-34ce46e134e6.jpg?crop=1800%2C1199%2C0%2C0",
      caption: "Overwater bungalows in Maldives",
    },
    images: [
      {
        url: "https://preview.redd.it/hvmnaxj0nmo91.jpg?width=750&format=pjpg&auto=webp&s=1a4644ff786f041ca8e4beef232831b9c59e6fc0",
        caption: "Crystal clear waters"
      },
      {
        url: "https://media.istockphoto.com/id/1170804921/photo/turtle-closeup-with-school-of-fish.jpg?s=612x612&w=0&k=20&c=0l3Sw_Lx-9PVHjR963pvt9A6-p7sxwMe-xm9LnwxAgw=",
        caption: "Underwater marine life"
      },
      {
        url: "https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?cs=srgb&dl=pexels-bella-white-201200-635279.jpg&fm=jpg",
        caption: "Sunset over the ocean"
      },
      {
        url: "https://amusementlogic.es/wp-content/uploads/2022/05/NEWSLETTER-2022-05-LUXURY-SPA-JULIA-ROSADO-1920x1080-1.jpeg",
        caption: "Luxury resort spa"
      }
    ],
    rating: 4.9,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "The Maldives is paradise on earth! The water is so clear you can see the fish from your overwater bungalow. The snorkeling is incredible, and the service at the resorts is impeccable.",
        createdAt: new Date("2025-04-01")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 5,
        content: "Perfect for a honeymoon or romantic getaway. The beaches are pristine, and the marine life is amazing. The sunset views from our overwater villa were unforgettable.",
        createdAt: new Date("2025-03-10")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Absolutely stunning destination, but be prepared for the high prices. The underwater restaurant experience was worth every penny though. The coral reefs are some of the best I've seen.",
        createdAt: new Date("2025-02-15")
      }
    ],
    tags: ["luxury", "beaches", "snorkeling", "romantic", "islands", "resorts", "honeymoon"],
    thingsToDo: [
      "Stay in an overwater bungalow",
      "Go snorkeling or diving in coral reefs",
      "Enjoy a private beach dinner",
      "Visit an underwater restaurant",
      "Take a sunset cruise",
      "Try water sports like paddleboarding",
      "Relax at a luxury spa",
      "Take a seaplane tour of the atolls",
      "Visit a local island to experience Maldivian culture"
    ],
    bestTimeToVisit: {
      from: "November",
      to: "April",
    },
  },
  {
    name: "Vancouver, Canada",
    description:
      "A vibrant coastal city surrounded by mountains and ocean, known for its stunning natural beauty, diverse culture, and outdoor lifestyle. Vancouver combines urban sophistication with easy access to nature, offering visitors world-class dining, cultural attractions, and outdoor adventures from skiing to whale watching, all within a spectacular setting.",
    location: {
      type: "Point",
      coordinates: [-123.1207, 49.2827],
      address: "Vancouver",
      city: "Vancouver",
      country: "Canada",
    },
    coverImage: {
      url: "https://media.istockphoto.com/id/504657339/photo/vancouver-skyline.jpg?s=612x612&w=0&k=20&c=Ey_m9A9K0jOGzJK0TxPFOLGI6wfo340QMAwMHPyESyY=",
      caption: "Vancouver skyline with mountains",
    },
    images: [
      {
        url: "https://www.andrewswalks.co.uk/wp-content/uploads/Siwash-Rock-Vancouver-Seawall.jpg",
        caption: "Stanley Park seawall"
      },
      {
        url: "https://media.tacdn.com/media/attractions-splice-spp-674x446/14/1a/ca/68.jpg",
        caption: "Capilano Suspension Bridge"
      },
      {
        url: "https://granvilleisland.com/wp-content/uploads/2022/03/img_0639-scaled.jpg",
        caption: "Granville Island market"
      }
    ],
    rating: 4.7,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Vancouver is an amazing city with the perfect mix of urban and natural attractions. Stanley Park is beautiful, and the food scene is incredible, especially the Asian cuisine.",
        createdAt: new Date("2025-03-20")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Great city for outdoor enthusiasts. We loved biking around Stanley Park and hiking in the nearby mountains. The public transportation is excellent, making it easy to explore.",
        createdAt: new Date("2025-02-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Beautiful city with stunning views of mountains and ocean. Granville Island is a must-visit for food lovers. The weather can be rainy, but that's part of the Pacific Northwest charm.",
        createdAt: new Date("2025-01-10")
      }
    ],
    tags: ["mountains", "ocean", "outdoor", "food", "culture", "urban", "nature"],
    thingsToDo: [
      "Explore Stanley Park",
      "Visit Granville Island",
      "Walk across Capilano Suspension Bridge",
      "Take a whale watching tour",
      "Visit the Vancouver Aquarium",
      "Explore Gastown",
      "Ski or snowboard at nearby mountains",
      "Visit the Museum of Anthropology",
      "Take a day trip to Whistler"
    ],
    bestTimeToVisit: {
      from: "June",
      to: "September",
    },
  },
  {
    name: "Seoul, South Korea",
    description:
      "A dynamic metropolis where ancient palaces and temples stand alongside cutting-edge technology and K-pop culture. Seoul offers a fascinating blend of traditional Korean heritage and modern innovation, with its vibrant street markets, world-class shopping, delicious cuisine, and rich history creating an unforgettable urban experience.",
    location: {
      type: "Point",
      coordinates: [126.9780, 37.5665],
      address: "Seoul",
      city: "Seoul",
      country: "South Korea",
    },
    coverImage: {
      url: "https://media.istockphoto.com/id/479194337/photo/seoul-skyline.jpg?s=612x612&w=0&k=20&c=2915AXGJqsfwIZ1FDzmx5T_bi76IG8esptFG5vTVnIc=",
      caption: "Seoul skyline with N Seoul Tower",
    },
    images: [
      {
        url: "https://s39023.pcdn.co/wp-content/uploads/2023/08/Gyeongbokgung-Palace-in-Seoul.jpg.optimal.jpg",
        caption: "Gyeongbokgung Palace"
      },
      {
        url: "https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/39/b3/15.jpg",
        caption: "Myeongdong shopping district"
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bukchon_Hanok_Village_01.jpg/1200px-Bukchon_Hanok_Village_01.jpg",
        caption: "Bukchon Hanok Village"
      },
      {
        url: "https://www.agoda.com/wp-content/uploads/2019/03/N-Seoul-Tower-Namsan-Cable-Car.jpg",
        caption: "Namsan Seoul Tower"
      }
    ],
    rating: 4.6,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Seoul is an amazing city with so much to offer! The food is incredible, especially the street food in Myeongdong. The palaces are beautiful, and the shopping is world-class.",
        createdAt: new Date("2025-03-25")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Great mix of traditional and modern culture. The subway system is excellent and easy to use. Don't miss the traditional hanbok experience at Gyeongbokgung Palace.",
        createdAt: new Date("2025-02-18")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Fascinating city with amazing food and shopping. The nightlife in Hongdae is incredible. Visit during cherry blossom season for an extra special experience.",
        createdAt: new Date("2025-01-15")
      }
    ],
    tags: ["culture", "food", "shopping", "history", "technology", "nightlife", "kpop"],
    thingsToDo: [
      "Visit Gyeongbokgung Palace",
      "Explore Bukchon Hanok Village",
      "Shop in Myeongdong",
      "Visit N Seoul Tower",
      "Try Korean BBQ and street food",
      "Explore Insadong for traditional crafts",
      "Visit the DMZ",
      "Experience a traditional tea ceremony",
      "Explore Hongdae nightlife"
    ],
    bestTimeToVisit: {
      from: "April",
      to: "June",
    },
  },
  {
    name: "Santorini, Greece",
    description:
      "A stunning island in the Aegean Sea, famous for its white-washed buildings, blue-domed churches, and breathtaking sunsets. Santorini's dramatic cliffs, volcanic beaches, and charming villages offer visitors a perfect blend of natural beauty, Greek culture, and luxury accommodations, making it one of the most romantic and picturesque destinations in the world.",
    location: {
      type: "Point",
      coordinates: [25.4615, 36.3932],
      address: "Santorini",
      city: "Thira",
      country: "Greece",
    },
    coverImage: {
      url: "https://santorinibesttours.com/sites/default/files/top-attractions/oia/oia-village-castle.jpg",
      caption: "Oia village at sunset",
    },
    images: [
      {
        url: "https://www.antoperla.com/blog/user/pages/01.home/13.santorini-blue-domes-churches/Santorini-Blue-Domes.jpg",
        caption: "Blue domed churches"
      },
      {
        url: "https://mybestplace.com/uploads/2020/07/Red-Sand-Beach-Galapagos-2.jpg",
        caption: "Red Beach"
      },
      {
        url: "https://www.greektravel.com/greekislands/santorini/hotel-volcano-view.jpg",
        caption: "Caldera views"
      }
    ],
    rating: 4.8,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Santorini is absolutely magical! The sunsets in Oia are breathtaking, and the views of the caldera are unforgettable. The food and wine are amazing too.",
        createdAt: new Date("2025-04-05")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Beautiful island with stunning views everywhere you look. The beaches are unique with their volcanic sand. Try to visit in shoulder season to avoid the crowds.",
        createdAt: new Date("2025-03-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 5,
        content: "Perfect for a romantic getaway. The luxury hotels with caldera views are worth the splurge. Don't miss the wine tasting - Santorini wines are unique and delicious.",
        createdAt: new Date("2025-02-20")
      }
    ],
    tags: ["romantic", "beaches", "sunset", "architecture", "wine", "islands", "luxury"],
    thingsToDo: [
      "Watch the sunset in Oia",
      "Visit the Red Beach",
      "Take a boat tour of the caldera",
      "Explore ancient Akrotiri",
      "Visit a winery",
      "Swim in the hot springs",
      "Explore Fira town",
      "Visit the black sand beaches",
      "Take a cooking class"
    ],
    bestTimeToVisit: {
      from: "May",
      to: "September",
    },
  },
  {
    name: "Reykjavik, Iceland",
    description:
      "The world's northernmost capital city, known for its stunning natural wonders, geothermal pools, and vibrant cultural scene. Reykjavik serves as the perfect base for exploring Iceland's dramatic landscapes, from the famous Blue Lagoon to the Northern Lights, while offering visitors a unique blend of Nordic charm and modern amenities.",
    location: {
      type: "Point",
      coordinates: [-21.9426, 64.1466],
      address: "Reykjavik",
      city: "Reykjavik",
      country: "Iceland",
    },
    coverImage: {
      url: "https://live.staticflickr.com/8370/8487341482_af40e471ca_b.jpg",
      caption: "Reykjavik cityscape with Hallgrímskirkja",
    },
    images: [
      {
        url: "https://allthingsiceland.com/wp-content/uploads/2024/02/hallgrimskirkja-church-t-night.jpg",
        caption: "Hallgrímskirkja church"
      },
      {
        url: "https://images.prismic.io/perlan/046cecbc-1bb8-4065-b249-73bbc226fa1e_13439-157-2613.png?auto=compress,format",
        caption: "Northern Lights over Reykjavik"
      },
      {
        url: "https://images.ctfassets.net/a68ipajj4t9l/67aqJovtK54hUZppdObklq/93ec87cffb8eb3c02149643c9afca977/blue_lagoon_header-2.jpg?w=1200&q=60",
        caption: "Blue Lagoon"
      }
    ],
    rating: 4.7,
    reviews: [
      {
        author: "65f7d5e7f2bc5d5c6a4b3f91",
        rating: 5,
        content: "Reykjavik is an amazing city with so much character! The Northern Lights were breathtaking, and the Blue Lagoon was the perfect way to relax. The food scene is surprisingly diverse and delicious.",
        createdAt: new Date("2025-03-15")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f92",
        rating: 4.5,
        content: "Great base for exploring Iceland's natural wonders. The city itself is charming with its colorful houses and friendly locals. Don't miss the hot dogs at Bæjarins Beztu Pylsur!",
        createdAt: new Date("2025-02-20")
      },
      {
        author: "65f7d5e7f2bc5d5c6a4b3f93",
        rating: 4.5,
        content: "Fascinating city with a great mix of culture and nature. The geothermal pools are amazing, and the nightlife is surprisingly vibrant. Visit in winter for the Northern Lights or summer for the midnight sun.",
        createdAt: new Date("2025-01-10")
      }
    ],
    tags: ["northern lights", "geothermal", "nature", "culture", "adventure", "winter", "summer"],
    thingsToDo: [
      "Visit the Blue Lagoon",
      "See the Northern Lights",
      "Explore Hallgrímskirkja church",
      "Visit Harpa Concert Hall",
      "Take a Golden Circle tour",
      "Try Icelandic hot dogs",
      "Visit the National Museum",
      "Explore the Old Harbor",
      "Take a whale watching tour"
    ],
    bestTimeToVisit: {
      from: "September",
      to: "March",
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
