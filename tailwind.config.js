const { heroui } = require("@heroui/react")

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        '004b54': '#004b54',
        '006d77': '#006d77',
        '83c5be': '#83c5be',
        'edf6f9': '#edf6f9',
        'ffddd2': '#ffddd2',
        'e29578': '#e29572',
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
		},
  },
  darkMode: "class",
  plugins: [heroui()],
}
