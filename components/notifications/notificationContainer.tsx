"use client";

import React from "react";
import { ToastContainer } from "react-toastify";

import clashDisplay from "@/fonts";

import "react-toastify/dist/ReactToastify.css";

function NotifCloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 7.5L12 12M12 12L7.5 16.5M12 12L16.5 16.5M12 12L16.5 7.5"
        stroke="#999CA0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NotificationContainer() {
  return (
    <ToastContainer
      bodyStyle={{ ...clashDisplay.style }}
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      icon={<NotifCloseIcon />}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton={NotifCloseIcon}
      theme="light"
    />
  );
}

export default NotificationContainer;
