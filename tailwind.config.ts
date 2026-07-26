import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forge: {
          50: "#eef6ff",
          100: "#d9ebff",
          500: "#3b82f6",
          600: "#2563eb",
          900: "#172554"
        }
      },
      boxShadow: {
        glow: "0 0 80px rgba(59, 130, 246, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
