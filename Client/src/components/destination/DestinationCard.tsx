import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { Destination } from "@/types";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src={destination.coverImage.url}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{destination.rating}</span>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl flex items-center gap-1">
          {destination.name}
        </CardTitle>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {destination.location.city}, {destination.location.country}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <CardDescription className="line-clamp-2">
          {destination.description}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-3">
          {destination.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-muted px-2 py-1 rounded-full font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t">
        <Link
          to={`/destinations?id=${destination._id}`}
          className="text-sm font-medium text-primary hover:underline mt-4"
        >
          View Destination
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
