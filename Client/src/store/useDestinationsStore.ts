import { create } from "zustand";
import { Destination, DestinationsState } from "../types/destination";
import { axiosInstance } from "../lib/axios";

export const useDestinationsStore = create<DestinationsState>((set, get) => ({
  destinations: [],
  currentDestination: null,
  loading: false,
  error: null,

  // Fetch all destinations with optional search and filter parameters
  fetchDestinations: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/destinations", { params });
      set({ destinations: response.data.destinations, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch destinations", loading: false });
    }
  },

  // Fetch a single destination by ID
  fetchDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/destinations/${id}`);
      set({ currentDestination: response.data, loading: false });
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
      set((state) => ({
        currentDestination:
          state.currentDestination?._id === destinationId
            ? {
                ...state.currentDestination,
                reviews: [...state.currentDestination.reviews, response.data],
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
