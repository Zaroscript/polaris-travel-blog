import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Destination } from "@/types";
import { destinations } from "../../data/destinations";
import { useThemeStore } from "@/store/useThemeStore";

// World map GeoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const DestinationMap = () => {
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const handleDestinationClick = (dest: Destination) => {
    setSelectedDestination(dest);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative w-full lg:h-[calc(100vh-320px)] bg-card rounded-lg overflow-hidden border">
        {/* World map with markers */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 130,
            center: [0, 20],
          }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isDarkMode ? "#2A2A2A" : "#EAEAEC"}
                    stroke={isDarkMode ? "#404040" : "#D6D6DA"}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: isDarkMode ? "#333333" : "#F5F5F5" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {destinations.map((dest) => (
              <Marker
                key={dest.id}
                coordinates={dest.coordinates}
                onClick={() => handleDestinationClick(dest)}
              >
                <g
                  transform="translate(-12, -24)"
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    r={3}
                    fill={
                      selectedDestination?.id === dest.id
                        ? "#FF4F4F"
                        : "#3B82F6"
                    }
                    stroke={isDarkMode ? "#1F1F1F" : "#FFFFFF"}
                    strokeWidth={1}
                  />
                  <text
                    textAnchor="middle"
                    y={-10}
                    style={{
                      fontSize: "8px",
                      fill: isDarkMode ? "#E5E5E5" : "#333",
                      pointerEvents: "none",
                    }}
                  >
                    {dest.name}
                  </text>
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-card/50 p-2 rounded-md hidden lg:block">
          <div className="text-xs font-semibold mb-1">Destinations:</div>
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="flex items-center mb-1 text-xs cursor-pointer hover:text-blue-400"
              onClick={() => handleDestinationClick(dest)}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedDestination?.id === dest.id
                    ? "bg-red-500"
                    : "bg-blue-500"
                } mr-1`}
              ></span>
              <span>{dest.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popup for selected destination */}
      {showPopup && selectedDestination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-md m-4 relative">
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Destination image */}
            <div className="h-40 bg-muted rounded-t-lg overflow-hidden">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">
                  {selectedDestination.name}
                </h3>
                <div className="flex items-center ml-2">
                  <span className="mr-1 font-medium">
                    {selectedDestination.rating}
                  </span>
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-1">
                {selectedDestination.location}
              </p>
              <p className="text-card-foreground my-4">
                {selectedDestination.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {selectedDestination.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                className="mt-6 w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationMap;
