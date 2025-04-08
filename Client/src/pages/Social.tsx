import { useEffect, useState } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import { useProfileStore } from "@/store/useProfileStore";
import PostCard from "@/components/social/PostCard";
import CreatePost from "@/components/social/CreatePost";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import Layout from "../components/layout/Layout";
import SocialSidebar from "@/components/social/SocialSidebar";
import RightSidebar from "@/components/social/RightSidebar";
import { newsItems } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@/types/social";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Social = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState("recent");

  const handleLike = async (postId: string) => {
    if (!authUser?._id) {
      toast({
        description: "Please login to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const post = posts.find(p => p._id === postId);
      if (!post) return;

      const isCurrentlyLiked = post.likes.some(like => like._id === authUser._id);
      
      if (isCurrentlyLiked) {
        await usePostsStore.getState().unlikePost(postId);
        toast({
          description: "Post unliked",
        });
      } else {
        await usePostsStore.getState().likePost(postId);
        toast({
          description: "Post liked",
        });
      }

      // Refresh posts to get updated like status
      await loadPosts();
    } catch (error) {
      console.error("Error handling like:", error);
      toast({
        variant: "destructive",
        description: "Failed to update like status",
      });
    }
  };

  const handleSave = async (postId: string) => {
    if (!authUser?._id) {
      toast({
        description: "Please login to save posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { message } = await usePostsStore.getState().toggleSavePost(postId);
      toast({
        description: message,
      });

      // Refresh posts to get updated save status
      await loadPosts();
    } catch (error) {
      console.error("Error handling save:", error);
      toast({
        variant: "destructive",
        description: "Failed to update save status",
      });
    }
  };

  const handleCopyLink = (postId: string) => {
    try {
      const postUrl = `${window.location.origin}/post/${postId}`;
      navigator.clipboard.writeText(postUrl);
      toast({
        description: "Post link copied to clipboard",
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        variant: "destructive",
        description: "Failed to copy link",
      });
    }
  };

  const {

    posts,
    loading: postsLoading,
    error: postsError,
    fetchPosts,
    fetchPopularPosts,
    fetchFollowingPosts,
  } = usePostsStore();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    fetchProfile,
    fetchFollowing,
    fetchSuggestedUsers,
  } = useProfileStore();
  const { authUser } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!authUser?._id) return;

      try {
        const [profileData, followingData] = await Promise.all([
          fetchProfile(authUser._id),
          fetchFollowing(authUser._id),
        ]);

        // Fetch suggested users separately to handle potential errors
        try {
          const suggestions = await fetchSuggestedUsers(authUser._id);
          setSuggestedUsers(suggestions);
        } catch (error) {
          console.error("Failed to fetch suggested users:", error);
        }

        // Load initial posts based on active tab
        await loadPosts();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [authUser?._id, fetchProfile, fetchFollowing, fetchSuggestedUsers, toast]);

  const loadPosts = async () => {
    try {
      switch (activeTab) {
        case "recent":
          await fetchPosts();
          break;
        case "popular":
          await fetchPopularPosts();
          break;
        case "following":
          await fetchFollowingPosts();
          break;
        default:
          await fetchPosts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loading = postsLoading || profileLoading;
  const error = postsError || profileError;

  if (loading && !posts.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="container flex min-h-[calc(100vh-65px)] bg-background">
        {/* Left Sidebar */}
        <SocialSidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Social Feed</h1>
            </div>

            <CreatePost />

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent">Recent Posts</TabsTrigger>
                <TabsTrigger value="popular">Popular Posts</TabsTrigger>
                <TabsTrigger value="following">Following Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="mt-4">
                <div className="grid grid-cols-1 gap-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={handleLike}
                      onSave={handleSave}
                      onCopyLink={handleCopyLink}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="popular" className="mt-4">
                <div className="grid grid-cols-1 gap-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={handleLike}
                      onSave={handleSave}
                      onCopyLink={handleCopyLink}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="following" className="mt-4">
                <div className="grid grid-cols-1 gap-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={handleLike}
                      onSave={handleSave}
                      onCopyLink={handleCopyLink}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          suggestedConnections={suggestedUsers}
          following={profile?.following?.map((f) => f._id) || []}
          onFollow={async (userId) => {
            try {
              await useProfileStore.getState().followUser(userId);
              // Update suggested users after following
              const updatedSuggestions = await fetchSuggestedUsers(
                authUser?._id
              );
              setSuggestedUsers(updatedSuggestions);
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to follow user",
                variant: "destructive",
              });
            }
          }}
          newsItems={newsItems}
        />
      </div>
    </Layout>
  );
};

export default Social;
