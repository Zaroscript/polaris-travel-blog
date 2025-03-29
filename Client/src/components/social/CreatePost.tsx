import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

interface NewPost {
  title: string;
  content: string;
  travelTips: string[];
  tags: string[];
  destination: string;
  gallery: string[];
  mentions: string[];
  coverImage: string;
}

interface CreatePostProps {
  onPostCreate: (post: any) => void;
}

const CreatePost = ({ onPostCreate }: CreatePostProps) => {
  const { authUser } = useAuthStore();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostData, setNewPostData] = useState<NewPost>({
    title: "",
    content: "",
    travelTips: [""],
    tags: [],
    destination: "",
    gallery: [],
    mentions: [],
    coverImage: "",
  });
  const [currentTip, setCurrentTip] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [currentMention, setCurrentMention] = useState("");

  const handleCreatePost = () => {
    if (!newPostData.title.trim() || !newPostData.content.trim()) return;

    // Create new post object
    const newPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: newPostData.title,
      content: newPostData.content,
      image: newPostData.coverImage,
      gallery: newPostData.gallery,
      date: new Date().toISOString(),
      author: {
        name: authUser?.fullName || "Anonymous",
        avatar: authUser?.profilePic || "",
      },
      travelTips: newPostData.travelTips.filter((tip) => tip.trim()),
      tags: newPostData.tags,
      destination: newPostData.destination,
      mentions: newPostData.mentions,
      likes: 0,
      comments: [],
    };

    onPostCreate(newPost);

    // Reset form
    setNewPostData({
      title: "",
      content: "",
      travelTips: [""],
      tags: [],
      destination: "",
      gallery: [],
      mentions: [],
      coverImage: "",
    });
    setIsCreatingPost(false);
  };

  const handleAddTip = () => {
    if (!currentTip.trim()) return;
    setNewPostData((prev) => ({
      ...prev,
      travelTips: [...prev.travelTips, currentTip],
    }));
    setCurrentTip("");
  };

  const handleRemoveTip = (index: number) => {
    setNewPostData((prev) => ({
      ...prev,
      travelTips: prev.travelTips.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (!currentTag.trim() || newPostData.tags.length >= 10) return;
    setNewPostData((prev) => ({
      ...prev,
      tags: [...prev.tags, currentTag],
    }));
    setCurrentTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setNewPostData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAddMention = () => {
    if (!currentMention.trim()) return;
    setNewPostData((prev) => ({
      ...prev,
      mentions: [...prev.mentions, currentMention],
    }));
    setCurrentMention("");
  };

  const handleRemoveMention = (mention: string) => {
    setNewPostData((prev) => ({
      ...prev,
      mentions: prev.mentions.filter((m) => m !== mention),
    }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isCover: boolean
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isCover) {
          setNewPostData((prev) => ({
            ...prev,
            coverImage: reader.result as string,
          }));
        } else {
          setNewPostData((prev) => ({
            ...prev,
            gallery: [...prev.gallery, reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewPostData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={authUser?.profilePic} />
            <AvatarFallback>{authUser?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground h-[42px] px-4"
              >
                What's on your mind?
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Image</label>
                  <div className="relative aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                    {newPostData.coverImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={newPostData.coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            setNewPostData((prev) => ({
                              ...prev,
                              coverImage: "",
                            }))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Upload cover image
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newPostData.title}
                    onChange={(e) =>
                      setNewPostData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter your post title"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newPostData.content}
                    onChange={(e) =>
                      setNewPostData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Share your travel experience..."
                    rows={5}
                  />
                </div>

                {/* Travel Tips */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel Tips</label>
                  <div className="space-y-3">
                    {newPostData.travelTips.map((tip, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={tip}
                          onChange={(e) => {
                            const newTips = [...newPostData.travelTips];
                            newTips[index] = e.target.value;
                            setNewPostData((prev) => ({
                              ...prev,
                              travelTips: newTips,
                            }));
                          }}
                          placeholder={`Tip ${index + 1}`}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveTip(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setNewPostData((prev) => ({
                          ...prev,
                          travelTips: [...prev.travelTips, ""],
                        }))
                      }
                      disabled={newPostData.travelTips.length >= 5}
                    >
                      Add Tip
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (max 10)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newPostData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      onClick={handleAddTag}
                      disabled={newPostData.tags.length >= 10}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Select
                    value={newPostData.destination}
                    onValueChange={(value) =>
                      setNewPostData((prev) => ({
                        ...prev,
                        destination: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paris">Paris, France</SelectItem>
                      <SelectItem value="tokyo">Tokyo, Japan</SelectItem>
                      <SelectItem value="nyc">New York City, USA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gallery */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gallery</label>
                  <div className="grid grid-cols-3 gap-4">
                    {newPostData.gallery.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
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
                    {newPostData.gallery.length < 5 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex items-center justify-center">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, false)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Mentions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mention People</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newPostData.mentions.map((mention) => (
                      <Badge
                        key={mention}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        @{mention}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveMention(mention)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={currentMention}
                      onChange={(e) => setCurrentMention(e.target.value)}
                      placeholder="@username"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddMention();
                        }
                      }}
                    />
                    <Button onClick={handleAddMention}>Add</Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingPost(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={
                      !newPostData.title.trim() || !newPostData.content.trim()
                    }
                  >
                    Create Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
