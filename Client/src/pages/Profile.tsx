import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Globe,
  Calendar,
  Mail,
  Heart,
  Users,
  Camera,
  Map,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProfileHeader from "@/components/social/ProfileHeader";
import PostCard from "@/components/social/PostCard";
import CreatePost from "@/components/social/CreatePost";
import DestinationMap from "@/components/destination/DestinationMap";
import { useProfileStore } from "@/store/useProfileStore";
import { usePostsStore } from "@/store/usePostsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");
  const { authUser } = useAuthStore();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    fetchProfile,
    fetchFollowing,
    fetchFollowers,
    followUser,
    unfollowUser,
  } = useProfileStore();
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    fetchPosts,
    likePost,
    toggleSavePost,
  } = usePostsStore();
  const isOwnProfile = authUser?._id === id;
  const isFollowing = profile?.followers?.some(follower => follower._id === authUser?._id) || false;

  useEffect(() => {
    if (id) {
      fetchProfile(id);
      fetchPosts();
    }
  }, [id, fetchProfile, fetchPosts]);

  useEffect(() => {
    if (id) {
      if (activeTab === "following") {
        fetchFollowing(id);
      } else if (activeTab === "followers") {
        fetchFollowers(id);
      }
    }
  }, [id, activeTab, fetchFollowing, fetchFollowers]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="container py-6 flex-1">
          <ProfileHeader
            coverImage={profile?.coverImage}
            profileImage={profile?.profilePic}
            name={profile?.fullName}
            location={profile?.location}
            age={profile?.birthDate}
            email={profile?.email}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            followersCount={profile?.followers?.length || 0}
            followingCount={profile?.following?.length || 0}
            postsCount={profile?.postsCount || 0}
            onEditProfile={() => navigate('/user/settings')}
            onBlockUser={() => {
              toast({
                title: "User Blocked",
                description: "You will no longer see content from this user.",
              });
            }}
            onReportUser={() => {
              toast({
                title: "User Reported",
                description: "Thank you for your report. We will review it shortly.",
              });
            }}
            onFollow={async () => {
              try {
                await followUser(id!);
                toast({
                  title: "Success",
                  description: `You are now following ${profile?.fullName}`,
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to follow user",
                  variant: "destructive",
                });
              }
            }}
            onUnfollow={async () => {
              try {
                await unfollowUser(id!);
                toast({
                  title: "Success",
                  description: `You have unfollowed ${profile?.fullName}`,
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to unfollow user",
                  variant: "destructive",
                });
              }
            }}
            onChat={() => {
              navigate(`/chat`);
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - About Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground mb-6">{profile?.about}</p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile?.location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile?.birthDate} years old
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile?.email}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.interests?.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Memories</h2>
                <div className="grid grid-cols-2 gap-4">
                  {profile?.visitedDestinations?.map((destination) => (
                    <div
                      key={destination._id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold">
                            {destination.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {destination.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Posts and Following/Followers */}
            <div className="lg:col-span-2">
              <Tabs
                defaultValue="posts"
                className="w-full h-full flex flex-col"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="posts">
                    <Camera className="h-4 w-4 mr-2" />
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="following">
                    <Heart className="h-4 w-4 mr-2" />
                    Following
                  </TabsTrigger>
                  <TabsTrigger value="followers">
                    <Users className="h-4 w-4 mr-2" />
                    Followers
                  </TabsTrigger>
                  <TabsTrigger value="map">
                    <Map className="h-4 w-4 mr-2" />
                    Travel Map
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 mt-6">
                  <TabsContent value="posts" className="space-y-6">
                    {isOwnProfile && <CreatePost />}

                    {posts
                      .filter((post) => post.author._id === id)
                      .map((post) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          onLike={async (postId) => {
                            try {
                              await likePost(postId);
                              toast({
                                title: "Success",
                                description: "Post liked successfully",
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to like post",
                                variant: "destructive",
                              });
                            }
                          }}
                          onSave={async (postId) => {
                            try {
                              await toggleSavePost(postId);
                              toast({
                                title: "Success",
                                description: "Post saved successfully",
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to save post",
                                variant: "destructive",
                              });
                            }
                          }}
                          onCopyLink={(postId) => {
                            const url = `${window.location.origin}/post/${postId}`;
                            navigator.clipboard.writeText(url);
                            toast({
                              title: "Success",
                              description: "Link copied to clipboard",
                            });
                          }}
                          isLiked={post.isLiked}
                          isSaved={post.isSaved}
                          isFollowing={isFollowing}
                        />
                      ))}
                  </TabsContent>

                  <TabsContent value="following" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile?.following?.map((user) => (
                        <Card key={user._id} className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profilePic}
                              alt={user.fullName}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h3 className="font-medium">{user.fullName}</h3>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="followers" className="space-y-6">
                    {profile?.followers?.length === 0 ? (
                      <Card className="p-6 text-center">
                        <p className="text-muted-foreground">
                          No followers yet
                        </p>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile?.followers?.map((user) => (
                          <Card key={user._id} className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.profilePic}
                                alt={user.fullName}
                                className="w-12 h-12 rounded-full"
                              />
                              <div>
                                <h3 className="font-medium">{user.fullName}</h3>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="map" className="space-y-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Travel Map</h2>
                      <div className="h-[400px] rounded-lg overflow-hidden">
                        {/* <DestinationMap  /> */}
                      </div>
                    </Card>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
