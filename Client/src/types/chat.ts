import { User } from "./auth";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;
  error: string | null;
  getUsers: () => Promise<User[]>;
  getMessages: (userId: string) => Promise<Message[]>;
  sendMessage: (messageData: SendMessageData) => Promise<Message>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: User) => void;
  clearError: () => void;
}

export interface SendMessageData {
  text?: string;
  image?: string | null;
}
