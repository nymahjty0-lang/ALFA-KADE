import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#d8a73d",
        gold2: "#f4cf72",
        ink: "#090909",
        panel: "#151515"
      }
    }
  },
  plugins: []
};
export default config;