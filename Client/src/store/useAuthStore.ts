import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import {
  AuthState,
  LoginData,
  SignupData,
  UpdateProfileData,
  ApiResponse,
} from "../types";
import { Profile } from "@/types/social";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  error: null,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<Profile>("/auth/check");
      set({ authUser: res.data, error: null });
      get().connectSocket();
      return res.data;
    } catch (error: unknown) {
      console.error("Auth check error:", error);
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401) {
        set({ authUser: null, error: null });
        return null;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Authentication check failed";
      set({ authUser: null, error: errorMessage });
      return null;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupData) => {
    set({ isSigningUp: true, error: null });
    try {
      console.log("Attempting signup with data:", {
        ...data,
        password: "[REDACTED]",
      });
      const res = await axiosInstance.post<Profile>("/auth/signup", data);

      if (!res.data || !res.data.token) {
        throw new Error("Invalid response from server: No token received");
      }

      localStorage.setItem("token", res.data.token);
      set({ authUser: res.data, error: null });
      toast.success("Account created successfully");
      get().connectSocket();
      return res.data;
    } catch (error: unknown) {
      console.error("Signup error:", error);

      let errorMessage = "Failed to create account. Please try again.";

      if (error && typeof error === "object") {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string };
          };
          message?: string;
        };

        if (axiosError.response?.status === 404) {
          errorMessage =
            "Server not found. Please check if the server is running.";
        } else if (axiosError.response?.status === 400) {
          errorMessage =
            "Invalid input. Please check your details and try again.";
        } else if (axiosError.response?.status === 409) {
          errorMessage = "An account with this email already exists.";
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      }

      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true, error: null });
    try {
      const res = await axiosInstance.post<Profile>("/auth/login", data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
      return res.data;
    } catch (error: unknown) {
      // Create a more descriptive error message
      let errorMessage = "Login failed. Please check your credentials.";

      if (error && typeof error === "object") {
        const axiosError = error as {
          status?: number;
          code?: string;
          response?: {
            status?: number;
            data?: { message?: string };
          };
        };

        if (
          axiosError.response?.status === 400 ||
          axiosError.code === "ERR_BAD_REQUEST"
        ) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (axiosError.response?.status === 401) {
          errorMessage = "Your account is not authorized.";
        } else if (axiosError.status === 404) {
          errorMessage =
            "Account not found. Please check your email or sign up.";
        }

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ error: null });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Logout failed";
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      const res = await axiosInstance.put<Profile>("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error: unknown) {
      console.log("error in update profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Profile update failed";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    const socket = io(BASE_URL, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
  },

  clearError: () => {
    set({ error: null });
  },
}));
