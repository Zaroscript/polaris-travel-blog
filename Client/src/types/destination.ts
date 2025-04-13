export interface Review {
  _id: string;
  author: {
    _id: string;
    fullName: string;
    profilePic: string;
  };
  rating: number;
  content: string;
  createdAt: string;
}

export interface Destination {
  _id: string;
  name: string;
  description: string;
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
    city: string;
    country: string;
  };
  coverImage: {
    url: string;
    caption: string;
  };
  images: Array<{
    url: string;
    caption: string;
  }>;
  rating: number;
  reviews: Review[];
  tags: string[];
  thingsToDo: string[];
  bestTimeToVisit: {
    from: string;
    to: string;
  };
  createdBy: {
    _id: string;
    fullName: string;
    profilePic: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DestinationFilters {
  search?: string;
  address?: string;
  city?: string;
  country?: string;
  tags?: string[];
  rating?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: "rating" | "createdAt" | "name";
  sortOrder?: "asc" | "desc";
  limit?: number;
  page?: number;
}

export interface DestinationsState {
  destinations: Destination[];
  currentDestination: Destination | null;
  loading: boolean;
  error: string | null;
  popularDestinations: Destination[];
  trendingDestinations: Destination[];
  isLoading: boolean;
  fetchDestinations: (params?: DestinationFilters) => Promise<void>;
  fetchPopularDestinations: (limit?: number) => Promise<void>;
  fetchTrendingDestinations: (limit?: number) => Promise<void>;
  fetchDestination: (id: string) => Promise<void>;
  createDestination: (destinationData: Partial<Destination>) => Promise<void>;
  updateDestination: (
    id: string,
    destinationData: Partial<Destination>
  ) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  addReview: (
    destinationId: string,
    reviewData: { rating: number; content: string }
  ) => Promise<void>;
  deleteReview: (destinationId: string, reviewId: string) => Promise<void>;
  getNearbyDestinations: (
    longitude: number,
    latitude: number,
    maxDistance?: number
  ) => Promise<void>;
  searchDestinations: (query: string) => Promise<void>;
  filterDestinations: (filters: DestinationFilters) => Promise<void>;
}
