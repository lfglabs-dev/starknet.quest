/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{html,tsx}", "./components/**/*.{html,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xl2_5: "1.875rem",
      },

      backgroundImage: {
        'border-gradient-green': 'linear-gradient(to right, #6AFFAF, #5DE5FA)',
        'border-gradient-blue': 'linear-gradient(to right, #5DE5FA, #6AFFAF)',
        'gradient-green': 'linear-gradient(to right, #6AFFAF, transparent, #5DE5FA)',
        'gradient-blue': 'linear-gradient(to right, #5DE5FA, transparent, #6AFFAF)',
      },

      colors: {
        primary: "#6AFFAF",
        secondary: "#F4FAFF",
        secondary300: "#eae0d5",
        tertiary: "#BF9E7B",
        background: "#101012",

        higher: "#5DE5FA00",
        darkCard: "#1F1F25",
        white10: "#FFFFFF0A",
        borderGlow: "#5CE3FE29",
        textGray: "#A6A5A7",
        greenAccent: "#6AFFAF",
        blueAccent: "#5CE3FE",

        transparent: "transparent",
        current: "currentColor",
        black: "#000",
        white: "#fff",

        gray: {
          100: "#f7fafc",
          200: "#d1d5db",
          300: "#1F1F25",
          900: "#1a202c",
        },

        brand: {
          greenBorder: "#6AFFAF1A", 
          blueBorder: "#5DE5FA1A", 
        },
      },

      borderColor: {
        greenGlow: "#6AFFAF",
        blueGlow: "#5DE5FA",
      },

      boxShadow: {
        greenGlow: "0 0 20px rgba(106, 255, 175, 0.15)",
        blueGlow: "0 0 20px rgba(93, 229, 250, 0.15)", 
      },

      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },

      lineHeight: {
        12: "3.8rem",
      },

      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};
