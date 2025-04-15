import { Link } from "react-router-dom";
import { User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  activePath: string;
};

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
  return (
    <nav className="space-y-2 px-4 py-6">
      <Link to="/user/settings">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-base font-medium",
            activePath === "/settings/" && "bg-primary/10 text-primary"
          )}
        >
          <User className="h-5 w-5" />
          Account Settings
        </Button>
      </Link>

      <Link to="/user/settings/notification">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-base font-medium",
            activePath === "/user/settings/notification" &&
              "bg-primary/10 text-primary"
          )}
        >
          <Bell className="h-5 w-5" />
          Notification
        </Button>
      </Link>
    </nav>
  );
};

export default Sidebar;
