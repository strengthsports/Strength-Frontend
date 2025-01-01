const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode support
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
    extend: {
      colors: {
        background: 'hsl(var(--background))', // Use CSS variables for colors
        foreground: 'hsl(var(--foreground))',
        // Add additional CSS variable-based colors here if needed
      },
    },
  },
  plugins: [require('tailwindcss-animate')], // Add the animate plugin
};
