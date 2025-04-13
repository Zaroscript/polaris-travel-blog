import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Settings,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  Bookmark,
  Users,
  Map,
  Share2,
  Shield,
  Heart,
  Clock,
  Images,
  UserPlus,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface ProfileSidebarProps {
  profile: any;
  isOwnProfile: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  children?: ReactNode;
}

export function ProfileSidebar({
  profile,
  isOwnProfile,
  activeTab,
  onTabChange,
  isFollowing,
  onFollow,
  onUnfollow,
  children,
}: ProfileSidebarProps) {
  const navigate = useNavigate();

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
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      {isFollowing ? (
                        <Button variant="outline" size="sm" onClick={onUnfollow}>
                          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                          Unfollow
                        </Button>
                      ) : (
                        <Button variant="default" size="sm" onClick={onFollow}>
                          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                          Follow
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => navigate(`/messages/${profile._id}`)}>
                        <Mail className="h-3.5 w-3.5 mr-1.5" />
                        Message
                      </Button>
                    </div>
                  </div>
                )}

                {isOwnProfile && (
                  <Button className="w-full" variant="outline" size="sm" onClick={() => navigate('/settings')}>
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Edit Profile
                  </Button>
                )}

                <Separator />

                {/* Additional Profile Info */}
                <div className="space-y-2 text-sm">
                  {profile.email && (
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.birthDate && (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Born on {format(new Date(profile.birthDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      Joined {format(new Date(profile.createdAt || Date.now()), "MMMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Sidebar */}
          <Card>
            <CardContent className="p-2">
              <div className="space-y-1">
                <Button
                  variant={activeTab === "posts" ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => onTabChange("posts")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Posts
                </Button>
                <Button
                  variant={activeTab === "saved" ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => onTabChange("saved")}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved Posts
                </Button>
                <Button
                  variant={activeTab === "photos" ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => onTabChange("photos")}
                >
                  <Images className="h-4 w-4 mr-2" />
                  Photos
                </Button>
                <Button
                  variant={activeTab === "liked" ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => onTabChange("liked")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Liked
                </Button>
                <Button
                  variant={activeTab === "map" ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => onTabChange("map")}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Travel Map
                </Button>
                <Button
                  variant={activeTab === "following" ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => onTabChange("following")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Following
                </Button>
                <Button
                  variant={activeTab === "followers" ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => onTabChange("followers")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Followers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Memory Section */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                Travel Memories
              </h3>
              
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {profile.visitedDestinations?.length > 0 ? (
                    profile.visitedDestinations.map((destination: any) => (
                      <div 
                        key={destination._id}
                        className="flex items-center gap-2 group hover:bg-muted p-1.5 rounded-md transition-colors"
                      >
                        <div className="h-8 w-8 rounded-md overflow-hidden">
                          <img 
                            src={destination.image} 
                            alt={destination.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{destination.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{destination.country}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground">No travel memories yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {profile.visitedDestinations?.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 text-xs" 
                  onClick={() => onTabChange("map")}
                >
                  <Map className="h-3 w-3 mr-1" />
                  View Travel Map
                </Button>
              )}
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
