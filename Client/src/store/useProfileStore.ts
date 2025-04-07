import { create } from "zustand";
import { Profile, Post } from "@/types/social";
import axios from "axios";
import { log } from "console";

interface ProfileState {
  profile: Profile | null;
  posts: Post[];
  followers: Profile[];
  following: Profile[];
  loading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
  fetchFollowers: (userId: string) => Promise<void>;
  fetchFollowing: (userId: string) => Promise<void>;
  updateProfile: (
    userId: string,
    profileData: Partial<Profile>
  ) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  reportUser: (userId: string, reason: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  posts: [],
  followers: [],
  following: [],
  loading: false,
  error: null,

  fetchProfile: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/users/${userId}`);
      set({ profile: response.data.user, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch profile", loading: false });
    }
  },

  fetchUserPosts: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/users/${userId}/posts`);
      set({ posts: response.data.posts, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch user posts", loading: false });
    }
  },

  fetchFollowers: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/users/${userId}/followers`);
      set({ followers: response.data.followers, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch followers", loading: false });
    }
  },

  fetchFollowing: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/users/${userId}/following`);
      set({ following: response.data.following, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch following", loading: false });
    }
  },

  updateProfile: async (userId, profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/users/profile`, profileData);
      set({ 
        profile: response.data.user, 
        loading: false 
      });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : "Failed to update profile";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  followUser: async (userId) => {
    try {
      await axios.post(`/api/users/${userId}/follow`);
      set((state) => ({
        profile: state.profile
          ? {
              ...state.profile,
              followers: [...state.profile.followers, "current-user-id"],
            }
          : null,
        followers: [...state.followers, { id: "current-user-id" }],
      }));
    } catch (error) {
      set({ error: "Failed to follow user" });
    }
  },

  unfollowUser: async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}/follow`);
      set((state) => ({
        profile: state.profile
          ? {
              ...state.profile,
              followers: state.profile.followers.filter(
                (id) => id !== "current-user-id"
              ),
            }
          : null,
        followers: state.followers.filter(
          (follower) => follower.id !== "current-user-id"
        ),
      }));
    } catch (error) {
      set({ error: "Failed to unfollow user" });
    }
  },

  blockUser: async (userId) => {
    try {
      await axios.post(`/api/users/${userId}/block`);
      set((state) => ({
        profile: state.profile ? { ...state.profile, isBlocked: true } : null,
      }));
    } catch (error) {
      set({ error: "Failed to block user" });
    }
  },

  reportUser: async (userId, reason) => {
    try {
      await axios.post(`/api/users/${userId}/report`, { reason });
    } catch (error) {
      set({ error: "Failed to report user" });
    }
  },
}));
