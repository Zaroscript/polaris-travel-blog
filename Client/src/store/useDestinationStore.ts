import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  images: string[];
  rating: number;
  reviews: Review[];
  category: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

interface DestinationStore {
  destinations: Destination[];
  currentDestination: Destination | null;
  loading: boolean;
  error: string | null;
  getDestinations: () => Promise<void>;
  getDestination: (destinationId: string) => Promise<void>;
  createDestination: (data: Partial<Destination>) => Promise<void>;
  updateDestination: (
    destinationId: string,
    data: Partial<Destination>
  ) => Promise<void>;
  deleteDestination: (destinationId: string) => Promise<void>;
  addReview: (
    destinationId: string,
    data: { rating: number; content: string; images?: string[] }
  ) => Promise<void>;
  updateReview: (
    destinationId: string,
    reviewId: string,
    data: { rating: number; content: string; images?: string[] }
  ) => Promise<void>;
  deleteReview: (destinationId: string, reviewId: string) => Promise<void>;
}

const useDestinationStore = create<DestinationStore>((set) => ({
  destinations: [],
  currentDestination: null,
  loading: false,
  error: null,

  getDestinations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/destinations");
      set({ destinations: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch destinations";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  getDestination: async (destinationId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/destinations/${destinationId}`);
      set({ currentDestination: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch destination";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  createDestination: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post("/destinations", data);
      set((state) => ({
        destinations: [...state.destinations, response.data],
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create destination";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  updateDestination: async (destinationId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(`/destinations/${destinationId}`, data);
      set((state) => ({
        destinations: state.destinations.map((dest) =>
          dest.id === destinationId ? response.data : dest
        ),
        currentDestination: response.data,
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update destination";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  deleteDestination: async (destinationId) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/destinations/${destinationId}`);
      set((state) => ({
        destinations: state.destinations.filter(
          (dest) => dest.id !== destinationId
        ),
        currentDestination: null,
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete destination";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  addReview: async (destinationId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/destinations/${destinationId}/reviews`,
        data
      );
      set((state) => ({
        destinations: state.destinations.map((dest) =>
          dest.id === destinationId ? response.data : dest
        ),
        currentDestination: response.data,
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to add review";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  updateReview: async (destinationId, reviewId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `/destinations/${destinationId}/reviews/${reviewId}`,
        data
      );
      set((state) => ({
        destinations: state.destinations.map((dest) =>
          dest.id === destinationId ? response.data : dest
        ),
        currentDestination: response.data,
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update review";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  deleteReview: async (destinationId, reviewId) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.delete(
        `/destinations/${destinationId}/reviews/${reviewId}`
      );
      set((state) => ({
        destinations: state.destinations.map((dest) =>
          dest.id === destinationId ? response.data : dest
        ),
        currentDestination: response.data,
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message
        : "Failed to delete review";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },
}));

export default useDestinationStore;
