import { create } from "zustand";

import API from "../service/api";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await API.getUsersForSidebar();
      set({ users: res.data });
    } catch (error) {
      
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      
      const res = await API.getMessages(userId);
      set({ messages: res.data });
    } catch (error) {
      // toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await API.sendMessage({
         id : selectedUser._id,
         text : messageData.text,
         image : messageData.image,
       
      })
     
     set(state => ({ messages: [...state.messages, res.data] }));
     console.log(res.data , " res from sendmessage ")
     
    } catch (error) {
      console.log(error  , " error from chat store sendmessage")
    }
  },

   subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set(state => ({
  messages: [...state.messages, newMessage],
}));

    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  
}));
