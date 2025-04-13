import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TravelLoader } from "./travel-loader";

interface LoadingStateProps {
  text?: string;
  variant?: "default" | "profile" | "map" | "destination";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}

/**
 * LoadingState - A consistent loading component for use across the application
 * 
 * @example
 * <LoadingState text="Loading posts..." />
 */
export function LoadingState({
  text,
  variant = "default",
  size = "md",
  className,
  children,
}: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <TravelLoader 
        variant={variant} 
        size={size}
        text={text}
      />
      {children}
    </div>
  );
}
