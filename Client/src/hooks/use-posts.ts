import { useCallback } from "react";
import { Post } from "@/types/social";
import { usePostsStore } from "@/store/usePostsStore";
import { useToast } from "@/components/ui/use-toast";
import { createSafeFetcher } from "@/lib/api-utils";

/**
 * Custom hook to handle post-related operations with simplified error handling
 * and toast notifications
 */
export function usePosts() {
  const { toast } = useToast();
  const {
    posts,
    loading,
    error,
    fetchPosts,
    fetchUserPosts,
    fetchSavedPosts,
    fetchLikedPosts,
    fetchUserPhotos,
    createPost,
    updatePost,
    deletePost,
    likePost,
    toggleSavePost,
    addComment,
  } = usePostsStore();

  // Simplified post liking with toast notifications
  const handleLikePost = useCallback(async (postId: string) => {
    try {
      const response = await likePost(postId);
      toast({
        title: "Success",
        description: `${response.isLiked ? "Liked" : "Unliked"} post successfully`,
      });
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
      throw error;
    }
  }, [likePost, toast]);

  // Simplified post saving with toast notifications
  const handleSavePost = useCallback(async (postId: string) => {
    try {
      const response = await toggleSavePost(postId);
      toast({
        title: "Success",
        description: `Post ${response.isSaved ? "saved" : "removed from saved"} successfully`,
      });
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
      throw error;
    }
  }, [toggleSavePost, toast]);

  // Get user posts safely with proper error handling
  const getUserPosts = useCallback(async (userId: string) => {
    try {
      const result = await fetchUserPosts(userId);
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user posts",
        variant: "destructive",
      });
      throw error;
    }
  }, [fetchUserPosts, toast]);

  // Create a new post with error handling
  const handleCreatePost = useCallback(async (postData: Partial<Post>) => {
    try {
      const newPost = await createPost(postData);
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      return newPost;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
      throw error;
    }
  }, [createPost, toast]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    fetchUserPosts: getUserPosts,
    fetchSavedPosts,
    fetchLikedPosts,
    fetchUserPhotos,
    likePost: handleLikePost,
    savePost: handleSavePost,
    createPost: handleCreatePost,
    updatePost,
    deletePost,
    addComment,
  };
}
