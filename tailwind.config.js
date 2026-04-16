/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#1a1a1a",
        bg2: "#222222",
        bg3: "#2a2a2a",
        bg4: "#313131",
        border: "#111111",
        border2: "#3a3a3a",
        text: "#a9b1d6",
        text2: "#787c99",
        text3: "#4a4a5a",
        green: "#73daca",
        red: "#f7768e",
        amber: "#e0af68",
        purple: "#bb9af7",
        blue: "#7aa2f7",
        orange: "#ff9e64",
        cyan: "#7dcfff",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
};
