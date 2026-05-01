/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./App.jsx"],
  theme: {
    extend: {
      colors: {
        volt: {
          bg:     "#0a0a0a",
          soft:   "#171717",
          border: "#262626",
          muted:  "#a3a3a3",
          dim:    "#525252",
          yellow: "#facc15",
          hover:  "#fde047",
          red:    "#ef4444",
        },
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
        sans:    ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
