"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialPost from "@/components/social/SocialPost";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { profileService } from "@/services/api";

interface UserPostsProps {
  userId: string;
}

const UserPosts = ({ userId }: UserPostsProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        // In a real app, you would fetch posts from the API
        const response = await profileService.getUserPosts(userId, 1, 5);

        // For now, we'll use mock data since the API might not be fully implemented
        // This is just for demonstration purposes
        const mockPosts = [
          {
            id: 1,
            title: "My Journey Through the Alps",
            excerpt:
              "Exploring the breathtaking landscapes and charming villages of the Swiss Alps.",
            image:
              "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
            date: "2023-09-15",
            author: {
              name: "John Doe",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            tags: ["alps", "switzerland", "hiking", "travel"],
            likes: 124,
            comments: [],
          },
          {
            id: 2,
            title: "Street Food Adventures in Bangkok",
            excerpt:
              "Tasting the most delicious and authentic street food in the vibrant markets of Bangkok.",
            image:
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
            date: "2023-08-22",
            author: {
              name: "John Doe",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            tags: ["bangkok", "thailand", "food", "streetfood"],
            likes: 98,
            comments: [],
          },
          {
            id: 3,
            title: "Sunset Safari in Serengeti",
            excerpt:
              "Witnessing the incredible wildlife and breathtaking sunsets in Tanzania's Serengeti National Park.",
            image:
              "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
            date: "2023-07-10",
            author: {
              name: "John Doe",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            tags: ["safari", "tanzania", "wildlife", "africa"],
            likes: 156,
            comments: [],
          },
        ];

        setPosts(mockPosts);
        setTotalPages(2); // Mock total pages
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleLoadMore = async () => {
    if (page >= totalPages || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      // In a real app, you would fetch more posts from the API
      // const response = await profileService.getUserPosts(userId, nextPage, 5)

      // For now, we'll use mock data
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock additional posts
      const morePosts = [
        {
          id: 4,
          title: "Hidden Beaches of Portugal",
          excerpt:
            "Discovering secluded beaches and coastal treasures along Portugal's stunning Algarve coast.",
          image:
            "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
          date: "2023-06-18",
          author: {
            name: "John Doe",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          tags: ["portugal", "beaches", "travel", "europe"],
          likes: 87,
          comments: [],
        },
        {
          id: 5,
          title: "Ancient Temples of Kyoto",
          excerpt:
            "Exploring the spiritual and historical wonders of Kyoto's most beautiful temples and gardens.",
          image:
            "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
          date: "2023-05-25",
          author: {
            name: "John Doe",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          tags: ["japan", "kyoto", "temples", "culture"],
          likes: 112,
          comments: [],
        },
      ];

      setPosts((prevPosts) => [...prevPosts, ...morePosts]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more posts:", error);
      toast.error("Failed to load more posts");
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-0">
                <Skeleton className="h-64 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No posts yet</h3>
        <p className="text-muted-foreground mb-4">
          This user hasn't created any posts yet.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SocialPost post={post} />
          </motion.div>
        ))}
      </AnimatePresence>

      {page < totalPages && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6"
          >
            {isLoadingMore ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
