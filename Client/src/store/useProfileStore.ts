import { create } from "zustand";
import api from "@/lib/api";
import { Profile } from "@/types/social";



interface ProfileStore {
  profile: Profile | null;
  loading: boolean;
  error: string | null;

  getAllUsers: () => Promise<Profile[]>;
  getProfile: (userId?: string) => Promise<Profile | null>;
  getUserFollowing: (userId: string) => Promise<Profile[]>;
  getUserFollowers: (userId: string) => Promise<Profile[]>;
  updateProfile: (data: Partial<Profile>) => Promise<Profile>;
  updateProfileImage: (imageUrl: string) => Promise<Profile>;
  updateCoverImage: (imageUrl: string) => Promise<Profile>;
  toggleFollow: (userId: string) => Promise<void>;
}

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  error: null,

  getAllUsers: async () => {
    const response = await api.get("api/users/all");
    return response.data;
  },

  getProfile: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(
        userId ? `api/users/profile/${userId}` : "api/users/profile"
      );
      set({ profile: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to fetch profile';
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  getUserFollowing: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`api/users/following/${userId}`);
      set({ loading: false });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to fetch user following';
      set({
        error: errorMessage,
        loading: false
      });
      throw new Error(errorMessage);
    }
  },

  getUserFollowers: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`api/users/followers/${userId}`);
      set({ loading: false });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to fetch user followers';
      set({
        error: errorMessage,
        loading: false  
      });
      throw new Error(errorMessage);
    }
  },

  updateProfile: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch("api/users/profile", data);
      set({ profile: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update profile';
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  updateProfileImage: async (imageUrl) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch("api/users/profile/image", {
        profileImage: imageUrl,
      });
      set({ profile: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message
        : "Failed to update profile image";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  updateCoverImage: async (imageUrl) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch("api/users/profile/cover", {
        coverImage: imageUrl,
      });
      set({ profile: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message
        : "Failed to update cover image";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  toggleFollow: async (userId) => {
    try {
      set({ loading: true, error: null });
      await api.post(`api/users/follow/${userId}`);
      // Refresh profile to get updated following/followers lists
      const response = await api.get("api/users/profile");
      set({ profile: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message
        : "Failed to toggle follow";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },


}));

export default useProfileStore;
