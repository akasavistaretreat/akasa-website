/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Wabi-Sabi earth palette
        paper: "#F7F4EE", // off-white base
        linen: "#EFE9DD", // warm beige
        sand: "#E4DCCB",
        stone: "#A9A398", // stone grey
        clay: "#8A7360", // muted brown
        moss: "#5C6B54", // earthy green
        forest: "#3C4A3A", // deep green
        charcoal: "#2B2B27",
        ink: "#1E1E1B",
        gold: "#B49B5E", // soft gold accent
        goldsoft: "#CBB98A",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Karla"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(43, 43, 39, 0.07)",
        card: "0 4px 20px rgba(43, 43, 39, 0.06)",
        lift: "0 16px 40px rgba(43, 43, 39, 0.12)",
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
};
