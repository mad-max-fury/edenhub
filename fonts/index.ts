import localFont from "next/font/local";

const clashDisplay = localFont({
  src: [
    {
      path: "./clashDisplay/ClashDisplay-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./clashDisplay/ClashDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./clashDisplay/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./clashDisplay/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./clashDisplay/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./clashDisplay/ClashDisplay-Variable.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

export default clashDisplay;
