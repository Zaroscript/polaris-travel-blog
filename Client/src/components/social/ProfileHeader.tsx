import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  Calendar,
  MoreHorizontal,
  PenSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileHeaderProps {
  coverImage: string;
  profileImage: string;
  name: string;
  role: string;
  location: string;
  connections: number;
  isVerified?: boolean;
  joinedDate: string;
  email: string;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
}

const ProfileHeader = ({
  coverImage,
  profileImage,
  name,
  role,
  location,
  connections,
  isVerified = false,
  joinedDate,
  email,
  isOwnProfile = false,
  onEditProfile,
}: ProfileHeaderProps) => {
  return (
    <div className="relative mb-6">
      {/* Cover Image */}
      <div className="h-[300px] w-full overflow-hidden rounded-lg">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info Overlay */}
      <div className="absolute -bottom-6 left-0 right-0 px-6">
        <div className="flex items-end justify-between">
          <div className="flex items-end space-x-4">
            {/* Profile Picture */}
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={profileImage} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Basic Info */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">{name}</h1>
                {isVerified && (
                  <Badge variant="secondary" className="rounded-full">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{role}</p>
              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {email}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {joinedDate}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 mb-4">
            {isOwnProfile ? (
              <Button
                variant="outline"
                className="space-x-2"
                onClick={onEditProfile}
              >
                <PenSquare className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <Button className="space-x-2">
                <span>Connect</span>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Share Profile</DropdownMenuItem>
                <DropdownMenuItem>Block User</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 mt-4">
          <Button variant="ghost" className="text-base font-semibold">
            {connections} connections
          </Button>
          <Button variant="ghost" className="text-base font-semibold">
            Posts
          </Button>
          <Button variant="ghost" className="text-base font-semibold">
            Photos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
