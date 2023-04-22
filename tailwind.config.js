/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{html,tsx}", "./components/**/*.{html,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6AFFAF",
        secondary: "#F4FAFF",
        tertiary: "#BF9E7B",
        background: "#101012",
      },
    },
  },
  plugins: [],
};
