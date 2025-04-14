import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Destination from "../models/destination.model.js";
import { connectDB } from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();

const seedPosts = async () => {
  try {
    await connectDB();

    // Clear existing posts
    await Post.deleteMany({});

    // Get users and destinations to assign as authors and destinations
    const users = await User.find().limit(10);
    const destinations = await Destination.find();
    
    if (users.length === 0) {
      console.log("No users found. Please seed users first.");
      process.exit(1);
    }

    if (destinations.length === 0) {
      console.log("No destinations found. Please seed destinations first.");
      process.exit(1);
    }

    // Helper function to get random users for likes
    const getRandomLikes = (excludeUserId, count = 5) => {
      const availableUsers = users.filter(user => user._id.toString() !== excludeUserId.toString());
      const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, shuffled.length)).map(user => user._id);
    };
    
    // Helper function to get random shares
    const getRandomShares = (excludeUserId, shareCount = 3) => {
      const availableUsers = users.filter(user => user._id.toString() !== excludeUserId.toString());
      const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
      const count = Math.min(shareCount, availableUsers.length);
      return shuffled.slice(0, count).map(user => ({
        user: {
          _id: user._id,
          fullName: user.fullName,
          profilePic: user.profilePic
        }
      }));
    };
    
    // Current date for reference
    const now = new Date();

    // Helper function to create date in the past
    const daysAgo = (days) => {
      const date = new Date(now);
      date.setDate(date.getDate() - days);
      return date;
    };

    const posts = [
      {
        title: "Magical Paris: Beyond the Eiffel Tower",
        content: 
          "Just spent a week exploring the hidden gems of Paris, and I'm completely enchanted! While the Eiffel Tower and Louvre are must-sees, the real magic happens in the less-traveled spots.\n\nHighlights:\n• Morning walks along Canal Saint-Martin\n• Vintage shopping in Le Marais\n• People-watching from tiny cafés in Montmartre\n• Finding secret passageways in the Latin Quarter\n\nPro tip: Visit Sainte-Chapelle for the most stunning stained glass windows you'll ever see - go early morning to avoid crowds and catch the light streaming through the glass.\n\nWhat are your favorite Paris discoveries? Share in the comments! 🇫🇷✨ #Paris #HiddenGems #TravelDeeper",
        coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
        author: users[0]._id,
        destination: destinations.find(d => d.name === "Paris, France")?._id || destinations[0]._id,
        gallery: [
          "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b", 
          "https://images.unsplash.com/photo-1550340499-a6c60fc8287c",
        ],
        likes: getRandomLikes(users[0]._id, 82),
        comments: [
          {
            content: "The light in your photos is incredible! What camera are you using?",
            author: users[1]._id,
            likes: getRandomLikes(users[1]._id, 7),
            replies: [
              {
                content: "Thank you! I'm using a Sony A7III with mostly a 24-70mm lens. The morning light in Paris is just magical!",
                author: users[0]._id,
                likes: getRandomLikes(users[0]._id, 3),
                createdAt: daysAgo(4)
              }
            ],
            createdAt: daysAgo(5)
          },
          {
            content: "Sainte-Chapelle is indeed a hidden treasure! I went last summer and was blown away. Your photos captured it perfectly!",
            author: users[3]._id,
            likes: getRandomLikes(users[3]._id, 9),
            replies: [
              {
                content: "It's breathtaking, isn't it? I think I spent two hours just staring up at those windows!",
                author: users[0]._id,
                likes: getRandomLikes(users[0]._id, 5),
                createdAt: daysAgo(3)
              },
              {
                content: "Did you also check out Notre-Dame reconstruction? It's coming along beautifully.",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 4),
                createdAt: daysAgo(2)
              }
            ],
            createdAt: daysAgo(6)
          },
          {
            content: "Adding these spots to my Paris itinerary for next month! Any food recommendations?",
            author: users[4]._id,
            likes: getRandomLikes(users[4]._id, 6),
            replies: [
              {
                content: "Definitely try Chez Janou for amazing chocolate mousse, and any small bakery for fresh croissants! The less touristy, the better!",
                author: users[0]._id,
                likes: getRandomLikes(users[0]._id, 8),
                createdAt: daysAgo(3)
              }
            ],
            createdAt: daysAgo(4)
          }
        ],
        tags: ["paris", "france", "europe", "architecture", "cityscape", "travel", "photography"],
        isPublished: true,
        views: 1845,
        createdAt: daysAgo(7),
        shares: getRandomShares(users[0]._id, 6)
      },
      {
        title: "Tokyo: Where Tradition Meets Innovation",
        content: 
          "Tokyo continues to amaze me on my third visit! This city seamlessly blends centuries-old traditions with cutting-edge technology and fashion.\n\nMy favorite experiences this time:\n• Witnessing a traditional tea ceremony in Hamarikyu Gardens\n• Getting lost in the neon wonderland of Shinjuku at night\n• Finding peace at the Meiji Shrine despite being in the heart of the city\n• Exploring the digital art museum TeamLab Borderless\n\nFood highlights: The omakase at a tiny 8-seat sushi bar in Ginza was life-changing. Also tried conveyor belt sushi, ramen at 2am, and the fluffiest Japanese pancakes!\n\nTip for first-timers: Get a Suica card immediately and embrace the train system - it's incredibly efficient once you understand it.\n\nWho else loves Tokyo? What should I explore on my next visit? 🇯🇵 #Tokyo #JapanTravel #TravelAsia",
        coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
        author: users[2]._id,
        destination: destinations.find(d => d.name === "Tokyo, Japan")?._id || destinations[0]._id,
        gallery: [
          "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
          "https://images.unsplash.com/photo-1542051841857-5f90071e7989", 
          "https://images.unsplash.com/photo-1554797589-7241bb691973",
          "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f",
        ],
        likes: getRandomLikes(users[2]._id, 126),
        comments: [
          {
            content: "TeamLab Borderless is amazing! Did you get a chance to visit their new exhibition?",
            author: users[0]._id,
            likes: getRandomLikes(users[0]._id, 14),
            replies: [
              {
                content: "I didn't know about the new one! Definitely adding that to my list for next time - thanks for the tip!",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 5),
                createdAt: daysAgo(7)
              }
            ],
            createdAt: daysAgo(8)
          },
          {
            content: "Your night photos of Shinjuku are spectacular! Any tips for nighttime photography in bright urban settings?",
            author: users[5]._id,
            likes: getRandomLikes(users[5]._id, 12),
            replies: [
              {
                content: "Thank you! I find a small tripod essential, and I usually shoot in manual mode with a lower ISO (around 400-800) and play with longer exposures. Also, shooting in RAW helps a lot with post-processing those neon lights!",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 18),
                createdAt: daysAgo(6)
              }
            ],
            createdAt: daysAgo(7)
          },
          {
            content: "I'm planning my first trip to Tokyo. Is 7 days enough to see the highlights?",
            author: users[7]._id,
            likes: getRandomLikes(users[7]._id, 8),
            replies: [
              {
                content: "7 days is good for hitting the main spots! I'd recommend 3 days for the major Tokyo areas (Shibuya, Shinjuku, Ginza, Akihabara), 1 day for a side trip to Kamakura, 1 day for the museums/parks, and 2 days to just wander and discover. Have an amazing trip!",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 15),
                createdAt: daysAgo(4)
              }
            ],
            createdAt: daysAgo(5)
          }
        ],
        tags: ["tokyo", "japan", "asia", "technology", "tradition", "cityscape", "nightlife", "food"],
        isPublished: true,
        views: 2762,
        createdAt: daysAgo(10),
        shares: getRandomShares(users[2]._id, 8)
      },
      {
        title: "Santorini Sunsets: A Photographer's Dream",
        content: 
          "They say Santorini has the most beautiful sunsets in the world, and after a week here, I completely agree. The white buildings against the deep blue Aegean Sea create a perfect canvas for the golden hour.\n\nBest sunset spots I discovered:\n• Oia is famous for a reason - get there 2 hours early for a good spot\n• Santo Winery offers amazing views with a glass of local wine\n• Skaros Rock for a more adventurous sunset hike\n• Our hotel in Imerovigli had the perfect private balcony view\n\nBeyond sunsets, Santorini offered incredible experiences: wine tasting (try the Assyrtiko!), fresh seafood at Amoudi Bay, boat tour of the caldera, and black sand beaches.\n\nWorth noting: While stunning, Santorini is very crowded in peak season. Consider visiting in May or September for a more peaceful experience.\n\nHave you been to Santorini? Share your favorite spots below! 🇬🇷 #Santorini #GreekIslands #SunsetPhotography #Travel",
        coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
        author: users[1]._id,
        destination: destinations.find(d => d.name === "Santorini, Greece")?._id || destinations[0]._id,
        gallery: [
          "https://media-01.imu.nl/storage/ourplanetinmylens.com/21978/reasons-to-visit-santorini-greece-2560x1100.jpg",
          "https://vacations.aircanada.com/.imaging/focalarea/wide/2000x/dam/jcr:a0d09386-8ec4-4f00-899a-007261841b89/MCE-26334-DEST-Santorini-Main_Santorini-Greece.jpg",
        ],
        likes: getRandomLikes(users[1]._id, 194),
        comments: [
          {
            content: "These photos are absolutely stunning! What camera settings did you use for the sunset shots?",
            author: users[3]._id,
            likes: getRandomLikes(users[3]._id, 16),
            replies: [
              {
                content: "Thank you! For the sunset shots, I used aperture priority around f/8, ISO 100-200, and underexposed slightly to preserve the colors. A polarizing filter helped with the water reflections too!",
                author: users[1]._id,
                likes: getRandomLikes(users[1]._id, 10),
                createdAt: daysAgo(13)
              }
            ],
            createdAt: daysAgo(14)
          },
          {
            content: "I was in Santorini last summer and it was magical! Did you get a chance to visit Ancient Thera?",
            author: users[4]._id,
            likes: getRandomLikes(users[4]._id, 8),
            replies: [
              {
                content: "Yes! Ancient Thera was fascinating and surprisingly less crowded than other spots. The hike up was worth it for both the ruins and the views!",
                author: users[1]._id,
                likes: getRandomLikes(users[1]._id, 7),
                createdAt: daysAgo(12)
              }
            ],
            createdAt: daysAgo(13)
          }
        ],
        tags: ["santorini", "greece", "islands", "sunset", "photography", "mediterranean", "travel", "views"],
        isPublished: true,
        views: 3547,
        createdAt: daysAgo(15),
        shares: getRandomShares(users[1]._id, 10)
      },
      {
        title: "Bali: Finding Balance in Paradise",
        content: 
          "Just spent a month in Bali, dividing my time between bustling Canggu, spiritual Ubud, and the remote eastern beaches. This island offers incredible diversity in a relatively small area.\n\nHighlights of my journey:\n• Morning yoga with rice field views in Ubud\n• Learning to surf in Canggu (many wipeouts, few successes!)\n• Hiking Mount Batur for sunrise - a challenging pre-dawn climb rewarded with spectacular views\n• Exploring lesser-known temples away from the tourist crowds\n• The warm welcome of Balinese people everywhere we went\n\nFood journey: From warungs (local eateries) serving amazing nasi campur to fancy beach clubs in Seminyak, Bali's food scene is incredible. Don't miss babi guling (suckling pig) if you eat meat!\n\nTravel tip: Rent a scooter if you're comfortable riding one - it gives you freedom to explore at your own pace. Just be very careful in traffic and always wear a helmet.\n\nI left feeling physically refreshed and spiritually centered. Already planning my return trip!\n\nHave you experienced the magic of Bali? 🌴 #Bali #Indonesia #TravelAsia #Wellness",
        coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
        author: users[3]._id,
        destination: destinations.find(d => d.name === "Bali, Indonesia")?._id || destinations[0]._id,
        gallery: [
          "https://images.unsplash.com/photo-1573790387438-4da905039392",
          "https://images.unsplash.com/photo-1555400038-63f5ba517a47",
        ],
        likes: getRandomLikes(users[3]._id, 143),
        comments: [
          {
            content: "The rice terraces look absolutely stunning! Was it very crowded at Tegallalang?",
            author: users[0]._id,
            likes: getRandomLikes(users[0]._id, 12),
            replies: [
              {
                content: "Tegallalang can get very crowded midday! I went right at 7am and had much of it to myself for about an hour. By 9am it was getting busy with tour groups. Definitely worth the early wake-up!",
                author: users[3]._id,
                likes: getRandomLikes(users[3]._id, 9),
                createdAt: daysAgo(16)
              }
            ],
            createdAt: daysAgo(17)
          },
          {
            content: "I'm planning a Bali trip next month. Is two weeks enough time? And would you recommend staying in one place or moving around?",
            author: users[6]._id,
            likes: getRandomLikes(users[6]._id, 7),
            replies: [
              {
                content: "Two weeks is perfect! I'd definitely recommend moving around - maybe 5 days Ubud, 5 days Canggu/Seminyak, and 4 days in either Uluwatu (for beaches/surfing) or the eastern side (for snorkeling/diving). Each area has such a different vibe!",
                author: users[3]._id,
                likes: getRandomLikes(users[3]._id, 14),
                createdAt: daysAgo(14)
              }
            ],
            createdAt: daysAgo(15)
          },
          {
            content: "Your Mount Batur photo is incredible! How difficult was the hike? I'm interested but not super fit.",
            author: users[2]._id,
            likes: getRandomLikes(users[2]._id, 8),
            replies: [
              {
                content: "Thanks! It's moderately challenging mostly because it's very early (2am start) and dark. The trail is steep but not technical, and guides are patient. Most people with average fitness can do it, just take your time! The sunrise view makes any struggle worth it!",
                author: users[3]._id,
                likes: getRandomLikes(users[3]._id, 11),
                createdAt: daysAgo(13)
              }
            ],
            createdAt: daysAgo(14)
          }
        ],
        tags: ["bali", "indonesia", "asia", "wellness", "nature", "travel", "beach", "culture"],
        isPublished: true,
        views: 2891,
        createdAt: daysAgo(18),
        shares: getRandomShares(users[3]._id, 9)
      },
      {
        title: "Barcelona: Gothic Quarter to Gaudí",
        content: 
          "Barcelona has stolen my heart! This city offers the perfect blend of beach, architecture, culture, and incredible food. Every neighborhood has its own unique character.\n\nMy Barcelona highlights:\n• Getting lost in the narrow streets of the Gothic Quarter\n• Gazing up at the incredible details of La Sagrada Familia (book tickets in advance!)\n• Watching the sunset from Park Güell with panoramic city views\n• Experiencing the vibrant atmosphere of La Boqueria Market\n• Beach relaxation at Barceloneta after days of city exploration\n\nCulinary journey: From innovative tapas bars to traditional Catalan cuisine, I ate my way through this city! Must-tries include patatas bravas, fresh seafood paella, jamón ibérico, and local vermouth.\n\nPractical tip: The Barcelona Card was worth it for unlimited public transit and museum discounts. Also, be aware of pickpockets in tourist areas.\n\nWhat's your favorite Gaudí masterpiece in Barcelona? 🇪🇸 #Barcelona #Spain #Gaudi #TravelEurope",
        coverImage: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
        author: users[4]._id,
        destination: destinations.find(d => d.name === "Barcelona, Spain")?._id || destinations[0]._id,
        gallery: [
          "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
          "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216", 
          "https://images.unsplash.com/photo-1559058789-672da06263d8",
          "https://images.unsplash.com/photo-1568386453619-84c3ff4b43c5",
        ],
        likes: getRandomLikes(users[4]._id, 118),
        comments: [
          {
            content: "Your Sagrada Familia photos are stunning! Did you go with a guide or self-guided tour?",
            author: users[1]._id,
            likes: getRandomLikes(users[1]._id, 9),
            replies: [
              {
                content: "Thank you! I did the audio guide tour, which was excellent - it explained all the symbolism and details at my own pace. I'd recommend adding the tower access too for amazing views!",
                author: users[4]._id,
                likes: getRandomLikes(users[4]._id, 7),
                createdAt: daysAgo(22)
              }
            ],
            createdAt: daysAgo(23)
          },
          {
            content: "I'm going to Barcelona next month! Any recommendations for less touristy tapas bars?",
            author: users[5]._id,
            likes: getRandomLikes(users[5]._id, 11),
            replies: [
              {
                content: "Definitely check out El Xampanyet in Born neighborhood - no reservations but amazing traditional tapas! Also loved Bar del Pla and La Cova Fumada. Just avoid places with picture menus on Las Ramblas!",
                author: users[4]._id,
                likes: getRandomLikes(users[4]._id, 15),
                createdAt: daysAgo(20)
              },
              {
                content: "Adding to this - Quimet & Quimet is fantastic too! Small space but incredible conservas and montaditos.",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 8),
                createdAt: daysAgo(19)
              }
            ],
            createdAt: daysAgo(21)
          }
        ],
        tags: ["barcelona", "spain", "europe", "architecture", "gaudi", "food", "city", "beach"],
        isPublished: true,
        views: 2105,
        createdAt: daysAgo(25),
        shares: getRandomShares(users[4]._id, 7)
      },
      {
        title: "Hidden Gems of Italy's Amalfi Coast",
        content: 
          "Just returned from two magical weeks exploring Italy's breathtaking Amalfi Coast! While Positano and Amalfi town are stunning (and deservedly famous), I wanted to share some lesser-known spots that captured my heart.\n\nHidden gems I discovered:\n• The village of Praiano - all the views without Positano's crowds\n• Valle dei Mulini (Valley of the Mills) - an abandoned paper mill reclaimed by nature\n• Marina di Praia - a tiny beach wedged between dramatic cliffs\n• Path of the Gods hike starting from Bomerano - the best coastal views imaginable\n• Ravello's Villa Cimbrone gardens - I had them almost to myself in the early morning\n\nCulinary highlights: Fresh seafood pasta at Lo Scoglio in Nerano, lemon granita from roadside stands, and the best pizza of my life at a tiny place in Minori.\n\nTravel tips: Visit in May or October to avoid peak crowds. Buses can be packed in summer, so consider hiring a driver for a day to see multiple towns stress-free.\n\nHave you explored this stunning coastline? Any hidden gems I missed? 🇮🇹 #AmalfiCoast #Italy #HiddenGems #TravelEurope",
        coverImage: "https://media2.thrillophilia.com/images/photos/000/178/736/original/1573646646_rome.jpg?w=753&h=450&dpr=1.5",
        author: users[5]._id,
        destination: destinations[0]._id, // Using first destination as fallback
        gallery: [
          "https://blog.atlanticbridge.com.br/wp-content/uploads/2024/06/Principais-cidades-da-Italia-2.webp",
          "https://imageio.forbes.com/specials-images/imageserve/60da1893f45734702a3ba5a7/Grand-Canal-in-Venice--Italy/0x0.jpg?format=jpg&width=960", 
        ],
        likes: getRandomLikes(users[5]._id, 156),
        comments: [
          {
            content: "Your photos are absolutely stunning! How difficult is the Path of the Gods hike?",
            author: users[0]._id,
            likes: getRandomLikes(users[0]._id, 13),
            replies: [
              {
                content: "Thank you! The Path of the Gods is moderate difficulty - some uneven terrain and elevation changes, but nothing technical. Comfortable shoes, water, and sun protection are essential. The views make every step worth it!",
                author: users[5]._id,
                likes: getRandomLikes(users[5]._id, 9),
                createdAt: daysAgo(28)
              }
            ],
            createdAt: daysAgo(29)
          },
          {
            content: "I've been considering Praiano instead of Positano for our trip. How was the transportation from there to other towns?",
            author: users[2]._id,
            likes: getRandomLikes(users[2]._id, 7),
            replies: [
              {
                content: "Great choice! Praiano has regular SITA buses connecting to Positano (15 min) and Amalfi (25 min). They run about hourly but can get crowded in peak season. There are also boats from the small marina connecting to major towns. We loved the quieter atmosphere while still having good access!",
                author: users[5]._id,
                likes: getRandomLikes(users[5]._id, 12),
                createdAt: daysAgo(27)
              }
            ],
            createdAt: daysAgo(28)
          }
        ],
        tags: ["italy", "amalficoast", "europe", "coast", "hiddentravel", "food", "hiking", "views"],
        isPublished: true,
        views: 3215,
        createdAt: daysAgo(30),
        shares: getRandomShares(users[5]._id, 10)
      },
      {
        title: "10 Days in Iceland: Chasing Waterfalls and Northern Lights",
        content: 
          "Just returned from the most incredible 10-day road trip around Iceland's Ring Road! If you're dreaming of otherworldly landscapes, this country MUST be on your bucket list.\n\nImagine driving around a bend to find another epic waterfall, geothermal area, or black sand beach waiting to be explored – that's Iceland every single day.\n\nHighlights of our journey:\n• Watching the Northern Lights dance above our cabin near Kirkjufell\n• Hiking on a glacier with crampons and ice axes in Vatnajökull National Park\n• Relaxing in the milky blue waters of the Blue Lagoon (touristy but worth it!)\n• Exploring ice caves with their surreal blue colors\n• Walking behind Seljalandsfoss waterfall\n• Photographing Diamond Beach where ice chunks wash up on black sand\n\nTravel tips:\n1. Rent a 4WD vehicle if visiting between October-April\n2. The weather changes CONSTANTLY – we experienced sunshine, rain, snow, and fierce winds all in one day\n3. Book accommodation well in advance, especially along the South Coast\n4. Bring waterproof everything and layers, layers, layers\n5. Download offline maps – cell service can be spotty\n\nWe spent about $3,500 per person for 10 days including flights from the US, car rental, accommodations, and food (yes, Iceland is expensive but SO worth it).\n\nHas anyone else experienced the magic of Iceland? What was your favorite spot? 🇮🇸❄️ #Iceland #RingRoad #TravelIceland #NorthernLights #IcelandWaterfalls",
        coverImage: "https://images.unsplash.com/photo-1476610182048-b716b8518aae",
        author: users[1]._id,
        destination: destinations[2]._id,
        gallery: [
          "https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2021/12/kirkjufellsfoss_iceland.jpg",
          "https://www.icelandhotelcollectionbyberjaya.com/static/news/shutterstock_527458129-1.jpg", 
          "https://kgv.ac.uk/user/pages/05.student-life/16.trips-and-visits/10.geography-iceland/iceland-1_.jpg",
          "https://res.cloudinary.com/icelandtours/g_auto,f_auto,c_auto,w_3840,q_auto:good/flatey_island_summer_e2506cca1c.jpg",
        ],
        likes: getRandomLikes(users[1]._id, 178),
        comments: [
          {
            content: "Your photos of the Northern Lights are incredible! What camera settings did you use to capture them so clearly?",
            author: users[0]._id,
            likes: getRandomLikes(users[0]._id, 12),
            replies: [
              {
                content: "Thank you! I used a Sony a7III with a 16-35mm f/2.8 lens. Settings were typically ISO 3200-6400, f/2.8, and 15-second exposures. A tripod is absolutely essential! The key is finding dark skies away from light pollution.",
                author: users[1]._id,
                likes: getRandomLikes(users[1]._id, 8),
                createdAt: daysAgo(33)
              }
            ],
            createdAt: daysAgo(34)
          },
          {
            content: "We're planning our Iceland trip for next February! Did you feel 10 days was enough to see everything you wanted?",
            author: users[3]._id,
            likes: getRandomLikes(users[3]._id, 5),
            replies: [
              {
                content: "10 days was perfect for the Ring Road at a comfortable pace! February is great for Northern Lights and ice caves, but some highland roads might be closed. Make sure to build in some buffer days for weather delays - we had one day where we couldn't drive at all due to wind advisories. The days are also quite short in February, so plan your driving accordingly!",
                author: users[1]._id,
                likes: getRandomLikes(users[1]._id, 9),
                createdAt: daysAgo(32)
              }
            ],
            createdAt: daysAgo(33)
          }
        ],
        tags: ["iceland", "northernlights", "waterfalls", "roadtrip", "adventure", "winter", "nature"],
        isPublished: true,
        views: 4217,
        createdAt: daysAgo(35),
        shares: getRandomShares(users[1]._id, 15)
      },
      {
        title: "Japan's Hidden Gems: Beyond Tokyo and Kyoto",
        content: 
          "After three visits to Japan focusing on the major cities, I decided to venture off the tourist trail on my recent 3-week trip. What I discovered was a side of Japan that completely stole my heart.\n\nWhile Tokyo's energy and Kyoto's temples are absolutely worth experiencing, here are some lesser-known destinations that deserve more attention:\n\n🌊 Yakushima Island - A mystical, UNESCO-protected island covered in ancient cedar forests that inspired Studio Ghibli's 'Princess Mononoke'. Hiking through moss-covered forests in the misty rain felt like stepping into another world.\n\n🏮 Takayama - This beautifully preserved Edo-period town in the Japanese Alps showcases traditional wooden architecture and has morning markets that have operated for centuries. The local Hida beef rivals the famous Kobe variety!\n\n⛩️ Onomichi - A charming port town connected by a series of small islands perfect for cycling (the Shimanami Kaido route). The hillside temples connected by a winding 'Path of Literature' offers stunning views of the Inland Sea.\n\n🏔️ Kamikochi - A remote alpine valley in the Northern Japan Alps with crystal-clear rivers, pristine forests, and excellent hiking. No private cars are allowed, preserving its serene atmosphere.\n\n🌸 Shikoku Pilgrimage - I only did 5 of the 88 temple pilgrimage route, but meeting white-clad pilgrims who were completing the entire circuit on foot was incredibly inspiring.\n\nLanguage tips for rural Japan:\n• Download Google Translate with Japanese offline\n• Learn basic phrases - even simple Japanese goes a long way\n• Take photos of train station names in Japanese characters\n• Have your accommodation write down destinations in Japanese to show taxi drivers\n\nHave you explored beyond Japan's major cities? I'd love to hear about your discoveries! 🇯🇵 #JapanTravel #HiddenJapan #JapaneseAlps #Yakushima #Takayama",
        coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
        author: users[2]._id,
        destination: destinations[1]._id,
        gallery: [
          "https://images.unsplash.com/photo-1528360983277-13d401cdc186",
          "https://images.unsplash.com/photo-1545569341-9eb8b30979d9", 
          "https://images.unsplash.com/photo-1578271887552-5ac3a72752bc",
          "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d",
        ],
        likes: getRandomLikes(users[2]._id, 215),
        comments: [
          {
            content: "This is exactly what I needed! Planning a third trip to Japan and wanted to explore beyond the usual spots. How did you get to Yakushima Island? Was transportation difficult?",
            author: users[4]._id,
            likes: getRandomLikes(users[4]._id, 8),
            replies: [
              {
                content: "You'll love Yakushima! I took a jetfoil ferry from Kagoshima (about 2 hours). There are also slower, cheaper ferries and some flights from certain cities. On the island, I rented a car which I'd highly recommend as public transportation is limited and the best hiking trails are spread out. Book accommodation well in advance as options are limited but absolutely beautiful - many have their own hot springs!",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 11),
                createdAt: daysAgo(25)
              }
            ],
            createdAt: daysAgo(26)
          },
          {
            content: "The Shimanami Kaido cycling route has been on my bucket list forever! Would you say it's suitable for casual cyclists or is it quite challenging?",
            author: users[0]._id,
            likes: getRandomLikes(users[0]._id, 6),
            replies: [
              {
                content: "It's perfect for casual cyclists! The route is incredibly well-marked with dedicated cycling lanes, and the climbs over the bridges are gradual. You can rent bikes at either end and even do one-way trips (return by bus). Many people break it into 2 days, staying overnight on one of the islands. The views are spectacular the entire way, with plenty of resting spots and cafes. Highly recommend it!",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 9),
                createdAt: daysAgo(24)
              }
            ],
            createdAt: daysAgo(25)
          }
        ],
        tags: ["japan", "offthebeatenpath", "yakushima", "japanesealps", "hiking", "culture", "ruraltravel"],
        isPublished: true,
        views: 3845,
        createdAt: daysAgo(28),
        shares: getRandomShares(users[2]._id, 17)
      },
      {
        title: "A Culinary Journey Through Vietnam: From North to South",
        content: 
          "I just spent a month traveling the length of Vietnam with one primary mission: to eat EVERYTHING. From steaming bowls of pho on plastic stools in Hanoi to fresh seafood on the beaches of Phu Quoc, this country's cuisine took me on an unforgettable journey.\n\nWhat makes Vietnamese food so special is how it varies dramatically as you travel from north to south. Each region has its own distinct flavors, ingredients, and cooking techniques, telling the story of Vietnam's diverse geography and history.\n\n🍜 Northern Vietnam (Hanoi region)\nCharacteristics: Subtle flavors, less spice, heavy Chinese influence\n• Pho: The original version is clear, simple, and all about the beef and star anise-infused broth\n• Bun Cha: Grilled pork with vermicelli, herbs, and dipping sauce (Obama and Bourdain's famous meal)\n• Cha Ca: Turmeric-marinated fish with dill and rice noodles\n\n🍲 Central Vietnam (Hue, Da Nang, Hoi An)\nCharacteristics: Spicier, complex, imperial influence\n• Bun Bo Hue: Spicy beef noodle soup with lemongrass\n• Mi Quang: Turmeric noodles with a small amount of broth, shrimp, pork, and herbs\n• Banh Xeo: Crispy rice flour crepes with shrimp and bean sprouts\n\n🥗 Southern Vietnam (Ho Chi Minh City, Mekong Delta)\nCharacteristics: Sweeter, tropical ingredients, Thai/Cambodian influences\n• Hu Tieu: Chinese-influenced noodle soup with clear broth and seafood\n• Banh Khot: Mini rice cakes topped with shrimp\n• Com Tam: 'Broken rice' with grilled pork, egg, and pickles\n\nCooking class recommendations:\n• Hanoi: Red Bridge Cooking School\n• Hoi An: Morning Glory Cooking School (my favorite!)\n• Ho Chi Minh City: Saigon Cooking Class\n\nThe secret to Vietnamese cuisine is the balance of five elements: sweet, sour, bitter, spicy, and salty. The liberal use of fresh herbs, minimal dairy, and emphasis on fresh ingredients also makes it one of the healthiest cuisines in the world.\n\nHave you tried Vietnamese food? What's your favorite dish? 🇻🇳 #VietnamFood #Foodie #CulinaryTravel #PhoLove #StreetFood",
        coverImage: "https://www.northclubhouse.com/wp-content/uploads/2024/09/image-VAHwqno5k7JFTg-Golden_Brid.width-1200.format-webp.webp",
        author: users[3]._id,
        destination: destinations[3]._id,
        gallery: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Halong_bay_vietnam.JPG/1200px-Halong_bay_vietnam.JPG",
          "https://www.creativeassociatesinternational.com/wp-content/uploads/2023/11/iStock-1705694439.jpg",
        ],
        likes: getRandomLikes(users[3]._id, 246),
        comments: [
          {
            content: "This makes me miss Vietnam so much! Did you have any food safety issues eating street food? I want to try everything when I visit but I'm a bit nervous about getting sick.",
            author: users[5]._id,
            likes: getRandomLikes(users[5]._id, 14),
            replies: [
              {
                content: "I totally understand the concern! I ate street food daily for a month with no issues by following some simple rules: 1) Choose busy stalls with locals eating there 2) Look for vendors who handle food and money separately 3) Make sure meat is thoroughly cooked 4) Avoid raw vegetables if you're very concerned 5) Carry probiotics just in case. The street food was actually often fresher than restaurant food because of the high turnover!",
                author: users[3]._id,
                likes: getRandomLikes(users[3]._id, 19),
                createdAt: daysAgo(18)
              }
            ],
            createdAt: daysAgo(19)
          },
          {
            content: "I'm heading to Vietnam next month! Between Hanoi and Ho Chi Minh City, which would you recommend for a food lover if you could only visit one?",
            author: users[1]._id,
            likes: getRandomLikes(users[1]._id, 7),
            replies: [
              {
                content: "Tough choice! For pure food experience, I'd slightly favor Hanoi. The Old Quarter is a food lover's dream with specialties on every corner - each street traditionally specialized in one dish. The city feels more 'authentically Vietnamese' with its French colonial influence still visible. That said, HCMC has more international options and incredible Chinese-Vietnamese fusion. If possible, try to include Hoi An in your itinerary - it might be my favorite food city in Vietnam!",
                author: users[3]._id,
                likes: getRandomLikes(users[3]._id, 10),
                createdAt: daysAgo(17)
              }
            ],
            createdAt: daysAgo(18)
          }
        ],
        tags: ["vietnam", "food", "streetfood", "culinarytravel", "pho", "hanoi", "hochiminh", "hoian"],
        isPublished: true,
        views: 5128,
        createdAt: daysAgo(20),
        shares: getRandomShares(users[3]._id, 22)
      },
      {
        title: "Safari in Tanzania: Witnessing the Great Migration",
        content: 
          "I've just returned from what can only be described as the most awe-inspiring wildlife experience of my life: witnessing the Great Migration in Tanzania's Serengeti National Park.\n\nFor those unfamiliar, the Great Migration is one of nature's most spectacular events, where over 1.5 million wildebeest and hundreds of thousands of zebras and gazelles move in a continuous circuit between Tanzania's Serengeti and Kenya's Maasai Mara in search of fresh grazing and water.\n\nOur journey began in Arusha, where we met our guide Immanuel, whose incredible knowledge and eagle eyes made our safari experience truly exceptional. We then embarked on a 10-day safari circuit including:\n\n🦁 Tarangire National Park - Famous for its elephant populations and baobab trees\n🦏 Ngorongoro Crater - An extinct volcanic caldera teeming with wildlife\n🦓 Central Serengeti - The heart of the park with abundant predators\n🦬 Northern Serengeti/Mara River - Where we witnessed the river crossings\n\nThe highlight was undoubtedly watching thousands of wildebeest gather nervously at the Mara River before suddenly plunging into the crocodile-infested waters. The chaos, courage, and sheer determination of these animals was humbling to witness.\n\nBeyond the migration itself, our wildlife sightings exceeded all expectations:\n• A cheetah teaching her cubs to hunt\n• A pride of 16 lions with cubs lounging on a kopje (rock formation)\n• A leopard dragging an impala up a tree\n• Black rhinos in Ngorongoro Crater (incredibly rare!)\n• A massive python swallowing a Thompson's gazelle\n\nPractical safari tips:\n1. Visit during July-October for migration river crossings in the Northern Serengeti\n2. Splurge on a quality safari operator with experienced guides\n3. Bring a good camera with zoom lens (300mm minimum)\n4. Pack neutral-colored clothing (avoid blue which attracts tsetse flies)\n5. Be patient and prepare for early mornings\n\nWhile not an inexpensive adventure (our mid-range safari cost about $4,500 per person excluding international flights), witnessing the raw circle of life unfold on the African savanna was absolutely priceless.\n\nHave you experienced an African safari? I'd love to hear your stories! 🦁🦓🐘 #Serengeti #GreatMigration #Tanzania #Safari #Wildlife #Africa #BucketList",
        coverImage: "https://images.unsplash.com/photo-1547970810-dc1eac37d174",
        author: users[4]._id,
        destination: destinations.find(d => d.name === "Dodoma, Tanzania")?._id || destinations[0]._id,
        gallery: [
          "https://images.unsplash.com/photo-1516426122078-c23e76319801",
          "https://images.unsplash.com/photo-1535941339077-2dd1c7963098",
        ],
        likes: getRandomLikes(users[4]._id, 312),
        comments: [
          {
            content: "Your photos are absolutely breathtaking! How many days would you recommend for a first-time safari if we can't do the full 10 days?",
            author: users[2]._id,
            likes: getRandomLikes(users[2]._id, 16),
            replies: [
              {
                content: "Thank you! If you're short on time, I'd recommend a minimum of 5-6 days. This would allow you to visit Tarangire, Ngorongoro Crater, and at least part of the Serengeti. The key is minimizing travel days between parks as the roads can be rough. If you're specifically interested in the migration river crossings, you'll need to allocate more time to reach the northern Serengeti, which is quite far from the entrance. Even a shorter safari is absolutely worth it though!",
                author: users[4]._id,
                likes: getRandomLikes(users[4]._id, 11),
                createdAt: daysAgo(13)
              }
            ],
            createdAt: daysAgo(14)
          },
          {
            content: "We're debating between Tanzania and Kenya for our first safari. What made you choose Tanzania over Kenya for the migration?",
            author: users[0]._id,
            likes: getRandomLikes(users[0]._id, 8),
            replies: [
              {
                content: "Both are amazing choices with slightly different advantages! I chose Tanzania because: 1) The Serengeti is larger and less crowded than the Maasai Mara 2) The migration spends more time in Tanzania (about 9 months vs 3 in Kenya) 3) The diversity of parks - Ngorongoro Crater and Tarangire offer very different ecosystems and wildlife viewing. Kenya has excellent parks too and can be slightly less expensive. The migration crosses back and forth across the border, so timing matters more than country. Many people do a combined Kenya/Tanzania safari to experience both!",
                author: users[4]._id,
                likes: getRandomLikes(users[4]._id, 13),
                createdAt: daysAgo(12)
              }
            ],
            createdAt: daysAgo(13)
          }
        ],
        tags: ["africa", "safari", "tanzania", "serengeti", "wildlife", "migration", "photography", "adventure"],
        isPublished: true,
        views: 6347,
        createdAt: daysAgo(15),
        shares: getRandomShares(users[4]._id, 25)
      },
      {
        title: "New Zealand's South Island: An Adventure Lover's Paradise",
        content: 
          "Two weeks exploring New Zealand's South Island left me breathless at every turn. From towering mountains to pristine lakes, this is Middle-earth come to life!\n\nMust-do adventures:\n• Heli-hiking on Franz Josef Glacier\n• Milford Sound overnight cruise (waterfalls everywhere!)\n• Bungee jumping in Queenstown (the birthplace of the sport)\n• Hiking the Hooker Valley Track with views of Aoraki/Mt. Cook\n• Stargazing at Lake Tekapo's Dark Sky Reserve\n\nThe scenery constantly changes as you drive - one moment you're in a rainforest, the next in a golden prairie with snow-capped peaks in the distance.\n\nTravel tip: Rent a campervan for ultimate flexibility, but book DOC campsites in advance during peak season. The freedom to wake up lakeside is unbeatable!\n\nWho else has fallen in love with NZ? What was your favorite spot? 🇳🇿 #NewZealand #SouthIsland #AdventureTravel #LordOfTheRings",
        coverImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
        author: users[5]._id,
        destination: destinations.find(d => d.name === "South Island, New Zealand")?._id || destinations[0]._id,
        gallery: [
          "https://images.unsplash.com/photo-1578932750355-5eb30ece487a",
        ],
        likes: getRandomLikes(users[5]._id, 187),
        comments: [
          {
            content: "Your glacier photos are incredible! Was the heli-hike worth the cost?",
            author: users[1]._id,
            likes: getRandomLikes(users[1]._id, 9),
            replies: [
              {
                content: "100% worth it! The helicopter ride alone with views of the glacier was spectacular, and walking on the ice with crampons was surreal. Our guide even carved an ice cave for us to crawl through!",
                author: users[5]._id,
                likes: getRandomLikes(users[5]._id, 12),
                createdAt: daysAgo(8)
              }
            ],
            createdAt: daysAgo(9)
          }
        ],
        tags: ["newzealand", "adventure", "hiking", "glacier", "roadtrip", "nature"],
        isPublished: true,
        views: 2987,
        createdAt: daysAgo(10),
        shares: getRandomShares(users[5]._id, 14)
      },
      {
        title: "Morocco: A Sensory Overload in the Best Way",
        content: 
          "From the bustling souks of Marrakech to the quiet Sahara dunes, Morocco dazzled all my senses for two incredible weeks.\n\nUnforgettable experiences:\n• Getting lost in the maze-like medina of Fes\n• Camel trekking to a luxury desert camp in Merzouga\n• Hiking through the dramatic Todgha Gorge\n• Bargaining for spices and rugs in Marrakech's souks\n• Staying in breathtaking riads with hidden courtyards\n\nThe food was a highlight - tagines cooked for hours, fresh orange juice for 10 cents, and mint tea poured from dramatic heights.\n\nCultural tip: Learn a few Arabic/French phrases, dress modestly, and be prepared for persistent (but good-natured) sales pitches in the markets.\n\nHas Morocco captured your heart too? Share your stories below! 🇲🇦 #Morocco #Sahara #Marrakech #TravelAfrica",
        coverImage: "https://media.istockphoto.com/id/1186702515/photo/panoramic-sunset-view-of-marrakech-and-old-medina-morocco.jpg?s=612x612&w=0&k=20&c=-M-1Xff7f9LIu7GOFFgAC6SO-SRG_cVjBIXG0iLYrKU=",
        author: users[0]._id,
        destination: destinations.find(d => d.name === "Marrakech, Morocco")?._id || destinations[0]._id,
        gallery: [
          "https://cdn.pixabay.com/photo/2022/08/19/09/35/handcraft-7396510_640.jpg",
          "https://cdn.shortpixel.ai/spai/q_lossless+w_1082+to_webp+ret_img/www.charlotteplansatrip.com/wp-content/uploads/2018/07/marocco-streets-of-marrakesh.jpg"
        ],
        likes: getRandomLikes(users[0]._id, 156),
        comments: [
          {
            content: "Which desert camp did you stay at? Looking for recommendations!",
            author: users[3]._id,
            likes: getRandomLikes(users[3]._id, 7),
            replies: [
              {
                content: "We stayed at Luxury Desert Camp Merzouga - absolutely stunning with private bathrooms in each tent! The camel ride at sunset and sunrise was magical, and the staff sang traditional music around the fire at night.",
                author: users[0]._id,
                likes: getRandomLikes(users[0]._id, 9),
                createdAt: daysAgo(12)
              }
            ],
            createdAt: daysAgo(13)
          }
        ],
        tags: ["morocco", "desert", "sahara", "culture", "markets", "architecture"],
        isPublished: true,
        views: 2678,
        createdAt: daysAgo(14),
        shares: getRandomShares(users[0]._id, 11)
      },
      {
        title: "Patagonia: Hiking at the End of the World",
        content: 
          "Three weeks trekking through Chilean and Argentine Patagonia tested my limits and rewarded me with some of the most spectacular landscapes on Earth.\n\nHighlights:\n• The W Trek in Torres del Paine (book refugios early!)\n• Perito Moreno Glacier calving in Argentina\n• The otherworldly marble caves of General Carrera Lake\n• Seeing condors soar in Fitz Roy\n• The remote beauty of Tierra del Fuego\n\nThe weather is extreme and unpredictable - we experienced all four seasons in one day on the hikes. But when the clouds part and those granite spires appear, it's pure magic.\n\nPro tip: Pack lightweight but warm layers, waterproof everything, and break in your boots thoroughly before going.\n\nWho else has braved the Patagonian winds? Share your stories below! 🇨🇱🇦🇷 #Patagonia #Hiking #AdventureTravel #TorresDelPaine",
        coverImage: "https://argentinapura.com/wp-content/uploads/2024/04/El-Chalten-Santa-Cruz-1.webp",
        author: users[2]._id,
        destination: destinations.find(d => d.name === "Patagonia, Chile")?._id || destinations[0]._id,
        gallery: [
          "https://www.wildernesstravel.com/wp-content/uploads/2023/09/patagonia-argentina-south-america-andes-sunset-THUMB-scaled.jpg",
          "https://images.squarespace-cdn.com/content/v1/6137f1eafdd46630c1744367/118c6bda-87ce-422c-95eb-1c8085e160f4/DSC00486-2.jpg"
        ],
        likes: getRandomLikes(users[2]._id, 201),
        comments: [
          {
            content: "How difficult was the W Trek? I'm considering it but not an expert hiker.",
            author: users[4]._id,
            likes: getRandomLikes(users[4]._id, 8),
            replies: [
              {
                content: "It's manageable for moderately fit beginners! The trails are well-marked and the refugios mean you don't need to carry camping gear. Longest day is about 12 miles but relatively flat. Just prepare for changeable weather - we got snow in January (summer)!",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 11),
                createdAt: daysAgo(17)
              }
            ],
            createdAt: daysAgo(18)
          }
        ],
        tags: ["patagonia", "hiking", "mountains", "glacier", "adventure", "nature"],
        isPublished: true,
        views: 3124,
        createdAt: daysAgo(19),
        shares: getRandomShares(users[2]._id, 16)
      },
      {
        title: "Portugal's Hidden Treasures: Beyond Lisbon and Porto",
        content: 
          "While Lisbon's hills and Porto's riverfront are stunning, Portugal's real magic lies in its lesser-known regions. After a month exploring, here are my favorites:\n\n• The fairytale palaces of Sintra (Pena Palace is straight from Disney)\n• The dramatic cliffs and secluded beaches of the Algarve's west coast\n• The medieval walls and university vibe of Coimbra\n• The Douro Valley's terraced vineyards (stay at a wine quinta!)\n• The untouched beauty of the Azores islands\n\nFood highlights: Pastel de nata (custard tarts) fresh from the oven, grilled sardines, francesinha sandwiches in Porto, and the best seafood of my life in Algarve fishing villages.\n\nInsider tip: Rent a car to explore at your own pace - Portugal is small but packed with diversity. The toll roads are excellent but expensive.\n\nWhat's your favorite hidden gem in Portugal? Share below! 🇵🇹 #Portugal #HiddenGems #TravelEurope",
        coverImage: "https://www.originaltravel.co.uk/img/EN/mag/886.jpg",
        author: users[1]._id,
        destination: destinations.find(d => d.name === "Lisbon, Portugal")?._id || destinations[0]._id,
        gallery: [
          "https://cdn.kimkim.com/files/a/images/877940395b27e9b0d4cdc0d07f15c28008e49129/big-fa3fdaea9c7c59a8bc94ebae40b4f121.jpg",
        ],
        likes: getRandomLikes(users[1]._id, 178),
        comments: [
          {
            content: "How many days would you recommend for the Azores? Trying to decide between islands!",
            author: users[3]._id,
            likes: getRandomLikes(users[3]._id, 6),
            replies: [
              {
                content: "I spent 5 days on São Miguel (the main island) which was perfect for hot springs, crater lakes and whale watching. If you have 10+ days, add Pico for hiking and Faial for the blue hydrangeas. The inter-island flights are cheap but weather-dependent!",
                author: users[1]._id,
                likes: getRandomLikes(users[1]._id, 8),
                createdAt: daysAgo(21)
              }
            ],
            createdAt: daysAgo(22)
          }
        ],
        tags: ["portugal", "europe", "beaches", "wine", "architecture", "hidden gems"],
        isPublished: true,
        views: 2876,
        createdAt: daysAgo(23),
        shares: getRandomShares(users[1]._id, 13)
      },
      {
        title: "Canadian Rockies: A Photographer's Winter Wonderland",
        content: 
          "Two weeks photographing the Canadian Rockies in winter was like stepping into a snow globe. The frozen lakes, snow-capped peaks, and occasional wildlife made every sunrise worth braving the -20°C temps.\n\nBest spots:\n• Lake Louise's frozen surface with the Victoria Glacier backdrop\n• Moraine Lake road (accessible via snowshoe in winter)\n• The ice bubbles in Abraham Lake\n• Johnston Canyon's frozen waterfalls\n• The Northern Lights over Banff\n\nGear tip: Keep camera batteries in inner pockets - they drain shockingly fast in the cold. Hand warmers are essential!\n\nWho else has experienced the Rockies in winter? Share your favorite spots below! ❄️🇨🇦 #CanadianRockies #WinterPhotography #Banff #TravelCanada",
        coverImage: "https://wildlandtrekking.com/content/uploads/2020/03/image1-33.jpg",
        author: users[4]._id,
        destination: destinations.find(d => d.name === "Banff, Canada")?._id || destinations[0]._id,
        gallery: [
          "https://adventures.com/media/4295/canadian-rockies-peyto-lake-tour.jpg",
          "https://www.amtrakvacations.com/sites/amtrak/files/styles/hero/public/images/rocky-mountains1.jpg?h=5a5fc591&itok=oq77Yu1w",
          "https://itinerary.expert/wp-content/uploads/2024/09/canadian-rockies-1.jpg",
          "https://www.tauck.com/-/media/Tauck/Collection/Hero-Images/Collection_CanadianRockies_banner.jpg",
        ],
        likes: getRandomLikes(users[4]._id, 198),
        comments: [
          {
            content: "What month did you visit? Trying to time it for both frozen lakes and auroras!",
            author: users[2]._id,
            likes: getRandomLikes(users[2]._id, 7),
            replies: [
              {
                content: "Late January was perfect! Lakes fully frozen but days starting to get longer. Saw auroras 3 nights out of 10. February would work too - just avoid full moon if you want to photograph northern lights.",
                author: users[4]._id,
                likes: getRandomLikes(users[4]._id, 10),
                createdAt: daysAgo(25)
              }
            ],
            createdAt: daysAgo(26)
          }
        ],
        tags: ["canada", "winter", "rockies", "photography", "nature", "snow"],
        isPublished: true,
        views: 3245,
        createdAt: daysAgo(27),
        shares: getRandomShares(users[4]._id, 15)
      },
      {
        title: "Sri Lanka: Teardrop of the Indian Ocean",
        content: 
          "This small island nation packs an incredible punch - ancient cities, tea plantations, wildlife safaris, and pristine beaches all within a few hours of each other.\n\nMy 2-week itinerary highlights:\n• Climbing Sigiriya Rock Fortress at sunrise\n• Safari in Yala National Park (leopards!)\n• Train ride through tea country (sit on the right side!)\n• Exploring the temples of Anuradhapura\n• Beach hopping along the south coast\n\nThe food was a revelation - hoppers (bowl-shaped pancakes), fiery curries, and the best fruit I've ever tasted. Don't miss the cinnamon plantations!\n\nTravel tip: Hire drivers between cities (very affordable) and take the famous trains for shorter scenic routes.\n\nHas Sri Lanka stolen your heart too? Share your experiences below! 🇱🇰 #SriLanka #TravelAsia #TeaCountry #Beaches",
        coverImage: "https://cdn.getyourguide.com/img/tour/e95e6c309a101d7f7cd77315cc3b14576cb9b97d3330e5df69ac2617322bde47.jpg/146.jpg",
        author: users[3]._id,
        destination: destinations.find(d => d.name === "Colombo, Sri Lanka")?._id || destinations[0]._id,
        gallery: [
          "https://i.natgeofe.com/n/6433f87f-9bc2-4ef6-861c-674c61d3d027/srilankacover.jpg",
          "https://a0.muscache.com/im/pictures/INTERNAL/INTERNAL-ImageByPlaceId-ChIJnR5a9jxZ4joRjNPiALSkPeE-large_background/original/e432a186-1516-480d-bbac-e596c8f74eba.jpeg",
        ],
        likes: getRandomLikes(users[3]._id, 167),
        comments: [
          {
            content: "How was the weather during your visit? Trying to avoid monsoon season!",
            author: users[0]._id,
            likes: getRandomLikes(users[0]._id, 5),
            replies: [
              {
                content: "I went in February - perfect weather on west/south coasts and cultural triangle. East coast was starting to get rainy. Generally December-March is best for west/south, April-September better for east coast!",
                author: users[3]._id,
                likes: getRandomLikes(users[3]._id, 7),
                createdAt: daysAgo(29)
              }
            ],
            createdAt: daysAgo(30)
          }
        ],
        tags: ["srilanka", "asia", "beaches", "wildlife", "culture", "tea"],
        isPublished: true,
        views: 2765,
        createdAt: daysAgo(31),
        shares: getRandomShares(users[3]._id, 12)
      },
      {
        title: "Antarctica: The White Continent",
        content: 
          "My expedition to Antarctica was the adventure of a lifetime. This pristine wilderness of icebergs, penguins, and dramatic landscapes exceeded all expectations.\n\nUnforgettable moments:\n• Kayaking among icebergs that glowed blue\n• Visiting a colony of 100,000 Adélie penguins\n• The Drake Passage crossing (both ways were 'Drake Lake' luckily!)\n• Camping overnight on the ice\n• The complete silence broken only by calving glaciers\n\nWildlife highlights: Humpback whales bubble-net feeding, orcas hunting, and penguins curiously approaching our group.\n\nBooking tip: Look for last-minute deals from Ushuaia if your schedule is flexible - we saved 40% by booking 3 weeks out!\n\nHas Antarctica been on your bucket list? What questions do you have? 🇦🇶 #Antarctica #BucketList #Penguins #ExpeditionCruise",
        coverImage: "https://www.swoop-antarctica.com/blog/wp-content/uploads/2024/02/Peninsula.jpg",
        author: users[5]._id,
        destination: destinations.find(d => d.name === "Antarctica")?._id || destinations[0]._id,
        gallery: [
          "https://aex-web.imgix.net/getContentAsset/80d388a4-0e52-4801-b582-20f4dd7d00b4/8e265d97-ee24-47b6-a823-0d8b4ca7c908/Group-of-Kayakers-on-calm-waters-Antarctica-Lina-Stock-@-Divergent-Travelers-scaled.jpg?auto=format&w=3024&w={width}",
          "https://climate.nasa.gov/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd2xpQWc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--458c731902375ac1b127ef1c6c2a749a8187317e/1-antarctic%20calving%20cropped.jpeg"
        ],
        likes: getRandomLikes(users[5]._id, 289),
        comments: [
          {
            content: "Which expedition company did you use? There are so many options!",
            author: users[1]._id,
            likes: getRandomLikes(users[1]._id, 9),
            replies: [
              {
                content: "We went with Quark Expeditions on the Ocean Diamond - excellent guides and small enough to do more landings. Highly recommend choosing a ship with <200 passengers for maximum time ashore!",
                author: users[5]._id,
                likes: getRandomLikes(users[5]._id, 12),
                createdAt: daysAgo(33)
              }
            ],
            createdAt: daysAgo(34)
          }
        ],
        tags: ["antarctica", "wildlife", "penguins", "expedition", "icebergs", "bucketlist"],
        isPublished: true,
        views: 4987,
        createdAt: daysAgo(35),
        shares: getRandomShares(users[5]._id, 21)
      },
      {
        title: "Turkey: Where East Meets West",
        content: 
          "Two weeks traveling from Istanbul to Cappadocia revealed Turkey's incredible diversity - both culturally and geographically.\n\nHighlights:\n• Hot air ballooning over Cappadocia's fairy chimneys at sunrise\n• Exploring the underground cities carved into soft rock\n• The ancient ruins of Ephesus (library of Celsus took my breath away)\n• Istanbul's Hagia Sophia and Blue Mosque\n• Relaxing in Pamukkale's thermal pools\n\nThe food was incredible - from street simit (sesame bread rings) to elaborate Ottoman feasts. Don't miss a traditional Turkish breakfast spread!\n\nCultural tip: Visit mosques outside prayer times, dress modestly, and carry a headscarf for women.\n\nWhat's your favorite Turkish experience? Share below! 🇹🇷 #Turkey #Cappadocia #Istanbul #Travel",
        coverImage: "https://media.worldnomads.com/Explore/middle-east/hagia-sophia-church-istanbul-turkey-gettyimages-skaman306.jpg",
        author: users[0]._id,
        destination: destinations.find(d => d.name === "Istanbul, Turkey")?._id || destinations[0]._id,
        gallery: [
          "https://ptimages.s3.eu-west-2.amazonaws.com/img/media_photos/country_of_turkey-jpg.webp",
        ],
        likes: getRandomLikes(users[0]._id, 176),
        comments: [
          {
            content: "How many days would you recommend for Cappadocia? Trying to decide between 2-3!",
            author: users[2]._id,
            likes: getRandomLikes(users[2]._id, 6),
            replies: [
              {
                content: "Definitely 3 if possible! One day for balloon flight and Göreme sights, one for underground cities and valleys, and one as buffer for weather (balloons fly about 60% of mornings). The sunset views from Red Valley are not to be missed!",
                author: users[0]._id,
                likes: getRandomLikes(users[0]._id, 8),
                createdAt: daysAgo(37)
              }
            ],
            createdAt: daysAgo(38)
          }
        ],
        tags: ["turkey", "cappadocia", "istanbul", "history", "culture", "hotairballoon"],
        isPublished: true,
        views: 2987,
        createdAt: daysAgo(39),
        shares: getRandomShares(users[0]._id, 14)
      },
      {
        title: "Peru: More Than Just Machu Picchu",
        content: 
          "While Machu Picchu was breathtaking, Peru surprised me with its incredible diversity beyond the famous ruins.\n\nHighlights:\n• Rainbow Mountain's striped colors (hike early to avoid crowds)\n• The Amazon rainforest around Iquitos (pink dolphins!)\n• Colonial architecture and food scene in Lima\n• The mysterious Nazca Lines flight\n• Lake Titicaca's floating Uros Islands\n\nThe food was a revelation - ceviche, lomo saltado, and countless varieties of potatoes. Peruvian chefs are putting this cuisine on the world map!\n\nTravel tip: Acclimate slowly to altitude - I spent 2 days in Cusco before any hiking. Coca tea helps!\n\nWhat's your favorite Peruvian experience? Share below! 🇵🇪 #Peru #MachuPicchu #Amazon #TravelSouthAmerica",
        coverImage: "https://www.peru.travel/Contenido/AcercaDePeru/Imagen/en/6/0.0/Principal/Machu%20Picchu.jpg",
        author: users[1]._id,
        destination: destinations.find(d => d.name === "Cusco, Peru")?._id || destinations[0]._id,
        gallery: [
          "https://carter.eu/wp-content/uploads/2024/02/The-Inka-Trail-Peru-najpiekniejsze-miejsca-wycieczki-do-peru-luksusowe-wakacje-w-peru-1024x682.png",
        ],
        likes: getRandomLikes(users[1]._id, 203),
        comments: [
          {
            content: "Which Inca Trail route did you take? Trying to decide between options!",
            author: users[4]._id,
            likes: getRandomLikes(users[4]._id, 7),
            replies: [
              {
                content: "We did the classic 4-day Inca Trail which was perfect - challenging but doable, with amazing ruins along the way. Book 6+ months in advance! The Salkantay Trek is great alternative if permits are sold out.",
                author: users[1]._id,
                likes: getRandomLikes(users[1]._id, 9),
                createdAt: daysAgo(41)
              }
            ],
            createdAt: daysAgo(42)
          }
        ],
        tags: ["peru", "machupicchu", "incatrail", "amazon", "hiking", "food"],
        isPublished: true,
        views: 3456,
        createdAt: daysAgo(43),
        shares: getRandomShares(users[1]._id, 17)
      },
      {
        title: "Scotland: Castles, Highlands & Whisky",
        content: 
          "Two weeks driving through Scotland revealed misty glens, dramatic castles, and the warmest hospitality. This country exceeded all my expectations!\n\nHighlights:\n• Edinburgh's Royal Mile and Arthur's Seat views\n• Isle of Skye's Fairy Pools and Old Man of Storr\n• Whisky tasting along the Speyside trail\n• The haunting beauty of Glencoe\n• Searching for Nessie at Loch Ness\n\nThe weather lived up to its reputation - we experienced all four seasons in one day! But when the sun breaks through over those green hills, it's pure magic.\n\nRoad trip tip: Single-track roads require patience - use passing places and embrace the slow pace. The scenery deserves your full attention anyway!\n\nWhat's your favorite Scottish memory? Share below! 🏴 #Scotland #Highlands #Whisky #Castles",
        coverImage: "https://www.visitscotland.com/binaries/content/gallery/visitscotland/cms-images/2024/06/04/dunrobin-castle--gardens-header.jpg",
        author: users[2]._id,
        destination: destinations.find(d => d.name === "Edinburgh, Scotland")?._id || destinations[0]._id,
        gallery: [
          "https://www.toeuropeandbeyond.com/wp-content/uploads/2017/01/P8173536-1.jpg",
          "https://www.getours.com/media/c4wnaqfd/country-roads-of-scotland.jpg?width=1280&height=854&v=1da5522613eb700",
        ],
        likes: getRandomLikes(users[2]._id, 189),
        comments: [
          {
            content: "How many days would you recommend for Isle of Skye? Trying to plan our itinerary!",
            author: users[3]._id,
            likes: getRandomLikes(users[3]._id, 6),
            replies: [
              {
                content: "Minimum 3 days to see properly! One for Fairy Glen/Quiraing, one for Neist Point/Dunvegan Castle, and one for the southern peninsula (Talisker distillery is there too). The light is magical in early morning/late evening when day-trippers are gone!",
                author: users[2]._id,
                likes: getRandomLikes(users[2]._id, 8),
                createdAt: daysAgo(45)
              }
            ],
            createdAt: daysAgo(46)
          }
        ],
        tags: ["scotland", "highlands", "whisky", "castles", "roadtrip", "nature"],
        isPublished: true,
        views: 3123,
        createdAt: daysAgo(47),
        shares: getRandomShares(users[2]._id, 15)
      }
    ];

    await Post.insertMany(posts);
    console.log("Posts seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding posts:", error);
    process.exit(1);
  }
};

seedPosts();
