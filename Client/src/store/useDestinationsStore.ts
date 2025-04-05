import { create } from "zustand";
import { Destination } from "@/types/destination";
import axios from "axios";

interface DestinationsState {
  destinations: Destination[];
  currentDestination: Destination | null;
  loading: boolean;
  error: string | null;
  fetchDestinations: () => Promise<void>;
  fetchDestination: (id: string) => Promise<void>;
  createDestination: (destinationData: Partial<Destination>) => Promise<void>;
  updateDestination: (
    id: string,
    destinationData: Partial<Destination>
  ) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  searchDestinations: (query: string) => Promise<void>;
  filterDestinations: (filters: Record<string, any>) => Promise<void>;
}

export const useDestinationsStore = create<DestinationsState>((set, get) => ({
  destinations: [],
  currentDestination: null,
  loading: false,
  error: null,

  fetchDestinations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/destinations");
      set({ destinations: response.data.destinations, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch destinations", loading: false });
    }
  },

  fetchDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/destinations/${id}`);
      set({ currentDestination: response.data.destination, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch destination", loading: false });
    }
  },

  createDestination: async (destinationData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/destinations", destinationData);
      set((state) => ({
        destinations: [...state.destinations, response.data.destination],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create destination", loading: false });
    }
  },

  updateDestination: async (id, destinationData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `/api/destinations/${id}`,
        destinationData
      );
      set((state) => ({
        destinations: state.destinations.map((destination) =>
          destination.id === id ? response.data.destination : destination
        ),
        currentDestination:
          state.currentDestination?.id === id
            ? response.data.destination
            : state.currentDestination,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update destination", loading: false });
    }
  },

  deleteDestination: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/destinations/${id}`);
      set((state) => ({
        destinations: state.destinations.filter(
          (destination) => destination.id !== id
        ),
        currentDestination:
          state.currentDestination?.id === id ? null : state.currentDestination,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete destination", loading: false });
    }
  },

  searchDestinations: async (query) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/destinations/search?q=${query}`);
      set({ destinations: response.data.destinations, loading: false });
    } catch (error) {
      set({ error: "Failed to search destinations", loading: false });
    }
  },

  filterDestinations: async (filters) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/destinations/filter", {
        params: filters,
      });
      set({ destinations: response.data.destinations, loading: false });
    } catch (error) {
      set({ error: "Failed to filter destinations", loading: false });
    }
  },
}));
