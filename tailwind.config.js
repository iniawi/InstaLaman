/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fbfaf7",
        ink: "#12274a",
        forest: "#12274a",
        forest2: "#1f3d6b",
        amber: "#f0813a",
        ambersoft: "#e6f3fc",
        line: "#dfe6ee",
        muted: "#5b6b85",
      },
      fontFamily: {
        display: ["Poppins", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
