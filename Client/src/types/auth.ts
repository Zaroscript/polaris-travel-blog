import type { Socket } from "socket.io-client";

export interface User {
  _id: string;
  username?: string;
  email: string;
  fullName: string;
  profilePic?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  onlineUsers: string[];
  socket: Socket | null;
  checkAuth: () => Promise<User | null>;
  signup: (data: SignupData) => Promise<User>;
  login: (data: LoginData) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  clearError: () => void;
}

export interface SignupData {
  username?: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  profilePic?: string;
  fullName?: string;
  bio?: string;
  username?: string;
}
