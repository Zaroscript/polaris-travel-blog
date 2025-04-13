import { useCallback } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { useToast } from "@/components/ui/use-toast";
import { createSafeFetcher } from "@/lib/api-utils";
import { Profile } from "@/types/social";

/**
 * Custom hook to handle profile-related operations with simplified error handling
 * and toast notifications
 */
export function useProfile() {
  const { toast } = useToast();
  const {
    profile,
    loading,
    error,
    fetchProfile,
    fetchFollowing,
    fetchFollowers,
    followUser,
    unfollowUser,
    updateProfile,
  } = useProfileStore();

  // Get profile data safely with proper error handling
  const getProfile = useCallback((userId: string) => {
    return createSafeFetcher(fetchProfile, {
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to fetch profile",
          variant: "destructive",
        });
      }
    })(userId);
  }, [fetchProfile, toast]);

  // Handle follow user with proper error handling and notifications
  const handleFollowUser = useCallback(async (userId: string) => {
    try {
      const response = await followUser(userId);
      toast({
        title: "Success",
        description: "You are now following this user",
      });
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
      throw error;
    }
  }, [followUser, toast]);

  // Handle unfollow user with proper error handling and notifications
  const handleUnfollowUser = useCallback(async (userId: string) => {
    try {
      const response = await unfollowUser(userId);
      toast({
        title: "Success",
        description: "You have unfollowed this user",
      });
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
      throw error;
    }
  }, [unfollowUser, toast]);

  // Update profile with error handling
  const handleUpdateProfile = useCallback(async (userId: string, profileData: Partial<Profile>) => {
    try {
      const updatedProfile = await updateProfile(userId, profileData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return updatedProfile;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  }, [updateProfile, toast]);

  return {
    profile,
    loading,
    error,
    fetchProfile: getProfile,
    fetchFollowing,
    fetchFollowers,
    followUser: handleFollowUser,
    unfollowUser: handleUnfollowUser,
    updateProfile: handleUpdateProfile,
    isCurrentUserFollowing: useCallback((followerId: string) => {
      return profile?.followers?.some(follower => follower._id === followerId) || false;
    }, [profile]),
  };
}
