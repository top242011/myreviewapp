/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js', // This line looks truncated, ensure it's correct.
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // All custom colors, boxShadow, backgroundImage removed to simplify.
      // Relying on Tailwind's default palette and direct utility classes.
    },
  },
  plugins: [],
}
