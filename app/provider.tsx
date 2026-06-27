"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ReduxProvider } from "@/redux";
import NotificationContainer from "@/components/notifications/notificationContainer";
import { CartSync } from "@/components/cart/CartSync";
import { AuthModalProvider } from "@/components/authModal/AuthModal";
import { googleClientId } from "@/config";

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <APIProvider apiKey={GOOGLE_MAPS_KEY}>
        <ReduxProvider>
          <NotificationContainer />
          <CartSync />
          <AuthModalProvider>{children}</AuthModalProvider>
        </ReduxProvider>
      </APIProvider>
    </GoogleOAuthProvider>
  );
};
