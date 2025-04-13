import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
  children?: ReactNode;
}

/**
 * EmptyState - A consistent component to display when there's no data
 * 
 * @example
 * <EmptyState
 *   icon={MessageCircle}
 *   title="No Comments Yet"
 *   description="Be the first to comment on this post"
 *   action={{
 *     label: "Add Comment",
 *     onClick: () => setIsCommenting(true),
 *     icon: Plus
 *   }}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-10 text-center space-y-4">
        {Icon && (
          <div className="mx-auto rounded-full bg-primary/10 p-3 w-fit">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
        
        <h3 className="text-xl font-medium">{title}</h3>
        
        {description && (
          <p className="text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        )}
        
        {action && (
          <Button 
            className="mt-2"
            onClick={action.onClick}
          >
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
        
        {children}
      </CardContent>
    </Card>
  );
}
