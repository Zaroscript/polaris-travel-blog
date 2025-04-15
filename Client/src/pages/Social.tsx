import { useEffect, useState } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import { useProfileStore } from "@/store/useProfileStore";
import PostCard from "@/components/social/PostCard";
import CreatePost from "@/components/social/CreatePost";
import { Button } from "@/components/ui/button";
import { Loader, Plus, UserCircle, Compass, Sparkles, Filter, Globe, Search, Bell } from "lucide-react";
import Layout from "../components/layout/Layout";
import SocialSidebar from "@/components/social/SocialSidebar";
import RightSidebar from "@/components/social/RightSidebar";
import { newsItems } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/use-toast";
import { Profile, ProfileUser } from "@/types/social";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-state";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; 
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Social = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<ProfileUser[]>([]);
  const [activeTab, setActiveTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

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

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  const filteredPosts = searchQuery
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <Layout>
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-primary/10 to-primary/5 py-8 px-6 mb-6">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Polaris Social</h1>
              <p className="text-muted-foreground max-w-md">
                Connect with fellow travelers, share your experiences, and discover new destinations
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="gap-2">
                <UserCircle className="h-4 w-4" />
                <span>My Profile</span>
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex max-w-6xl mx-auto px-4 min-h-[calc(100vh-65px)]">
        {/* Left Sidebar */}
        <SocialSidebar />

        {/* Main Content */}
        <motion.div 
          className="flex-1 min-w-0 px-0 md:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto">
            {/* Search and Filters */}
            <Card className="mb-6 shadow-sm border-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts, people, or topics..."
                      className="pl-8 bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Post Creation Card */}
            <Card className="mb-6 border border-primary/10 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <CreatePost />
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <div className="mb-6 overflow-auto pb-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer">
                  <Sparkles className="h-3 w-3 mr-1 text-primary" />
                  <span>Trending</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer">
                  <Compass className="h-3 w-3 mr-1 text-primary" />
                  <span>Adventure</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer">
                  <Globe className="h-3 w-3 mr-1 text-primary" />
                  <span>Europe</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer">
                  <Bell className="h-3 w-3 mr-1 text-primary" />
                  <span>Events</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer">
                  <span>#backpacking</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer">
                  <span>#foodie</span>
                </Badge>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-3 p-1 h-12">
                <TabsTrigger value="recent" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  Recent Posts
                </TabsTrigger>
                <TabsTrigger value="popular" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  Popular Posts
                </TabsTrigger>
                <TabsTrigger value="following" className="rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  Following
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {loading && !filteredPosts.length ? (
                  <div className="py-12 flex justify-center items-center">
                    <LoadingState text="Loading posts..." />
                  </div>
                ) : (
                  <>
                    {filteredPosts.length === 0 ? (
                      <div className="text-center py-12 bg-muted/20 rounded-lg">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
                          <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery ? "Try a different search term" : "Be the first to create a post!"}
                        </p>
                        <Button >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Post
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {filteredPosts.map((post) => (
                          <PostCard
                            key={post._id}
                            post={post}
                            onLike={handleLike}
                            onSave={handleSave}
                            onCopyLink={handleCopyLink}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </Tabs>
          </div>
        </motion.div>

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
