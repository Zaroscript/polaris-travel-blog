import { Destination } from "@/types";

export const destinations: Destination[] = [
  {
    id: 1,
    name: "Bali, Indonesia",
    location: "Bali, Indonesia",
    description:
      "A tropical paradise known for its stunning beaches, vibrant culture, and lush landscapes.",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    rating: 4.8,
    tags: ["beach", "culture", "adventure"],
    coordinates: [115.1889, -8.4095],
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    location: "Kyoto, Japan",
    description:
      "Famous for its classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines, and traditional wooden houses.",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    rating: 4.9,
    tags: ["culture", "history", "temples"],
    coordinates: [135.7681, 35.0116],
  },
  {
    id: 3,
    name: "Santorini, Greece",
    location: "Santorini, Greece",
    description:
      "Known for its whitewashed buildings with blue domes, stunning sunsets, and beautiful beaches.",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    rating: 4.7,
    tags: ["beach", "romance", "sunset"],
    coordinates: [25.3963, 36.3932],
  },
  {
    id: 4,
    name: "New York City, USA",
    location: "New York City, USA",
    description:
      "The city that never sleeps, known for its iconic skyline, diverse culture, and vibrant arts scene.",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    rating: 4.6,
    tags: ["city", "culture", "food"],
    coordinates: [-74.006, 40.7128],
  },
];

export default destinations;
