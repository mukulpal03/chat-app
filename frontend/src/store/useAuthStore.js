import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");

      set({ authUser: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
