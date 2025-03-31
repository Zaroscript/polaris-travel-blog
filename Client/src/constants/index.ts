// Navbar items

import { SuggestedConnection } from "@/types/social";

export const navItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/destinations", label: "Destinations" },
  { path: "/blogs", label: "Blogs" },
  { path: "/social", label: "Social" },
];

// Mock data for suggested connections
export const suggestedConnections: SuggestedConnection[] = [
  {
    name: "Amanda Reed",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    role: "Travel Writer",
  },
  {
    name: "Billy Vincent",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    role: "Photographer",
  },
  {
    name: "Carl Ferguson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "Explorer",
  },
  {
    name: "Carolyn Gray",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "Food Blogger",
  },
];

// Mock data for news items
export const newsItems = [
  "The destinations you should visit this summer",
  "Five unforgettable facts about hiking",
  "Best Pinterest boards for traveling while business",
  "Skills that you can learn from the internet",
];
