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
        canvas: "#FAF8F5",
        background: "#FAF8F5",
        surface: {
          DEFAULT: "#FFFFFF",
          card: "#FFFFFF",
          elevated: "#FFFFFF",
          alabaster: "#F2EFE9",
          muted: "#F2EFE9",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#181716",
        },
        border: {
          DEFAULT: "#E6E2D8",
          sandstone: "#E6E2D8",
        },
        charcoal: "#181716",
        taupe: "#6B6661",
        accent: {
          DEFAULT: "#E26D5C",
          terracotta: "#E26D5C",
          sage: "#D8E2DC",
          cobalt: "#2B50EC",
          foreground: "#FFFFFF",
          hover: "#2B50EC",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "var(--font-cormorant)", "Cormorant Garamond", "Fraunces", "serif"],
        body: ["var(--font-body)", "var(--font-jakarta)", "Plus Jakarta Sans", "DM Sans", "sans-serif"],
        mono: ["var(--font-mono)", "var(--font-space)", "Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
