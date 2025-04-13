import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserMinus, ExternalLink, TrendingUp, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { RightSidebarProps } from "@/types/social";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const RightSidebar = ({
  suggestedConnections,
  following,
  onFollow,
  newsItems,
}: RightSidebarProps) => {
  // Filter out users that are already being followed and limit to 5
  const limitedConnections =
    suggestedConnections
      ?.filter((connection) => !following?.includes(connection._id))
      .slice(0, 5) || [];

  return (
    <div className="hidden xl:flex flex-col w-72 sticky top-[85px] h-[calc(100vh-90px)] overflow-y-auto overflow-x-hidden pb-6">
      {/* Suggested Connections */}
      <Card className="border-primary/10 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">People you may know</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {limitedConnections.length > 0 ? (
              limitedConnections.map((connection) => (
                <div
                  key={connection._id}
                  className="flex items-center justify-between group hover:bg-muted/30 p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border border-primary/10">
                      <AvatarImage src={connection.profilePic} />
                      <AvatarFallback>
                        {connection.fullName?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {connection.fullName || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {connection.role || "Traveler"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 px-2 rounded-full text-xs border-primary/20 hover:bg-primary/5 hover:text-primary",
                      following?.includes(connection._id) && "text-primary"
                    )}
                    onClick={() => onFollow(connection._id)}
                  >
                    {following?.includes(connection._id) ? (
                      <>
                        <UserMinus className="h-3 w-3 mr-1" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No suggestions available
              </div>
            )}
          </div>
          {limitedConnections.length > 0 && (
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-primary">
              See more suggestions
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Trending Destinations */}
      <Card className="border-primary/10 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Trending destinations</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {['Paris, France', 'Bali, Indonesia', 'Santorini, Greece'].map((destination, idx) => (
              <div key={idx} className="group flex items-start gap-3 hover:bg-muted/30 p-2 rounded-md transition-colors">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm group-hover:text-primary">{destination}</p>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-primary/20">
                      <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                      <span>+{Math.floor(Math.random() * 30) + 5}%</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {idx === 0 ? "Historic landmarks and romantic cafes" : 
                    idx === 1 ? "Beautiful beaches and spiritual retreats" : 
                    "Stunning sunsets and blue-domed churches"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-2 text-xs text-primary">
            <MapPin className="h-3 w-3 mr-1" />
            Explore all destinations
          </Button>
        </CardContent>
      </Card>

      {/* Today's News */}
      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Travel news & updates</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {newsItems?.map((news, index) => (
              <div key={index} className="group hover:bg-muted/30 p-2 rounded-md transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {news}
                  </p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>April {Math.floor(Math.random() * 12) + 1}, 2025</span>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <Button variant="link" className="h-auto p-0 text-xs text-primary w-full justify-center" size="sm">
            <span>View all news</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-primary/10 shadow-sm mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Upcoming travel events</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="group hover:bg-muted/30 p-2 rounded-md transition-colors">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded flex flex-col items-center justify-center">
                  <span className="text-xs font-semibold text-primary">APR</span>
                  <span className="text-sm font-bold text-primary">15</span>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-primary">Travel Photography Workshop</p>
                  <p className="text-xs text-muted-foreground">Virtual Event • 3:00 PM</p>
                </div>
              </div>
            </div>
            <div className="group hover:bg-muted/30 p-2 rounded-md transition-colors">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded flex flex-col items-center justify-center">
                  <span className="text-xs font-semibold text-primary">APR</span>
                  <span className="text-sm font-bold text-primary">20</span>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-primary">Barcelona Meetup</p>
                  <p className="text-xs text-muted-foreground">Sagrada Familia • 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" className="w-full mt-2 text-xs text-primary">
            <Calendar className="h-3 w-3 mr-1" />
            View all events
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;
