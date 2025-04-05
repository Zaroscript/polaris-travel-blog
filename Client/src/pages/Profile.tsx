import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
import DestinationMap from "@/components/destination/DestinationMap";
import { Post, Comment } from "@/types/social";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isOwnProfile] = useState(true); // This would come from auth context

  // Mock data for the profile
  const profileData = {
    _id: "1",
    coverImage: "https://picsum.photos/1200/400",
    profileImage: "https://picsum.photos/200/200",
    name: "John Doe",
    location: "New York",
    country: "United States",
    age: 28,
    email: "john.doe@example.com",
    bio: "Passionate traveler exploring the world one destination at a time. Love photography and meeting new people.",
    interests: ["Photography", "Hiking", "Food", "Culture", "Adventure"],
    following: 150,
    followers: 200,
    posts: [
      {
        id: "1",
        content: "Just visited Paris!",
        images: ["https://picsum.photos/800/600"],
        authorId: "1",
        createdAt: "2024-02-20T10:00:00Z",
        likes: ["2", "3"],
        comments: [
          {
            id: "c1",
            content: "Looks amazing!",
            authorId: "2",
            createdAt: "2024-02-20T11:00:00Z",
            user: {
              id: "2",
              name: "Jane Smith",
              profileImage: "https://picsum.photos/200/200?random=1",
            },
            likes: [],
            replies: [],
          },
        ],
        destination: {
          id: "paris1",
          name: "Paris",
          image: "https://picsum.photos/200/200?random=2",
        },
        gallery: [],
      },
    ],
    memories: [
      {
        id: "1",
        title: "Santorini Sunset",
        destination: "Santorini, Greece",
        coverImage: "https://picsum.photos/400/400?random=3",
        date: "2023-06-15",
        images: [
          "https://picsum.photos/400/400?random=3",
          "https://picsum.photos/400/400?random=4",
        ],
        description: "Watching the sunset in Oia was a magical experience.",
      },
      {
        id: "2",
        title: "Tokyo Adventures",
        destination: "Tokyo, Japan",
        coverImage: "https://picsum.photos/400/400?random=5",
        date: "2023-09-20",
        images: [
          "https://picsum.photos/400/400?random=5",
          "https://picsum.photos/400/400?random=6",
        ],
        description:
          "Exploring the vibrant streets of Tokyo and its unique culture.",
      },
    ],
  };

  const handleEditProfile = () => {
    // Implement edit profile functionality
  };

  const handleBlockUser = () => {
    // Implement block user functionality
  };

  const handleReportUser = () => {
    // Implement report user functionality
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="container py-6 flex-1">
          <ProfileHeader
            coverImage={profileData.coverImage}
            profileImage={profileData.profileImage}
            name={profileData.name}
            location={profileData.location}
            country={profileData.country}
            age={profileData.age}
            email={profileData.email}
            isOwnProfile={isOwnProfile}
            onEditProfile={handleEditProfile}
            onBlockUser={handleBlockUser}
            onReportUser={handleReportUser}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - About Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground mb-6">{profileData.bio}</p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profileData.location}, {profileData.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profileData.age} years old
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profileData.email}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, index) => (
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
                  {profileData.memories.map((memory) => (
                    <div
                      key={memory.id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={memory.coverImage}
                        alt={memory.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold">
                            {memory.title}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {memory.destination}
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
                    {profileData.posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={() => {}}
                        onSave={() => {}}
                        onCopyLink={() => {}}
                        onFollow={() => {}}
                        isLiked={false}
                        isSaved={false}
                        isCopied={false}
                        isFollowing={false}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="following" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Following list would go here */}
                    </div>
                  </TabsContent>

                  <TabsContent value="followers" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Followers list would go here */}
                    </div>
                  </TabsContent>

                  <TabsContent value="map" className="space-y-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Travel Map</h2>
                      <div className="h-[400px] rounded-lg overflow-hidden">
                        <DestinationMap />
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
