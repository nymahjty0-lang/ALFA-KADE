import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alfa: {
          black: "#070707",
          gold: "#d8aa4d",
          darkGold: "#8f6f2d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
