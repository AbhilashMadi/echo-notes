import type { Config } from "tailwindcss";

import { heroui } from "@heroui/theme";

export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)"],
        secondary: ["var(--font-secondary)"],
        ternary: ["var(--font-ternary)"],
      },
    },
    // backgroundImage: {
    //   "pattern-white": "/src/assets/images/bg-pattern-white.png",
    //   "pattern-black": "/src/assets/images/bg-pattern-black.png",
    // },
  },
  darkMode: "class",
  plugins: [heroui()],
} as Config;
