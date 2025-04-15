import { create } from "zustand";
import { Post, PostsState, PostFilter, PostSort } from "../types/social";
import { axiosInstance } from "../lib/axios";
import { useProfileStore } from "./useProfileStore";
import { useAuthStore } from "./useAuthStore";

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  activeFilter: "all",
  activeSort: "recent",
  searchQuery: "",

  // Reset pagination and filters
  resetFilters: () => {
    set({ 
      currentPage: 1, 
      hasMore: true, 
      activeFilter: "all",
      activeSort: "recent",
      searchQuery: ""
    });
  },

  // Fetch posts with pagination, filtering, and sorting
  fetchPosts: async (
    page = 1, 
    filter: PostFilter = get().activeFilter, 
    sort = get().activeSort,
    search = get().searchQuery,
    append = false
  ) => {
    set(state => ({ 
      loading: true, 
      error: null, 
      activeFilter: filter,
      activeSort: sort,
      searchQuery: search,
      currentPage: page
    }));

    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      
      if (filter && filter !== "all") {
        params.append("filter", filter);
      }
      
      if (sort) {
        params.append("sort", sort);
      }
      
      if (search) {
        params.append("search", search);
      }

      const response = await axiosInstance.get(`/posts?${params.toString()}`);
      
      set(state => ({
        posts: append ? [...state.posts, ...response.data.posts] : response.data.posts,
        hasMore: response.data.hasMore,
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch posts", loading: false });
      throw error;
    }
  },

  // Load more posts (append to existing posts)
  loadMorePosts: async () => {
    const { currentPage, hasMore, activeFilter, activeSort, searchQuery } = get();
    if (!hasMore || get().loading) return;
    
    const nextPage = currentPage + 1;
    await get().fetchPosts(nextPage, activeFilter, activeSort, searchQuery, true);
  },

  // Fetch a single post by ID
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

  // Create a new post
  createPost: async (postData: Partial<Post> & { file?: File | File[] }) => {
    set({ loading: true, error: null });
    try {
      // Handle form data if there are files
      let response;
      if (postData.file) {
        const formData = new FormData();
        Object.entries(postData).forEach(([key, value]) => {
          if (key === 'file') {
            if (Array.isArray(value)) {
              value.forEach(file => formData.append('files', file));
            } else {
              formData.append('file', value as File);
            }
          } else if (key === 'tags' && Array.isArray(value)) {
            formData.append('tags', JSON.stringify(value));
          } else if (typeof value === 'string' || typeof value === 'number' || value instanceof Blob) {
            formData.append(key, value.toString());
          } else if (value !== undefined && value !== null) {
            // Handle complex objects by stringify
            formData.append(key, JSON.stringify(value));
          }
        });
        
        response = await axiosInstance.post("/posts", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axiosInstance.post("/posts", postData);
      }
      
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

  // Update an existing post
  updatePost: async (id: string, postData: Partial<Post> & { file?: File | File[] }) => {
    set({ loading: true, error: null });
    try {
      let response;
      if (postData.file) {
        const formData = new FormData();
        Object.entries(postData).forEach(([key, value]) => {
          if (key === 'file') {
            if (Array.isArray(value)) {
              value.forEach(file => formData.append('files', file));
            } else {
              formData.append('file', value as File);
            }
          } else if (key === 'tags' && Array.isArray(value)) {
            formData.append('tags', JSON.stringify(value));
          } else if (typeof value === 'string' || typeof value === 'number' || value instanceof Blob) {
            formData.append(key, value.toString());
          } else if (value !== undefined && value !== null) {
            // Handle complex objects by stringify
            formData.append(key, JSON.stringify(value));
          }
        });
        
        response = await axiosInstance.put(`/posts/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axiosInstance.put(`/posts/${id}`, postData);
      }
      
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

  // Delete a post
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

  // Like a post
  likePost: async (postId: string) => {
    try {
      const post = get().posts.find(p => p._id === postId);
      
      // Optimistically update the UI
      if (post) {
        const authStore = useAuthStore.getState();
        const userId = authStore.authUser?._id;
        
        set(state => ({
          posts: state.posts.map(p => {
            if (p._id === postId) {
              // Check if user has already liked the post
              const alreadyLiked = p.likes.some(like => like._id === userId);
              
              if (!alreadyLiked && userId) {
                return {
                  ...p,
                  likes: [
                    ...p.likes, 
                    { 
                      _id: userId, 
                      fullName: authStore.authUser?.fullName || "",
                      profilePic: authStore.authUser?.profilePic || ""
                    }
                  ],
                  isLiked: true
                };
              } else if (alreadyLiked) {
                return {
                  ...p,
                  likes: p.likes.filter(like => like._id !== userId),
                  isLiked: false
                };
              }
            }
            return p;
          })
        }));
      }
      
      const response = await axiosInstance.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      // If the request fails, revert the optimistic update
      set({ error: "Failed to like post" });
      throw error;
    }
  },

  // Unlike a post
  unlikePost: async (postId: string) => {
    try {
      const post = get().posts.find(p => p._id === postId);
      
      // Optimistically update the UI
      if (post) {
        const authStore = useAuthStore.getState();
        const userId = authStore.authUser?._id;
        
        set(state => ({
          posts: state.posts.map(p => {
            if (p._id === postId) {
              return {
                ...p,
                likes: p.likes.filter(like => like._id !== userId),
                isLiked: false
              };
            }
            return p;
          })
        }));
      }
      
      await axiosInstance.delete(`/posts/${postId}/like`);
    } catch (error) {
      // If the request fails, revert the optimistic update
      set({ error: "Failed to unlike post" });
      throw error;
    }
  },

  // Add a comment to a post
  addComment: async (postId: string, content: string) => {
    try {
      // Optimistically update the UI with a temporary comment
      const authStore = useAuthStore.getState();
      const tempId = `temp-${Date.now()}`;
      const tempComment = {
        _id: tempId,
        content,
        author: {
          _id: authStore.authUser?._id || '',
          fullName: authStore.authUser?.fullName || '',
          profilePic: authStore.authUser?.profilePic || '',
        },
        likes: [],
        replies: [],
        createdAt: new Date().toISOString(),
        isLoading: true
      };
      
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [tempComment, ...post.comments]
            };
          }
          return post;
        })
      }));
      
      // Send the comment to the server
      const response = await axiosInstance.post(`/posts/${postId}/comments`, { content });
      
      // Update the UI with the real comment from the server
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === tempId) {
                  // Replace the temporary comment with the real one
                  return response.data.comment;
                }
                return comment;
              })
            };
          }
          return post;
        })
      }));
      
      return response.data.comment;
    } catch (error) {
      // If the request fails, remove the temporary comment
      const tempId = `temp-${Date.now()}`;
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment._id !== tempId)
            };
          }
          return post;
        }),
        error: "Failed to add comment"
      }));
      throw error;
    }
  },

  // Like a comment
  likeComment: async (postId: string, commentId: string) => {
    try {
      const authStore = useAuthStore.getState();
      const userId = authStore.authUser?._id;
      
      // Optimistically update the UI
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === commentId) {
                  // Check if already liked
                  const alreadyLiked = comment.likes.some(like => like._id === userId);
                  
                  if (!alreadyLiked && userId) {
                    return {
                      ...comment,
                      likes: [
                        ...comment.likes, 
                        { 
                          _id: userId, 
                          fullName: authStore.authUser?.fullName || "",
                          profilePic: authStore.authUser?.profilePic || "" 
                        }
                      ],
                      isLiked: true
                    };
                  }
                }
                return comment;
              })
            };
          }
          return post;
        })
      }));
      
      await axiosInstance.post(`/posts/${postId}/comments/${commentId}/like`);
    } catch (error) {
      set({ error: "Failed to like comment" });
      throw error;
    }
  },

  // Unlike a comment
  unlikeComment: async (postId: string, commentId: string) => {
    try {
      const authStore = useAuthStore.getState();
      const userId = authStore.authUser?._id;
      
      // Optimistically update the UI
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === commentId) {
                  return {
                    ...comment,
                    likes: comment.likes.filter(like => like._id !== userId),
                    isLiked: false
                  };
                }
                return comment;
              })
            };
          }
          return post;
        })
      }));
      
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}/like`);
    } catch (error) {
      set({ error: "Failed to unlike comment" });
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (postId: string, commentId: string) => {
    try {
      // Optimistically update UI
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment._id !== commentId)
            };
          }
          return post;
        })
      }));
      
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error("Failed to delete comment");
    }
  },

  // Add a reply to a comment
  addReply: async (postId: string, commentId: string, content: string) => {
    try {
      // Optimistically update UI with a temporary reply
      const authStore = useAuthStore.getState();
      const tempId = `temp-${Date.now()}`;
      const tempReply = {
        _id: tempId,
        content,
        author: {
          _id: authStore.authUser?._id || '',
          fullName: authStore.authUser?.fullName || '',
          profilePic: authStore.authUser?.profilePic || '',
        },
        likes: [],
        createdAt: new Date().toISOString(),
        isLoading: true
      };

      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === commentId) {
                  return {
                    ...comment,
                    replies: [...comment.replies, tempReply]
                  };
                }
                return comment;
              })
            };
          }
          return post;
        })
      }));

      // Make API call
      const response = await axiosInstance.post(
        `/posts/${postId}/comments/${commentId}/replies`,
        { content }
      );

      // Update with real reply from server
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.map(reply => 
                      reply._id === tempId ? response.data.reply : reply
                    )
                  };
                }
                return comment;
              })
            };
          }
          return post;
        })
      }));

      return response.data.reply;
    } catch (error) {
      // Remove optimistic reply on failure
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.filter(reply => !reply.isLoading)
                  };
                }
                return comment;
              })
            };
          }
          return post;
        }),
        error: "Failed to add reply"
      }));
      throw error;
    }
  },

  // Like a reply
  likeReply: async (postId: string, commentId: string, replyId: string) => {
    try {
      const authStore = useAuthStore.getState();
      const userId = authStore.authUser?._id;
      
      // Optimistically update the UI
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.map(reply => {
                      if (reply._id === replyId) {
                        // Check if already liked
                        const alreadyLiked = reply.likes.some(like => like._id === userId);
                        
                        if (!alreadyLiked && userId) {
                          return {
                            ...reply,
                            likes: [
                              ...reply.likes, 
                              { 
                                _id: userId,
                                fullName: authStore.authUser?.fullName || "",
                                profilePic: authStore.authUser?.profilePic || "" 
                              }
                            ],
                            isLiked: true
                          };
                        }
                      }
                      return reply;
                    })
                  };
                }
                return comment;
              })
            };
          }
          return post;
        })
      }));
      
      await axiosInstance.post(`/posts/${postId}/comments/${commentId}/replies/${replyId}/like`);
    } catch (error) {
      set({ error: "Failed to like reply" });
      throw error;
    }
  },

  // Unlike a reply
  unlikeReply: async (postId: string, commentId: string, replyId: string) => {
    try {
      const authStore = useAuthStore.getState();
      const userId = authStore.authUser?._id;
      
      // Optimistically update the UI
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.map(reply => {
                      if (reply._id === replyId) {
                        return {
                          ...reply,
                          likes: reply.likes.filter(like => like._id !== userId),
                          isLiked: false
                        };
                      }
                      return reply;
                    })
                  };
                }
                return comment;
              })
            };
          }
          return post;
        })
      }));
      
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}/replies/${replyId}/like`);
    } catch (error) {
      set({ error: "Failed to unlike reply" });
      throw error;
    }
  },

  // Delete a reply
  deleteReply: async (postId: string, commentId: string, replyId: string) => {
    try {
      // Optimistically update UI
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment._id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.filter(reply => reply._id !== replyId)
                  };
                }
                return comment;
              })
            };
          }
          return post;
        })
      }));
      
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}/replies/${replyId}`);
    } catch (error) {
      console.error("Error deleting reply:", error);
      throw new Error("Failed to delete reply");
    }
  },

  // Toggle save status of a post
  toggleSavePost: async (id: string) => {
    try {
      // Optimistically update the UI
      const post = get().posts.find(p => p._id === id);
      if (post) {
        set(state => ({
          posts: state.posts.map(p => {
            if (p._id === id) {
              return { ...p, isSaved: !p.isSaved };
            }
            return p;
          })
        }));
      }
      
      const response = await axiosInstance.post(`/posts/${id}/toggle-save`);
      return response.data;
    } catch (error) {
      console.error("Error toggling save:", error);
      throw new Error("Failed to toggle save status");
    }
  },

  // Share a post
  sharePost: async (postId: string): Promise<void> => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/share`);
      
      // Update post share count in UI
      set(state => ({
        posts: state.posts.map(post => {
          if (post._id === postId) {
            // Make sure shares is an array
            const newShares = Array.isArray(post.shares) ? [...post.shares] : [];
            return {
              ...post,
              isShared: true,
              shares: newShares
            };
          }
          return post;
        })
      }));
    } catch (error) {
      set({ error: "Failed to share post" });
      throw error;
    }
  },

  // Fetch popular posts
  fetchPopularPosts: async () => {
    set({ loading: true, error: null, activeFilter: "popular" });
    try {
      const response = await axiosInstance.get("/posts/popular");
      set({
        posts: response.data.posts,
        loading: false,
        hasMore: response.data.hasMore || false
      });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch popular posts", loading: false });
      throw error;
    }
  },

  // Fetch posts from followed users
  fetchFollowingPosts: async () => {
    set({ loading: true, error: null, activeFilter: "following" });
    try {
      const response = await axiosInstance.get("/posts/following");
      set({
        posts: response.data.posts,
        loading: false,
        hasMore: response.data.hasMore || false
      });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch following posts", loading: false });
      throw error;
    }
  },

  // Fetch saved posts
  fetchSavedPosts: async () => {
    set({ loading: true, error: null, activeFilter: "saved" });
    try {
      const response = await axiosInstance.get("/posts/saved");
      set({
        posts: response.data.posts,
        loading: false,
        hasMore: response.data.hasMore || false
      });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch saved posts", loading: false });
      throw error;
    }
  },

  // Fetch liked posts
  fetchLikedPosts: async () => {
    set({ loading: true, error: null, activeFilter: "liked" });
    try {
      const response = await axiosInstance.get("/posts/liked");
      set({
        posts: response.data.posts,
        loading: false,
        hasMore: response.data.hasMore || false
      });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch liked posts", loading: false });
      throw error;
    }
  },

  // Fetch user photos (posts with images)
  fetchUserPhotos: async (userId?: string) => {
    set({ loading: true, error: null, activeFilter: "photos" });
    try {
      const url = userId 
        ? `/posts/photos/${userId}`
        : "/posts/photos";
        
      const response = await axiosInstance.get(url);
      set({
        posts: response.data.posts,
        loading: false,
        hasMore: response.data.hasMore || false
      });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch user photos", loading: false });
      throw error;
    }
  },

  // Fetch posts by a specific user
  fetchUserPosts: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/posts/user/${userId}`);
      set({
        posts: response.data.posts,
        loading: false,
        hasMore: response.data.hasMore || false
      });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch user posts", loading: false });
      throw error;
    }
  }
}));
