import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import ERDEAxios from "./ERDEAxios";
import SecureStoreManager from "../components/AsyncStorageManager";

export interface ChatUser {
  id: string;
  name: string;
  lastName: string;
  photo: string;
}

export interface ChatMessageItem {
  id: string;
  sanId: string;
  text: string;
  sentAt: string;
  user: ChatUser;
}

export interface ChatRoom {
  id: string;
  sanName: string;
  muted: boolean;
  lastMessage: {
    text: string;
    sentAt: string;
    authorName: string;
  } | null;
}

type SendAck = { ok?: boolean; error?: string; message?: ChatMessageItem };

let socket: Socket | null = null;
let socketToken: string | null = null;

function apiOrigin() {
  return String(process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
}

export async function connectChatSocket(): Promise<Socket | null> {
  const token = await SecureStoreManager.getItem<string>("Token");
  if (!token || !apiOrigin()) return null;
  if (socket && socketToken === token) return socket;
  socket?.disconnect();
  socketToken = token;
  socket = io(apiOrigin(), {
    auth: { token },
  });
  return socket;
}

export function getChatSocket() {
  return socket;
}

export const useChatRooms = () => {
  return useQuery<ChatRoom[], Error>({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const response = await ERDEAxios.get<ChatRoom[]>("/chat/rooms");
      return response.data;
    },
  });
};

export const useChatMessages = (sanId: string) => {
  return useQuery<ChatMessageItem[], Error>({
    queryKey: ["chatMessages", sanId],
    enabled: Boolean(sanId),
    queryFn: async () => {
      const response = await ERDEAxios.get<ChatMessageItem[]>(
        `/chat/messages/${sanId}`,
      );
      return response.data;
    },
  });
};

export const useSetChatMuted = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { sanId: string; muted: boolean }>({
    mutationFn: async ({ sanId, muted }) => {
      await ERDEAxios.patch(`/chat/rooms/${sanId}/mute`, { muted });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
  });
};

export function emitChatMessage(sanId: string, text: string) {
  return new Promise<SendAck>((resolve, reject) => {
    if (!socket) {
      reject(new Error("Chat socket is not connected"));
      return;
    }
    socket.emit("message", { sanId, text }, (response: SendAck) => {
      resolve(response || {});
    });
  });
}
