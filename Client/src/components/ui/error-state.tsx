import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string | null;
  retry?: () => void;
  onBack?: () => void;
  className?: string;
  children?: ReactNode;
}

/**
 * ErrorState - A consistent component for displaying errors across the application
 * 
 * @example
 * <ErrorState 
 *   error={error}
 *   retry={fetchData}
 *   onBack={() => navigate(-1)}
 * />
 */
export function ErrorState({
  title = "Error",
  description,
  error,
  retry,
  onBack,
  className,
  children,
}: ErrorStateProps) {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';

  const displayDescription = description || errorMessage;

  return (
    <Card className={cn("border-destructive/50 bg-destructive/10", className)}>
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {displayDescription}
        </p>
        {children}
      </CardContent>
      {(retry || onBack) && (
        <CardFooter className="flex gap-2 justify-end">
          {onBack && (
            <Button 
              variant="outline" 
              onClick={onBack}
            >
              Go Back
            </Button>
          )}
          {retry && (
            <Button 
              onClick={retry}
            >
              Retry
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
