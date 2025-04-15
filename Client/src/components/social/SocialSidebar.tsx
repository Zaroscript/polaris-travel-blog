import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Bell, Newspaper, Settings, Bookmark, Globe, Compass, UserCircle, Image, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SocialSidebar = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="hidden lg:flex flex-col w-64 shadow-sm bg-card rounded-lg border border-primary/10 sticky top-[85px] h-[calc(100vh-90px)] overflow-hidden">
      {/* Cover Image & Profile */}
      <div className="relative mb-16">
        <div className="w-full h-24 bg-gradient-to-r from-primary/20 to-primary/5 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1549228167-511375f69159?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D"
            alt="cover image"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
            <AvatarImage src={authUser?.profilePic} />
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
          variant="ghost"
          className="w-full justify-start font-medium text-sm"
          size="sm"
        >
          <Home className="mr-3 h-4 w-4" />
          Home Feed
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium text-sm"
          size="sm"
        >
          <Compass className="mr-3 h-4 w-4" />
          Explore
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium text-sm"
          size="sm"
        >
          <Bell className="mr-3 h-4 w-4" />
          Notifications
          <Badge className="ml-auto bg-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">3</Badge>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium text-sm"
          size="sm"
        >
          <MessageCircle className="mr-3 h-4 w-4" />
          Messages
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium text-sm"
          size="sm"
        >
          <Bookmark className="mr-3 h-4 w-4" />
          Saved Posts
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium text-sm"
          size="sm"
        >
          <UserCircle className="mr-3 h-4 w-4" />
          My Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium text-sm"
          size="sm"
        >
          <Image className="mr-3 h-4 w-4" />
          Photos
        </Button>
      </div>

      <Separator className="my-4" />

      {/* Explore Section */}
      <div className="px-4 mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Explore Destinations</h3>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start font-medium text-xs"
            size="sm"
          >
            <Globe className="mr-3 h-4 w-4 text-primary" />
            Europe
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-medium text-xs"
            size="sm"
          >
            <Globe className="mr-3 h-4 w-4 text-primary" />
            Asia
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-medium text-xs"
            size="sm"
          >
            <Globe className="mr-3 h-4 w-4 text-primary" />
            Americas
          </Button>
        </div>
      </div>

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
