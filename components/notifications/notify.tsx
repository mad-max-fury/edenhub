"use client";

import {
  Id,
  toast,
  ToastContent,
  ToastOptions,
  UpdateOptions,
} from "react-toastify";

import { NotifErrorIcon, NotifSuccessIcon } from "../../assets/svgs";
import NotificationMsg from "./NotificationMsg";

// Notifications props
interface NotifProps extends ToastOptions<object> {
  content?: ToastContent<unknown>;
  message?: string;
  subtitle?: string;
}

// Update notifications props
interface UpdateNotifProps extends UpdateOptions<object> {
  content?: ToastContent<unknown>;
  message?: string;
  subtitle?: string;
}

// Success notifications trigger
const success = ({ content, message, subtitle, ...options }: NotifProps) =>
  toast.success(
    content || <NotificationMsg message={message} subtitle={subtitle} />,
    {
      icon: <NotifSuccessIcon className="!h-7 !w-7" />,
      ...options,
    },
  );

// Error notifications trigger
const error = ({ content, message, subtitle, ...options }: NotifProps) =>
  toast.error(
    content || (
      <NotificationMsg message={message} subtitle={subtitle} type="error" />
    ),
    {
      icon: <NotifErrorIcon className="!h-7 !w-7" />,
      ...options,
    },
  );

// Update notifications trigger
const update = (
  id: Id,
  { content, message, subtitle, type, ...props }: UpdateNotifProps,
) =>
  toast.update(id, {
    render: content || (
      <NotificationMsg message={message} subtitle={subtitle} />
    ),
    icon: type === "error" ? NotifErrorIcon : NotifSuccessIcon,
    ...props,
  });

// Dismiss all notifications
const dismissAll = () => toast.dismiss();

export const notify = { success, error, update, dismissAll };
