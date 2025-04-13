import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Bookmark, 
  Users, 
  Map, 
  Heart, 
  Images 
} from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  isOwnProfile: boolean;
  onTabChange: (tab: string) => void;
  className?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  visibleToOwnerOnly?: boolean;
}

/**
 * ProfileTabs - Component for managing tab navigation in the profile page
 */
export function ProfileTabs({ 
  activeTab, 
  isOwnProfile, 
  onTabChange,
  className 
}: ProfileTabsProps) {
  // Define available tabs
  const tabs: TabItem[] = [
    { 
      id: "posts", 
      label: "Posts", 
      icon: <MessageCircle className="h-4 w-4 mr-2" /> 
    },
    { 
      id: "photos", 
      label: "Photos", 
      icon: <Images className="h-4 w-4 mr-2" /> 
    },
    { 
      id: "liked", 
      label: "Liked", 
      icon: <Heart className="h-4 w-4 mr-2" />,
      visibleToOwnerOnly: true 
    },
    { 
      id: "saved", 
      label: "Saved", 
      icon: <Bookmark className="h-4 w-4 mr-2" />,
      visibleToOwnerOnly: true 
    },
    { 
      id: "map", 
      label: "Travel Map", 
      icon: <Map className="h-4 w-4 mr-2" /> 
    },
    { 
      id: "following", 
      label: "Following", 
      icon: <Users className="h-4 w-4 mr-2" /> 
    },
    { 
      id: "followers", 
      label: "Followers", 
      icon: <Users className="h-4 w-4 mr-2" /> 
    }
  ];

  // Filter tabs based on profile ownership
  const visibleTabs = tabs.filter(tab => !tab.visibleToOwnerOnly || isOwnProfile);

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {visibleTabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "secondary" : "ghost"}
          className="w-full justify-start text-left"
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
