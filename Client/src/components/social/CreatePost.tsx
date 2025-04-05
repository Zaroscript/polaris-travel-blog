import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon, Plus, X, MapPin } from "lucide-react";
import { Post } from "@/types/social";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CreatePostProps {
  onPostCreate: (post: Post) => void;
}

const CreatePost = ({ onPostCreate }: CreatePostProps) => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [content, setContent] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static mock data
  const mockAuthUser = {
    profilePic: "/images/avatar.jpg",
    fullName: "John Doe",
    _id: "1",
  };

  const mockDestinations = [
    { id: "1", name: "Paris" },
    { id: "2", name: "London" },
    { id: "3", name: "Tokyo" },
    { id: "4", name: "New York" },
  ];

  const handleCreatePost = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPost = {
        id: Date.now().toString(),
        content,
        images,
        authorId: mockAuthUser._id,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        gallery: [],
        destination: selectedDestination
          ? {
              id: selectedDestination,
              name:
                mockDestinations.find((d) => d.id === selectedDestination)
                  ?.name || "",
              image: "",
            }
          : undefined,
      };

      onPostCreate(newPost as Post);
      setContent("");
      setSelectedDestination("");
      setImages([]);
      setIsCreatingPost(false);
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={mockAuthUser.profilePic} />
            <AvatarFallback>{mockAuthUser.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground h-[42px] px-4"
              >
                Tell us about your travel experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your travel experience..."
                    className="min-h-[150px]"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Images</label>
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {images.length < 4 && (
                      <label className="flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Add image
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Select
                    value={selectedDestination}
                    onValueChange={setSelectedDestination}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDestinations.map((destination) => (
                        <SelectItem key={destination.id} value={destination.id}>
                          {destination.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full"
                  onClick={handleCreatePost}
                  disabled={!content.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
