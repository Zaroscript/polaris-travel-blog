import { useState } from "react";
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
import Link from "react-router-dom";

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

export default function SocialNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(4);
  const [isSearchFocused, setIsSearchFocused] = useState(false); 
  const isMobile = useIsMobile(); 

  const notifications = [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/48?img=1", 
      avatarFallback: "JN",
      name: "Judy Nguyen",
      content: "sent you a friend request.",
      time: "Just now",
      actions: [
        { label: "Accept", variant: "primary" },
        { label: "Delete", variant: "destructive" },
      ],
      isNew: true,
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/48?img=2", 
      avatarFallback: "AR",
      name: "Amanda Reed",
      content: "a happy birthday (Nov 12)",
      prefix: "Wish",
      time: "2min",
      actions: [{ label: "Say happy birthday 🎂", variant: "secondary" }],
      isNew: true,
    },
    {
      id: 3,
      avatar: "https://i.pravatar.cc/48?img=3", 
      avatarFallback: "WB",
      name: "Webestica",
      content: "has 15 like and 1 new activity",
      time: "1hr",
      isNew: true,
    },
    {
      id: 4,
      avatar: "https://i.pravatar.cc/48?img=4", 
      avatarFallback: "B",
      name: "Bootstrap in the news:",
      content:
        "The search giant's parent company, Alphabet, just joined an exclusive club of tech stocks.",
      time: "4hr",
      isNew: true,
    },
  ];

  const clearAllNotifications = () => {
    setUnreadNotifications(0);
    // Update the notifications to mark them as read
  };

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
          {!isMobile && (
            <>
              <NavItem label="Account" hasDropdown />
              <NavItem label="My Network" hasDropdown={false} />
            </>
          )}

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-md relative">
              <MessageSquare className="h-6 w-6 text-gray-600" />
              {unreadMessages > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-md">
              <Settings className="h-6 w-6 text-gray-600" />
            </Button>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-md relative"
                >
                  <Bell className="h-6 w-6 text-gray-600" />
                  {unreadNotifications > 0 && (
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
                    {unreadNotifications > 0 && (
                      <span className="text-sm text-red-500">
                        {unreadNotifications} new
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
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b hover:bg-gray-50"
                    >
                      <div className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={notification.avatar}
                              alt={notification.name}
                            />
                            <AvatarFallback>
                              {notification.avatarFallback}
                            </AvatarFallback>
                          </Avatar>
                          {notification.isNew && (
                            <div className="absolute left-0 top-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <div>
                              {notification.prefix && (
                                <span className="text-gray-600">
                                  {notification.prefix}{" "}
                                </span>
                              )}
                              <span className="font-medium">
                                {notification.name}
                              </span>
                              <span className="text-gray-600">
                                {" "}
                                {notification.content}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                              {notification.time}
                            </span>
                          </div>
                          {notification.actions && (
                            <div className="flex gap-2 mt-2">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  variant={
                                    action.variant === "primary"
                                      ? "default"
                                      : action.variant === "destructive"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className={
                                    action.variant === "destructive"
                                      ? "text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50"
                                      : action.variant === "secondary"
                                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                      : ""
                                  }
                                  size="sm"
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 flex justify-center">
                  <Button
                    variant="secondary"
                    className="w-full text-blue-600 bg-blue-50 hover:bg-blue-100"
                  >
                    See all incoming activity
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-md p-0">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src="https://i.pravatar.cc/64?img=1"
                      alt="profile"
                    />
                    <AvatarFallback>LF</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`${isMobile ? "w-[calc(100vw-32px)]" : "w-64"}`}
                align="end"
              >
                <div className="flex flex-col items-center p-4">
                  <Avatar className="h-16 w-16 mb-2">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage
                        src="https://i.pravatar.cc/64?img=1"
                        alt="Lori Ferguson"
                      />
                      <AvatarFallback>LF</AvatarFallback>
                    </Avatar>
                    <AvatarFallback>LF</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-base">Lori Ferguson</h3>
                  <p className="text-sm text-muted-foreground">Web Developer</p>

                  <Button
                    variant="secondary"
                    className="mt-2 w-full bg-blue-50 text-blue-600 hover:bg-blue-100"
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

                <DropdownMenuItem className="py-2 cursor-pointer">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
