/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map to JUKANES CSS variables
        primary: 'var(--color-primary)',     // #ffc72c
        secondary: 'var(--color-secondary)', // #20a39e
        light: 'var(--color-light)',         // #fffacd
        dark: 'var(--color-dark)',           // #2e4057
        accent: 'var(--color-accent)',        // #ff6b6b
        'gray-custom': 'var(--color-gray-custom)', // #797e88
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}