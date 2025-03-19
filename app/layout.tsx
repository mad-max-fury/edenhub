import type { Metadata, Viewport } from "next";

import circularStd from "@/fonts";

import "./globals.css";

import Head from "./head";
import { AppProvider } from "./provider";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://google.com/"),
  title: { default: "Resource Edge", template: `%s | Resource Edge` },
  description: "Talent Management Application for Tenece Professional Services",
  icons: {
    icon: [
      {
        url: "../public/favicon/resource-edge-favicon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
  keywords: "manage company, organization app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head />

      <body className={circularStd.variable}>
        <div id="drawer-root"></div>
        <div id="portal"></div>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
