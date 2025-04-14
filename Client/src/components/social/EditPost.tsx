import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostsStore } from "@/store/usePostsStore";
import { useToast } from "@/components/ui/use-toast";
import {
  Image as ImageIcon,
  X,
  Tag,
  MapPin,
  Info,
  Globe,
  Camera,
} from "lucide-react";
import { useDestinationsStore } from "@/store/useDestinationsStore";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "@/types/social";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  travelTips: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  destinationId: z.string().optional(),
});

interface EditPostProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditPost = ({ post, open, onOpenChange }: EditPostProps) => {
  const [activeTab, setActiveTab] = useState("content");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>(post.coverImage || "");
  const [galleryImages, setGalleryImages] = useState<string[]>(post.gallery || []);
  const [travelTips, setTravelTips] = useState<string[]>(post.travelTips || []);
  const [tags, setTags] = useState<string[]>(post.tags || []);

  const { updatePost } = usePostsStore();
  const { destinations, fetchDestinations } = useDestinationsStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      subtitle: post.subtitle || "",
      content: post.content,
      coverImage: post.coverImage || "",
      gallery: post.gallery || [],
      travelTips: post.travelTips || [],
      tags: post.tags || [],
      destinationId: post.destinationId || "",
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Ensure all state values are included in the update
      const updateData = {
        ...values,
        coverImage: coverImage || values.coverImage,
        gallery: galleryImages.length > 0 ? galleryImages : values.gallery,
        travelTips: travelTips.length > 0 ? travelTips : values.travelTips,
        tags: tags.length > 0 ? tags.map(tag => tag.trim()) : (values.tags ? values.tags.map(tag => tag.trim()) : []),
      };
      
      console.log("Submitting update data:", updateData);
      
      const updatedPost = await updatePost(post._id, updateData);
      console.log("Post successfully updated:", updatedPost);
      
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader className="space-y-4 pb-6">
          <div>
            <DialogTitle className="text-2xl font-semibold mb-1">Edit Post</DialogTitle>
            <p className="text-sm text-muted-foreground">Update your travel story</p>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 gap-1">
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="size-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Camera className="size-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="tips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Tag className="size-4 mr-2" />
              Tips & Tags
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ScrollArea className="h-[60vh] pr-4">
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Give your travel story a captivating title"
                              className="text-2xl font-semibold py-3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Add a brief description to hook your readers (optional)"
                              className="text-lg text-muted-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="destinationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Where did you travel?" />
                            </SelectTrigger>
                            <SelectContent>
                              {destinations.map((destination) => (
                                <SelectItem
                                  key={destination._id}
                                  value={destination._id}
                                >
                                  {destination.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your travel experience..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <Card className="border-dashed hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-semibold mb-0.5">Cover Image</h4>
                            <p className="text-sm text-muted-foreground">Set a cover image for your post</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2 hover:bg-primary hover:text-primary-foreground"
                            onClick={() =>
                              document.getElementById("cover-upload")?.click()
                            }
                          >
                            <ImageIcon className="h-4 w-4" />
                            Choose Image
                          </Button>
                          <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setCoverImage(url);
                                form.setValue("coverImage", url);
                              }
                            }}
                          />
                        </div>
                        {coverImage && (
                          <div className="relative aspect-video">
                            <img
                              src={coverImage}
                              alt="Cover"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setCoverImage("");
                                form.setValue("coverImage", "");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-semibold mb-0.5">Photo Gallery</h4>
                            <p className="text-sm text-muted-foreground">Add photos to showcase your journey</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2 hover:bg-primary hover:text-primary-foreground"
                            onClick={() =>
                              document.getElementById("gallery-upload")?.click()
                            }
                          >
                            <ImageIcon className="h-4 w-4" />
                            Add Images
                          </Button>
                          <input
                            id="gallery-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              const urls = files.map((file) =>
                                URL.createObjectURL(file)
                              );
                              setGalleryImages([...galleryImages, ...urls]);
                              form.setValue("gallery", [...galleryImages, ...urls]);
                            }}
                          />
                        </div>
                        {galleryImages.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {galleryImages.map((url, index) => (
                              <div
                                key={index}
                                className="relative aspect-square group rounded-lg overflow-hidden border hover:border-primary/50 transition-colors"
                              >
                                <img
                                  src={url}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => {
                                      const newImages = [...galleryImages];
                                      newImages.splice(index, 1);
                                      setGalleryImages(newImages);
                                      form.setValue("gallery", newImages);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tips" className="space-y-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Travel Tips
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTravelTips([...travelTips, ""]);
                              form.setValue("travelTips", [...travelTips, ""]);
                            }}
                          >
                            <Info className="h-4 w-4 mr-2" />
                            Add Tip
                          </Button>
                        </div>
                        {travelTips.map((tip, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Travel tip ${index + 1}`}
                              value={tip}
                              onChange={(e) => {
                                const newTips = [...travelTips];
                                newTips[index] = e.target.value;
                                setTravelTips(newTips);
                                form.setValue("travelTips", newTips);
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                const newTips = [...travelTips];
                                newTips.splice(index, 1);
                                setTravelTips(newTips);
                                form.setValue("travelTips", newTips);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tags</span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button type="button" variant="ghost" size="sm">
                                <Tag className="h-4 w-4 mr-2" />
                                Add Tag
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <div className="p-2">
                                <div className="flex gap-2 mb-2">
                                  <Input 
                                    placeholder="Add custom tag..."
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const input = e.currentTarget;
                                        const value = input.value.trim();
                                        if (value && !tags.includes(value)) {
                                          const newTags = [...tags, value];
                                          setTags(newTags);
                                          form.setValue("tags", newTags);
                                          input.value = '';
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                <div className="font-medium text-sm mb-2">Suggested Tags:</div>
                                <Command>
                                  <CommandInput placeholder="Search tags..." />
                                  <CommandEmpty>No tags found.</CommandEmpty>
                                  <CommandGroup>
                                    <CommandList className="scrollbar-thin scrollbar-thumb-[#000]">
                                      {[
                                        "Adventure",
                                        "Beach",
                                        "Culture",
                                        "Food",
                                        "Nature",
                                        "City",
                                        "History",
                                        "Shopping",
                                        "Nightlife",
                                        "Family",
                                        "Romantic",
                                        "Budget",
                                        "Luxury",
                                      ].map((tag) => (
                                        <CommandItem
                                          key={tag}
                                          value={tag}
                                          onSelect={(currentValue) => {
                                            if (!tags.includes(currentValue)) {
                                              const newTags = [
                                                ...tags,
                                                currentValue,
                                              ];
                                              setTags(newTags);
                                              form.setValue("tags", newTags);
                                            }
                                          }}
                                        >
                                          {tag}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </CommandGroup>
                                </Command>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => {
                                  const newTags = [...tags];
                                  newTags.splice(index, 1);
                                  setTags(newTags);
                                  form.setValue("tags", newTags);
                                }}
                              >
                                {tag}
                                <X className="w-3 h-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Post"}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditPost;
