import { memo, useEffect } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import PostList from "../social/PostList";

interface TimelinePostsProps {
  userId: string;
}

const TimelinePosts = memo(({ userId }: TimelinePostsProps) => {
  const { userPosts, loading, getUserPosts } = usePostsStore();

  useEffect(() => {
    getUserPosts(userId);
  }, [userId, getUserPosts]);

  return (
    <div className="space-y-4">
      <PostList posts={userPosts} isLoading={loading} />
    </div>
  );
});

TimelinePosts.displayName = "TimelinePosts";

export default TimelinePosts;
