import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { RightSidebarProps } from "@/types/social";



const RightSidebar = ({
  suggestedConnections,
  following,
  onFollow,
  newsItems,
}: RightSidebarProps) => {
  return (
    <div className="hidden xl:flex flex-col w-60 p-6 border-x border-border/40 sticky top-[65px] h-[calc(100vh-65px)] overflow-hidden">
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
                  <AvatarImage src={connection.profileImage} />
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
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10",
                  following && "text-primary"
                )}
                onClick={() => onFollow(connection.name)}
              >
                {following ? (
                  <UserMinus className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
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
