import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Globe,
  Calendar,
  Mail,
  Edit2,
  Flag,
  AlertTriangle,
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
  country: string;
  age: number;
  email: string;
  isOwnProfile: boolean;
  onEditProfile: () => void;
  onBlockUser: () => void;
  onReportUser: () => void;
}

const ProfileHeader = ({
  coverImage,
  profileImage,
  name,
  location,
  country,
  age,
  email,
  isOwnProfile,
  onEditProfile,
  onBlockUser,
  onReportUser,
}: ProfileHeaderProps) => {
  return (
    <Card className="relative overflow-hidden border-2 border-primary/20">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Passport-like Profile Section */}
      <div className="relative px-6 pb-6">
        <div className="absolute -top-16 left-6">
          <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary/20">
            <AvatarImage src={profileImage} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="pt-20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {location}, {country}
                </span>
              </div>
            </div>

            {isOwnProfile ? (
              <Button onClick={onEditProfile} variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
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
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
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
