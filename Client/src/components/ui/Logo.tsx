import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ className, size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-center gap-2 group", className)}>
      <div
        className={cn(
          "rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors",
          sizeClasses[size]
        )}
      >
        <img src="/logo.svg" alt="Logo" className="w-1/2 h-1/2 text-blue-600" />
      </div>
      {showText && (
        <span className={cn("font-bold text-gray-900", textSizeClasses[size])}>
          Polaris
        </span>
      )}
    </div>
  );
};

export default Logo;
