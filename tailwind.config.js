const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode support
  content: [
    "app/index.js",
    "app/_layout.js",
    "app/(auth)/login.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    fontSize: {
      xxs: ["8px", { lineHeight: "11px" }],
      xs: ["9px", { lineHeight: "11px" }],
      sm: ["10px", { lineHeight: "14px" }],
      base: ["11px", { lineHeight: "14px" }],
      lg: ["12px", { lineHeight: "16px" }],
      xl: ["13px", { lineHeight: "16px" }],
      "2xl": ["14px", { lineHeight: "20px" }],
      "3xl": ["15px", { lineHeight: "20px" }],
      "4xl": ["16px", { lineHeight: "28px" }],
      "5xl": ["18px", { lineHeight: "24px" }],
      "6xl": ["22px", { lineHeight: "28px" }],
      "7xl": ["28px", { lineHeight: "42px" }],
      "8xl": ["36px", { lineHeight: "46px" }],
      "9xl": ["44px", { lineHeight: "1" }],
      // '6xl': ['56px', { lineHeight: '1' }],
      // '7xl': ['68px', { lineHeight: '1' }],
      // '8xl': ['84px', { lineHeight: '1' }],
      // '9xl': ['120px', { lineHeight: '1' }],
    },

    extend: {
      colors: {
        background: "hsl(var(--background))", // Use CSS variables for colors
        foreground: "hsl(var(--foreground))",
        // Add additional CSS variable-based colors here if needed
        theme: {
          DEFAULT: "#12956B", // Default shade
          50: "#e6f5f0", // Lightest shade
          100: "#ccebe1",
          200: "#99d7c3",
          300: "#66c3a5",
          400: "#33af87",
          500: "#12956B", // Base shade
          600: "#0f7a58",
          700: "#0c5f45",
          800: "#094532",
          900: "#062a1f", // Darkest shade
        },
      },
    },
  },
  plugins: [
    // require('tailwindcss-animate')
    require('@tailwindcss/line-clamp'),
  ], // Add the animate plugin
};
