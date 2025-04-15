import { memo, useCallback, useState } from "react";
import { Post } from "@/types/social";
import PostCard from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostsStore } from "@/store/usePostsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/use-toast";

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  onPostClick?: (postId: string) => void;
}

const PostList = memo(({ posts, isLoading, onPostClick }: PostListProps) => {
  const { authUser } = useAuthStore();
  const { savePost, unsavePost } = usePostsStore();
  const { toast } = useToast();
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const handleSave = useCallback(
    async (postId: string) => {
      try {
        const isSaved = posts
          .find((p) => p._id === postId)
          ?.savedBy?.includes(authUser?._id || "");
        if (isSaved) {
          await unsavePost(postId);
        } else {
          await savePost(postId);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save post",
          variant: "destructive",
        });
      }
    },
    [posts, authUser?._id, savePost, unsavePost, toast]
  );

  const handleCopyLink = useCallback((postId: string) => {
    const url = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-[200px] w-full mt-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          isSaved={post.savedBy?.includes(authUser?._id || "") || false}
          isFollowing={
            post.author.followers?.includes(authUser?._id || "") || false
          }
          isCopied={copiedPostId === post._id}
          onSave={handleSave}
          onCopyLink={handleCopyLink}
          onClick={() => onPostClick?.(post._id)}
        />
      ))}
    </div>
  );
});

PostList.displayName = "PostList";

export default PostList;
