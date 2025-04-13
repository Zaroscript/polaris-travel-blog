import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, MapPin, Calendar, Mail } from "lucide-react";
import { format } from "date-fns";
import { ProfileTabs } from "./ProfileTabs";
import { ProfileUser } from "@/types/social";

interface ProfileContainerProps {
  profile: ProfileUser | null;
  isOwnProfile: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isFollowing: boolean;
  onFollow: () => Promise<void>;
  onUnfollow: () => Promise<void>;
  children: ReactNode;
}

/**
 * ProfileContainer - Main profile layout component that organizes sidebar and content
 */
export function ProfileContainer({
  profile,
  isOwnProfile,
  activeTab,
  onTabChange,
  isFollowing,
  onFollow,
  onUnfollow,
  children,
}: ProfileContainerProps) {
  const [isFollowHovered, setIsFollowHovered] = useState(false);

  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Sidebar */}
      <div className="md:col-span-1">
        <div className="space-y-6 sticky top-20">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-primary/30 to-primary/10 rounded-t-lg">
                  {profile.coverImage && (
                    <img
                      src={profile.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                </div>
                <Avatar className="absolute -bottom-6 left-4 h-16 w-16 border-4 border-background">
                  <AvatarImage src={profile.profilePic} alt={profile.fullName} className="object-cover" />
                  <AvatarFallback className="text-lg">
                    {profile.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="p-4 pt-8 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {profile.fullName}
                    {profile.isVerified && (
                      <Badge variant="outline" className="text-blue-500 h-5">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </h2>
                  
                  {profile.location && (
                    <p className="text-muted-foreground text-sm flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {profile.location}
                    </p>
                  )}
                </div>

                {profile.about && (
                  <p className="text-sm text-foreground/90">{profile.about}</p>
                )}

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{profile.postsCount || 0}</span>
                    <span className="text-muted-foreground text-xs">Posts</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{profile.followers?.length || 0}</span>
                    <span className="text-muted-foreground text-xs">Followers</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{profile.following?.length || 0}</span>
                    <span className="text-muted-foreground text-xs">Following</span>
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="flex items-center gap-2">
                    {isFollowing ? (
                      <Button
                        variant={isFollowHovered ? "destructive" : "secondary"}
                        className="w-full"
                        onMouseEnter={() => setIsFollowHovered(true)}
                        onMouseLeave={() => setIsFollowHovered(false)}
                        onClick={onUnfollow}
                      >
                        {isFollowHovered ? "Unfollow" : "Following"}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={onFollow}
                      >
                        Follow
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = "/user/settings"}
                  >
                    Edit Profile
                  </Button>
                )}

                {profile.birthDate && (
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Joined {format(new Date(profile.birthDate), "MMMM yyyy")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Navigation Tabs */}
          <Card>
            <CardContent className="p-4">
              <ProfileTabs
                activeTab={activeTab}
                isOwnProfile={isOwnProfile}
                onTabChange={onTabChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-3">
        {children}
      </div>
    </div>
  );
}
