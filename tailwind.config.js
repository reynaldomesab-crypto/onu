/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        un: {
          dark: "#0f172a",
          blue: "#1e40af",
          lightblue: "#3b82f6",
          gold: "#d4af37",
          white: "#f8fafc",
        },
        p5: {
          red: "#dc2626",
          orange: "#ea580c",
        },
        e10: {
          green: "#16a34a",
          teal: "#0d9488",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
}
