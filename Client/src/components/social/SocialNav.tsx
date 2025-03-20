import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  MessageSquare,
  Search,
  Settings,
  Sun,
  Moon,
  Laptop,
  LogOut,
  Shield,
  FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavItem from "../NavItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useChatStore } from "@/store/useChatStore";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { PopulatedNotification, User } from "@/types";

export default function SocialNav() {
  const { authUser, logout } = useAuthStore();
  const { 
    notifications, 
    getNotifications, 
    markAsRead, 
    markAllAsRead,
    unreadCount
  } = useNotificationStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false); 
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Get user initials for avatar fallback
  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: false });
  };

  // Handle notification click
  const handleNotificationClick = async (notification: PopulatedNotification) => {
    try {
      await markAsRead(notification._id);
      
      // If it's a message notification, navigate to the chat with that user
      if (notification.type === "message") {
        const sender = typeof notification.sender === 'object' 
          ? notification.sender 
          : { _id: notification.sender, fullName: "User" };
          
        // Store the user ID to retrieve after navigation
        localStorage.setItem('selectedChatUser', sender._id);
        
        // Navigate to messages
        navigate("/messages");
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Handle navigation to messages page
  const navigateToMessages = () => {
    // Always clear any previously selected user when navigating via the messages icon
    localStorage.removeItem('selectedChatUser');
    
    // Reset the selectedUser in chat store directly
    const chatStore = useChatStore.getState();
  chatStore.setSelectedUser(null);
  
  // Then navigate to messages page
  navigate("/messages");
};

  // Get message-related notifications
  const getMessageNotifications = () => {
    return notifications.filter(notification => notification.type === "message");
  };

  // Get unread message count
  const getUnreadMessageCount = () => {
    return getMessageNotifications().filter(notification => !notification.read).length;
  };

  // Load notifications on mount only if user is authenticated
  useEffect(() => {
    if (authUser) {
      getNotifications();
    }
  }, [authUser, getNotifications]);

  return (
    <nav className="w-full border-b border-gray-200 bg-white relative">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          {/* Search - Icon on mobile, full input on desktop */}
          {isMobile ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md"
                onClick={() => setIsSearchFocused(true)}
              >
                <Search className="h-5 w-5 text-gray-600" />
              </Button>
              {isSearchFocused && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-white rounded-lg p-4">
                    <div className="flex items-center rounded-md bg-gray-100 px-3 py-2">
                      <Search className="mr-2 h-5 w-5 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        className="ml-2"
                        onClick={() => setIsSearchFocused(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative flex items-center">
              <div className="flex items-center rounded-md bg-gray-100 px-3 py-2">
                <Search className="mr-2 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          {!isMobile && authUser && (
            <>
              <NavItem label="Account" hasDropdown />
              <NavItem label="My Network" hasDropdown={false} />
            </>
          )}

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Messages Button - Only for logged in users */}
            {authUser && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-md relative"
                onClick={navigateToMessages}
              >
                <MessageSquare className="h-6 w-6 text-gray-600" />
                {getUnreadMessageCount() > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
                    {getUnreadMessageCount() > 9 ? "9+" : getUnreadMessageCount()}
                  </span>
                )}
              </Button>
            )}
            
            {/* Settings Button - Only for logged in users */}
            {authUser && (
              <Button variant="ghost" size="icon" className="rounded-md">
                <Settings className="h-6 w-6 text-gray-600" />
              </Button>
            )}

            {/* Notifications Dropdown - Only for logged in users */}
            {authUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md relative"
                  >
                    <Bell className="h-6 w-6 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={`${isMobile ? "w-[calc(100vw-32px)]" : "w-96"}`}
                  align="end"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-sm text-red-500">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-transparent p-0 h-auto text-sm"
                      onClick={clearAllNotifications}
                    >
                      Clear all
                    </Button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const sender = notification.sender as { 
                          _id: string;
                          fullName: string;
                          profilePic?: string;
                        };
                        const message = notification.message as {
                          _id: string;
                          text?: string;
                          image?: string;
                        };
                        
                        return (
                          <div
                            key={notification._id}
                            className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex gap-3">
                              <div className="relative flex-shrink-0">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src={sender.profilePic}
                                    alt={sender.fullName}
                                  />
                                  <AvatarFallback>
                                    {getUserInitials(sender.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                {!notification.read && (
                                  <div className="absolute left-0 top-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <div>
                                    <span className="font-medium">
                                      {sender.fullName}
                                    </span>
                                    <span className="text-gray-600">
                                      {" sent you a "}
                                      {notification.type === "message" ? "message" : notification.type}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                                    {formatTime(notification.createdAt)}
                                  </span>
                                </div>
                                {message && message.text && (
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {message.text}
                                  </p>
                                )}
                                {notification.type === "message" && (
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        localStorage.setItem('selectedChatUser', sender._id);
                                        navigate("/messages");
                                      }}
                                    >
                                      Reply
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        No notifications yet
                      </div>
                    )}
                  </div>

                  <div className="p-2 flex justify-center">
                    <Button
                      variant="secondary"
                      className="w-full text-blue-600 bg-blue-50 hover:bg-blue-100"
                    >
                      See all notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Profile Dropdown or Sign In Button */}
            {authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-md p-0">
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={authUser?.profilePic || ""}
                        alt={authUser?.fullName || ""}
                      />
                      <AvatarFallback>
                        {getUserInitials(authUser.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={`${isMobile ? "w-[calc(100vw-32px)]" : "w-64"}`}
                  align="end"
                >
                  <div className="flex flex-col items-center p-4">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage
                        src={authUser?.profilePic || ""}
                        alt={authUser?.fullName || ""}
                      />
                      <AvatarFallback>
                        {getUserInitials(authUser.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-base">{authUser?.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{authUser?.email}</p>

                    <Button
                      variant="secondary"
                      className="mt-2 w-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => navigate(`/profile/${authUser?._id}`)}
                    >
                      View profile
                    </Button>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="py-2 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings & Privacy</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Documentation</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem 
                    className="py-2 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-muted-foreground">Mode:</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 bg-blue-600 text-white border-blue-600"
                      >
                        <Sun className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Moon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Laptop className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-md text-gray-600"
                onClick={() => navigate("/login")}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <span className="text-xs">G</span>
                  </AvatarFallback>
                </Avatar>
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}