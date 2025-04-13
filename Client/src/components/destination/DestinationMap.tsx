import React, { useState, useEffect, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Destination } from "@/types/destination";
import { useThemeStore } from "@/store/useThemeStore";
import { ZoomIn, ZoomOut, List, MapPin, X, Search, Info, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getDestinationImageUrl, handleImageError } from "@/lib/imageUtils";

// World map GeoJSON - higher resolution for better country details
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// Color scale for countries
const generateCountryColor = (countryName: string, isDarkMode: boolean) => {
  // Create a simple hash from the country name for consistent colors
  let hash = 0;
  for (let i = 0; i < countryName.length; i++) {
    hash = countryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate pastel colors for better map aesthetics
  const hue = hash % 360;
  const saturation = isDarkMode ? '20%' : '30%';
  const lightness = isDarkMode ? '20%' : '85%';
  
  return `hsl(${hue}, ${saturation}, ${lightness})`;
};

interface DestinationMapProps {
  destinations?: Destination[];
  singleView?: boolean;
  longitude?: number;
  latitude?: number;
  name?: string;
  selectedDestination?: Destination | null;
  height?: string;
}

const DestinationMap = ({ 
  destinations = [], 
  singleView = false,
  longitude,
  latitude,
  name,
  selectedDestination = null,
  height = "500px"
}: DestinationMapProps) => {
  const [internalSelectedDestination, setInternalSelectedDestination] = useState<Destination | null>(
    selectedDestination || (singleView && destinations.length > 0 ? destinations[0] : null)
  );
  const [showPopup, setShowPopup] = useState(!!selectedDestination);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [showSidebar, setShowSidebar] = useState(!singleView);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(true);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // Filter destinations based on search query
  const filteredDestinations = searchQuery 
    ? destinations.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : destinations;

  // Initialize map zoom and position
  useEffect(() => {
    let initialZoom = 1;
    let initialCoordinates = [0, 20];
    
    if (singleView && destinations.length === 1) {
      initialCoordinates = destinations[0].location.coordinates;
      initialZoom = 4;
    } else if (longitude !== undefined && latitude !== undefined) {
      initialCoordinates = [longitude, latitude];
      initialZoom = 4;
    } else if (internalSelectedDestination) {
      initialCoordinates = internalSelectedDestination.location.coordinates;
      initialZoom = 3;
    }
    
    setPosition({
      coordinates: initialCoordinates,
      zoom: initialZoom
    });
  }, [singleView, destinations, longitude, latitude, internalSelectedDestination]);

  // Update internal state when selectedDestination prop changes
  useEffect(() => {
    if (selectedDestination) {
      setInternalSelectedDestination(selectedDestination);
      setShowPopup(true);
      setPosition(prevPosition => ({
        coordinates: selectedDestination.location.coordinates,
        zoom: 4
      }));
    }
  }, [selectedDestination]);

  const handleZoomIn = () => {
    setPosition(prevPosition => {
      const newZoom = Math.min(prevPosition.zoom * 1.5, 20);
      return { ...prevPosition, zoom: newZoom };
    });
  };

  const handleZoomOut = () => {
    setPosition(prevPosition => {
      const newZoom = Math.max(prevPosition.zoom / 1.5, 1);
      return { ...prevPosition, zoom: newZoom };
    });
  };

  const handleMoveEnd = (position: any) => {
    if (position && typeof position.zoom === 'number') {
      setPosition(position);
    }
  };

  const handleDestinationClick = (dest: Destination) => {
    setInternalSelectedDestination(dest);
    setShowPopup(true);
    setPosition({
      coordinates: dest.location.coordinates,
      zoom: 4
    });
  };

  const closePopup = () => {
    setShowPopup(false);
    setInternalSelectedDestination(null);
    
    // Reset map to default view
    let defaultCoordinates = [0, 20];
    let defaultZoom = 1;
    
    // If we're in single view mode, maintain focus on that destination
    if (singleView && destinations.length === 1) {
      defaultCoordinates = destinations[0].location.coordinates;
      defaultZoom = 4;
    } else if (longitude !== undefined && latitude !== undefined) {
      defaultCoordinates = [longitude, latitude];
      defaultZoom = 4;
    }
    
    setPosition({
      coordinates: defaultCoordinates,
      zoom: defaultZoom
    });
  };

  // Reset position to destination
  const handleResetView = () => {
    if (internalSelectedDestination) {
      setPosition({
        coordinates: internalSelectedDestination.location.coordinates,
        zoom: 4
      });
    } else if (singleView && destinations.length > 0) {
      setPosition({
        coordinates: destinations[0].location.coordinates,
        zoom: 4
      });
    } else if (longitude !== undefined && latitude !== undefined) {
      setPosition({
        coordinates: [longitude, latitude],
        zoom: 4
      });
    } else {
      setPosition({
        coordinates: [0, 20],
        zoom: 1
      });
    }
  };

  const handleCountryHover = (countryName: string) => {
    setHighlightedCountry(countryName);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 relative" style={{ height }}>
      {/* Sidebar for destination list */}
      {showSidebar && !singleView && (
        <div className="w-full lg:w-1/4 lg:max-w-xs bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col z-10">
          <div className="p-3 border-b">
            <h3 className="font-medium mb-2">Destinations</h3>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search destinations..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredDestinations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No destinations found
              </div>
            ) : (
              <div className="divide-y">
                {filteredDestinations.map((dest) => (
                  <div 
                    key={dest._id} 
                    className={cn(
                      "p-3 cursor-pointer transition-colors hover:bg-muted flex items-start gap-3",
                      internalSelectedDestination?._id === dest._id && "bg-primary/10"
                    )}
                    onClick={() => handleDestinationClick(dest)}
                  >
                    <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={getDestinationImageUrl(dest)}
                        alt={dest.name}
                        className="h-full w-full object-cover"
                        onError={(e) => handleImageError(e, dest.name)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{dest.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{dest.location.city}, {dest.location.country}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            filled={i < Math.floor(dest.rating)}
                            className="h-3 w-3"
                          />
                        ))}
                        <span className="text-xs">{dest.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="px-2 h-8 ml-auto self-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/destination/${dest._id}`;
                      }}
                    >
                      <span className="sr-only">View</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile only: Close sidebar button */}
          <div className="lg:hidden p-3 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowSidebar(false)}
            >
              Close List
            </Button>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div className={cn(
        "flex-1 relative rounded-lg overflow-hidden border",
        !showSidebar && "w-full"
      )}>
        <div className="absolute inset-0">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 100,
            }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: isDarkMode ? "#1a1b26" : "#f0f7ff"
            }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
              translateExtent={[
                [-Infinity, -Infinity],
                [Infinity, Infinity]
              ]}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    // Check if this country contains a destination
                    const hasDestination = destinations.some(dest => 
                      geo.properties.name === dest.location.country ||
                      geo.properties.name.includes(dest.location.country) ||
                      dest.location.country.includes(geo.properties.name)
                    );

                    // Check if this is the current selected destination's country
                    const isSelectedCountry = internalSelectedDestination && (
                      geo.properties.name === internalSelectedDestination.location.country ||
                      geo.properties.name.includes(internalSelectedDestination.location.country) ||
                      internalSelectedDestination.location.country.includes(geo.properties.name)
                    );
                    
                    const isHighlighted = highlightedCountry === geo.properties.name;
                    
                    // Generate a unique color for each country
                    const countryColor = generateCountryColor(geo.properties.name, isDarkMode);
                    
                    // Determine the fill color based on the conditions
                    let fillColor = countryColor;
                    if (isSelectedCountry) {
                      fillColor = isDarkMode ? "rgba(249, 168, 212, 0.7)" : "rgba(219, 39, 119, 0.2)";
                    } else if (hasDestination && !singleView) {
                      fillColor = isDarkMode ? "rgba(147, 197, 253, 0.5)" : "rgba(59, 130, 246, 0.2)";
                    }
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke={isDarkMode ? "#2d3748" : "#ddd"}
                        strokeWidth={0.5}
                        style={{
                          default: {
                            outline: "none",
                            transition: "all 250ms"
                          },
                          hover: {
                            fill: isSelectedCountry 
                              ? isDarkMode ? "rgba(249, 168, 212, 0.9)" : "rgba(219, 39, 119, 0.4)"
                              : hasDestination && !singleView 
                                ? isDarkMode ? "rgba(147, 197, 253, 0.7)" : "rgba(59, 130, 246, 0.3)"
                                : isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                            outline: "none",
                            cursor: "pointer",
                            transition: "all 250ms"
                          },
                          pressed: {
                            outline: "none"
                          }
                        }}
                        onMouseEnter={() => handleCountryHover(geo.properties.name)}
                        onMouseLeave={() => setHighlightedCountry(null)}
                      />
                    );
                  })
                }
              </Geographies>
              
              {/* Destination Markers */}
              {filteredDestinations.map((dest) => (
                <Marker 
                  key={dest._id}
                  coordinates={dest.location.coordinates}
                  onClick={() => handleDestinationClick(dest)}
                >
                  <g
                    fill="none"
                    stroke={isDarkMode ? "#f43f5e" : "#e11d48"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(-8, -16)"
                    className={cn(
                      "cursor-pointer transition-all",
                      internalSelectedDestination?._id === dest._id && "scale-115"
                    )}
                  >
                    <circle cx="8" cy="6" r="2" fill={isDarkMode ? "#f43f5e" : "#e11d48"} />
                    <path d="M8 14.5C11.5 11.5 13.5 8.8 13.5 6.8a5.5 5.5 0 1 0-11 0c0 2 2 4.7 5.5 7.7z" />
                  </g>
                  {internalSelectedDestination?._id === dest._id && (
                    <circle
                      r={6 / position.zoom}
                      fill={isDarkMode ? "rgba(244, 63, 94, 0.4)" : "rgba(225, 29, 72, 0.3)"}
                      stroke="none"
                      className="animate-ping"
                    />
                  )}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Map Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
              onClick={handleResetView}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Destination Info Card */}
          {showPopup && internalSelectedDestination && (
            <div className="absolute bottom-3 left-3 max-w-[300px] z-10">
              <Card className="bg-background/90 backdrop-blur-sm shadow-lg border-primary/20">
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={closePopup}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={getDestinationImageUrl(internalSelectedDestination)}
                        alt={internalSelectedDestination.name}
                        className="h-full w-full object-cover"
                        onError={(e) => handleImageError(e, internalSelectedDestination.name)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{internalSelectedDestination.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{internalSelectedDestination.location.city}, {internalSelectedDestination.location.country}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            filled={i < Math.floor(internalSelectedDestination.rating)}
                            className="h-3 w-3"
                          />
                        ))}
                        <span className="text-xs ml-1">{internalSelectedDestination.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex gap-1 flex-wrap mt-1">
                      {internalSelectedDestination.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                          {tag}
                        </Badge>
                      ))}
                      {internalSelectedDestination.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                          +{internalSelectedDestination.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button 
                      size="sm"
                      className="w-full"
                      onClick={() => window.location.href = `/destination/${internalSelectedDestination._id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Country Info Tooltip */}
          {highlightedCountry && (
            <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full shadow-md z-10">
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3" />
                <span>{highlightedCountry}</span>
              </div>
            </div>
          )}

          {/* Map type indicator */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-background/70 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md z-10">
            <Info className="h-3 w-3" />
            <span>
              {singleView 
                ? internalSelectedDestination?.location.country
                : `Destinations: ${filteredDestinations.length}`} • Zoom: {position.zoom.toFixed(1)}x
            </span>
          </div>

          {/* Toggle sidebar button for mobile */}
          {!showSidebar && !singleView && (
            <Button
              variant="secondary"
              size="sm"
              className="md:hidden absolute left-3 top-3 z-20 bg-background/90 backdrop-blur-sm hover:bg-background shadow-md"
              onClick={() => setShowSidebar(true)}
            >
              <List className="h-4 w-4 mr-2" />
              Destinations
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Star component for ratings
const Star = ({ filled = false, className = "" }: { filled?: boolean, className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill={filled ? "#FFD700" : "none"} 
      stroke={filled ? "#FFD700" : "currentColor"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

// Arrow right component for destination list
const ArrowRight = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
};

export default DestinationMap;
