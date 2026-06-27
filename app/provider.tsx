"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReduxProvider } from "@/redux";
import NotificationContainer from "@/components/notifications/notificationContainer";
import { CartSync } from "@/components/cart/CartSync";
import { AuthModalProvider } from "@/components/authModal/AuthModal";
import { googleClientId } from "@/config";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ReduxProvider>
        <NotificationContainer />
        <CartSync />
        <AuthModalProvider>{children}</AuthModalProvider>
      </ReduxProvider>
    </GoogleOAuthProvider>
  );
};
