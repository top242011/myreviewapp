/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // <-- สำคัญ: แก้ไขบรรทัดนี้ให้ถูกต้อง!
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Removed custom colors, shadows, and background images to simplify.
      // We will rely on Tailwind's default color palette and direct class applications.
      // Custom text shadow for glow effect
      textShadow: {
        'glow': '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
      },
    },
  },
  plugins: [
    // Plugin for custom text-shadow utility
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.text-shadow-glow': {
          textShadow: theme('textShadow.glow'),
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}
