"use client";

import React from "react";

export interface NotificationMsgProps {
  message?: string;
  subtitle?: string;
  type?: "success" | "error";
}

function NotificationMsg({
  message,
  subtitle,
  type = "success",
}: NotificationMsgProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {message && (
        <p className="text-sm font-medium text-N900 first-letter:capitalize leading-snug">
          {message}
        </p>
      )}
      {subtitle && (
        <p className="text-xs text-N500 leading-snug">
          {subtitle[0].toUpperCase() + subtitle.slice(1)}
        </p>
      )}
    </div>
  );
}

export default NotificationMsg;
