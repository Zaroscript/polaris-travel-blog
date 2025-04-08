import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Globe,
  Calendar,
  Mail,
  Edit2,
  Flag,
  AlertTriangle,
  UserMinus,
  UserPlus,
  MessageCircle,
  Camera,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface ProfileHeaderProps {
  coverImage: string;
  profileImage: string;
  name: string;
  location: string;
  age: string;
  email: string;
  isOwnProfile: boolean;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  onEditProfile: () => void;
  onBlockUser: () => void;
  onReportUser: () => void;
  onFollow: () => void;
  onUnfollow: () => void;
  onChat: () => void;
}

const ProfileHeader = ({
  coverImage,
  profileImage,
  name,
  location,
  age,
  email,
  isOwnProfile,
  isFollowing,
  followersCount,
  followingCount,
  postsCount,
  onEditProfile,
  onBlockUser,
  onReportUser,
  onFollow,
  onUnfollow,
  onChat,
}: ProfileHeaderProps) => {
  return (
    <Card className="relative overflow-hidden border-2 border-primary/20">
      {/* Cover Image */}
      <div className="h-48 relative overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5">
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        <div className="absolute -top-16 left-6">
          <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary/20 shadow-xl">
            <AvatarImage src={profileImage} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </div>

        <div className="pt-20">
          {/* Profile Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{location}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button onClick={onEditProfile} variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={isFollowing ? onUnfollow : onFollow}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onChat}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={onBlockUser}
                        className="text-destructive"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Block User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={onReportUser}
                        className="text-destructive"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-6 py-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-semibold">{postsCount}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Camera className="h-4 w-4" /> Posts
              </div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-2xl font-semibold">{followersCount}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Users className="h-4 w-4" /> Followers
              </div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-2xl font-semibold">{followingCount}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Users className="h-4 w-4" /> Following
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{age} years old</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
