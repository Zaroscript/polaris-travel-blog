import { useNavigate } from "react-router-dom";
import { Map, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Destination } from "@/types/destination";
import DestinationMap from "@/components/destination/DestinationMap";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";

interface ProfileMapProps {
  destinations?: Destination[];
  loading: boolean;
  isOwnProfile: boolean;
}

/**
 * ProfileMap - Component for displaying the travel map tab in the profile page
 */
export function ProfileMap({ 
  destinations, 
  loading, 
  isOwnProfile 
}: ProfileMapProps) {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingState text="Loading travel map..." />;
  }

  const hasDestinations = destinations && destinations.length > 0;

  if (!hasDestinations) {
    return (
      <EmptyState
        icon={Map}
        title="No Destinations Yet"
        description={isOwnProfile 
          ? "Add your visited destinations to see them on your travel map" 
          : "This user hasn't added any destinations to their travel map yet"}
        action={isOwnProfile ? {
          label: "Add Destinations",
          onClick: () => navigate('/destinations'),
          icon: PlusCircle
        } : undefined}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] rounded-lg overflow-hidden">
          <DestinationMap destinations={destinations} />
        </div>
        
        {hasDestinations && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Recently Visited Destinations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.slice(0, 8).map((destination) => (
                <div key={destination._id} className="group relative rounded-lg overflow-hidden h-32">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                    <h4 className="text-white font-medium text-sm">{destination.name}</h4>
                    <p className="text-white/80 text-xs">{destination.country}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {destinations.length > 8 && (
              <div className="text-center mt-4">
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigate('/destinations')}>
                  View All ({destinations.length}) Destinations
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
