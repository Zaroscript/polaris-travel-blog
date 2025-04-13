import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import mongoose from "mongoose";

config();

// Helper function to create ObjectIDs for references
const createUserIds = (count) => {
  return Array(count).fill().map(() => new mongoose.Types.ObjectId());
};

// Create IDs for all users so we can reference them in followers/following
const userIds = createUserIds(12);

const seedUsers = [
  {
    _id: userIds[0],
    email: "sophia.rivera@example.com",
    fullName: "Sophia Rivera",
    username: "sophiawanderlust",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    coverImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
    bio: "Travel photographer and writer based in Barcelona. Capturing the world's beauty one frame at a time. ✈️ 📸",
    location: "Barcelona, Spain",
    website: "www.sophiarivera.com",
    isVerified: true,
    joinedAt: new Date("2025-01-15"),
    occupation: "Travel Photographer",
    followers: [userIds[1], userIds[2], userIds[3], userIds[5], userIds[6], userIds[8], userIds[10]],
    following: [userIds[1], userIds[3], userIds[4], userIds[7]],
    savedPosts: [],
    likedPosts: [],
    interests: ["photography", "nature", "architecture", "food", "culture"],
    social: {
      instagram: "sophiawanderlust",
      twitter: "sophiawanderlust",
      facebook: "sophiarivera"
    },
    stats: {
      postsCount: 24,
      totalLikes: 2786,
      totalViews: 87459
    }
  },
  {
    _id: userIds[1],
    email: "ethan.chen@example.com",
    fullName: "Ethan Chen",
    username: "ethantravels",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    coverImage: "https://images.unsplash.com/photo-1494783367193-149034c05e8f",
    bio: "Adventure seeker and digital nomad. Currently exploring Southeast Asia. Living with a backpack and a laptop. 🌏 🧗‍♂️",
    location: "Bali, Indonesia",
    website: "www.ethangoesplaces.com",
    isVerified: true,
    joinedAt: new Date("2025-01-21"),
    occupation: "Digital Nomad",
    followers: [userIds[0], userIds[3], userIds[5], userIds[7], userIds[9]],
    following: [userIds[0], userIds[2], userIds[5], userIds[9], userIds[11]],
    savedPosts: [],
    likedPosts: [],
    interests: ["adventure", "backpacking", "hiking", "street food", "local culture"],
    social: {
      instagram: "ethantravels",
      twitter: "ethantravels",
      youtube: "EthanTravelsChannel"
    },
    stats: {
      postsCount: 18,
      totalLikes: 2153,
      totalViews: 65241
    }
  },
  {
    _id: userIds[2],
    email: "olivia.williams@example.com",
    fullName: "Olivia Williams",
    username: "oliviaexplores",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
    coverImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    bio: "Luxury travel blogger and hotel reviewer. Finding the most exquisite experiences around the globe. ✨ 🏨",
    location: "London, UK",
    website: "www.olivialuxurytravel.com",
    isVerified: true,
    joinedAt: new Date("2025-02-03"),
    occupation: "Luxury Travel Blogger",
    followers: [userIds[1], userIds[4], userIds[6], userIds[8], userIds[10], userIds[11]],
    following: [userIds[0], userIds[6], userIds[8]],
    savedPosts: [],
    likedPosts: [],
    interests: ["luxury", "hotels", "fine dining", "wellness", "fashion"],
    social: {
      instagram: "oliviaexplores",
      pinterest: "olivialuxurytravel",
      tiktok: "oliviaexplores"
    },
    stats: {
      postsCount: 31,
      totalLikes: 3845,
      totalViews: 112678
    }
  },
  {
    _id: userIds[3],
    email: "james.rodriguez@example.com",
    fullName: "James Rodriguez",
    username: "jameseatsworld",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    coverImage: "https://images.unsplash.com/photo-1513530945704-83bfd7effde3",
    bio: "Culinary explorer and food photographer. Tasting my way through continents one dish at a time. 🍜 🥘 🍷",
    location: "Mexico City, Mexico",
    website: "www.jameseatsworld.com",
    isVerified: true,
    joinedAt: new Date("2025-01-28"),
    occupation: "Food & Travel Writer",
    followers: [userIds[0], userIds[1], userIds[6], userIds[7], userIds[9], userIds[11]],
    following: [userIds[0], userIds[1], userIds[5], userIds[7], userIds[8]],
    savedPosts: [],
    likedPosts: [],
    interests: ["food", "cooking", "street food", "local cuisine", "wine tasting"],
    social: {
      instagram: "jameseatsworld",
      youtube: "JamesEatsWorld",
      tiktok: "jameseatsworld"
    },
    stats: {
      postsCount: 26,
      totalLikes: 2967,
      totalViews: 73402
    }
  },
  {
    _id: userIds[4],
    email: "zara.patel@example.com",
    fullName: "Zara Patel",
    username: "zaraadventures",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    coverImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    bio: "Solo female traveler exploring remote destinations. Spreading positive vibes and travel tips. 🧠 🗺️ 🌈",
    location: "Cape Town, South Africa",
    website: "www.zarasoloadventures.com",
    isVerified: false,
    joinedAt: new Date("2025-02-15"),
    occupation: "Travel Guide Author",
    followers: [userIds[0], userIds[2], userIds[5], userIds[8], userIds[10]],
    following: [userIds[2], userIds[9], userIds[10], userIds[11]],
    savedPosts: [],
    likedPosts: [],
    interests: ["solo travel", "women travel", "adventure", "budget travel", "safety"],
    social: {
      instagram: "zaraadventures",
      twitter: "zarasoloadventures",
      facebook: "zaraadventures"
    },
    stats: {
      postsCount: 16,
      totalLikes: 1823,
      totalViews: 42156
    }
  },
  {
    _id: userIds[5],
    email: "noah.thompson@example.com",
    fullName: "Noah Thompson",
    username: "noahoutdoors",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    bio: "Outdoor enthusiast and nature photographer. Always seeking wilderness and epic landscapes. 🏞️ 🏕️ 🥾",
    location: "Denver, Colorado, USA",
    website: "www.noahinthewild.com",
    isVerified: false,
    joinedAt: new Date("2025-01-10"),
    occupation: "Outdoor Photographer",
    followers: [userIds[1], userIds[3], userIds[4], userIds[7]],
    following: [userIds[1], userIds[4], userIds[7], userIds[9]],
    savedPosts: [],
    likedPosts: [],
    interests: ["hiking", "camping", "wildlife", "nature", "conservation"],
    social: {
      instagram: "noahoutdoors",
      youtube: "NoahOutdoors",
      strava: "noahthompson"
    },
    stats: {
      postsCount: 22,
      totalLikes: 1956,
      totalViews: 51273
    }
  },
  {
    _id: userIds[6],
    email: "mia.tanaka@example.com",
    fullName: "Mia Tanaka",
    username: "miatanaka",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    coverImage: "https://images.unsplash.com/photo-1515518554912-63b4da53597d",
    bio: "Cultural explorer and language enthusiast. Learning about traditions around the world. Currently perfecting my Spanish! 🌍 📚 🎭",
    location: "Kyoto, Japan",
    website: "www.miaculturaladventures.com",
    isVerified: false,
    joinedAt: new Date("2025-02-25"),
    occupation: "Cultural Anthropologist",
    followers: [userIds[0], userIds[2], userIds[3], userIds[10]],
    following: [userIds[2], userIds[3], userIds[8], userIds[11]],
    savedPosts: [],
    likedPosts: [],
    interests: ["culture", "languages", "traditions", "festivals", "anthropology"],
    social: {
      instagram: "miatanaka",
      linkedin: "miatanaka",
      medium: "miatanaka"
    },
    stats: {
      postsCount: 14,
      totalLikes: 1634,
      totalViews: 36789
    }
  },
  {
    _id: userIds[7],
    email: "liam.carter@example.com",
    fullName: "Liam Carter",
    username: "liamfliesworld",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    coverImage: "https://images.unsplash.com/photo-1494587351196-bbf5f29cff42",
    bio: "Aviation geek and world traveler. Collecting airline miles and airport stories since 2020. ✈️ 🏨 🗺️",
    location: "Dubai, UAE",
    website: "www.liamfliesworld.com",
    isVerified: false,
    joinedAt: new Date("2025-02-10"),
    occupation: "Travel Hacker",
    followers: [userIds[1], userIds[3], userIds[5], userIds[9]],
    following: [userIds[3], userIds[5], userIds[9], userIds[11]],
    savedPosts: [],
    likedPosts: [],
    interests: ["aviation", "airline miles", "travel hacking", "airports", "business class"],
    social: {
      instagram: "liamfliesworld",
      twitter: "liamfliesworld",
      youtube: "LiamFliesWorld"
    },
    stats: {
      postsCount: 19,
      totalLikes: 1756,
      totalViews: 43269
    }
  },
  {
    _id: userIds[8],
    email: "aisha.khan@example.com",
    fullName: "Aisha Khan",
    username: "aishatrekker",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    bio: "Mountain climber and trekking guide. Conquered 5 of the Seven Summits and counting. Join me on my journey to the top! 🏔️ 🧗‍♀️ 🌄",
    location: "Kathmandu, Nepal",
    website: "www.aishamountains.com",
    isVerified: true,
    joinedAt: new Date("2025-01-05"),
    occupation: "Mountain Guide",
    followers: [userIds[0], userIds[3], userIds[6], userIds[10]],
    following: [userIds[2], userIds[3], userIds[6], userIds[10]],
    savedPosts: [],
    likedPosts: [],
    interests: ["mountaineering", "trekking", "climbing", "high altitude", "adventure"],
    social: {
      instagram: "aishatrekker",
      strava: "aishakhan",
      facebook: "aishamountains"
    },
    stats: {
      postsCount: 27,
      totalLikes: 3125,
      totalViews: 82341
    }
  },
  {
    _id: userIds[9],
    email: "daniel.kovacs@example.com",
    fullName: "Daniel Kovacs",
    username: "danielecotravels",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    coverImage: "https://images.unsplash.com/photo-1500835556837-99ac94a94552",
    bio: "Sustainable travel advocate and environmental blogger. Exploring the world with minimal footprint. Green living on the road. 🌱 🌎 ♻️",
    location: "Amsterdam, Netherlands",
    website: "www.sustainablewanderer.com",
    isVerified: false,
    joinedAt: new Date("2025-03-01"),
    occupation: "Environmental Journalist",
    followers: [userIds[1], userIds[4], userIds[5], userIds[7]],
    following: [userIds[1], userIds[5], userIds[7], userIds[11]],
    savedPosts: [],
    likedPosts: [],
    interests: ["eco-travel", "sustainability", "environment", "conservation", "responsible tourism"],
    social: {
      instagram: "danielecotravels",
      twitter: "danecotravels",
      linkedin: "danielkovacs"
    },
    stats: {
      postsCount: 15,
      totalLikes: 1437,
      totalViews: 31926
    }
  },
  {
    _id: userIds[10],
    email: "emma.johnson@example.com",
    fullName: "Emma Johnson",
    username: "emmafamilytravels",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    coverImage: "https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7",
    bio: "Family travel expert and mom of 3. Showing that adventures don't stop when kids arrive! Tips for traveling with little ones. 👨‍👩‍👧‍👦 🧸 🏖️",
    location: "Sydney, Australia",
    website: "www.emmafamilyadventures.com",
    isVerified: true,
    joinedAt: new Date("2025-02-18"),
    occupation: "Family Travel Consultant",
    followers: [userIds[2], userIds[4], userIds[6], userIds[8]],
    following: [userIds[2], userIds[4], userIds[6], userIds[8]],
    savedPosts: [],
    likedPosts: [],
    interests: ["family travel", "kid-friendly", "budget travel", "educational travel", "multigenerational"],
    social: {
      instagram: "emmafamilytravels",
      facebook: "emmafamilytravels",
      pinterest: "emmafamilytravels"
    },
    stats: {
      postsCount: 24,
      totalLikes: 2765,
      totalViews: 66978
    }
  },
  {
    _id: userIds[11],
    email: "alex.morgan@example.com",
    fullName: "Alex Morgan",
    username: "alexluxtravel",
    password: "123456",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    coverImage: "https://images.unsplash.com/photo-1500835556837-99ac94a94552",
    bio: "Luxury travel consultant and yacht enthusiast. Discovering exclusive destinations and premium experiences. First class all the way. 🛥️ 🥂 🏝️",
    location: "Monaco",
    website: "www.alexluxuryescapes.com",
    isVerified: true,
    joinedAt: new Date("2025-01-12"),
    occupation: "Luxury Travel Consultant",
    followers: [userIds[1], userIds[3], userIds[4], userIds[6], userIds[7], userIds[9]],
    following: [userIds[1], userIds[2], userIds[6], userIds[7], userIds[9]],
    savedPosts: [],
    likedPosts: [],
    interests: ["luxury", "yachting", "private jets", "fine dining", "exclusive resorts"],
    social: {
      instagram: "alexluxtravel",
      facebook: "alexluxuryescapes",
      linkedin: "alexmorgan"
    },
    stats: {
      postsCount: 32,
      totalLikes: 3912,
      totalViews: 128543
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Delete existing users
    await User.deleteMany({});
    console.log("Deleted existing users");

    // Hash passwords before inserting
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users with their IDs
    await User.insertMany(hashedUsers);
    console.log("Users seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Call the function
seedDatabase();
