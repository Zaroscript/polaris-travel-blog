import { useEffect, useState } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import { useProfileStore } from "@/store/useProfileStore";
import PostCard from "@/components/social/PostCard";
import CreatePost from "@/components/social/CreatePost";
import { Button } from "@/components/ui/button";
import { Loader, Plus, UserCircle, Compass, Sparkles, Filter, Globe, Search, Bell, Bookmark, MessageCircle, Image as ImageIcon, Settings, Users } from "lucide-react";
import { getCoverImage, getProfilePic } from "@/lib/placeholders";
import Layout from "../components/layout/Layout";
import SocialSidebar from "@/components/social/SocialSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/use-toast";
import { Profile, ProfileUser } from "@/types/social";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-state";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"; 
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const Social = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<ProfileUser[]>([]);
  const [feedTab, setFeedTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSidebarTab, setActiveSidebarTab] = useState("feed"); // default to feed view
  const [travelers, setTravelers] = useState<ProfileUser[]>([]); 
  const [travelerCategory, setTravelerCategory] = useState("all");
  const [travelerSearchQuery, setTravelerSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse the current path to determine active sidebar tab
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/social/explore')) {
      setActiveSidebarTab('explore-travelers'); // Updated to match new tab name
    } else if (path.includes('/social/notifications')) {
      setActiveSidebarTab('notifications');
    } else if (path.includes('/social/messages')) {
      setActiveSidebarTab('messages');
    } else if (path.includes('/social/saved')) {
      setActiveSidebarTab('saved');
    } else if (path.includes('/social/profile')) {
      setActiveSidebarTab('profile');
    } else if (path.includes('/social/photos')) {
      setActiveSidebarTab('photos');
    } else {
      setActiveSidebarTab('feed');
    }
  }, [location]);

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

  // Fetch travelers when category changes or when the explore-travelers tab is activated
  useEffect(() => {
    const loadTravelers = async () => {
      if (activeSidebarTab === 'explore-travelers') {
        try {
          const fetchedTravelers = await useProfileStore.getState().fetchAllTravelers(
            travelerCategory,
            authUser?._id // Pass the current user's ID to exclude them
          );
          setTravelers(fetchedTravelers);
        } catch (error) {
          console.error("Failed to fetch travelers:", error);
          toast({
            title: "Error",
            description: "Failed to load travelers",
            variant: "destructive",
          });
        }
      }
    };

    loadTravelers();
  }, [activeSidebarTab, travelerCategory, toast]);

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
      switch (feedTab) {
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
  }, [feedTab]);

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
    <>
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
                <Button variant="outline" className="gap-2" onClick={() => navigate(`/user/profile/${authUser?._id}`)}>
                  <UserCircle className="h-4 w-4" />
                  <span>My Profile</span>
                </Button>
                <Button className="gap-2" onClick={() => setIsCreatePostOpen(true)}>
                  <Plus className="h-4 w-4" />
                  <span>Create Post</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container flex max-w-6xl mx-auto px-4 min-h-[calc(100vh-65px)]">
          {/* Left Sidebar */}
          <SocialSidebar 
            activeTab={activeSidebarTab} 
            onTabChange={setActiveSidebarTab}
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
          />

          {/* Main Content */}
          <motion.div 
            className="flex-1 min-w-0 px-0 md:px-6 max-w-3xl mx-auto"
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

              {/* Dynamic Content Based on Active Sidebar Tab */}
              {activeSidebarTab === 'feed' && (
                <>
                  {/* Post Creation Card */}
                  <Card className="mb-6 border border-primary/10 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <CreatePost />
                    </CardContent>
                  </Card>

                  {/* Feed Tabs */}
                  <Tabs
                    value={feedTab}
                    onValueChange={setFeedTab}
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
                              <Button onClick={() => setIsCreatePostOpen(true)}>
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
                </>
              )}

              {activeSidebarTab === 'explore-travelers' && (
                <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Explore Travelers</h2>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search travelers..."
                        className="pl-8 w-[220px] bg-background"
                        value={travelerSearchQuery}
                        onChange={(e) => setTravelerSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Separator className="mb-6" />
                  
                  <div className="space-y-6">
                    {/* Travel Categories */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer ${travelerCategory === 'all' ? 'bg-primary/5' : ''}`}
                        onClick={() => setTravelerCategory('all')}
                      >
                        <Globe className="h-3 w-3 mr-1 text-primary" />
                        <span>All</span>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer ${travelerCategory === 'adventure' ? 'bg-primary/5' : ''}`}
                        onClick={() => setTravelerCategory('adventure')}
                      >
                        <Compass className="h-3 w-3 mr-1 text-primary" />
                        <span>Adventure</span>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer ${travelerCategory === 'photographers' ? 'bg-primary/5' : ''}`}
                        onClick={() => setTravelerCategory('photographers')}
                      >
                        <span>Photographers</span>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer ${travelerCategory === 'foodies' ? 'bg-primary/5' : ''}`}
                        onClick={() => setTravelerCategory('foodies')}
                      >
                        <span>Foodies</span>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer ${travelerCategory === 'budget' ? 'bg-primary/5' : ''}`}
                        onClick={() => setTravelerCategory('budget')}
                      >
                        <span>Budget</span>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1 border-primary/30 hover:bg-primary/5 cursor-pointer ${travelerCategory === 'luxury' ? 'bg-primary/5' : ''}`}
                        onClick={() => setTravelerCategory('luxury')}
                      >
                        <span>Luxury</span>
                      </Badge>
                    </div>

                    {/* Loading State */}
                    {loading && (
                      <div className="py-12 flex justify-center items-center">
                        <LoadingState text="Loading travelers..." />
                      </div>
                    )}

                    {/* No Results */}
                    {!loading && travelers.length === 0 && (
                      <div className="text-center py-12 bg-muted/20 rounded-lg">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
                          <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No travelers found</h3>
                        <p className="text-muted-foreground mb-4">
                          {travelerSearchQuery ? "Try a different search term" : travelerCategory !== 'all' ? "Try a different category" : "No travelers match your criteria"}
                        </p>
                      </div>
                    )}

                    {/* Travelers Grid */}
                    {!loading && travelers.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {travelers
                          .filter(traveler => {
                            if (!travelerSearchQuery) return true;
                            const query = travelerSearchQuery.toLowerCase();
                            return (
                              traveler.fullName?.toLowerCase().includes(query) ||
                              traveler.location?.toLowerCase().includes(query) ||
                              traveler.interests?.some(interest => interest.toLowerCase().includes(query)) ||
                              traveler.travelerType?.toLowerCase().includes(query) ||
                              traveler.about?.toLowerCase().includes(query)
                            );
                          })
                          .map(traveler => {
                            // Get cover image or placeholder if none exists
                            const coverImage = getCoverImage(traveler.coverImage);
                            
                            // Placeholder bio if none exists
                            const bio = traveler.about || "Travel enthusiast exploring the world and sharing experiences.";
                            
                            // Random follower count if not available
                            const followersCount = traveler.followersCount || Math.floor(Math.random() * 10000);
                            const formattedFollowers = followersCount > 999 ? (followersCount / 1000).toFixed(1) + 'k' : followersCount;
                            
                            // Generate interests tags from user interests
                            const interestTags = traveler.interests?.slice(0, 3) || ['travel', 'adventure', 'explore'];
                            
                            return (
                              <div key={traveler._id} className="flex flex-col rounded-lg overflow-hidden border border-primary/10 bg-card hover:shadow-md transition-all">
                                <div className="relative h-48 overflow-hidden">
                                  <img 
                                    src={coverImage}
                                    alt={`${traveler.fullName} profile`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10 ring-2 ring-white">
                                        <AvatarImage src={getProfilePic(traveler.profilePic)} />
                                        <AvatarFallback>{traveler.fullName?.charAt(0) || "T"}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="text-white font-semibold">{traveler.fullName}</h3>
                                        <p className="text-white/80 text-sm">{traveler.travelerType || 'Travel Enthusiast'}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <Globe className="h-4 w-4 text-primary" />
                                    <span>{traveler.countriesVisited} countries visited</span>
                                    <span className="ml-auto flex items-center gap-1">
                                      <UserCircle className="h-4 w-4" />
                                      {formattedFollowers} followers
                                    </span>
                                  </div>
                                  <p className="text-sm mb-4 line-clamp-2">{bio}</p>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {interestTags.map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">#{tag.toLowerCase()}</Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      className="flex-1"
                                      onClick={() => {
                                        useProfileStore.getState().followUser(traveler._id);
                                        toast({
                                          description: `You're now following ${traveler.fullName}`
                                        });
                                      }}
                                    >
                                      Follow
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => navigate(`/user/profile/${traveler._id}`)}
                                    >
                                      View Profile
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    )}
                    
                    {!loading && travelers.length > 0 && (
                      <div className="flex justify-center mt-8">
                        <Button variant="outline">
                          <Users className="mr-2 h-4 w-4" />
                          Discover More Travelers
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSidebarTab === 'notifications' && (
                <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    <Badge className="bg-primary">3 new</Badge>
                  </div>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    {/* Sample notifications */}
                    <div className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/30 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm"><span className="font-medium">Sarah Johnson</span> liked your post about <span className="text-primary">"Tokyo Night Markets"</span></p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/30 transition-colors bg-primary/5">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm"><span className="font-medium">John Doe</span> started following you</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="default" className="h-8">Follow back</Button>
                          <Button size="sm" variant="ghost" className="h-8">Dismiss</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/30 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>MK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm"><span className="font-medium">Polaris Travel</span> featured your photo in their weekly showcase</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSidebarTab === 'messages' && (
                <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Messages</h2>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-center py-8">Message functionality is coming soon!</p>
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Start a new conversation
                    </Button>
                  </div>
                </div>
              )}

              {activeSidebarTab === 'saved' && (
                <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Saved Posts</h2>
                  <Separator className="mb-4" />
                  
                  {loading ? (
                    <div className="py-12 flex justify-center items-center">
                      <LoadingState text="Loading saved posts..." />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredPosts.filter(post => post.isSaved).length === 0 ? (
                        <div className="text-center py-12 bg-muted/20 rounded-lg">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
                            <Bookmark className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">No saved posts</h3>
                          <p className="text-muted-foreground mb-4">
                            Save posts for later by clicking the bookmark icon
                          </p>
                          <Button variant="outline" onClick={() => setActiveSidebarTab('feed')}>
                            Browse posts
                          </Button>
                        </div>
                      ) : (
                        filteredPosts.filter(post => post.isSaved).map((post) => (
                          <PostCard
                            key={post._id}
                            post={post}
                            onLike={handleLike}
                            onSave={handleSave}
                            onCopyLink={handleCopyLink}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeSidebarTab === 'profile' && (
                <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">My Profile</h2>
                  <Separator className="mb-4" />
                  
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Profile view is under development</p>
                    <Button variant="outline" onClick={() => navigate(`/user/profile/${authUser?._id}`)}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      Go to full profile
                    </Button>
                  </div>
                </div>
              )}

              {activeSidebarTab === 'photos' && (
                <div className="bg-card p-6 rounded-lg border border-primary/10 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">My Photos</h2>
                  <Separator className="mb-4" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {/* Sample photos - would be populated from API in real implementation */}
                    <div className="aspect-square rounded-md overflow-hidden bg-muted/20 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="aspect-square rounded-md overflow-hidden bg-muted/20 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="aspect-square rounded-md overflow-hidden bg-muted/20 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Photos
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Layout>
      
      {/* Create Post Modal */}
      <CreatePost open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </>
  );
};

export default Social;
