import { Destination } from "@/types";

export const destinations: Destination[] = [
  {
    id: 1,
    name: "Bali, Indonesia",
    location: "Bali, Indonesia",
    description:
      "A tropical paradise known for its stunning beaches, vibrant culture, and lush landscapes.",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QmFsaSUyQyUyMEluZG9uZXNpYXxlbnwwfHwwfHx8MA%3D%3D",
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
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEt5b3RvJTJDJTIwSmFwYW58ZW58MHx8MHx8fDA%3D",
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
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2FudG9yaW5pJTJDJTIwR3JlZWNlfGVufDB8fDB8fHww",
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
    image:
      "https://images.unsplash.com/photo-1519121785383-3229633bb75b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TmV3JTIwWW9yayUyMENpdHklMkMlMjBVU0F8ZW58MHx8MHx8fDA%3D",
    rating: 4.6,
    tags: ["city", "culture", "food"],
    coordinates: [-74.006, 40.7128],
  },
  {
    id: 5,
    name: "Pyramids of Giza, Egypt",
    location: "Giza, Egypt",
    description:
      "One of the Seven Wonders of the Ancient World, the Pyramids of Giza are a testament to Egypt’s rich history and architectural brilliance. Visitors can explore the Great Pyramid, the Sphinx, and ancient tombs while experiencing the mystique of ancient Egypt.",
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHB5cmFtaWRzfGVufDB8fDB8fHww",
    rating: 4.8,
    tags: ["history", "architecture", "wonder"],
    coordinates: [31.1342, 29.9792],
  },
];

export default destinations;
