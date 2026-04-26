/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInSoft: {
          "0%": { opacity: "0.6" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.45s ease-out forwards",
        fadeInUp: "fadeInUp 0.55s ease-out forwards",
        fadeInSlow: "fadeIn 0.75s ease-out forwards",
        fadeInSoft: "fadeInSoft 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
