import { useState, useEffect } from "react";
import { Grid, List, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Post } from "@/types/social";
import PostCard from "@/components/social/PostCard";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { usePosts } from "@/hooks/use-posts";

interface ProfilePostsProps {
  userId: string;
  isOwnProfile: boolean;
  profileName?: string;
}

/**
 * ProfilePosts - Component for displaying posts tab content in the profile page
 */
export function ProfilePosts({ userId, isOwnProfile, profileName }: ProfilePostsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { posts, loading, likePost, savePost, fetchUserPosts } = usePosts();

  useEffect(() => {
    // Fetch posts for the specific user when component mounts or userId changes
    const loadUserPosts = async () => {
      try {
        await fetchUserPosts(userId);
      } catch (error) {
        // Error is already handled by the usePosts hook
        console.error("Error loading user posts:", error);
      }
    };
    
    loadUserPosts();
  }, [userId, fetchUserPosts]);

  // Create post content to display in the empty state
  const getEmptyStateContent = () => {
    return {
      title: "No Posts Yet",
      description: isOwnProfile 
        ? "You haven't created any posts yet. Share your travel experiences with the world!" 
        : `${profileName || 'This user'} hasn't posted any travel experiences yet.`,
    };
  };

  // Handler for copying post link
  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
  };

  if (loading) {
    return <LoadingState text="Loading posts..." />;
  }

  if (!posts || posts.length === 0) {
    const { title, description } = getEmptyStateContent();
    return (
      <EmptyState
        icon={MessageCircle}
        title={title}
        description={description}
      />
    );
  }

  return (
    <>
      {/* View Mode Selector */}
      <div className="flex justify-end">
        <div className="bg-white dark:bg-gray-900 p-1 rounded-full border flex">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${viewMode === 'list' ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Posts Grid/List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
          : "space-y-6"
        }
      >
        {posts.map((post: Post) => (
          <PostCard
            key={post._id}
            post={post}
            onLike={(postId) => void likePost(postId)}
            onSave={(postId) => void savePost(postId)}
            onCopyLink={handleCopyLink}
            isLiked={!!post.isLiked}
            isSaved={!!post.isSaved}
            isFollowing={false} // This will be updated by parent component
            compact={viewMode === "grid"}
          />
        ))}
      </motion.div>
    </>
  );
}
