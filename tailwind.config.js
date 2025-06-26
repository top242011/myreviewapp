/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Ensure this line is correct: './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Liquid Glass Palette - Vibrant, Energetic, and Modern
        'primary-start': '#6A11CB', // Deep Purple (for gradients)
        'primary-end': '#2575FC',   // Vibrant Blue (for gradients)
        'accent-pink': '#FF6B6B',   // Energetic Coral/Pink
        'accent-orange': '#FFA500', // Bright Orange (secondary accent)
        'text-light': '#F8FAFC',    // Light text on dark backgrounds
        'text-dark': '#1F2937',     // Dark text on light elements (for contrast)
        'glass-overlay': 'rgba(255, 255, 255, 0.15)', // Base transparency for glass
        'glass-border-light': 'rgba(255, 255, 255, 0.3)', // Lighter border for glass
        'glass-input-bg': 'rgba(255, 255, 255, 0.25)', // Input specific transparency
      },
      boxShadow: {
        // Custom shadows for glass elements to add depth and glow
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.17)',
        'glass-lg': '0 10px 40px 0 rgba(0, 0, 0, 0.25)',
        'glass-sm': '0 4px 15px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        // Reusable gradients for backgrounds and buttons
        'gradient-bg': 'radial-gradient(circle at 10% 20%, var(--tw-colors-primary-start) 0%, var(--tw-colors-primary-end) 100%)',
        'gradient-button-primary': 'linear-gradient(to right, var(--tw-colors-primary-start), var(--tw-colors-primary-end))',
        'gradient-button-accent': 'linear-gradient(to right, var(--tw-colors-accent-pink), var(--tw-colors-accent-orange))',
        'gradient-card-border': 'linear-gradient(45deg, var(--tw-colors-accent-pink), var(--tw-colors-accent-orange))',
      },
      // Custom text shadow for glow effect
      textShadow: {
        'glow': '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
      },
    },
  },
  plugins: [
    // Ensure you add any required Tailwind plugins here, e.g., for text-shadow
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
