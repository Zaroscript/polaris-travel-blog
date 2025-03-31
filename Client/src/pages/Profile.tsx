import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import ProfileHeader from "@/components/social/ProfileHeader";
import ProfileInfo from "@/components/social/ProfileInfo";
import PhotosGrid from "@/components/social/PhotosGrid";
import FriendsGrid from "@/components/social/FriendsGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/social/PostCard";
import useProfileStore from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types";


const Profile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { getProfile, getUserFollowing, getUserFollowers } = useProfileStore();
  const { authUser } = useAuthStore();
  const currentUser: User = getProfile(authUser._id);
  const userFollowing = getUserFollowing(authUser._id);
  const userFollowers = getUserFollowers(authUser._id);
  const [activeTab, setActiveTab] = useState("timeline");
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [savedPosts, setSavedPosts] = useState<{ [key: string]: boolean }>({});
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>(
    {}
  );
  // Determine if we're viewing our own profile or someone else's
  const isOwnProfile = !id || id === currentUser._id;
  const otherUserData = id ? getProfile(id) : null;
  const userData = isOwnProfile ? currentUser : otherUserData;

  const handleEditProfile = () => {
    if (!isOwnProfile) return;
    // ... edit profile logic
  };

  const handleToggleFollow = (friendId: string) => {
    setFollowing((prev) => ({
      ...prev,
      [friendId]: !prev[friendId],
    }));
    toast({
      title: following[friendId] ? "Unfollowed" : "Followed",
      description: following[friendId]
        ? "You have unfollowed this user"
        : "You are now following this user",
    });
  };

  const handleLikePost = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSavePost = (postId: string) => {
    setSavedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    toast({
      title: savedPosts[postId] ? "Post unsaved" : "Post saved",
      description: savedPosts[postId]
        ? "Post has been removed from your saved items"
        : "Post has been saved to your collection",
    });
  };

  const handleCopyLink = (postId: string) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl);
    setCopiedLinks((prev) => ({
      ...prev,
      [postId]: true,
    }));
    setTimeout(() => {
      setCopiedLinks((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }, 2000);
    toast({
      title: "Link copied",
      description: "Post link has been copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-65px)] bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Profile Header */}
          <ProfileHeader
            coverImage={userData.coverImage}
            profileImage={userData.profileImage}
            name={userData.name}
            role={userData.role}
            location={userData.location}
            connections={userData.connections}
            isVerified={userData.isVerified}
            joinedDate={userData.joinedDate}
            email={userData.email}
            isOwnProfile={isOwnProfile}
            onEditProfile={handleEditProfile}
          />

          {/* Main Content */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <ProfileInfo
                about={userData.about}
                status={userData.status}
                birthDate={userData.birthDate}
                location={userData.location}
                email={userData.email}
                experience={userData.experience}
                skills={userData.skills}
              />
            </div>

            {/* Center Column */}
            <div className="md:col-span-2 space-y-6">
              <Tabs
                defaultValue="timeline"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                  >
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger
                    value="photos"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                  >
                    Photos
                  </TabsTrigger>
                  <TabsTrigger
                    value="friends"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                  >
                    Friends
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="mt-6">
                  <div className="space-y-6">
                    {userData.posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLikePost}
                        onSave={handleSavePost}
                        onCopyLink={handleCopyLink}
                        onFollow={handleToggleFollow}
                        isLiked={likedPosts[post.id]}
                        isSaved={savedPosts[post.id]}
                        isCopied={copiedLinks[post.id]}
                        isFollowing={following[post.author.name]}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="photos" className="mt-6">
                  <PhotosGrid
                    photos={userData.photos}
                    maxDisplay={9}
                    onSeeAll={() => {
                      toast({
                        title: "View All Photos",
                        description: "Full photo gallery coming soon!",
                      });
                    }}
                  />
                </TabsContent>

                <TabsContent value="friends" className="mt-6">
                  <FriendsGrid
                    friends={userData.friends}
                    maxDisplay={6}
                    onSeeAll={() => {
                      toast({
                        title: "View All Friends",
                        description: "Full friends list coming soon!",
                      });
                    }}
                    onToggleFollow={handleToggleFollow}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
