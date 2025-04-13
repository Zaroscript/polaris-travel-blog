import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Compass, MapPin, Plane } from "lucide-react";

interface TravelLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "map" | "destination" | "profile";
  text?: string;
}

export function TravelLoader({
  size = "md",
  variant = "default",
  text,
  className,
  ...props
}: TravelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  // Animation variants for each loader type
  const getAnimationVariant = () => {
    switch (variant) {
      case "default":
        return {
          initial: { x: -20, y: 0, rotate: -15 },
          animate: {
            x: [20, -20],
            y: [0, -10, 0, 10, 0],
            rotate: [-15, 15, -15],
            transition: {
              x: { repeat: Infinity, duration: 3, ease: "easeInOut", repeatType: "reverse" },
              y: { repeat: Infinity, duration: 3, ease: "easeInOut", repeatType: "mirror" },
              rotate: { repeat: Infinity, duration: 3, ease: "easeInOut", repeatType: "mirror" }
            }
          }
        };
      case "map":
        return {
          initial: { y: 0, scale: 1 },
          animate: {
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
            transition: {
              y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            }
          }
        };
      case "destination":
        return {
          initial: { rotate: 0 },
          animate: {
            rotate: [0, 360],
            transition: {
              rotate: { repeat: Infinity, duration: 3, ease: "linear" }
            }
          }
        };
      case "profile":
        return {
          initial: { x: 0, y: 0, scale: 1 },
          animate: {
            x: [0, 10, 0, -10, 0],
            y: [0, -5, 0, 5, 0],
            scale: [1, 1.1, 1, 1.1, 1],
            transition: {
              x: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }
          }
        };
      default:
        return {
          initial: { scale: 1 },
          animate: {
            scale: [1, 1.1, 1],
            transition: {
              scale: { repeat: Infinity, duration: 1, ease: "easeInOut" }
            }
          }
        };
    }
  };

  const { initial, animate } = getAnimationVariant();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "relative flex items-center justify-center text-primary",
          sizeClasses[size]
        )}
        initial={initial}
        animate={animate}
      >
        {variant === "default" && <Plane className="h-full w-full" />}
        {variant === "map" && <MapPin className="h-full w-full" />}
        {variant === "destination" && <Compass className="h-full w-full" />}
        {variant === "profile" && <Plane className="h-full w-full" />}
      </motion.div>
      {text && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
