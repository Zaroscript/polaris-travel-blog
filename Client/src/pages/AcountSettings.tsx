import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import ImagePicker from "../components/ui/ImagePicker";
import { UpdateProfileData } from "@/types/index";
import { Eye, EyeOff } from "lucide-react";

// Form validation schema for account info
const accountFormSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  profilePic: z
    .string()
    .default("https://cdn-icons-gif.flaticon.com/11617/11617195.gif"),
  coverImage: z
    .string()
    .default("https://cdn-icons-png.flaticon.com/128/1102/1102949.png"),
  location: z.string().optional(),
  about: z.string().max(300, "About cannot exceed 300 characters").optional(),
  status: z.string().optional(),
  birthDate: z.string().optional(),
});

// Form validation schema for password change
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const AccountSettings = () => {
  const { authUser, updateProfile, isUpdatingProfile, error, changePassword } =
    useAuthStore();
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Setup account form
  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      profilePic: "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
      coverImage: "https://cdn-icons-png.flaticon.com/128/1102/1102949.png",
      location: "",
      about: "",
      status: "",
      birthDate: "",
    },
  });

  // Setup password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
  });

  // Format date for the form
  const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime())
      ? date.toISOString().split("T")[0]
      : "";
  };

  // Populate form with user data when available
  useEffect(() => {
    if (authUser) {
      accountForm.reset({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        profilePic:
          authUser.profilePic ||
          "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
        coverImage:
          authUser.coverImage ||
          "https://cdn-icons-png.flaticon.com/128/1102/1102949.png",
        location: authUser.location || "",
        about: authUser.about || "",
        birthDate: formatDate(authUser.birthDate),
      });
    }
  }, [authUser, accountForm]);

  // Handle account form submission
  const onAccountSubmit = async (data: z.infer<typeof accountFormSchema>) => {
    if (!authUser) return;

    try {
      // Ensure all required fields are present with defaults if necessary
      const profileData: UpdateProfileData = {
        fullName: data.fullName,
        email: data.email,
        profilePic:
          data.profilePic ||
          "https://cdn-icons-gif.flaticon.com/11617/11617195.gif",
        coverImage:
          data.coverImage ||
          "https://cdn-icons-png.flaticon.com/128/1102/1102949.png",
        location: data.location,
        about: data.about,
        status: data.status,
        birthDate: data.birthDate,
      };

      // Call the updateProfile function with the properly formatted data
      const updatedUser = await updateProfile(profileData);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // Handle password form submission
  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    setIsChangingPassword(true);
    setPasswordError("");

    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      passwordForm.reset();
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to change password:", err);
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success message */}
      {successMessage && (
        <div className="p-4 rounded-md bg-green-100 text-green-800">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-md bg-red-100 text-red-800">{error}</div>
      )}

      {/* Account Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Update your account information and profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...accountForm}>
            <form
              onSubmit={accountForm.handleSubmit(onAccountSubmit)}
              className="space-y-6"
            >
              {/* Profile Pictures Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={accountForm.control}
                  name="profilePic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <ImagePicker
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Enter profile image URL"
                          defaultImage="https://cdn-icons-gif.flaticon.com/11617/11617195.gif"
                          aspectRatio="square"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={accountForm.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <ImagePicker
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Enter cover image URL"
                          defaultImage="https://cdn-icons-png.flaticon.com/128/1102/1102949.png"
                          aspectRatio="cover"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={accountForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={accountForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={accountForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="What's on your mind?" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountForm.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl className="">
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px] "
                        maxLength={300}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password for security reasons
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Success message */}
          {passwordSuccess && (
            <div className="p-4 mb-4 rounded-md bg-green-100 text-green-800">
              {passwordSuccess}
            </div>
          )}

          {/* Error message */}
          {passwordError && (
            <div className="p-4 mb-4 rounded-md bg-red-100 text-red-800">
              {passwordError}
            </div>
          )}

          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:rounded">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:rounded">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showNewPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:rounded">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
