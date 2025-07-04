import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data.users });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/message/${selectedUser._id}`,
        data
      );
      set({ messages: [...messages, res.data.message] });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
