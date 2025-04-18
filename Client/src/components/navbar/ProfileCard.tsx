import { Avatar } from "@radix-ui/react-avatar";
import React from "react";
import { AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileCard({ authUser, handleLogout }) {
  return (
    <>
      {/* Profile Menu */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 rounded-full hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 ">
                <AvatarImage
                  className="rounded-full object-cover"
                  src={authUser.profilePic}
                  alt={authUser.fullName}
                />
                <AvatarFallback>{authUser.fullName?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center space-x-2 p-2 border-b">
            <Avatar className="h-10 w-10 ">
              <AvatarImage
                className="rounded-full object-cover"
                src={authUser.profilePic}
                alt={authUser.fullName}
              />
              <AvatarFallback>{authUser.fullName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{authUser.fullName}</p>
            </div>
          </div>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              to={`/user/profile/${authUser._id}`}
              className="flex items-center"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to='/user/settings' className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center text-red-600 focus:text-red-600 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
