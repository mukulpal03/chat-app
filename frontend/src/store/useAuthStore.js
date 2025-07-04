import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSignInUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/check-auth");

      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      console.error(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignInUp: true });

    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      set({ authUser: res.data.user });
      get().connectSocket();
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message ?? "Something went wrong");
    } finally {
      set({ isSignInUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      set({ authUser: res.data.user });
      get().connectSocket();
      toast.success("Logged In successfully");
    } catch (error) {
      toast.error(error.response.data.message ?? "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnetSocket();
    } catch (error) {
      toast.error(error.response.data.message ?? "Something went wrong");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/api/auth/profile", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message ?? "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
