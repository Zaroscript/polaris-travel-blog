"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader } from "lucide-react";
import type { User } from "@/types";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  user: User;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}: ProfileEditModalProps) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    location: user?.location || "New York, USA",
    website: user?.website || "",
  });

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    user?.profilePic || null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    user?.coverImage ||
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        location: user.location || "New York, USA",
        website: user.website || "",
      });
      setProfilePicPreview(user.profilePic || null);
      setCoverImagePreview(
        user.coverImage ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
      );
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        profilePic: profilePicPreview,
        coverImage: coverImagePreview,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="relative h-48 rounded-lg overflow-hidden bg-muted group">
              {coverImagePreview && (
                <img
                  src={coverImagePreview || "/placeholder.svg"}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => coverImageInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Change Cover
                </Button>
              </div>
            </div>
            <input
              type="file"
              ref={coverImageInputRef}
              onChange={handleCoverImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Profile Picture */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profilePicPreview || "/avatar.png"}
                    alt={user?.fullName}
                  />
                  <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                  onClick={() => profilePicInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Upload a new photo</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. 1MB max size.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => profilePicInputRef.current?.click()}
                >
                  Upload
                </Button>
              </div>
            </div>
            <input
              type="file"
              ref={profilePicInputRef}
              onChange={handleProfilePicChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="yourwebsite.com"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
