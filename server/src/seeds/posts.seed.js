import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Destination from "../models/destination.model.js";
import { connectDB } from "../lib/db.js";
import dotenv from "dotenv";
dotenv.config();
const seedPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing posts
    await Post.deleteMany({});

    // Get users and destinations to assign as authors and destinations
    const users = await User.find().limit(5);
    const destinations = await Destination.find().limit(5);

    if (users.length === 0) {
      console.log("No users found. Please seed users first.");
      process.exit(1);
    }

    if (destinations.length === 0) {
      console.log("No destinations found. Please seed destinations first.");
      process.exit(1);
    }

    const posts = [
      {
        title: "Grand Canyon Adventure",
        content:
          "Just completed an epic hike through the Grand Canyon! The views from the South Rim are absolutely breathtaking. The colors of the rock formations change throughout the day, creating a mesmerizing display of nature's beauty. 🏔️ #GrandCanyon #HikingAdventure",
        coverImage:
          "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722",
        author: {
          _id: users[0]._id,
          fullName: users[0].fullName,
          profilePic: users[0].profilePic,
        },
        destination: destinations[0]._id,
        gallery: [
          "https://images.unsplash.com/photo-1615551043360-33de8b5f410c",
          "https://images.unsplash.com/photo-1542466500-1f7c8a93ea62",
          "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
        ],
        likes: [users[1]._id, users[2]._id, users[3]._id, users[4]._id],
        comments: [
          {
            content: "Amazing photos! How long was your hike?",
            author: {
              _id: users[1]._id,
              fullName: users[1].fullName,
              profilePic: users[1].profilePic,
            },
            likes: [users[0]._id, users[2]._id],
            replies: [
              {
                content:
                  "We did the Bright Angel Trail - about 12 miles round trip!",
                author: {
                  _id: users[0]._id,
                  fullName: users[0].fullName,
                  profilePic: users[0].profilePic,
                },
                likes: [users[1]._id, users[3]._id],
                createdAt: new Date(),
              },
              {
                content: "That's quite a trek! Did you camp overnight?",
                author: {
                  _id: users[3]._id,
                  fullName: users[3].fullName,
                  profilePic: users[3].profilePic,
                },
                likes: [users[0]._id],
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
          {
            content:
              "The colors are stunning! What time of day were these taken?",
            author: {
              _id: users[2]._id,
              fullName: users[2].fullName,
              profilePic: users[2].profilePic,
            },
            likes: [users[0]._id, users[3]._id, users[4]._id],
            replies: [],
            createdAt: new Date(),
          },
        ],
        tags: ["hiking", "nature", "adventure", "usa"],
        isPublished: true,
        views: 545,
        isSaved: false,
        isLiked: false,
        isShared: false,
        isDeleted: false,
        isEdited: false,
        shares: [],
      },
      {
        title: "Parisian Dreams",
        content:
          "Exploring the magical streets of Paris! From the Eiffel Tower to Montmartre, every corner tells a story. The architecture, the food, the art - everything is simply magnificent! 🗼 #Paris #TravelGoals",
        coverImage:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
        author: {
          _id: users[1]._id,
          fullName: users[1].fullName,
          profilePic: users[1].profilePic,
        },
        destination: destinations[1]._id,
        gallery: [
          "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
          "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b",
          "https://images.unsplash.com/photo-1508321942372-daf2e39e3c23",
        ],
        likes: [users[0]._id, users[2]._id, users[4]._id, users[3]._id],
        comments: [
          {
            content:
              "Paris is always a good idea! Did you try any local bakeries?",
            author: {
              _id: users[2]._id,
              fullName: users[2].fullName,
              profilePic: users[2].profilePic,
            },
            likes: [users[0]._id, users[1]._id, users[4]._id],
            replies: [
              {
                content:
                  "Yes! The croissants at Du Pain et des Idées were incredible!",
                author: {
                  _id: users[1]._id,
                  fullName: users[1].fullName,
                  profilePic: users[1].profilePic,
                },
                likes: [users[2]._id, users[0]._id],
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ],
        tags: ["europe", "city", "architecture", "food"],
        isPublished: true,
        views: 389,
        isSaved: false,
        isLiked: false,
        isShared: false,
        isDeleted: false,
        isEdited: false,
        shares: [],
      },
      {
        title: "Safari in Kenya",
        content:
          "Witnessed the great migration in Kenya! The sheer number of wildebeest and zebras crossing the Mara River was mind-blowing. Nature at its most raw and beautiful. 🦁 #Safari #Wildlife",
        coverImage:
          "https://images.unsplash.com/photo-1516426122078-c23e76319801",
        author: {
          _id: users[2]._id,
          fullName: users[2].fullName,
          profilePic: users[2].profilePic,
        },
        destination: destinations[2]._id,
        gallery: [
          "https://images.unsplash.com/photo-1534177616072-ef7dc120449d",
          "https://images.unsplash.com/photo-1549366021-9f761d450615",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801",
        ],
        likes: [users[0]._id, users[1]._id, users[3]._id, users[4]._id],
        comments: [
          {
            content: "Incredible experience! What time of year did you go?",
            author: {
              _id: users[3]._id,
              fullName: users[3].fullName,
              profilePic: users[3].profilePic,
            },
            likes: [users[2]._id, users[0]._id],
            replies: [
              {
                content: "We went in August, which is peak migration season!",
                author: {
                  _id: users[2]._id,
                  fullName: users[2].fullName,
                  profilePic: users[2].profilePic,
                },
                likes: [users[3]._id, users[1]._id],
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ],
        tags: ["safari", "wildlife", "africa", "nature"],
        isPublished: true,
        views: 612,
        isSaved: false,
        isLiked: false,
        isShared: false,
        isDeleted: false,
        isEdited: false,
        shares: [],
      },
      {
        title: "Japanese Cherry Blossoms",
        content:
          "Experiencing hanami in Kyoto! The cherry blossoms are in full bloom, creating a magical pink canopy throughout the city. The combination of ancient temples and sakura is simply breathtaking. 🌸 #Japan #CherryBlossoms",
        coverImage:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
        author: {
          _id: users[3]._id,
          fullName: users[3].fullName,
          profilePic: users[3].profilePic,
        },
        destination: destinations[3]._id,
        gallery: [
          "https://images.unsplash.com/photo-1552465011-b4e87bfa6f63",
          "https://images.unsplash.com/photo-1542051841857-5f90071e7989",
          "https://images.unsplash.com/photo-1492571350019-22de08371fd3",
        ],
        likes: [users[0]._id, users[1]._id, users[2]._id, users[4]._id],
        comments: [
          {
            content:
              "The photos are stunning! What's your favorite spot for hanami?",
            author: {
              _id: users[4]._id,
              fullName: users[4].fullName,
              profilePic: users[4].profilePic,
            },
            likes: [users[3]._id, users[1]._id],
            replies: [
              {
                content:
                  "Maruyama Park is magical, but Philosopher's Path is my favorite!",
                author: {
                  _id: users[3]._id,
                  fullName: users[3].fullName,
                  profilePic: users[3].profilePic,
                },
                likes: [users[4]._id, users[2]._id],
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ],
        tags: ["japan", "spring", "culture", "nature"],
        isPublished: true,
        views: 478,
        isSaved: false,
        isLiked: false,
        isShared: false,
        isDeleted: false,
        isEdited: false,
        shares: [],
      },
      {
        title: "Australian Outback Adventure",
        content:
          "Exploring the vast and beautiful Australian Outback! The red earth, starry nights, and unique wildlife make this an unforgettable experience. The Uluru sunset was particularly magical. 🌅 #Australia #Outback",
        coverImage:
          "https://images.unsplash.com/photo-1529108190281-9d6ebf35a776",
        author: {
          _id: users[4]._id,
          fullName: users[4].fullName,
          profilePic: users[4].profilePic,
        },
        destination: destinations[4]._id,
        gallery: [
          "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
          "https://images.unsplash.com/photo-1523438885200-e635ba2c371e",
          "https://images.unsplash.com/photo-1523437345381-db5ee4df9c04",
        ],
        likes: [users[0]._id, users[1]._id, users[2]._id, users[3]._id],
        comments: [
          {
            content:
              "How was the temperature? I've heard it can get quite hot!",
            author: {
              _id: users[0]._id,
              fullName: users[0].fullName,
              profilePic: users[0].profilePic,
            },
            likes: [users[4]._id, users[2]._id],
            replies: [
              {
                content:
                  "It was around 35°C during the day, but the nights were cool and perfect for stargazing!",
                author: {
                  _id: users[4]._id,
                  fullName: users[4].fullName,
                  profilePic: users[4].profilePic,
                },
                likes: [users[0]._id, users[3]._id],
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ],
        tags: ["australia", "adventure", "nature", "wildlife"],
        isPublished: true,
        views: 356,
        isSaved: false,
        isLiked: false,
        isShared: false,
        isDeleted: false,
        isEdited: false,
        shares: [],
      },
      {
        title: "Santorini Sunset Magic",
        content:
          "Watching the sun dip into the Aegean Sea from Oia is pure magic! The white-washed buildings turn golden, and the sky explodes in colors. Greek hospitality and food are unmatched! 🌅 #Greece #Santorini",
        coverImage:
          "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
        author: {
          _id: users[0]._id,
          fullName: users[0].fullName,
          profilePic: users[0].profilePic,
        },
        destination: destinations[0]._id,
        gallery: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
          "https://images.unsplash.com/photo-1555400038-63f5ba517a47",
          "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
        ],
        likes: [users[1]._id, users[2]._id, users[3]._id, users[4]._id],
        comments: [
          {
            content: "Which restaurant had the best view?",
            author: {
              _id: users[1]._id,
              fullName: users[1].fullName,
              profilePic: users[1].profilePic,
            },
            likes: [users[0]._id, users[3]._id],
            replies: [
              {
                content:
                  "Apsithia - amazing sunset views and the seafood was incredible!",
                author: {
                  _id: users[0]._id,
                  fullName: users[0].fullName,
                  profilePic: users[0].profilePic,
                },
                likes: [users[1]._id, users[4]._id],
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ],
        tags: ["greece", "sunset", "islands", "mediterranean"],
        isPublished: true,
        views: 423,
        isSaved: false,
        isLiked: false,
        isShared: false,
        isDeleted: false,
        isEdited: false,
        shares: [],
      },
      {
        title: "Northern Lights in Iceland",
        content:
          "Finally witnessed the mesmerizing Aurora Borealis in Iceland! The green lights dancing across the night sky created an otherworldly experience. The hot springs and glaciers add to the magic! ❄️ #Iceland #NorthernLights",
        coverImage:
          "https://images.unsplash.com/photo-1579033461380-adb47c3eb938",
        author: {
          _id: users[1]._id,
          fullName: users[1].fullName,
          profilePic: users[1].profilePic,
        },
        destination: destinations[1]._id,
        gallery: [
          "https://images.unsplash.com/photo-1579033461380-adb47c3eb938",
          "https://images.unsplash.com/photo-1520681279154-51b3fb4e6b4d",
          "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
        ],
        likes: [users[0]._id, users[2]._id, users[3]._id],
        comments: [
          {
            content: "When's the best time to see the Northern Lights?",
            author: {
              _id: users[2]._id,
              fullName: users[2].fullName,
              profilePic: users[2].profilePic,
            },
            likes: [users[1]._id],
            replies: [
              {
                content: "September to March is best, we went in February!",
                author: {
                  _id: users[1]._id,
                  fullName: users[1].fullName,
                  profilePic: users[1].profilePic,
                },
                likes: [users[2]._id],
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ],
        tags: ["iceland", "northernlights", "winter", "nature"],
        isPublished: true,
        views: 289,
        isSaved: false,
        isLiked: false,
        isShared: false,
        isDeleted: false,
        isEdited: false,
        shares: [],
      },
      {
        title: "Machu Picchu Trek",
        content:
          "Completed the Inca Trail to Machu Picchu! Four days of challenging hiking through stunning mountain passes led to the most rewarding view. The ancient Incan architecture is mind-blowing! 🏔️ #MachuPicchu #Peru",
        coverImage:
          "https://images.unsplash.com/photo-1526392060635-9d6019884377",
        author: {
          _id: users[2]._id,
          fullName: users[2].fullName,
          profilePic: users[2].profilePic,
        },
        destination: destinations[2]._id,
        gallery: [
          "https://images.unsplash.com/photo-1526392060635-9d6019884377",
          "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
          "https://images.unsplash.com/photo-1526392060635-9d6019884377",
        ],
        likes: [users[0]._id, users[1]._id, users[3]._id, users[4]._id],
        comments: [
          {
            content: "How difficult was the trek?",
            author: {
              _id: users[3]._id,
              fullName: users[3].fullName,
              profilePic: users[3].profilePic,
            },
            likes: [users[2]._id],
            replies: [
              {
                content:
                  "Challenging but doable with proper preparation. Dead Woman's Pass was the toughest part!",
                author: {
                  _id: users[2]._id,
                  fullName: users[2].fullName,
                  profilePic: users[2].profilePic,
                },
                likes: [users[3]._id],
                createdAt: new Date(),
              },
            ],
            createdAt: new Date(),
          },
        ],
        tags: ["peru", "hiking", "history", "adventure"],
        isPublished: true,
        views: 512,
        isSaved: false,
        isLiked: false,
        isShared: false,
        isDeleted: false,
        isEdited: false,
        shares: [],
      },
    ];

    await Post.insertMany(posts);

    // Update user's posts array
    for (const post of posts) {
      await User.findByIdAndUpdate(post.author._id, {
        $push: { posts: post._id },
      });
    }

    console.log("Posts seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding posts:", error);
    process.exit(1);
  }
};

seedPosts();
