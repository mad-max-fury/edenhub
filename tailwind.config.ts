import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "320px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1360px",
      mxl: { max: "1279px" },
      mlg: { max: "1023px" },
      mmlg: { max: "976px" },
      mmd: { max: "768px" },
      msm: { max: "639px" },
      mxs: { max: "480px" },
      mxxs: { max: "400px" },
      mxxss: { max: "375px" },
      mxxssw: { max: "355px" },
      mxxxs: { max: "320px" },
      "ms-height": { raw: "(max-height: 700px)" },
      "mxl-height": { raw: "(max-height: 850px)" },
    },
    fontFamily: {
      clashDisplay: ["var(--font-clash-display)", ...fontFamily.serif],
    },
    extend: {
      backgroundImage: {},
      fontSize: {
        // Headings element styles
        "h-xxl": ["3rem", { lineHeight: "48px", fontWeight: 700 }],
        "h-xl": ["2rem", { lineHeight: "40px", fontWeight: 700 }],
        "h-l": ["1.5rem", { lineHeight: "24px", fontWeight: 700 }],
        "h-m": ["1.1875rem", { lineHeight: "24px", fontWeight: 700 }],
        "h-s": ["1rem", { lineHeight: "24px", fontWeight: 700 }],
        "h-xs": [".75rem", { lineHeight: "15.96px", fontWeight: 700 }],

        // Paragraph element styles
        "p-xxl": ["1.5rem", { lineHeight: "32px", fontWeight: 400 }],
        "p-xl": ["1.1875rem", { lineHeight: "28px", fontWeight: 400 }],
        "p-l": ["1rem", { lineHeight: "16px", fontWeight: 400 }],
        "p-m": ["0.875rem", { lineHeight: "20.02px", fontWeight: 400 }],
        "p-s": ["0.75rem", { lineHeight: "15.96px", fontWeight: 400 }],
        // Controls element styles
        "c-xxl": ["1.5rem", { lineHeight: "24px", fontWeight: 700 }],
        "c-xl": ["1.1875rem", { lineHeight: "19px", fontWeight: 700 }],
        "c-l": ["1rem", { lineHeight: "24px", fontWeight: 700 }],
        "c-m": ["0.875rem", { lineHeight: "15.96px", fontWeight: 700 }],
        "c-s": ["0.75rem", { lineHeight: "12px", fontWeight: 700 }],
      },
      colors: {
        "gray-normal": "var(--color-text-gray-normal)",
        "gray-darker":"var(--color-text-gray-darker)",
        // Bg
        default: "var(--color-bg)",
        card: "var(--color-bg50)",
        // Gold
        LB50: "var(--color-LB50)",
        LB75: "var(--color-LB75)",
        LB100: "var(--color-LB100)",
        LB200: "var(--color-LB200)",
        LB300: "var(--color-LB300)",
        LB400: "var(--color-LB400)",
        LB500: "var(--color-LB500)",
        LB600: "var(--color-LB600)",
        // Brown
        BR50: "var(--color-BR50)",
        BR75: "var(--color-BR75)",
        BR100: "var(--color-BR100)",
        BR200: "var(--color-BR200)",
        BR300: "var(--color-BR300)",
        BR400: "var(--color-BR400)",
        BR500: "var(--color-BR500)",
        // Blue
        B50: "var(--color-B50)",
        B75: "var(--color-B75)",
        B100: "var(--color-B100)",
        B200: "var(--color-B200)",
        B300: "var(--color-B300)",
        B400: "var(--color-B400)",
        B500: "var(--color-B500)",

        // Red
        R50: "var(--color-R50)",
        R75: "var(--color-R75)",
        R100: "var(--color-R100)",
        R200: "var(--color-R200)",
        R300: "var(--color-R300)",
        R400: "var(--color-R400)",
        R500: "var(--color-R500)",

        // Yellow
        Y50: "var(--color-Y50)",
        Y75: "var(--color-Y75)",
        Y100: "var(--color-Y100)",
        Y200: "var(--color-Y200)",
        Y300: "var(--color-Y300)",
        Y400: "var(--color-Y400)",
        Y500: "var(--color-Y500)",

        // Green
        G50: "var(--color-G50)",
        G75: "var(--color-G75)",
        G100: "var(--color-G100)",
        G200: "var(--color-G200)",
        G300: "var(--color-G300)",
        G400: "var(--color-G400)",
        G500: "var(--color-G500)",

        // Purple
        P50: "var(--color-P50)",
        P75: "var(--color-P75)",
        P100: "var(--color-P100)",
        P200: "var(--color-P200)",
        P300: "var(--color-P300)",
        P400: "var(--color-P400)",
        P500: "var(--color-P500)",

        // Teal
        T50: "var(--color-T50)",
        T75: "var(--color-T75)",
        T100: "var(--color-T100)",
        T200: "var(--color-T200)",
        T300: "var(--color-T300)",
        T400: "var(--color-T400)",
        T500: "var(--color-T500)",

        // Neutral (Light)
        N0: "var(--color-N0)",
        N10: "var(--color-N10)",
        N20: "var(--color-N20)",
        N30: "var(--color-N30)",
        N40: "var(--color-N40)",
        N50: "var(--color-N50)",

        // Neutral (Mid)
        N60: "var(--color-N60)",
        N70: "var(--color-N70)",
        N80: "var(--color-N80)",
        N90: "var(--color-N90)",
        N100: "var(--color-N100)",
        N200: "var(--color-N200)",
        N300: "var(--color-N300)",
        N400: "var(--color-N400)",

        // Neutral (Dark)
        N500: "var(--color-N500)",
        N600: "var(--color-N600)",
        N700: "var(--color-N700)",
        N800: "var(--color-N800)",
        N900: "var(--color-N900)",

        //Text
        "text-default": "var(--color-text-default)",
        "text-light": "var(--color-text-light)",
      },
      boxShadow: {
        auth: "0px 4px 50px 0px #0000000D",
      },
      dropShadow: {
        "image-drop-shadow": "-43px 46px 60px 0px #091E424F",
      },
      animation: {
        move: "move 2s linear infinite",
      },
      keyframes: {
        move: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(calc(5 / 2 * 100%))" },
        },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line
    plugin(function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".text-balance": {
          "text-wrap": "balance",
        },
        ".tab-box-shadow": {
          "box-shadow": "0px 1px 0px 0px #091e4240",
        },
        ".page-tab-box-shadow": {
          "box-shadow": "0px 2px 6px 0px #c1c7d066",
        },
        ".dropdown-menu-box-shadow": {
          "box-shadow": "0px 0px 1px 0px #091e424f, 0px 3px 5px 0px #091e4233",
        },
        "auth-shadow": {
          "box-shadow": "0px 4px 50px 0px #0000000D",
        },
        ".sticky-column-shadow": {
          "box-shadow": "0px -1px 0px 0px #DDDDDD",
        },
        ".hideScrollBar": {
          "-ms-overflow-style": "none", // IE and Edge
          "scrollbar-width": "none", // Firefox
        },
        ".hideScrollBar::-webkit-scrollbar": {
          display: "none", // Hide scrollbar in Webkit browsers
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
export default config;
