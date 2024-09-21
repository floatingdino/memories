import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["SF Pro Text", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      serif: ["Georgia", "ui-serif", "serif"],
      monospace: ["SF Mono", "monospace"],
    },
    extend: {
      colors: {
        black: "#000",
        white: "#fff",
        error: {
          400: "#FF3B30",
          500: "#FF453A",
        },
        gray: {
          200: "#F2F2F7",
          300: "#E5E5EA",
          400: "#D1D1D6",
          500: "#C7C7CC",
          600: "#AEAEB2",
          700: "#8E8E93",
        },
        success: "#12b76a",
        warning: "#FEC84B",
        primary: {
          400: "#007aff",
          500: "#0a84ff",
        },
        "global-bg": "var(--bg-color)",
      },
      transitionDelay: {
        0: "0ms",
      },
      transitionProperty: {
        opacity: "opacity, visibility",
      },
    },
  },
  plugins: [],
}
export default config
