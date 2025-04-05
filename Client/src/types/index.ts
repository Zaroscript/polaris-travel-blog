import { Socket } from "socket.io-client";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

// Base Notification with ID references
export interface Notification {
  _id: string;
  recipient: string;
  sender: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Populated Notification with full objects
export interface PopulatedNotification {
  _id: string;
  recipient: User;
  sender: User;
  message: Message;
  type: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Auth state interface
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

// Chat state interface
export interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;
  error: string | null;
  unreadMessages: number;
  getUsers: () => Promise<User[]>;
  getMessages: (userId: string) => Promise<Message[]>;
  sendMessage: (messageData: SendMessageData) => Promise<Message>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: User) => void;
  clearError: () => void;
  getUnreadMessages: () => Promise<number>;
}

// Notification state interface
export interface NotificationState {
  notifications: PopulatedNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  getNotifications: () => Promise<PopulatedNotification[]>;
  markAsRead: (id: string) => Promise<PopulatedNotification>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: PopulatedNotification) => void;
  clearError: () => void;
}

// Data Transfer Objects
export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  profilePic: string;
}

export interface SendMessageData {
  text?: string;
  image?: string | null;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
export interface Destination {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  tags: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
    role?: string;
  };
  text: string;
  date: string;
  likes: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  category: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  featured?: boolean;
  readTime?: string;
  destination?: Destination; // Added destination property
  travelTips?: string[]; // Added travel tips property
  gallery?: string[]; // Added gallery property
  mentions?: string[]; // Added mentions property
}
