import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestedConnection {
  name: string;
  avatar: string;
  role: string;
}

interface RightSidebarProps {
  suggestedConnections: SuggestedConnection[];
  following: { [key: string]: boolean };
  onFollow: (userId: string) => void;
  newsItems: string[];
}

const RightSidebar = ({
  suggestedConnections,
  following,
  onFollow,
  newsItems,
}: RightSidebarProps) => {
  return (
    <div className="hidden xl:flex flex-col w-80 p-6 border-l border-border/40 sticky top-[65px] h-[calc(100vh-65px)] overflow-hidden">
      {/* Suggested Connections */}
      <div className="mb-8 pb-8 border-b border-border/40">
        <h3 className="font-semibold mb-4 text-base">People you may know</h3>
        <div className="space-y-4">
          {suggestedConnections.map((connection, index) => (
            <div
              key={index}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  <AvatarImage src={connection.avatar} />
                  <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {connection.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {connection.role}
                  </p>
                </div>
              </div>
              <Button
                variant={following[connection.name] ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "hover:bg-primary/10 hover:text-primary transition-colors",
                  following[connection.name] && "bg-primary/10 text-primary"
                )}
                onClick={() => onFollow(connection.name)}
              >
                {following[connection.name] ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Today's News */}
      <div>
        <h3 className="font-semibold mb-4 text-base">Today's news</h3>
        <div className="space-y-4">
          {newsItems.map((news, index) => (
            <div key={index} className="group cursor-pointer">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">
                {news}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
