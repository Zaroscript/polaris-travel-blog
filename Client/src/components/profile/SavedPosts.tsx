import { memo, useEffect } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import PostList from "../social/PostList";
import { Bookmark } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SavedPostsProps {
  userId: string;
}

const SavedPosts = memo(({ userId }: SavedPostsProps) => {
  const { posts, loading, fetchSavedPosts } = usePostsStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedPosts();
  }, [userId, fetchSavedPosts]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <LoadingState text="Loading saved posts..." />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Bookmark className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold">No saved posts</h3>
        <p className="text-sm mb-4">Save posts to view them here</p>
        <Button variant="outline" onClick={() => navigate("/social")}>
          Browse posts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PostList posts={posts} isLoading={false} />
    </div>
  );
});

SavedPosts.displayName = "SavedPosts";

export default SavedPosts;
