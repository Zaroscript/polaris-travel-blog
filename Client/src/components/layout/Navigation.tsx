import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-6xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-semibold text-xl">
            Polaris
          </Link>
          <Link to="/social" className="text-sm font-medium">
            Social
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Profile"
                  />
                  <AvatarFallback>SL</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  Your Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
