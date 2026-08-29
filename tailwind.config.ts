import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          500: "#D4AF37",
          600: "#B5952F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
