import { create } from "zustand";
import {
  Profile,
  Post,
  ProfileState,
  Pagination,
  MinimalProfile,
} from "../types/social";
import { axiosInstance } from "../lib/axios";

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
      const response = await axiosInstance.get(`/users/${userId}`);
      set({ profile: response.data.user, loading: false });
      return response.data.user;
    } catch (error) {
      set({ error: "Failed to fetch profile", loading: false });
      throw error;
    }
  },

  fetchSuggestedUsers: async (userId) => {
    set({ loading: true, error: null });
    try {
      // Get current user's profile
      const response = await axiosInstance.get(`/users/${userId}`);
      const currentUser = response.data.user;

      // Get all users
      const allUsersResponse = await axiosInstance.get("/users/all");
      const allUsers = allUsersResponse.data.users;

      // Filter users with matching location or interests
      const suggestedUsers = allUsers.filter((user: Profile) => {
        // Don't suggest current user
        if (user._id === userId) return false;

        // Check for location match
        const hasSameLocation = user.location === currentUser.location;

        // Check for interests match
        const hasCommonInterests = user.interests?.some(interest => 
          currentUser.interests?.includes(interest)
        );

        // Return true if either location or interests match
        return hasSameLocation || hasCommonInterests;
      });

      set({
        profile: currentUser,
        
        loading: false
      });

      return suggestedUsers;

    } catch (error) {
      set({ error: "Failed to fetch suggested users", loading: false });
      throw error;
    }
  },

  fetchUserPosts: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/${userId}/posts`);
      set({
        posts: response.data.posts,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch user posts", loading: false });
      throw error;
    }
  },

  fetchFollowers: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      set({
        followers: response.data.user.followers,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch followers", loading: false });
      throw error;
    }
  },

  fetchFollowing: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      set({
        following: response.data.user.following,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch following", loading: false });
      throw error;
    }
  },

  updateProfile: async (userId, profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/users/${userId}`, profileData);
      set({ profile: response.data.user, loading: false });
      return response.data.user;
    } catch (error) {
      set({ error: "Failed to update profile", loading: false });
      throw error;
    }
  },

  followUser: async (userId) => {
    try {
      const response = await axiosInstance.post(`/users/${userId}/follow`);
      const { following, followingCount, followerCount } = response.data;

      // Get the user's profile to get their fullName and profilePic
      const userResponse = await axiosInstance.get(`/users/${userId}`);
      const user = userResponse.data.user;

      const followingUser: MinimalProfile = {
        _id: user._id,
        fullName: user.fullName,
        profilePic: user.profilePic,
      };

      set((state) => ({
        profile: state.profile
          ? {
              ...state.profile,
              following: [...state.profile.following, followingUser],
              followingCount: followingCount,
            }
          : null,
        following: [...state.following, followingUser],
      }));

      return response.data;
    } catch (error) {
      set({ error: "Failed to follow user" });
      throw error;
    }
  },

  unfollowUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}/follow`);
      const { following, followingCount, followerCount } = response.data;

      set((state) => ({
        profile: state.profile
          ? {
              ...state.profile,
              following: state.profile.following.filter(
                (f) => f._id !== userId
              ),
              followingCount: followingCount,
            }
          : null,
        following: state.following.filter((f) => f._id !== userId),
      }));

      return response.data;
    } catch (error) {
      set({ error: "Failed to unfollow user" });
      throw error;
    }
  },

  blockUser: async (userId) => {
    try {
      await axiosInstance.post(`/users/${userId}/block`);
      set((state) => ({
        profile: state.profile ? { ...state.profile, isBlocked: true } : null,
      }));
    } catch (error) {
      set({ error: "Failed to block user" });
      throw error;
    }
  },

  reportUser: async (userId, reason) => {
    try {
      await axiosInstance.post(`/users/${userId}/report`, { reason });
    } catch (error) {
      set({ error: "Failed to report user" });
      throw error;
    }
  },
}));
