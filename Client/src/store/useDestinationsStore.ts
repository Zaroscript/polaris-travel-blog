import { create } from "zustand";
import { Destination, DestinationsState } from "../types/destination";
import { axiosInstance } from "../lib/axios";
import { normalizeReviews } from "@/lib/reviewUtils";

export const useDestinationsStore = create<DestinationsState>((set, get) => ({
  destinations: [],
  currentDestination: null,
  loading: false,
  error: null,
  popularDestinations: [],
  trendingDestinations: [],
  isLoading: false,

  // Fetch all destinations with optional search and filter parameters
  fetchDestinations: async (params = {}) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/destinations", { params });
      set({ destinations: response.data.destinations, loading: false, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch destinations", loading: false, isLoading: false });
    }
  },

  // Fetch popular destinations (sorted by rating)
  fetchPopularDestinations: async (limit = 4) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/destinations", { 
        params: { 
          limit, 
          sort: "-rating" 
        } 
      });
      set({ 
        popularDestinations: response.data.destinations, 
        // Also update main destinations if empty
        destinations: get().destinations.length === 0 ? response.data.destinations : get().destinations,
        loading: false,
        isLoading: false 
      });
    } catch (error) {
      set({ error: "Failed to fetch popular destinations", loading: false, isLoading: false });
    }
  },

  // Fetch trending destinations (could be based on recent views, bookmarks, etc.)
  fetchTrendingDestinations: async (limit = 4) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      // This could use different criteria based on your API
      const response = await axiosInstance.get("/destinations", { 
        params: { 
          limit, 
          sort: "-updatedAt" // As an example - newest destinations
        } 
      });
      set({ 
        trendingDestinations: response.data.destinations,
        loading: false,
        isLoading: false 
      });
    } catch (error) {
      set({ error: "Failed to fetch trending destinations", loading: false, isLoading: false });
    }
  },

  // Fetch a single destination by ID
  fetchDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/destinations/${id}`);
      
      // Normalize the reviews data to ensure it has the correct structure
      const destinationData = response.data;
      if (destinationData.reviews) {
        destinationData.reviews = normalizeReviews(destinationData.reviews);
      } else {
        destinationData.reviews = [];
      }
      
      set({ currentDestination: destinationData, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch destination", loading: false });
    }
  },

  // Create a new destination
  createDestination: async (destinationData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        "/destinations",
        destinationData
      );
      set((state) => ({
        destinations: [...state.destinations, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create destination", loading: false });
    }
  },

  // Update an existing destination
  updateDestination: async (id, destinationData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `/destinations/${id}`,
        destinationData
      );
      set((state) => ({
        destinations: state.destinations.map((destination) =>
          destination._id === id ? response.data : destination
        ),
        currentDestination:
          state.currentDestination?._id === id
            ? response.data
            : state.currentDestination,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update destination", loading: false });
    }
  },

  // Delete a destination
  deleteDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/destinations/${id}`);
      set((state) => ({
        destinations: state.destinations.filter(
          (destination) => destination._id !== id
        ),
        currentDestination:
          state.currentDestination?._id === id
            ? null
            : state.currentDestination,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete destination", loading: false });
    }
  },

  // Add a review to a destination
  addReview: async (destinationId, reviewData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/destinations/${destinationId}/reviews`,
        reviewData
      );
      
      // Normalize the new review before adding it to the state
      const normalizedReview = normalizeReviews([response.data])[0];
      
      set((state) => ({
        currentDestination:
          state.currentDestination?._id === destinationId
            ? {
                ...state.currentDestination,
                reviews: [...(state.currentDestination.reviews || []), normalizedReview],
              }
            : state.currentDestination,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add review", loading: false });
    }
  },

  // Delete a review from a destination
  deleteReview: async (destinationId, reviewId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(
        `/destinations/${destinationId}/reviews/${reviewId}`
      );
      set((state) => ({
        currentDestination:
          state.currentDestination?._id === destinationId
            ? {
                ...state.currentDestination,
                reviews: state.currentDestination.reviews.filter(
                  (review) => review._id !== reviewId
                ),
              }
            : state.currentDestination,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete review", loading: false });
    }
  },

  // Get nearby destinations
  getNearbyDestinations: async (longitude, latitude, maxDistance = 10000) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/destinations/nearby", {
        params: { longitude, latitude, maxDistance },
      });
      set({ destinations: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch nearby destinations", loading: false });
    }
  },

  // Search destinations
  searchDestinations: async (query) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/destinations", {
        params: { search: query },
      });
      set({ destinations: response.data.destinations, loading: false });
    } catch (error) {
      set({ error: "Failed to search destinations", loading: false });
    }
  },

  // Filter destinations
  filterDestinations: async (filters) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/destinations", {
        params: filters,
      });
      set({ destinations: response.data.destinations, loading: false });
    } catch (error) {
      set({ error: "Failed to filter destinations", loading: false });
    }
  },
}));
