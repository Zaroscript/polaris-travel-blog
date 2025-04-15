import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import CreatePost from "@/components/social/CreatePost";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useProfile } from "@/hooks/use-profile";
import { usePosts } from "@/hooks/use-posts";
import {
  ProfileContainer,
  ProfileHeader,
  ProfilePosts,
  ProfileFollowers,
  ProfileMap,
} from "@/components/profile";
import SavedPosts from "@/components/profile/SavedPosts";

/**
 * Profile - Main profile page component that handles user profiles and content tabs
 */
const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");
  const [tabsLoading, setTabsLoading] = useState({
    posts: false,
    following: false,
    followers: false,
    saved: false
  });

  // Use custom hooks for profile and posts
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    fetchProfile,
    fetchFollowing,
    fetchFollowers,
    followUser,
    unfollowUser,
    isCurrentUserFollowing,
  } = useProfile();

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    fetchUserPosts,
    fetchSavedPosts,
    fetchUserPhotos,
  } = usePosts();

  // Check if this is the current user's profile
  const isOwnProfile = authUser?._id === id;

  // Check if the current auth user is following the profile user
  const isFollowing = useCallback(() => {
    if (!profile || !authUser) return false;
    return profile.followers?.some(follower => follower._id === authUser._id) || false;
  }, [profile, authUser]);

  // Handle follow user action
  const handleFollow = async () => {
    if (!id) return;
    try {
      await followUser(id);
      toast({
        title: "Success",
        description: `You are now following this user`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
    }
  };

  // Handle unfollow user action
  const handleUnfollow = async () => {
    if (!id) return;
    try {
      await unfollowUser(id);
      toast({
        title: "Success",
        description: `You have unfollowed this user`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
    }
  };

  // Load data based on active tab
  const loadTabData = useCallback(async (tab: string) => {
    if (!id) return;

    // Only set loading for the current tab
    setTabsLoading(prev => ({ ...prev, [tab]: true }));

    try {
      if (tab === "following" && id) {
        await fetchFollowing(id);
      } else if (tab === "followers" && id) {
        await fetchFollowers(id);
      } else if (tab === "posts") {
        await fetchUserPosts(id);
      } else if (tab === "saved" && isOwnProfile) {
        await fetchSavedPosts();

      }
    } catch (error) {
      console.error(`Error loading ${tab} tab:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${tab} data`,
        variant: "destructive",
      });
    } finally {
      setTabsLoading(prev => ({ ...prev, [tab]: false }));
    }
  }, [id, isOwnProfile, fetchFollowing, fetchFollowers, fetchUserPosts, fetchSavedPosts, toast]);

  // Fetch initial profile data
  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id, fetchProfile]);

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab, loadTabData]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Display loading state if profile is loading
  if (profileLoading) {
    return (
      <Layout>
        <div className="container py-8 h-[calc(100vh-65px)] flex justify-center items-center">
          <LoadingState variant="profile" text="Loading profile..." size="lg"/>
        </div>
      </Layout>
    );
  }

  // Display error state if there's an error
  if (profileError) {
    return (
      <Layout>
        <div className="container py-8">
          <ErrorState 
            title="Error Loading Profile" 
            description={profileError} 
            retry={() => fetchProfile(id || '')} 
          />
        </div>
      </Layout>
    );
  }

  // Display error state if there's no profile
  if (!profile) {
    return (
      <Layout>
        <div className="container py-8">
          <ErrorState 
            title="Profile Not Found" 
            description="The profile you're looking for doesn't exist or has been removed." 
            retry={() => navigate(-1)} 
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile} 
        />

        <ProfileContainer
          profile={profile}
          isOwnProfile={isOwnProfile}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isFollowing={isFollowing()}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        >
          <div className="space-y-6">
            {/* Create Post (only for own profile and posts tab) */}
            {isOwnProfile && activeTab === "posts" && (
              <Card className="overflow-hidden border-dashed border-2 bg-muted/40 p-4">
                <CreatePost />
              </Card>
            )}

            {/* Tab Content */}
            {activeTab === "posts" && (
              <ProfilePosts 
                userId={id || ''} 
                isOwnProfile={isOwnProfile}
                profileName={profile.fullName}
              />
            )}

            {activeTab === "following" && (
              <ProfileFollowers 
                followers={profile.following || []} 
                loading={tabsLoading.following}
                isOwnProfile={isOwnProfile}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                isFollowing={isCurrentUserFollowing}
              />
            )}

            {activeTab === "followers" && (
              <ProfileFollowers 
                followers={profile.followers || []} 
                loading={tabsLoading.followers}
                isOwnProfile={isOwnProfile}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                isFollowing={isCurrentUserFollowing}
              />
            )}

            {activeTab === "saved" && isOwnProfile && (
              <SavedPosts userId={id || ''} />
            )}


          </div>
        </ProfileContainer>
      </div>
    </Layout>
  );
};

export default Profile;
