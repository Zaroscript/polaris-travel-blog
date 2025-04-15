import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Bell, Newspaper, Settings, Bookmark, Globe, Compass, UserCircle, Image, MessageCircle, Plus } from "lucide-react";
import { getCoverImage, getProfilePic } from "@/lib/placeholders";
import { useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SocialSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  suggestedConnections?: any[];
  following?: string[];
  onFollow?: (userId: string) => Promise<void>;
}

const SocialSidebar = ({ 
  activeTab, 
  onTabChange, 
  suggestedConnections = [], 
  following = [],
  onFollow 
}: SocialSidebarProps) => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  
  // Filter out users that are already being followed and limit to 3
  const limitedConnections = suggestedConnections
    ?.filter((connection) => !following?.includes(connection._id))
    .slice(0, 3) || [];

  return (
    <div className="hidden lg:flex flex-col w-64 shadow-sm bg-card rounded-lg border border-primary/10 sticky top-[85px] h-[calc(100vh-90px)] overflow-hidden">
      {/* Cover Image & Profile */}
      <div className="relative mb-16">
        <div className="w-full h-24 bg-gradient-to-r from-primary/20 to-primary/5 overflow-hidden">
          <img
            src={getCoverImage(authUser?.coverImage)}
            alt="cover image"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
            <AvatarImage src={getProfilePic(authUser?.profilePic)} />
            <AvatarFallback>{authUser?.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="text-center mt-2">
            <h3 className="font-semibold text-base">{authUser?.fullName || "User"}</h3>
            <p className="text-xs text-primary hover:underline cursor-pointer transition-colors">
              @{authUser?.fullName?.toLowerCase().replace(/\s/g, '') || "username"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-6">
        <div className="flex flex-col items-center p-2 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
          <span className="font-semibold text-sm">
            {authUser?.posts?.length || 0}
          </span>
          <span className="text-xs text-muted-foreground">Posts</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
          <span className="font-semibold text-sm">
            {authUser?.followers?.length || 0}
          </span>
          <span className="text-xs text-muted-foreground">Followers</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-md hover:bg-primary/5 transition-colors cursor-pointer">
          <span className="font-semibold text-sm">
            {authUser?.following?.length || 0}
          </span>
          <span className="text-xs text-muted-foreground">Following</span>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Navigation */}
      <div className="px-4 space-y-1">
        <Button
          variant={activeTab === "feed" ? "secondary" : "ghost"}
          className="w-full justify-start font-medium text-sm"
          size="sm"
          onClick={() => onTabChange("feed")}
        >
          <Home className="mr-3 h-4 w-4" />
          Home Feed
        </Button>
        <Button
          variant={activeTab === "explore-travelers" ? "secondary" : "ghost"}
          className="w-full justify-start font-medium text-sm"
          size="sm"
          onClick={() => onTabChange("explore-travelers")}
        >
          <Users className="mr-3 h-4 w-4" />
          Explore Travelers
        </Button>
        <Button
          variant={activeTab === "notifications" ? "secondary" : "ghost"}
          className="w-full justify-start font-medium text-sm"
          size="sm"
          onClick={() => onTabChange("notifications")}
        >
          <Bell className="mr-3 h-4 w-4" />
          Notifications
          <Badge className="ml-auto bg-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">3</Badge>
        </Button>
        
        <Button
          variant={activeTab === "saved" ? "secondary" : "ghost"}
          className="w-full justify-start font-medium text-sm"
          size="sm"
          onClick={() => onTabChange("saved")}
        >
          <Bookmark className="mr-3 h-4 w-4" />
          Saved Posts
        </Button>
        
      </div>

      <Separator className="my-4" />
      
      {/* People You May Know Section */}
      {limitedConnections.length > 0 ? (
        <div className="px-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">People you may know</h4>
          <div className="space-y-3">
            {limitedConnections.map((connection) => (
              <div
                key={connection._id}
                className="flex items-center justify-between group hover:bg-muted/30 p-2 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 border border-primary/10">
                    <AvatarImage src={getProfilePic(connection.profilePic)} />
                    <AvatarFallback>
                      {connection.fullName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-xs group-hover:text-primary transition-colors line-clamp-1">
                      {connection.fullName || "Unknown User"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {connection.role || "Traveler"}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 rounded-full"
                  onClick={() => onFollow && onFollow(connection._id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )) }
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 text-xs font-medium text-primary"
            onClick={() => onTabChange('explore-travelers')}
          >
            View all
          </Button>
        </div>
      ) : (
        <div className="px-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">People you may know</h4>
          <div className="text-center text-sm text-muted-foreground">
            No suggestions found
          </div>
        </div>
      )}

      <Separator className="mb-4" />

      <div className="mt-auto px-4 pb-6">
        <Button
          variant="outline"
          className="w-full justify-start font-medium border-primary/20"
          size="sm"
          onClick={() => navigate("/settings/")}
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default SocialSidebar;
