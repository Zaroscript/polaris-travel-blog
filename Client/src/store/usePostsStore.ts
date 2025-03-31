import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { BlogPost, ApiError } from "../types";
import { Post, Profile } from "@/types/social";

interface PostsState {
  posts: Post[];
  userPosts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getPosts: () => Promise<void>;
  getUserPosts: (userId: string) => Promise<void>;
  getPost: (postId: string) => Promise<void>;
  createPost: (data: {
    content: string;
    images?: string[];
    destinationId?: string;
  }) => Promise<void>;
  updatePost: (
    postId: string,
    data: { content: string; images?: string[] }
  ) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  clearError: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  userPosts: [],
  currentPost: null,
  isLoading: false,
  error: null,

  getPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<Post[]>("/posts");
      set({ posts: response.data || [] });
    } catch (error) {
      const message = (error as ApiError).message || "Failed to fetch posts";
      set({ error: message, posts: [] });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  getUserPosts: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<Post[]>(
        `api/posts/user/${userId}`
      );
      set({ userPosts: response.data });
    } catch (error) {
      const message =
        (error as ApiError).message || "Failed to fetch user posts";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  getPost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<Post>(`posts/${postId}`);
      set({ currentPost: response.data });
    } catch (error) {
      const message = (error as ApiError).message || "Failed to fetch post";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  createPost: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<Post>("posts", data);
      set((state) => ({ posts: [response.data, ...state.posts] }));
      toast.success("Post created successfully");
    } catch (error) {
      const message = (error as ApiError).message || "Failed to create post";
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePost: async (postId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<Post>(`posts/${postId}`, data);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? response.data : post
        ),
        currentPost:
          state.currentPost?.id === postId ? response.data : state.currentPost,
        userPosts: state.userPosts.map((post) =>
          post.id === postId ? response.data : post
        ),
      }));
      toast.success("Post updated successfully");
    } catch (error) {
      const message = (error as ApiError).message || "Failed to update post";
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deletePost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
        currentPost:
          state.currentPost?.id === postId ? null : state.currentPost,
        userPosts: state.userPosts.filter((post) => post.id !== postId),
      }));
      toast.success("Post deleted successfully");
    } catch (error) {
      const message = (error as ApiError).message || "Failed to delete post";
      set({ error: message });
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  likePost: async (postId) => {
    try {
      await axiosInstance.post(`posts/${postId}/like`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, likes: [...post.likes, postId] }
            : post
        ),
        currentPost:
          state.currentPost?.id === postId
            ? {
                ...state.currentPost,
                likes: [...state.currentPost.likes, postId],
              }
            : state.currentPost,
        userPosts: state.userPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: [...post.likes, postId] }
            : post
        ),
      }));
    } catch (error) {
      const message = (error as ApiError).message || "Failed to like post";
      toast.error(message);
      throw error;
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await axiosInstance.post(`posts/${postId}/comments`, {
        content,
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        ),
        currentPost:
          state.currentPost?.id === postId
            ? {
                ...state.currentPost,
                comments: [...state.currentPost.comments, response.data],
              }
            : state.currentPost,
        userPosts: state.userPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        ),
      }));
      toast.success("Comment added successfully");
    } catch (error) {
      const message = (error as ApiError).message || "Failed to add comment";
      toast.error(message);
      throw error;
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      await axiosInstance.delete(`posts/${postId}/comments/${commentId}`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : post
        ),
        currentPost:
          state.currentPost?.id === postId
            ? {
                ...state.currentPost,
                comments: state.currentPost.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : state.currentPost,
        userPosts: state.userPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : post
        ),
      }));
      toast.success("Comment deleted successfully");
    } catch (error) {
      const message = (error as ApiError).message || "Failed to delete comment";
      toast.error(message);
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
