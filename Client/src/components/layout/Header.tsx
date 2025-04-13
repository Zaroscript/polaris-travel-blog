import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useChatStore } from "@/store/useChatStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/utils/date";
import toast from "react-hot-toast";
import { PopulatedNotification } from "@/types";
import MobileNav from "../navbar/MobileNav";
import { navItems } from "@/constants";
import ProfileCard from "../navbar/ProfileCard";
import { ThemeToggle } from "../theme/ThemeToggle";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser, logout } = useAuthStore();
  const {
    notifications,
    getNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotificationStore();
  const { unreadMessages } = useChatStore();
  const { theme, setTheme } = useThemeStore();
  const isActive = (path: string) => location.pathname === path;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (authUser) {
      getNotifications();
    }
  }, [authUser, getNotifications]);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const handleNotificationClick = async (
    notification: PopulatedNotification
  ) => {
    try {
      await markAsRead(notification._id);

      if (notification.type === "message") {
        const sender =
          typeof notification.sender === "object"
            ? notification.sender
            : { _id: notification.sender, fullName: "User" };

        localStorage.setItem("selectedChatUser", sender._id);
        navigate("/messages");
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-background/80 backdrop-blur-md shadow-sm border-b border-border/40"
          : "bg-white dark:bg-background border-b border-border/20"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src={theme !== "light" ? "/logoDark.svg" : "/logo.svg"}
              alt="Polaris"
              className="w-10 h-10 transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Polaris
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons and User Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {authUser ? (
              <>
                {/* Messages */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-muted/50"
                  asChild
                >
                  <Link to="/messages">
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center"
                      >
                        {unreadMessages}
                      </motion.span>
                    )}
                  </Link>
                </Button>

                {/* Notifications */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-muted/50"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center"
                        >
                          {unreadCount}
                        </motion.span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h4 className="font-semibold">Notifications</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs hover:bg-muted/50"
                        onClick={clearAllNotifications}
                      >
                        Mark all as read
                      </Button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 hover:bg-muted/50 cursor-pointer border-b last:border-0 transition-colors"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {typeof notification.sender === "object"
                                  ? notification.sender.fullName
                                  : "User"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {typeof notification.message === "string"
                                  ? notification.message
                                  : typeof notification.message === "object"
                                  ? notification.message.text || "New message"
                                  : "New message"}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <Button
                        variant="ghost"
                        className="w-full hover:bg-muted/50"
                        size="sm"
                        asChild
                      >
                        <Link to="/coming-soon">View all notifications</Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <ThemeToggle />

                <ProfileCard authUser={authUser} handleLogout={handleLogout} />
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:bg-muted/50">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileNav
            navItems={navItems}
            isActive={isActive}
            authUser={authUser}
            unreadMessages={unreadMessages}
            unreadCount={unreadCount}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
