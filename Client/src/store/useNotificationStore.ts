import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { NotificationState, PopulatedNotification } from "../types";

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  getNotifications: async () => {
    const { authUser } = useAuthStore.getState();
    if (!authUser) {
      set({ notifications: [], unreadCount: 0 });
      return [];
    }
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get<PopulatedNotification[]>(
        "/notifications"
      );
      set({
        notifications: res.data,
        unreadCount: res.data.filter((n) => !n.read).length,
      });
      return res.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to fetch notifications";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    set({ error: null });
    try {
      const res = await axiosInstance.patch<PopulatedNotification>(
        `/notifications/${id}/read`
      );

      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        );

        return {
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter((n) => !n.read).length,
        };
      });

      return res.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to mark notification as read";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },

  markAllAsRead: async () => {
    set({ error: null });
    try {
      await axiosInstance.patch("/notifications/read-all");

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to mark all notifications as read";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },

  addNotification: (notification: PopulatedNotification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Add socket event listener in a separate function to avoid circular dependencies
export const initNotificationListeners = () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  socket.on(
    "newNotification",
    (data: { notification: PopulatedNotification }) => {
      useNotificationStore.getState().addNotification(data.notification);
      const senderName =
        typeof data.notification.sender === "object"
          ? data.notification.sender.fullName
          : "someone";

      toast.success(`New message from ${senderName}`);
    }
  );

  return () => {
    socket.off("newNotification");
  };
};
