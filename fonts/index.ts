import localFont from "next/font/local";

const circularStd = localFont({
  src: [
    {
      path: "./circularStd/CircularStd-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./circularStd/CircularStd-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./circularStd/CircularStd-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./circularStd/CircularStd-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-circularStd",
  display: "swap",
});

export default circularStd;
