"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useGetMyConversationsQuery,
  useGetMyConversationQuery,
  useCreateConversationMutation,
} from "@/redux/api/conversations";
import { useSocket } from "@/hooks/useSocket";
import { getCookie } from "cookies-next";
import { cookieValues } from "@/constants/data";
import { apiUrl } from "@/config";
import { RichChat } from "@/components/chat/RichChat";

const MessageCenterPage = () => {
  const { data, isLoading, refetch } = useGetMyConversationsQuery({ pageSize: 1 });
  const [createConversation] = useCreateConversationMutation();
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    const convos = data.data.data ?? [];
    if (convos.length > 0) {
      setConversationId(convos[0]._id);
    } else {
      createConversation({ subject: "Support", body: "Hi, I need help." })
        .unwrap()
        .then((res) => setConversationId(res.data._id));
    }
  }, [data, createConversation]);

  if (isLoading || !conversationId)
    return <div className="text-N400 py-12 text-center">Loading…</div>;

  return (
    <div>
      <h2 className="text-lg font-bold text-N900 mb-4">Messages</h2>
      <div className="border border-N30 rounded-xl overflow-hidden" style={{ height: "600px" }}>
        <ChatView conversationId={conversationId} refetchList={refetch} />
      </div>
    </div>
  );
};

const ChatView = ({
  conversationId,
  refetchList,
}: {
  conversationId: string;
  refetchList: () => void;
}) => {
  const { data, isLoading, refetch } = useGetMyConversationQuery(conversationId);
  const {
    socket,
    joinConversation,
    leaveConversation,
    sendMessage: socketSend,
    markRead,
    emitTyping,
  } = useSocket();
  const [typing, setTyping] = useState(false);
  const [typingName, setTypingName] = useState("Support");
  const typingTimer = useRef<ReturnType<typeof setTimeout>>();
  const conversation = data?.data;

  useEffect(() => {
    joinConversation(conversationId);
    markRead(conversationId);
    return () => leaveConversation(conversationId);
  }, [conversationId, joinConversation, leaveConversation, markRead]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (d: { conversationId: string }) => {
      if (d.conversationId === conversationId) {
        refetch();
        refetchList();
        markRead(conversationId);
        setTyping(false);
      }
    };
    const onTyping = (d: { conversationId: string; role: string; name?: string }) => {
      if (d.conversationId === conversationId && d.role === "admin") {
        setTyping(true);
        if (d.name) setTypingName(d.name);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTyping(false), 3000);
      }
    };
    const onStop = (d: { conversationId: string }) => {
      if (d.conversationId === conversationId) setTyping(false);
    };
    socket.on("new_message", onNew);
    socket.on("user_typing", onTyping);
    socket.on("user_stop_typing", onStop);
    return () => {
      socket.off("new_message", onNew);
      socket.off("user_typing", onTyping);
      socket.off("user_stop_typing", onStop);
      clearTimeout(typingTimer.current);
    };
  }, [socket, conversationId, refetch, refetchList, markRead]);

  const handleUpload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const token = getCookie(cookieValues.token);
    const res = await fetch(`${apiUrl}/conversations/upload?type=chat`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const json = await res.json();
    return json.data.url;
  };

  if (isLoading || !conversation)
    return <div className="text-N400 py-12 text-center">Loading…</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-N30 bg-white shrink-0">
        <div className="w-9 h-9 rounded-full bg-BR400 grid place-items-center text-white text-xs font-bold shrink-0">
          S
        </div>
        <div>
          <h3 className="text-sm font-semibold text-N900">Support</h3>
          <p className="text-xs text-N400">Eden Wood Watch Hub</p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 min-h-0 relative">
        <RichChat
          messages={conversation.messages}
          myRole="customer"
          isOpen={true}
          typing={typing}
          senderName={typingName}
          onSend={(body, attachments) => socketSend(conversationId, body, attachments)}
          onTyping={() => emitTyping(conversationId)}
          onUploadFile={handleUpload}
        />
      </div>
    </div>
  );
};

export default MessageCenterPage;
