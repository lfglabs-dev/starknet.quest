/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{html,tsx}", "./components/**/*.{html,tsx}"],
  theme: {
    colors: {
      primary: "#6AFFAF",
      secondary: "#F4FAFF",
      secondary300: "#eae0d5",
      tertiary: "#BF9E7B",
      background: "#101012",
      // Add additional default colors here
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      gray: {
        100: "#f7fafc",
        // ...
        200: "#d1d5db",
        900: "#1a202c",
      },
      // ... Other colors you want to add
    },
  },
  plugins: [],
};
