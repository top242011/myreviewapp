/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vibrant colors for Liquid Glass theme
        'glass-primary-light': '#6A11CB', // Deeper purple for gradients
        'glass-primary-dark': '#2575FC',  // Vibrant blue for gradients
        'glass-accent-light': '#FF6B6B',  // Energetic coral/pink
        'glass-accent-dark': '#A74EE6',   // Bright purple for elements
        'text-light': '#F8FAFC',          // Light text on dark background
        'text-dark': '#1F2937',           // Dark text on light glass elements (not extensively used here, but good to have)
      },
      boxShadow: {
        // Custom shadows for glass elements to add depth
        'glass-card': '0 8px 32px 0 rgba( 0, 0, 0, 0.17 )', // Soft, subtle shadow for cards
        'glass-lg': '0 10px 40px 0 rgba( 0, 0, 0, 0.25 )', // Larger shadow for more prominent elements
      },
      backgroundImage: {
        // Custom gradient for buttons/hero elements (defined here for reusability)
        'gradient-button': 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
