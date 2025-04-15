import { User } from "./auth";
import { Message } from "./chat";

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
