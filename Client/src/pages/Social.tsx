import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/layout/Layout";
import { blogPosts } from "@/data/blogData";
import CreatePost from "@/components/social/CreatePost";
import PostCard from "@/components/social/PostCard";
import SocialSidebar from "@/components/social/SocialSidebar";
import RightSidebar from "@/components/social/RightSidebar";
import { Post, SuggestedConnection, CreatePostData } from "@/types/social";
import { BlogPost } from "@/types";

const Social = () => {
  const { authUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("recent");
  const [savedPosts, setSavedPosts] = useState<{ [key: string]: boolean }>({});
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const filteredPosts = useMemo(() => {
    const posts = blogPosts.map(
      (post): Post => ({
        ...post,
        id: String(post.id),
        comments: [],
        destination: post.destination?.name || "",
      })
    );

    switch (activeTab) {
      case "popular":
        return [...posts].sort((a, b) => b.likes - a.likes);
      case "following":
        return posts.filter((_, index) => index % 2 === 0);
      case "recent":
      default:
        return [...posts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  }, [activeTab]);

  // Mock data for suggested connections
  const suggestedConnections: SuggestedConnection[] = [
    {
      name: "Amanda Reed",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "Travel Writer",
    },
    {
      name: "Billy Vincent",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      role: "Photographer",
    },
    {
      name: "Carl Ferguson",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      role: "Explorer",
    },
    {
      name: "Carolyn Gray",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      role: "Food Blogger",
    },
  ];

  // Mock data for news items
  const newsItems = [
    "The destinations you should visit this summer",
    "Five unforgettable facts about hiking",
    "Best Pinterest boards for traveling while business",
    "Skills that you can learn from the internet",
  ];

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

  const handleFollowUser = (userId: string) => {
    setFollowing((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    toast({
      title: following[userId] ? "Unfollowed" : "Followed",
      description: following[userId]
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

  const handleCreatePost = (newPost: CreatePostData) => {
    const post: Post = {
      id: Math.random().toString(36).substr(2, 9),
      title: newPost.title,
      content: newPost.content,
      image: newPost.coverImage,
      gallery: newPost.gallery,
      date: new Date().toISOString(),
      author: {
        name: authUser?.fullName || "Anonymous",
        avatar: authUser?.profilePic || "",
      },
      travelTips: newPost.travelTips.filter((tip) => tip.trim()),
      tags: newPost.tags,
      destination: newPost.destination,
      mentions: newPost.mentions,
      likes: 0,
      comments: [],
    };
    blogPosts.unshift(post as unknown as BlogPost);
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
        isLiked={likedPosts[post.id]}
        isSaved={savedPosts[post.id]}
        isCopied={copiedLinks[post.id]}
        isFollowing={following[post.author.name]}
      />
    ));

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-65px)] bg-background">
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
                  {renderPostCards(filteredPosts)}
                </TabsContent>

                <TabsContent value="popular" className="mt-6">
                  {renderPostCards(filteredPosts)}
                </TabsContent>

                <TabsContent value="following" className="mt-6">
                  {filteredPosts.length > 0 ? (
                    renderPostCards(filteredPosts)
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
          suggestedConnections={suggestedConnections}
          following={following}
          onFollow={handleFollowUser}
          newsItems={newsItems}
        />
      </div>
    </Layout>
  );
};

export default Social;
