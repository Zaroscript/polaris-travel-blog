import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Bell, Newspaper, Settings } from "lucide-react";

const SocialSidebar = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="hidden lg:flex flex-col w-72 p-6 border-r border-border/40 sticky top-[65px] h-[calc(100vh-65px)] overflow-hidden">
      <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-border/40">
        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
          <AvatarImage src={authUser?.profilePic} />
          <AvatarFallback>{authUser?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{authUser?.fullName}</h3>
          <p className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
            View profile
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Button
          variant="ghost"
          className="w-full justify-start font-medium"
          size="lg"
        >
          <Home className="mr-3 h-5 w-5" />
          Feed
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium"
          size="lg"
        >
          <Users className="mr-3 h-5 w-5" />
          Connections
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium"
          size="lg"
        >
          <Bell className="mr-3 h-5 w-5" />
          Latest News
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium"
          size="lg"
        >
          <Newspaper className="mr-3 h-5 w-5" />
          Events
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start font-medium"
          size="lg"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default SocialSidebar;
