import { create } from "zustand";
import { Post, PostsState } from "../types/social";
import { axiosInstance } from "../lib/axios";
import { useProfileStore } from "./useProfileStore";

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/posts");
      set({
        posts: response.data.posts,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch posts", loading: false });
      throw error;
    }
  },

  fetchPost: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch post", loading: false });
      throw error;
    }
  },

  createPost: async (postData: Partial<Post>) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/posts", postData);
      set((state) => ({
        posts: [response.data.post, ...state.posts],
        loading: false,
      }));
      return response.data.post;
    } catch (error) {
      set({ error: "Failed to create post", loading: false });
      throw error;
    }
  },

  updatePost: async (id: string, postData: Partial<Post>) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/posts/${id}`, postData);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === id ? response.data.post : post
        ),
        loading: false,
      }));
      return response.data.post;
    } catch (error) {
      set({ error: "Failed to update post", loading: false });
      throw error;
    }
  },

  deletePost: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/posts/${id}`);
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete post", loading: false });
      throw error;
    }
  },

  likePost: async (postId: string) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking post:", error);
      throw new Error("Failed to like post");
    }
  },

  unlikePost: async (postId: string) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/unlike`);
      return response.data;
    } catch (error) {
      console.error("Error unliking post:", error);
      throw new Error("Failed to unlike post");
    }
  },

  addComment: async (postId: string, content: string) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comments`, {
        content,
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, response.data.comment],
              }
            : post
        ),
      }));
      return response.data.comment;
    } catch (error) {
      set({ error: "Failed to add comment" });
      throw error;
    }
  },

  likeComment: async (postId: string, commentId: string) => {
    try {
      const response = await axiosInstance.post(
        `/posts/${postId}/comments/${commentId}/like`
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        likes: [...(comment.likes || []), response.data.user],
                      }
                    : comment
                ),
              }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to like comment" });
      throw error;
    }
  },

  unlikeComment: async (postId: string, commentId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/posts/${postId}/comments/${commentId}/like`
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        likes: comment.likes.filter(
                          (like) => like._id !== response.data.user._id
                        ),
                      }
                    : comment
                ),
              }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to unlike comment" });
      throw error;
    }
  },

  deleteComment: async (postId: string, commentId: string) => {
    try {
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment._id !== commentId
                ),
              }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to delete comment" });
      throw error;
    }
  },

  addReply: async (postId: string, commentId: string, content: string) => {
    try {
      const response = await axiosInstance.post(
        `/posts/${postId}/comments/${commentId}/replies`,
        {
          content,
        }
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: [...comment.replies, response.data.reply],
                      }
                    : comment
                ),
              }
            : post
        ),
      }));
      return response.data.reply;
    } catch (error) {
      set({ error: "Failed to add reply" });
      throw error;
    }
  },

  likeReply: async (postId: string, commentId: string, replyId: string) => {
    try {
      const response = await axiosInstance.post(
        `/posts/${postId}/comments/${commentId}/replies/${replyId}/like`
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: comment.replies.map((reply) =>
                          reply._id === replyId
                            ? {
                                ...reply,
                                likes: [
                                  ...(reply.likes || []),
                                  response.data.user,
                                ],
                              }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to like reply" });
      throw error;
    }
  },

  unlikeReply: async (postId: string, commentId: string, replyId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/posts/${postId}/comments/${commentId}/replies/${replyId}/like`
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: comment.replies.map((reply) =>
                          reply._id === replyId
                            ? {
                                ...reply,
                                likes: reply.likes.filter(
                                  (like) => like._id !== response.data.user._id
                                ),
                              }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to unlike reply" });
      throw error;
    }
  },

  deleteReply: async (postId: string, commentId: string, replyId: string) => {
    try {
      await axiosInstance.delete(
        `/posts/${postId}/comments/${commentId}/replies/${replyId}`
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: comment.replies.filter(
                          (reply) => reply._id !== replyId
                        ),
                      }
                    : comment
                ),
              }
            : post
        ),
      }));
    } catch (error) {
      set({ error: "Failed to delete reply" });
      throw error;
    }
  },

  toggleSavePost: async (id: string) => {
    try {
      const response = await axiosInstance.post(`/posts/${id}/toggle-save`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === id ? { ...post, isSaved: response.data.isSaved } : post
        ),
      }));
      return response.data;
    } catch (error) {
      set({ error: "Failed to toggle save post" });
      throw error;
    }
  },

  fetchPopularPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/posts");
      // Sort posts by total engagement (likes + comments)
      const popularPosts = response.data.posts.sort((a: Post, b: Post) => {
        const aEngagement = a.likes.length + a.comments.length;
        const bEngagement = b.likes.length + b.comments.length;
        return bEngagement - aEngagement;
      });
      set({
        posts: popularPosts,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch popular posts", loading: false });
      throw error;
    }
  },

  fetchFollowingPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/posts");
      const { following } = useProfileStore.getState();
      // Filter posts to only show posts from followed users
      const followingPosts = response.data.posts.filter((post: Post) =>
        following.some((followedUser) => followedUser._id === post.author._id)
      );
      set({
        posts: followingPosts,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch following posts", loading: false });
      throw error;
    }
  },
}));
