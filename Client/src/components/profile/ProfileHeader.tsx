import { Camera, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileUser } from "@/types/social";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  profile: ProfileUser | null;
  isOwnProfile: boolean;
}

/**
 * ProfileHeader - Component for displaying the profile header with cover image
 */
export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="pb-8">
      <div className="relative w-full h-48 md:h-60 lg:h-72 rounded-xl overflow-hidden bg-gradient-to-r from-primary/30 to-primary/10">
        {profile.coverImage ? (
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="h-16 w-16 text-muted-foreground/20" />
          </div>
        )}
        
        {isOwnProfile && (
          <Button 
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background/95"
            onClick={() => navigate('/settings')}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
