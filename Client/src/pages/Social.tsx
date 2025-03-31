import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostsStore } from "@/store/usePostsStore";
import useProfileStore from "@/store/useProfileStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/layout/Layout";
import CreatePost from "@/components/social/CreatePost";
import PostCard from "@/components/social/PostCard";
import SocialSidebar from "@/components/social/SocialSidebar";
import RightSidebar from "@/components/social/RightSidebar";
import { Post } from "@/types/social";
import { newsItems } from "@/constants";

const Social = () => {
  const { authUser } = useAuthStore();
  const {
    posts,
    isLoading: postsLoading,
    getPosts,
    likePost,
    createPost,
  } = usePostsStore();
  const { profile, getProfile, toggleFollow } = useProfileStore();
  const [activeTab, setActiveTab] = useState("recent");
  const [savedPosts, setSavedPosts] = useState<{ [key: string]: boolean }>({});
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { toast } = useToast();

  useEffect(() => {
    getPosts();
    if (authUser) {
      getProfile();
    }
  }, [getPosts, getProfile, authUser]);

  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];

    switch (activeTab) {
      case "popular":
        return [...posts].sort((a, b) => b.likes.length - a.likes.length);
      case "following":
        return posts.filter((post) =>
          profile?.following?.some((following) => following.id === post.user.id)
        );
      case "recent":
      default:
        return [...posts].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [activeTab, posts, profile?.following]);

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
    const postUrl = `${window.location.origin}/blog/${postId}`;
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

  const handleFollowUser = async (userId: string) => {
    await toggleFollow(userId);
    toast({
      title: profile?.following.some((following) => following.id === userId)
        ? "Unfollowed"
        : "Followed",
      description: profile?.following.some(
        (following) => following.id === userId
      )
        ? "You have unfollowed this user"
        : "You are now following this user",
    });
  };

  const handleLikePost = async (postId: string) => {
    await likePost(postId);
  };

  const handleCreatePost = async (newPost: Post) => {
    await createPost({
      content: newPost.content,
      images: newPost.gallery || [],
      destinationId: newPost.destination?.id || undefined,
    });
  };

  const renderPostCards = (posts: Post[]) =>
    posts.map((post) => (
      <PostCard
        key={post.id}
        post={post}
        onLike={handleLikePost}
        onSave={handleSavePost}
        onCopyLink={handleCopyLink}
        onFollow={handleFollowUser}
        isLiked={authUser ? post.likes.includes(authUser._id) : false}
        isSaved={savedPosts[post.id]}
        isCopied={copiedLinks[post.id]}
        isFollowing={profile?.following.some(
          (following) => following.id === post.user.id
        )}
      />
    ));

  return (
    <Layout>
      <div className="container flex min-h-[calc(100vh-65px)] bg-background">
        {/* Left Sidebar */}
        <SocialSidebar />

        {/* Main Content */}
        <ScrollArea className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto py-6 px-4">
            {/* Create Post Card */}
            <CreatePost onPostCreate={handleCreatePost} />

            {/* Posts Feed */}
            <div className="space-y-6">
              <Tabs
                defaultValue="recent"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
                  <TabsTrigger
                    value="recent"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                  >
                    Recent
                  </TabsTrigger>
                  <TabsTrigger
                    value="popular"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                  >
                    Popular
                  </TabsTrigger>
                  <TabsTrigger
                    value="following"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
                  >
                    Following
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="mt-6">
                  {postsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading posts...</p>
                            </div>
                  ) : (
                    renderPostCards(filteredPosts as Post[])
                  )}
                </TabsContent>

                <TabsContent value="popular" className="mt-6">
                  {postsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading posts...</p>
                          </div>
                  ) : (
                    renderPostCards(filteredPosts as Post[])
                  )}
                </TabsContent>

                <TabsContent value="following" className="mt-6">
                  {postsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading posts...</p>
                            </div>
                  ) : filteredPosts.length > 0 ? (
                    renderPostCards(filteredPosts as Post[])
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No posts from people you follow yet.
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start following people to see their posts here.
                      </p>
                          </div>
                  )}
                </TabsContent>
              </Tabs>
                          </div>
                        </div>
        </ScrollArea>

        {/* Right Sidebar */}
        <RightSidebar
          suggestedConnections={(profile?.connections || []).map((conn) => ({
            ...conn,
            role: "user", // Adding required role property
          }))}
          following={(profile?.following || []).map((f) => f.id)} // Extract just the IDs
          onFollow={handleFollowUser}
          newsItems={newsItems}
        />
              </div>
    </Layout>
  );
};

export default Social;
