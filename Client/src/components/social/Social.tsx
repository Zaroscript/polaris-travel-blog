import { useEffect } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import { useProfileStore } from "@/store/useProfileStore";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const Social = () => {
  const { posts, loading, error, fetchPosts } = usePostsStore();
  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchPosts();
    fetchProfile("current-user-id"); // Replace with actual user ID
  }, [fetchPosts, fetchProfile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Feed</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      <CreatePost />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Social;
