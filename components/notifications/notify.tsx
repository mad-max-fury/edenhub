"use client";

import React from "react";
import {
  Id,
  toast,
  ToastContent,
  ToastOptions,
  UpdateOptions,
} from "react-toastify";
import { CheckCircle2, XCircle } from "lucide-react";

import NotificationMsg from "./NotificationMsg";

interface NotifProps extends ToastOptions<object> {
  content?: ToastContent<unknown>;
  message?: string;
  subtitle?: string;
}

interface UpdateNotifProps extends UpdateOptions<object> {
  content?: ToastContent<unknown>;
  message?: string;
  subtitle?: string;
}

const SuccessIcon = () => (
  <div className="w-8 h-8 rounded-full bg-G50 grid place-items-center shrink-0">
    <CheckCircle2 size={18} className="text-G500" />
  </div>
);

const ErrorIcon = () => (
  <div className="w-8 h-8 rounded-full bg-R50 grid place-items-center shrink-0">
    <XCircle size={18} className="text-R500" />
  </div>
);

const success = ({ content, message, subtitle, ...options }: NotifProps) =>
  toast.success(
    content || <NotificationMsg message={message} subtitle={subtitle} />,
    { icon: <SuccessIcon />, ...options },
  );

const error = ({ content, message, subtitle, ...options }: NotifProps) =>
  toast.error(
    content || <NotificationMsg message={message} subtitle={subtitle} type="error" />,
    { icon: <ErrorIcon />, ...options },
  );

const update = (
  id: Id,
  { content, message, subtitle, type, ...props }: UpdateNotifProps,
) =>
  toast.update(id, {
    render: content || <NotificationMsg message={message} subtitle={subtitle} />,
    icon: type === "error" ? <ErrorIcon /> : <SuccessIcon />,
    ...props,
  });

const dismissAll = () => toast.dismiss();

export const notify = { success, error, update, dismissAll };
