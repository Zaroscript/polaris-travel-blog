import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Calendar, Users, Heart, ChevronRight } from "lucide-react";
import { Destination } from "@/types/destination";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getDestinationImageUrl, handleImageError } from "@/lib/imageUtils";

interface DestinationCardProps {
  destination: Destination;
  variant?: "default" | "featured";
  onClick?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

// Extended destination properties that might not be in the API type
interface ExtendedDestinationDetails {
  price?: number;
  duration?: number;
  groupSize?: number;
  reviewCount?: number;
}

const DestinationCard = ({ 
  destination, 
  variant = "default", 
  onClick,
  onSelect,
  isSelected = false
}: DestinationCardProps) => {
  const isFeatured = variant === "featured";
  
  // Get extended details from destination object or metadata
  // This allows us to work with the current API type while supporting additional UI elements
  const extendedDetails: ExtendedDestinationDetails = {
    price: (destination as any).price,
    duration: (destination as any).duration,
    groupSize: (destination as any).groupSize,
    reviewCount: destination.reviews?.length || (destination as any).reviewCount || 0
  };
  
  // Format price with currency
  const formatPrice = (price?: number) => {
    if (!price) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  // Get a truncated description
  const shortDescription = destination.description.length > 120 
    ? `${destination.description.substring(0, 120)}...` 
    : destination.description;

  // Handle card click - either use the onClick prop or navigate to destination page
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    // If no onClick handler, the Link will navigate normally
  };

  return (
    <Link 
      to={`/destination/${destination._id}`} 
      onClick={handleCardClick}
      className="block transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <Card className={cn(
        "group overflow-hidden transition-all duration-300 h-full",
        isSelected 
          ? "ring-2 ring-primary border-transparent shadow-md"
          : "border-border/40 hover:border-primary/30",
        isFeatured 
          ? "hover:shadow-xl" 
          : "hover:shadow-md"
      )}
      onMouseEnter={() => onSelect && onSelect()}
      >
        <div className={cn(
          "relative overflow-hidden",
          isFeatured ? "h-72" : "h-56"
        )}>
          <img
            src={getDestinationImageUrl(destination)}
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => handleImageError(e, destination.name)}
          />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{destination.rating.toFixed(1)}</span>
            <span className="text-white/70">({extendedDetails.reviewCount || destination.reviews?.length || 0})</span>
          </div>
          
          {/* Price Badge - only shown if price is available */}
          {extendedDetails.price && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary text-white px-3 py-1.5 text-xs font-semibold shadow-md">
                From {formatPrice(extendedDetails.price)}
              </Badge>
            </div>
          )}
          
          {/* Like Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md">
              <Heart className="h-4 w-4 text-rose-500" />
            </Button>
          </div>
          
          {/* Location Badge */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 max-w-[80%]">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">
              {destination.location.city}, {destination.location.country}
            </span>
          </div>

          {/* Interactive indicator overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-10">
            <div className="bg-primary text-primary-foreground text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className={cn(
              "font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors",
              isFeatured ? "text-2xl" : "text-xl"
            )}>
              {destination.name}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 space-y-3">
          {isSelected && (
            <Badge className="bg-primary text-white mb-2">
              Selected
            </Badge>
          )}
          <CardDescription className="line-clamp-2 text-muted-foreground">
            {shortDescription}
          </CardDescription>
          
          {/* Features */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {/* Display duration if available */}
            {extendedDetails.duration && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {extendedDetails.duration} days
              </span>
            )}
            
            {/* Display group size if available */}
            {extendedDetails.groupSize && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                Up to {extendedDetails.groupSize}
              </span>
            )}
            
            {/* Always show number of thingsToDo */}
            {destination.thingsToDo && destination.thingsToDo.length > 0 && (
              <span className="flex items-center gap-1">
                <span role="img" aria-label="activities" className="text-primary">✓</span>
                {destination.thingsToDo.length} activities
              </span>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {destination.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-muted/50 hover:bg-muted border-none text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
            {destination.tags.length > 3 && (
              <Badge
                variant="outline"
                className="bg-muted/50 hover:bg-muted border-none text-xs font-normal"
              >
                +{destination.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DestinationCard;
