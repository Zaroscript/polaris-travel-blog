export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  coverImage: string;
  location?: string;
  about?: string;
  status?: string;
  birthDate?: string;
  joinedDate: string;
  isVerified: boolean;
  connections: User[];
  savedPosts: string[];
  following: User[];
  followers: User[];
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
}

export interface UserResponse {
  user: User;
  message?: string;
}

export interface UserUpdateData {
  fullName?: string;
  email?: string;
  location?: string;
  about?: string;
  status?: string;
  birthDate?: string;
  profilePic?: string;
  coverImage?: string;
  role?: string;
}
