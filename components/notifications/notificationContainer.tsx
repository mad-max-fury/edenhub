"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import { X } from "lucide-react";

import clashDisplay from "@/fonts";

import "react-toastify/dist/ReactToastify.css";

const CloseButton = ({ closeToast }: { closeToast?: (e: React.MouseEvent<HTMLElement>) => void }) => (
  <button onClick={closeToast} className="text-N300 hover:text-N600 transition-colors p-1 self-start mt-0.5" aria-label="Dismiss">
    <X size={14} />
  </button>
);

function NotificationContainer() {
  return (
    <>
      <style>{`
        .Toastify__toast-container { padding: 0; width: auto; max-width: 380px; }
        .Toastify__toast {
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
          padding: 14px 16px;
          min-height: auto;
          margin-bottom: 8px;
          border: 1px solid rgba(0,0,0,0.06);
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.97);
        }
        .Toastify__toast-body { padding: 0; gap: 12px; align-items: flex-start; }
        .Toastify__toast-icon { width: 32px; min-width: 32px; margin: 0; }
        .Toastify__toast--success { border-left: 3px solid #00875A; }
        .Toastify__toast--error { border-left: 3px solid #E34850; }
        .Toastify__progress-bar { height: 2px; }
        .Toastify__progress-bar--success { background: #00875A; }
        .Toastify__progress-bar--error { background: #E34850; }
      `}</style>
      <ToastContainer
        bodyStyle={{ ...clashDisplay.style }}
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={CloseButton}
        theme="light"
      />
    </>
  );
}

export default NotificationContainer;
