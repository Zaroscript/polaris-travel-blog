import { create } from "zustand";
import { Post } from "@/types/social";
import axios from "axios";

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (postData: Partial<Post>) => Promise<void>;
  updatePost: (id: string, postData: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  unlikePost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/posts");
      set({ posts: response.data.posts, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch posts", loading: false });
    }
  },

  createPost: async (postData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/posts", postData);
      set((state) => ({
        posts: [response.data.post, ...state.posts],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create post", loading: false });
    }
  },

  updatePost: async (id, postData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/posts/${id}`, postData);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? response.data.post : post
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update post", loading: false });
    }
  },

  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/posts/${id}`);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete post", loading: false });
    }
  },

  likePost: async (id) => {
    try {
      await axios.post(`/api/posts/${id}/like`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id
            ? { ...post, likes: [...post.likes, "current-user-id"] }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to like post" });
    }
  },

  unlikePost: async (id) => {
    try {
      await axios.delete(`/api/posts/${id}/like`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id
            ? {
                ...post,
                likes: post.likes.filter((like) => like !== "current-user-id"),
              }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to unlike post" });
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content,
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data.comment] }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to add comment" });
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
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
      }));
    } catch (error) {
      set({ error: "Failed to delete comment" });
    }
  },
}));
