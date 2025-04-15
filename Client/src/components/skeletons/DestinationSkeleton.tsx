import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DestinationSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-border/40">
      {/* Image placeholder */}
      <div className="h-52 relative">
        <Skeleton className="h-full w-full" />
        
        {/* Rating badge placeholder */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Price badge placeholder */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Location badge placeholder */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        {/* Title placeholder */}
        <Skeleton className="h-6 w-[70%]" />
      </CardHeader>
      
      <CardContent className="p-4 pt-2 space-y-3">
        {/* Description placeholder */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        
        {/* Features placeholder */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
        
        {/* Tags placeholder */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </CardFooter>
    </Card>
  );
};
