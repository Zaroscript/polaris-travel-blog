import { axiosInstance } from "../lib/axios";
import type { UpdateProfileData, User } from "../types";

// Profile API services
export const profileService = {
  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/auth/profile/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await axiosInstance.put("/auth/update-profile", data);
    return response.data;
  },

  // Get user posts
  getUserPosts: async (userId: string, page = 1, limit = 5) => {
    const response = await axiosInstance.get(
      `/posts/user/${userId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

// Post API services
export const postService = {
  // Create a new post
  createPost: async (postData: any) => {
    const response = await axiosInstance.post("/posts", postData);
    return response.data;
  },

  // Like a post
  likePost: async (postId: string) => {
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Comment on a post
  commentOnPost: async (postId: string, text: string) => {
    const response = await axiosInstance.post(`/posts/${postId}/comment`, {
      text,
    });
    return response.data;
  },
};
