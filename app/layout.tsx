import type { Metadata, Viewport } from "next";

import clashDisplay from "@/fonts";

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
  title: { default: "EdenHub", template: `%s | EdenHub` },
  description:
    "E-commerce Watch Selling Website aimed to create an online platform where users can browse, select, and purchase watches, sunglasses, bracelets and personalised gifts. Additionally, users will have the option to customize their watch orders with specific designs. The website will also include administrative functionalities to manage watch listings, user accounts, and order tracking.",
  icons: {
    icon: [
      {
        url: "../public/favicon/logoIconWhite.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
  keywords: "Buy watch, customize , watch, sunglasses, bracelets, gifts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head />

      <body className={clashDisplay.variable}>
        <div id="drawer-root"></div>
        <div id="portal"></div>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
