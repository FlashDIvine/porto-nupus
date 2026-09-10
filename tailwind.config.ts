import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: {
          DEFAULT: "#121212",
          card: "#121212",
          elevated: "#161616",
        },
        card: {
          DEFAULT: "#121212",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#D4FF00",
          foreground: "#0a0a0a",
          hover: "#bce300",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Fraunces", "serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
