"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  Download,
  FileText,
  Headphones,
  Image as ImageIcon,
  Paperclip,
  Play,
  Send,
  Smile,
  X,
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import type { IMessage } from "@/redux/api/conversations/interface";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const detectType = (file: File): "image" | "video" | "audio" | "document" => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "document";
};

const detectTypeFromUrl = (url: string, type?: string): string => {
  if (type) return type;
  if (/\.(jpe?g|png|gif|webp|svg|bmp)(\?|$)/i.test(url)) return "image";
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac)(\?|$)/i.test(url)) return "audio";
  return "document";
};

const formatSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface PendingAttachment {
  file: File;
  preview: string;
  type: "image" | "video" | "audio" | "document";
}

interface RichChatProps {
  messages: IMessage[];
  myRole: "admin" | "customer";
  isOpen: boolean;
  typing?: boolean;
  typingLabel?: string;
  senderName?: string;
  senderAvatar?: string;
  onSend: (
    body: string,
    attachments: { url: string; type: string; name?: string; mimetype?: string; size?: number }[],
  ) => void;
  onTyping?: () => void;
  onUploadFile?: (file: File) => Promise<string>;
  closedMessage?: string;
  dateLabel?: string;
}

const Avatar = ({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string;
  size?: number;
}) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "bg-B400",
    "bg-BR400",
    "bg-G400",
    "bg-O400",
    "bg-R400",
    "bg-P400",
  ];
  const colorIdx =
    name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${colors[colorIdx]} rounded-full shrink-0 grid place-items-center text-white font-bold`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
};

const MediaPreview = ({ url, type, name, size, isOutgoing }: { url: string; type?: string; name?: string; size?: number; isOutgoing?: boolean }) => {
  const [lightbox, setLightbox] = useState(false);
  const resolved = detectTypeFromUrl(url, type);
  const fileName = name || decodeURIComponent(url.split("/").pop()?.split("?")[0] || "file");
  const bg = isOutgoing ? "bg-white/15 hover:bg-white/25" : "bg-N50 hover:bg-N100";

  if (resolved === "image") {
    return (
      <>
        <button onClick={() => setLightbox(true)} className="block max-w-[280px] rounded-xl overflow-hidden mt-1.5">
          <img src={url} alt={fileName} className="w-full h-auto max-h-[240px] object-cover rounded-xl" loading="lazy" />
        </button>
        {lightbox && (
          <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
            <button className="absolute top-4 right-4 text-white hover:text-N200" onClick={() => setLightbox(false)}><X size={24} /></button>
            <img src={url} alt="" className="max-w-full max-h-[90vh] object-contain rounded" onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </>
    );
  }

  if (resolved === "video") {
    return <video src={url} controls className="max-w-[300px] max-h-[220px] rounded-xl mt-1.5" preload="metadata" />;
  }

  if (resolved === "audio") {
    return (
      <div className={`flex items-center gap-3 mt-1.5 px-3 py-2.5 rounded-xl ${bg} transition-colors max-w-[300px]`}>
        <Headphones size={18} className={isOutgoing ? "text-white/70" : "text-BR500"} />
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium truncate ${isOutgoing ? "text-white" : "text-N800"}`}>{fileName}</p>
          {size ? <p className={`text-[10px] ${isOutgoing ? "text-white/50" : "text-N400"}`}>{formatSize(size)}</p> : null}
          <audio src={url} controls className="w-full mt-1.5 h-8" preload="metadata" />
        </div>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-3 mt-1.5 px-3 py-2.5 rounded-xl ${bg} transition-colors max-w-[280px]`}>
      <div className={`w-9 h-9 rounded-lg grid place-items-center shrink-0 ${isOutgoing ? "bg-white/20" : "bg-BR50"}`}>
        <FileText size={18} className={isOutgoing ? "text-white" : "text-BR500"} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${isOutgoing ? "text-white" : "text-N800"}`}>{fileName}</p>
        {size ? <p className={`text-[10px] ${isOutgoing ? "text-white/50" : "text-N400"}`}>{formatSize(size)}</p> : null}
      </div>
      <Download size={14} className={`shrink-0 ${isOutgoing ? "text-white/60" : "text-N400"}`} />
    </a>
  );
};

