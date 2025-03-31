import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  MenuIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = ({
  navItems,
  isActive,
  authUser,
  unreadMessages,
  unreadCount,
  handleLogout,
}) => {
  return (
    <>
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50"
            aria-label="Open navigation menu"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px] p-0"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Polaris" className="w-8 h-8" />
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Polaris
                </span>
              </div>
            </div>
            <nav
              className="flex-1 overflow-y-auto p-4"
              aria-label="Main navigation"
            >
              <div className="flex flex-col space-y-4">
                {/* Navigation Links */}
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive(item.path)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                      )}
                      aria-current={isActive(item.path) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* User Section */}
                {authUser ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="h-12 w-12 ring-2 ring-border/20">
                        <AvatarImage
                          src={authUser.profilePic}
                          alt={authUser.fullName}
                        />
                        <AvatarFallback>
                          {authUser.fullName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{authUser.fullName}</p>
                      </div>
                    </div>

                    <div className="space-y-1" role="menu">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted/50"
                        asChild
                      >
                        <Link to="/messages" className="flex items-center">
                          <MessageSquare
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Messages
                          {unreadMessages > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {unreadMessages}
                            </span>
                          )}
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted/50"
                        asChild
                      >
                        <Link to="/notifications" className="flex items-center">
                          <Bell className="mr-2 h-4 w-4" aria-hidden="true" />
                          Notifications
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted/50"
                        asChild
                      >
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" aria-hidden="true" />
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-muted/50"
                        asChild
                      >
                        <Link to="/settings" className="flex items-center">
                          <Settings
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Settings
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full hover:bg-muted/50"
                      asChild
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      asChild
                    >
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNav;
