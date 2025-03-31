import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Bell, Newspaper, Settings } from "lucide-react";

const SocialSidebar = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="hidden lg:flex flex-col w-56  border-x rounded-lg border-border/40 sticky top-[85px] h-[calc(100vh-65px)] overflow-hidden">
      <div className="w-full h-14 object-cover overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1549228167-511375f69159?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D"
          alt="cover image"
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col -mt-6 items-center space-x-3 mb-8 pb-6 border-b border-border/40">
        <Avatar className="h-14 w-14 ring-2 ring-primary/10">
          <AvatarImage src={authUser?.profilePic} />
          <AvatarFallback>{authUser?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
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
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default SocialSidebar;
