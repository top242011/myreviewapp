/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Removed custom colors, boxShadow, and backgroundImage to simplify.
      // We will rely on Tailwind's default color palette and direct class applications.
    },
  },
  plugins: [],
}
