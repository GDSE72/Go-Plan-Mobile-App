/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: This includes all files in your 'app' and 'components' directories
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0FA4E9", // Sky blue/Cyan from image
          50: "#EFFAFF",
          100: "#DEF3FF",
          200: "#B6E6FF",
          300: "#75D2FF",
          400: "#2EB9FF",
          500: "#0FA4E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        }
      }
    },
  },
  plugins: [],
};