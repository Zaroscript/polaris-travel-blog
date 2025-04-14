import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BlogCardSkeleton = () => {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {/* Image skeleton */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      
      <CardHeader className="p-4 pb-0">
        {/* Date and category */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Title */}
        <div className="mb-2">
          <Skeleton className="h-6 w-full mb-1" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-4 mt-auto flex items-center justify-between border-t">
        {/* Author */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-4" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCardSkeleton;
