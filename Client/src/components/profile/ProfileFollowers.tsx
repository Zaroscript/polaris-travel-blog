import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MinimalProfile } from "@/types/social";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useNavigate } from "react-router-dom";

interface ProfileFollowersProps {
  followers: MinimalProfile[];
  loading: boolean;
  isOwnProfile: boolean;
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  isFollowing: (userId: string) => boolean;
}

/**
 * ProfileFollowers - Component for displaying followers tab content in the profile page
 */
export function ProfileFollowers({ 
  followers, 
  loading, 
  isOwnProfile,
  onFollow,
  onUnfollow,
  isFollowing 
}: ProfileFollowersProps) {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingState text="Loading followers..." />;
  }

  if (!followers || followers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Followers Yet"
        description={isOwnProfile 
          ? "When people follow you, they'll appear here" 
          : "This user doesn't have any followers yet"}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Followers ({followers.length})</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {followers.map((follower) => (
          <Card key={follower._id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 flex items-center gap-3">
                <Avatar className="h-12 w-12 cursor-pointer" onClick={() => navigate(`/user/profile/${follower._id}`)}>
                  <AvatarImage src={follower.profilePic} alt={follower.fullName} />
                  <AvatarFallback>{follower.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div 
                    className="font-medium truncate hover:underline cursor-pointer"
                    onClick={() => navigate(`/user/profile/${follower._id}`)}
                  >
                    {follower.fullName}
                  </div>
                  
                  {follower.location && (
                    <div className="text-sm text-muted-foreground truncate">
                      {follower.location}
                    </div>
                  )}
                </div>
                
                {!isOwnProfile && onFollow && onUnfollow && (
                  isFollowing(follower._id) ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onUnfollow(follower._id)}
                    >
                      Following
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => onFollow(follower._id)}
                    >
                      Follow
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
