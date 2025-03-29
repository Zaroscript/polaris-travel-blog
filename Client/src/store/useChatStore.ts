import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { ChatState, Message, SendMessageData, User } from "../types";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  error: null,
  unreadMessages: 0,

  getUsers: async () => {
    set({ isUsersLoading: true, error: null });
    try {
      const res = await axiosInstance.get<User[]>("/messages/users");
      set({ users: res.data });
      return res.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to fetch users";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return [];
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true, error: null });
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
      set({ messages: res.data });
      return res.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to fetch messages";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return [];
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getUnreadMessages: async () => {
    try {
      const res = await axiosInstance.get<number>("/messages/unread");
      set({ unreadMessages: res.data });
      return res.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to fetch unread messages";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return 0;
    }
  },

  sendMessage: async (messageData: SendMessageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) throw new Error("No user selected");

    set({ isSendingMessage: true, error: null });
    try {
      const res = await axiosInstance.post<Message>(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      const updatedMessages = [...messages, res.data];
      set({ messages: updatedMessages });
      return res.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to send message";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage: Message) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser: User) => set({ selectedUser }),

  clearError: () => {
    set({ error: null });
  },
}));
