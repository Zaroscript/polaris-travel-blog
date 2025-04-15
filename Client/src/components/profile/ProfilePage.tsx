import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileStore } from "@/store/useProfileStore";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileHeader from "./ProfileHeader";
import TimelinePosts from "./TimelinePosts";
import SavedPosts from "./SavedPosts";
import ProfileSettings from "./ProfileSettings";
import ProfileStats from "./ProfileStats";

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, loading, error, getUser } = useProfileStore();

  useEffect(() => {
    if (userId) {
      getUser(userId);
    } else {
      getUser(); // Get current user's profile
    }
  }, [userId, getUser]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">User not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={user} />
      <ProfileStats user={user} />

      <Tabs defaultValue="timeline" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="saved">Saved Posts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <TimelinePosts userId={user._id} />
        </TabsContent>

        <TabsContent value="saved">
          <SavedPosts userId={user._id} />
        </TabsContent>

        <TabsContent value="settings">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="stats">
          <ProfileStats user={user} detailed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
