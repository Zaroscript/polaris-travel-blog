
export interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
    role?: string;
  };
  text: string;
  date: string;
  likes: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  category: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  featured?: boolean;
  readTime?: string;
}

export interface Destination {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  tags: string[];
}

// Blog posts data
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Must-Visit Hidden Gems in Southeast Asia",
    excerpt: "Discover untouched paradises and authentic cultural experiences off the beaten path in Southeast Asia.",
    content: "Southeast Asia has long been a favorite for travelers seeking exotic experiences, beautiful beaches, and rich cultural heritage. While destinations like Bali, Bangkok, and Phuket receive millions of visitors annually, there are still many hidden gems waiting to be explored...",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    date: "2023-08-15",
    author: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "Travel Writer"
    },
    category: "Adventure",
    tags: ["southeast asia", "off the beaten path", "hidden gems", "backpacking"],
    likes: 243,
    comments: [
      {
        id: 1,
        user: {
          name: "Mike Robinson",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg"
        },
        text: "I visited Koh Rong in Cambodia last year and it was absolutely magical. Great recommendations!",
        date: "2023-08-16",
        likes: 12
      },
      {
        id: 2,
        user: {
          name: "Elena Gilbert",
          avatar: "https://randomuser.me/api/portraits/women/3.jpg"
        },
        text: "Adding these to my bucket list! Thanks for sharing these lesser-known places.",
        date: "2023-08-17",
        likes: 8
      }
    ],
    featured: true,
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Budget Travel Guide: Europe on $50 a Day",
    excerpt: "How to experience the best of Europe without breaking the bank. Tips, tricks, and destinations for budget travelers.",
    content: "Traveling through Europe on a budget might seem like an impossible dream, but with careful planning and insider knowledge, it's entirely achievable...",
    image: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    date: "2023-07-28",
    author: {
      name: "David Chen",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      role: "Budget Travel Expert"
    },
    category: "Budget Travel",
    tags: ["europe", "budget travel", "backpacking", "travel tips"],
    likes: 187,
    comments: [
      {
        id: 1,
        user: {
          name: "Hannah Baker",
          avatar: "https://randomuser.me/api/portraits/women/5.jpg"
        },
        text: "I used these tips during my trip to Eastern Europe and saved so much money! Hostels in Poland are especially affordable.",
        date: "2023-07-29",
        likes: 10
      }
    ],
    featured: true,
    readTime: "10 min read"
  },
  {
    id: 3,
    title: "Solo Female Traveler: Safety Tips and Inspiring Destinations",
    excerpt: "Empowering advice for women traveling alone, from safety considerations to destinations where solo female travelers thrive.",
    content: "Traveling solo as a woman can be one of the most empowering experiences. It offers unparalleled freedom, self-discovery, and the opportunity to connect with people from around the world on your own terms...",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    date: "2023-07-14",
    author: {
      name: "Maya Patel",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      role: "Solo Travel Blogger"
    },
    category: "Solo Travel",
    tags: ["solo female travel", "safety tips", "empowerment", "travel destinations"],
    likes: 315,
    comments: [
      {
        id: 1,
        user: {
          name: "Jessica Alba",
          avatar: "https://randomuser.me/api/portraits/women/7.jpg"
        },
        text: "Thank you for this empowering article! I'm planning my first solo trip to Portugal.",
        date: "2023-07-15",
        likes: 15
      },
      {
        id: 2,
        user: {
          name: "Linda Park",
          avatar: "https://randomuser.me/api/portraits/women/8.jpg"
        },
        text: "I've traveled solo to Japan and found it incredibly safe and welcoming. Would highly recommend!",
        date: "2023-07-16",
        likes: 12
      }
    ],
    featured: true,
    readTime: "12 min read"
  },
  {
    id: 4,
    title: "Digital Nomad Life: One Year Working from Tropical Destinations",
    excerpt: "My journey as a digital nomad, including the best destinations for remote work, productivity tips, and lessons learned.",
    content: "One year ago, I took the plunge and embraced the digital nomad lifestyle. With just a laptop and a carry-on suitcase, I set off to work remotely while exploring some of the world's most beautiful tropical destinations...",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    date: "2023-06-30",
    author: {
      name: "Jason Miller",
      avatar: "https://randomuser.me/api/portraits/men/9.jpg",
      role: "Digital Nomad"
    },
    category: "Digital Nomad",
    tags: ["digital nomad", "remote work", "tropical destinations", "lifestyle"],
    likes: 256,
    comments: [
      {
        id: 1,
        user: {
          name: "Robert Smith",
          avatar: "https://randomuser.me/api/portraits/men/10.jpg"
        },
        text: "I'm starting my digital nomad journey next month in Bali. Any coworking spaces you particularly recommend?",
        date: "2023-07-01",
        likes: 5
      }
    ],
    featured: false,
    readTime: "15 min read"
  },
  {
    id: 5,
    title: "Sustainable Travel: How to Minimize Your Environmental Footprint",
    excerpt: "Practical tips for eco-friendly travel, from reducing plastic use to supporting local conservation efforts.",
    content: "As awareness of climate change and environmental issues grows, many travelers are looking for ways to explore the world while minimizing their impact on the planet...",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    date: "2023-06-22",
    author: {
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
      role: "Environmental Journalist"
    },
    category: "Sustainable Travel",
    tags: ["eco-friendly", "sustainable travel", "conservation", "responsible tourism"],
    likes: 189,
    comments: [
      {
        id: 1,
        user: {
          name: "Thomas Green",
          avatar: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        text: "Great tips! I've started carrying a reusable water bottle and metal straws on all my trips.",
        date: "2023-06-23",
        likes: 9
      }
    ],
    featured: false,
    readTime: "9 min read"
  },
  {
    id: 6,
    title: "Culinary Tourism: Exploring World Cultures Through Food",
    excerpt: "How food tourism offers authentic cultural experiences and what dishes you must try in different countries.",
    content: "For many travelers, experiencing a destination's authentic cuisine is as important as visiting its landmarks. Food is a universal language that offers profound insights into culture, history, and traditions...",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    date: "2023-06-15",
    author: {
      name: "Carlos Rodriguez",
      avatar: "https://randomuser.me/api/portraits/men/13.jpg",
      role: "Food & Travel Writer"
    },
    category: "Food Tourism",
    tags: ["culinary tourism", "food travel", "local cuisine", "foodie"],
    likes: 275,
    comments: [
      {
        id: 1,
        user: {
          name: "Sophie Turner",
          avatar: "https://randomuser.me/api/portraits/women/14.jpg"
        },
        text: "The street food in Thailand completely changed my life! Nothing beats eating where locals eat.",
        date: "2023-06-16",
        likes: 14
      }
    ],
    featured: false,
    readTime: "11 min read"
  }
];

