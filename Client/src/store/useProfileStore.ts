import { create } from "zustand";
import {
  Profile,
  Post,
  ProfileState,
  Pagination,
  MinimalProfile,
} from "../types/social";
import { axiosInstance } from "../lib/axios";
import axios from "axios";

// Helper function to derive a traveler type from interests
const deriveTravelerTypeFromInterests = (interests: string[]): string => {
  // Convert interests to lowercase for easier matching
  const lowerInterests = interests.map(i => i.toLowerCase());
  
  // Define categories and their related keywords
  const categories = {
    'Adventure Traveler': ['hiking', 'trekking', 'climbing', 'adventure', 'outdoor', 'extreme', 'camping'],
    'Photographer': ['photography', 'camera', 'photo', 'landscape', 'wildlife', 'portrait'],
    'Food Explorer': ['food', 'cuisine', 'culinary', 'gastronomy', 'cooking', 'restaurant', 'dining'],
    'Budget Backpacker': ['budget', 'backpacking', 'hostel', 'affordable', 'cheap', 'economic'],
    'Luxury Traveler': ['luxury', 'resort', 'spa', 'premium', '5-star', 'upscale', 'exclusive'],
    'Culture Enthusiast': ['culture', 'history', 'museum', 'heritage', 'architecture', 'local', 'tradition'],
    'Beach Lover': ['beach', 'ocean', 'sea', 'island', 'surf', 'diving', 'snorkel', 'coastal'],
    'City Explorer': ['city', 'urban', 'metropolitan', 'nightlife', 'shopping', 'cafe']
  };
  
  // Count matches for each category
  const scores: Record<string, number> = {};
  
  for (const [category, keywords] of Object.entries(categories)) {
    scores[category] = 0;
    for (const interest of lowerInterests) {
      if (keywords.some(keyword => interest.includes(keyword))) {
        scores[category]++;
      }
    }
  }
  
  // Find the category with the highest score
  let bestMatch = 'Travel Enthusiast'; // Default
  let highestScore = 0;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestMatch = category;
    }
  }
  
  return bestMatch;
};

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
  
  fetchAllTravelers: async (category?: string, currentUserId?: string) => {
    set({ loading: true, error: null });
    try {
      // Get all users
      const response = await axiosInstance.get("/users/all");
      let travelers = response.data.users;
      
      // Filter out the current user if an ID is provided
      if (currentUserId) {
        travelers = travelers.filter((user: Profile) => user._id !== currentUserId);
      }
      
      // If a category is specified, filter users by interests that match the category
      if (category && category !== 'all') {
        travelers = travelers.filter((user: Profile) => {
          // Map common categories to related interests
          const categoryToInterests: Record<string, string[]> = {
            'adventure': ['hiking', 'adventure', 'outdoor', 'mountain', 'trekking', 'climbing'],
            'photographers': ['photography', 'landscape', 'nature', 'street photography', 'wildlife'],
            'foodies': ['food', 'cuisine', 'cooking', 'restaurant', 'gastronomy', 'culinary'],
            'budget': ['backpacking', 'hostel', 'budget travel', 'affordable', 'cheap travel'],
            'luxury': ['luxury', 'resort', 'fine dining', 'spa', 'premium travel', '5-star']
          };
          
          const relatedInterests = categoryToInterests[category.toLowerCase()] || [];
          
          // Check if user has any interests that relate to the category
          return user.interests?.some(interest => 
            relatedInterests.some(relatedInterest => 
              interest.toLowerCase().includes(relatedInterest)
            )
          );
        });
      }
      
      // Add some additional calculated fields for display in the UI
      travelers = travelers.map((user: Profile) => ({
        ...user,
        countriesVisited: user.visitedDestinations?.length || 0,
        // Derive role from user interests if not specified
        travelerType: user.role || deriveTravelerTypeFromInterests(user.interests || [])
      }));
      
      set({ loading: false });
      return travelers;
    } catch (error) {
      set({ error: "Failed to fetch travelers", loading: false });
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
