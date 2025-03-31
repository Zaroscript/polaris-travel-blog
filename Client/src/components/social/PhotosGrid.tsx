import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  alt?: string;
}

interface PhotosGridProps {
  photos: Photo[];
  maxDisplay?: number;
  onSeeAll?: () => void;
}

const PhotosGrid = ({ photos, maxDisplay = 6, onSeeAll }: PhotosGridProps) => {
  const displayPhotos = photos.slice(0, maxDisplay);
  const remainingCount = Math.max(0, photos.length - maxDisplay);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Photos</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Photos
          </Button>
          {remainingCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onSeeAll}>
              See all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {displayPhotos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square rounded-lg overflow-hidden group relative cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.alt || "Gallery image"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
          {remainingCount > 0 && maxDisplay < photos.length && (
            <div
              className="aspect-square rounded-lg overflow-hidden relative cursor-pointer bg-muted/50"
              onClick={onSeeAll}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-muted-foreground">
                  +{remainingCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotosGrid;
