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
  DialogTrigger,
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
  Plus,
  Image as ImageIcon,
  X,
  Tag,
  MapPin,
  Calendar,
  Info,
  Globe,
  Camera,
} from "lucide-react";
import { useDestinationsStore } from "@/store/useDestinationsStore";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
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

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [travelTips, setTravelTips] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const { createPost } = usePostsStore();
  const { destinations, fetchDestinations } = useDestinationsStore();
  const { toast } = useToast();
  const { authUser } = useAuthStore();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
      coverImage: "",
      gallery: [],
      travelTips: [],
      tags: [],
      destinationId: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(urls);
    form.setValue("gallery", urls);
  };

  const removeImage = (index: number) => {
    const newImages = [...previewImages];
    newImages.splice(index, 1);
    setPreviewImages(newImages);
    form.setValue("gallery", newImages);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createPost({
        ...values,
        tags: values.tags ? values.tags.map((tag) => tag.trim()) : [],
      });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setOpen(false);
      setPreviewImages([]);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full mb-4 p-4 bg-card rounded-lg shadow-sm cursor-pointer hover:bg-accent transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={authUser?.profilePic} className="object-cover" />
              <AvatarFallback>{authUser?.fullName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-muted-foreground">
                Share your travel experience,{" "}
                {authUser?.fullName?.split(" ")[0]}!
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <Button variant="ghost" className="flex-1 gap-2">
              <ImageIcon className="size-5 text-green-600" />
              <span>Photos</span>
            </Button>
            <Button variant="ghost" className="flex-1 gap-2">
              <MapPin className="size-5 text-blue-600" />
              <span>Location</span>
            </Button>
            <Button variant="ghost" className="flex-1 gap-2">
              <Tag className="size-5 text-purple-600" />
              <span>Tags</span>
            </Button>
            <Button variant="ghost" className="flex-1 gap-2">
              <Info className="size-5 text-yellow-600" />
              <span>Tips</span>
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center">Create Travel Post</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="size-10">
            <AvatarImage src={authUser?.profilePic} />
            <AvatarFallback>{authUser?.fullName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{authUser?.fullName}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tags</TabsTrigger>
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
                        <FormLabel>Your Story</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your travel experience, highlights, and memorable moments..."
                            className="min-h-[200px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Cover Image
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById("cover-image-upload")
                                ?.click()
                            }
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Add Cover
                          </Button>
                          <input
                            id="cover-image-upload"
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
                              form.setValue("gallery", [
                                ...galleryImages,
                                ...urls,
                              ]);
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
                            <Plus className="h-4 w-4 mr-2" />
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
                            {tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4"
                                  onClick={() => {
                                    const newTags = tags.filter(
                                      (t) => t !== tag
                                    );
                                    setTags(newTags);
                                    form.setValue("tags", newTags);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Posting..." : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