// Destinations data
export const destinations: Destination[] = [
  {
    id: 1,
    name: "Bali, Indonesia",
    location: "Indonesia",
    description:
      "Bali is a living postcard, an Indonesian paradise that feels like a fantasy. Soak up the sun on a stretch of fine white sand, or commune with the tropical creatures as you dive along coral ridges or the colorful wreck of a WWII war ship.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    rating: 4.8,
    tags: ["beach", "culture", "temples", "surfing"],
  },
  {
    id: 2,
    name: "Santorini, Greece",
    location: "Greece",
    description:
      "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns, Fira and Oia, cling to cliffs above an underwater caldera (crater).",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    rating: 4.9,
    tags: ["islands", "beach", "romantic", "views"],
  },
  {
    id: 3,
    name: "Kyoto, Japan",
    location: "Japan",
    description:
      "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    rating: 4.7,
    tags: ["culture", "temples", "history", "gardens"],
  },
  {
    id: 4,
    name: "Machu Picchu, Peru",
    location: "Peru",
    description:
      "Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it's renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar, intriguing buildings that play on astronomical alignments and panoramic views.",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    rating: 4.9,
    tags: ["history", "hiking", "ancient ruins", "mountains"],
  },
  {
    id: 5,
    name: "Marrakech, Morocco",
    location: "Morocco",
    description:
      "Marrakech, a former imperial city in western Morocco, is a major economic center and home to mosques, palaces and gardens. The medina is a densely packed, walled medieval city dating to the Berber Empire, with mazelike alleys where thriving souks (marketplaces) sell traditional textiles, pottery and jewelry.",
    image:
      "https://media.istockphoto.com/id/1294321554/photo/koutoubia-mosque-in-the-morning-marrakesh-morocco.webp?a=1&b=1&s=612x612&w=0&k=20&c=tNk9iwx0_O2f5ZypWlper35biMTDBAbGFbTfXvhrF9w=",
    rating: 4.6,
    tags: ["markets", "culture", "history", "architecture"],
  },
  {
    id: 6,
    name: "Banff National Park, Canada",
    location: "Canada",
    description:
      "Banff National Park is Canada's oldest national park, established in 1885 in the Rocky Mountains. The park, located in Alberta's southwestern corner, encompasses 6,641 square kilometers of mountainous terrain, with numerous glaciers and ice fields, dense coniferous forest, and alpine landscapes.",
    image:
      "https://media.istockphoto.com/id/525508231/photo/moraine-lake-rocky-mountains-canada.webp?a=1&b=1&s=612x612&w=0&k=20&c=u5jFQLGxvwPjQANl4LjwSgxePhOh8MhKvK-PhU2hhxg=",
    rating: 4.8,
    tags: ["nature", "mountains", "wildlife", "hiking"],
  },
  {
    id: 7,
    name: "Amalfi Coast, Italy",
    location: "Italy",
    description:
      "The Amalfi Coast is a stretch of coastline along the southern edge of Italy's Sorrentine Peninsula, in the Campania region. It's a popular holiday destination, with sheer cliffs and a rugged shoreline dotted with small beaches and pastel-colored fishing villages. The coastal road between the port city of Salerno and clifftop Sorrento winds past grand villas, terraced vineyards and cliffside lemon groves.",
    image:
      "https://media.istockphoto.com/id/1949047759/photo/vibrant-colored-umbrellas-and-buildings-along-the-beach-of-amalfi-italy-on-a-sunny-day.webp?a=1&b=1&s=612x612&w=0&k=20&c=2u1EWR_1hAyv1S_rSGk4LJSTERuuEzaQjEWunl5KkiE=",
    rating: 4.7,
    tags: ["coastal", "villages", "scenic drives", "food"],
  },
  {
    id: 8,
    name: "Cape Town, South Africa",
    location: "South Africa",
    description:
      "Cape Town is a port city on South Africa's southwest coast, on a peninsula beneath the imposing Table Mountain. Slowly rotating cable cars climb to the mountain's flat top, from which there are sweeping views of the city, the busy harbor and boats heading for Robben Island, the notorious prison that once held Nelson Mandela, which is now a living museum.",
    image:
      "https://images.unsplash.com/photo-1576485375217-d6a95e34d043?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
    rating: 4.6,
    tags: ["city", "beaches", "mountain", "culture"],
  },
];
