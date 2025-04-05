import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("recent");
  const [savedPosts, setSavedPosts] = useState<{ [key: string]: boolean }>({});
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { toast } = useToast();

  // Static mock data
  const mockUser = {
    _id: "1",
    name: "John Doe",
    profileImage: "/images/avatar.jpg",
  };

  const mockPosts = [
    {
      id: "1",
      content: "Just visited Paris!",
      images: ["/images/paris.jpg"],
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
            profileImage: "/images/avatar2.jpg",
          },
          likes: [],
          replies: [],
        },
      ],
      destination: {
        id: "paris1",
        name: "Paris",
        image: "/images/paris-icon.jpg",
      },
      gallery: [],
    },
    {
      id: "2",
      content: "Beautiful day in London",
      images: ["/images/london.jpg"],
      authorId: "1",
      createdAt: "2024-02-19T15:30:00Z",
      likes: ["2"],
      comments: [],
      destination: {
        id: "london1",
        name: "London",
        image: "/images/london-icon.jpg",
      },
      gallery: [],
    },
  ];

  const mockConnections = [
    {
      id: "2",
      name: "Jane Smith",
      profileImage: "/images/avatar2.jpg",
      role: "user",
    },
    {
      id: "3",
      name: "Bob Wilson",
      profileImage: "/images/avatar3.jpg",
      role: "user",
    },
  ];

  const mockFollowing = ["2"];

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
    toast({
      title: mockFollowing.includes(userId) ? "Unfollowed" : "Followed",
      description: mockFollowing.includes(userId)
        ? "You have unfollowed this user"
        : "You are now following this user",
    });
  };

  const handleLikePost = (postId: string) => {
    // Static like handling
    toast({
      title: "Post liked",
      description: "You liked this post",
    });
  };

  const handleCreatePost = (newPost: Post) => {
    toast({
      title: "Post created",
      description: "Your post has been created successfully",
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
        isLiked={post.likes.includes(mockUser._id)}
        isSaved={savedPosts[post.id]}
        isCopied={copiedLinks[post.id]}
        isFollowing={mockFollowing.includes(post.authorId)}
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
                  {renderPostCards(mockPosts as Post[])}
                </TabsContent>

                <TabsContent value="popular" className="mt-6">
                  {renderPostCards(mockPosts as Post[])}
                </TabsContent>

                <TabsContent value="following" className="mt-6">
                  {mockPosts.length > 0 ? (
                    renderPostCards(mockPosts as Post[])
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
          suggestedConnections={mockConnections}
          following={mockFollowing}
          onFollow={handleFollowUser}
          newsItems={newsItems}
        />
      </div>
    </Layout>
  );
};

export default Social;
