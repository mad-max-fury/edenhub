"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getCookie } from "cookies-next";
import { cookieValues } from "@/constants/data";
import { apiUrl } from "@/config";

const SOCKET_URL = apiUrl.replace(/\/api\/?$/, "");

let globalSocket: Socket | null = null;

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(globalSocket);
  const socketRef = useRef<Socket | null>(globalSocket);

  useEffect(() => {
    const token = getCookie(cookieValues.token) as string | undefined;
    if (!token) return;

    if (globalSocket?.connected) {
      socketRef.current = globalSocket;
      setSocket(globalSocket);
      return;
    }

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
    });

    s.on("connect", () => {
      setSocket(s);
    });

    s.on("connect_error", (err) => {
      console.warn("[socket] connection error:", err.message);
    });

    globalSocket = s;
    socketRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
      globalSocket = null;
      socketRef.current = null;
    };
  }, []);

  const joinConversation = useCallback((id: string) => {
    socketRef.current?.emit("join_conversation", id);
  }, []);

  const leaveConversation = useCallback((id: string) => {
    socketRef.current?.emit("leave_conversation", id);
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, body: string, attachments?: { url: string; type: string; name?: string }[]) => {
      socketRef.current?.emit("send_message", { conversationId, body, attachments });
    },
    [],
  );

  const emitTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing", { conversationId });
  }, []);

  const emitStopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("stop_typing", { conversationId });
  }, []);

  const markRead = useCallback((conversationId: string) => {
    socketRef.current?.emit("mark_read", { conversationId });
  }, []);

  return {
    socket,
    joinConversation,
    leaveConversation,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markRead,
  };
};
