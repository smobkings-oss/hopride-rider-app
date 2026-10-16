/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
      },
    },
  },
  plugins: [],
};
