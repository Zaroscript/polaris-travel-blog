import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  mutualConnections: number;
  isFollowing?: boolean;
}

interface FriendsGridProps {
  friends: Friend[];
  maxDisplay?: number;
  onSeeAll?: () => void;
  onToggleFollow: (friendId: string) => void;
}

const FriendsGrid = ({
  friends,
  maxDisplay = 4,
  onSeeAll,
  onToggleFollow,
}: FriendsGridProps) => {
  const displayFriends = friends.slice(0, maxDisplay);
  const remainingCount = Math.max(0, friends.length - maxDisplay);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle>Friends</CardTitle>
          <span className="text-sm text-muted-foreground">
            ({friends.length})
          </span>
        </div>
        {remainingCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onSeeAll}>
            See all
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {displayFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{friend.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {friend.mutualConnections} mutual connections
                </p>
              </div>
              <Button
                variant={friend.isFollowing ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "flex-shrink-0",
                  friend.isFollowing &&
                    "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onToggleFollow(friend.id)}
              >
                {friend.isFollowing ? (
                  <UserMinus className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendsGrid;