const MessageBubble = ({
  msg,
  myRole,
  showAvatar,
  showName,
}: {
  msg: IMessage;
  myRole: string;
  showAvatar: boolean;
  showName: boolean;
}) => {
  const isMe = msg.sender === myRole;
  const attachments = msg.attachments ?? [];
  const populatedName = typeof msg.senderId === "object" && msg.senderId
    ? `${msg.senderId.firstName} ${msg.senderId.lastName}`.trim()
    : "";
  const senderLabel = isMe
    ? "You"
    : populatedName || (myRole === "admin" ? "Customer" : "Support");

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} ${showName ? "mt-4" : "mt-0.5"}`}
    >
      {!isMe && (
        <div className="w-9 shrink-0 mr-2 flex items-end">
          {showAvatar && <Avatar name={senderLabel} size={32} />}
        </div>
      )}

      <div
        className={`max-w-[65%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
      >
        {showName && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-semibold text-N700">
              {senderLabel}
            </span>
            <span className="text-[10px] text-N400">
              {formatTime(msg.createdAt)}
            </span>
          </div>
        )}

        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isMe
              ? "bg-[#0084FF] text-white rounded-2xl rounded-br-sm"
              : "bg-N10 text-N800 border border-N30 rounded-2xl rounded-bl-sm"
          }`}
        >
          {msg.body && (
            <div className="whitespace-pre-wrap break-words">{msg.body}</div>
          )}
          {attachments.map((a, i) => (
            <MediaPreview key={i} url={a.url} type={a.type} name={a.name} size={a.size} isOutgoing={isMe} />
          ))}
        </div>

        {!showName && isMe && (
          <div className="flex items-center gap-1 mt-0.5 px-1">
            <span className="text-[10px] text-N300">
              {formatTime(msg.createdAt)}
            </span>
          </div>
        )}
      </div>

      {isMe && (
        <div className="w-9 shrink-0 ml-2 flex items-end">
          {showAvatar && <Avatar name="You" size={32} />}
        </div>
      )}
    </div>
  );
};

export const RichChat = ({
  messages,
  myRole,
  isOpen,
  typing,
  typingLabel = "typing…",
  senderName,
  senderAvatar,
  onSend,
  onTyping,
  onUploadFile,
  closedMessage = "Conversation closed.",
  dateLabel,
}: RichChatProps) => {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [pending, setPending] = useState<PendingAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, pending.length]);

  useEffect(() => {
    if (!showEmoji) return;
    const close = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showEmoji]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      setPending((p) => [
        ...p,
        { file, preview: URL.createObjectURL(file), type: detectType(file) },
      ]);
    }
    e.target.value = "";
  };

  const removePending = (i: number) => {
    setPending((p) => {
      URL.revokeObjectURL(p[i].preview);
      return p.filter((_, j) => j !== i);
    });
  };

  const handleSend = async () => {
    if (!text.trim() && pending.length === 0) return;
    setUploading(true);
    try {
      const attachments: { url: string; type: string; name?: string; mimetype?: string; size?: number }[] = [];
      if (onUploadFile) {
        for (const p of pending) {
          const url = await onUploadFile(p.file);
          attachments.push({ url, type: p.type, name: p.file.name, mimetype: p.file.type, size: p.file.size });
        }
      }
      onSend(text.trim(), attachments);
      setText("");
      setPending((p) => {
        p.forEach((a) => URL.revokeObjectURL(a.preview));
        return [];
      });
      setShowEmoji(false);
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTyping?.();
  };

  const addEmoji = (emoji: { native: string }) => {
    setText((t) => t + emoji.native);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {dateLabel && (
          <div className="text-center mb-5">
            <span className="text-[11px] text-N400 bg-N10 px-4 py-1.5 rounded-full">
              {dateLabel}
            </span>
          </div>
        )}
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showName = !prev || prev.sender !== m.sender;
          const next = messages[i + 1];
          const showAvatar = !next || next.sender !== m.sender;
          return (
            <MessageBubble
              key={m._id ?? i}
              msg={m}
              myRole={myRole}
              showAvatar={showAvatar}
              showName={showName}
            />
          );
        })}
        {typing && (
          <div className="flex items-end mt-4">
            <div className="w-9 shrink-0 mr-2">
              <Avatar name={senderName || "User"} src={senderAvatar} size={32} />
            </div>
            <div className="bg-N10 border border-N30 rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="inline-flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-N400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-N400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-N400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {pending.length > 0 && (
        <div className="px-5 py-2 border-t border-N20 flex gap-2 overflow-x-auto">
          {pending.map((p, i) => (
            <div key={i} className="relative shrink-0">
              {p.type === "image" ? (
                <img src={p.preview} alt="" className="w-16 h-16 object-cover rounded-xl border border-N30" />
              ) : p.type === "video" ? (
                <div className="w-16 h-16 rounded-xl border border-N30 bg-N50 flex items-center justify-center">
                  <Play size={20} className="text-N500" />
                </div>
              ) : p.type === "audio" ? (
                <div className="w-16 h-16 rounded-xl border border-N30 bg-N50 flex flex-col items-center justify-center gap-1">
                  <Headphones size={18} className="text-N500" />
                  <span className="text-[8px] text-N400 truncate max-w-[56px]">{p.file.name.split(".").pop()}</span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border border-N30 bg-N50 flex flex-col items-center justify-center gap-1">
                  <FileText size={18} className="text-N500" />
                  <span className="text-[8px] text-N400 truncate max-w-[56px]">{p.file.name.split(".").pop()}</span>
                </div>
              )}
              <button
                onClick={() => removePending(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-N700 text-white rounded-full grid place-items-center hover:bg-R500 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen ? (
        <div className="border-t border-N20 px-4 py-3 shrink-0 relative">
          {showEmoji && (
            <div ref={emojiRef} className="absolute bottom-16 left-4 z-50 shadow-xl rounded-xl overflow-hidden">
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
              />
            </div>
          )}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-9 h-9 rounded-full grid place-items-center text-[#0084FF] hover:bg-B50 transition-colors shrink-0"
            >
              <ImageIcon size={20} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex-1 relative flex items-end bg-N10 rounded-full px-4 py-2">
              <textarea
                value={text}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Write a message"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-N800 placeholder:text-N400 focus:outline-none max-h-[100px] overflow-y-auto leading-5"
                style={{ minHeight: "20px" }}
              />
              <button
                type="button"
                onClick={() => setShowEmoji((s) => !s)}
                className={`shrink-0 ml-1 transition-colors ${showEmoji ? "text-[#0084FF]" : "text-N400 hover:text-N600"}`}
              >
                <Smile size={20} />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={uploading || (!text.trim() && pending.length === 0)}
              className="w-9 h-9 rounded-full bg-[#0084FF] text-white grid place-items-center hover:bg-[#006FDB] transition-colors disabled:bg-N200 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-N20 py-4 text-center text-sm text-N400">
          {closedMessage}
        </div>
      )}
    </div>
  );
};
