"use client";

import React from "react";
import clsx from "clsx";

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
    <div className="flex flex-col">
      {message && (
        <h2
          className={clsx(
            "text-sm font-bold tracking-[0.2px] first-letter:capitalize",
            type === "success" ? "text-success" : "text-error",
          )}
        >
          {message}
        </h2>
      )}

      {subtitle && (
        <p className="text-xs !text-[#A9A9A9]">
          {subtitle[0].toUpperCase() + subtitle.slice(1)}
        </p>
      )}
    </div>
  );
}

export default NotificationMsg;
