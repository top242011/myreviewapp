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
        // Vibrant and energetic colors for Liquid Glass theme
        'primary-light': '#8B5CF6', // Purple-500 equivalent - for gradients/highlights
        'primary-dark': '#4F46E5',  // Indigo-600 equivalent - for gradients/main background
        'accent-1': '#F472B6',      // Pink-400 equivalent - for buttons/interactive elements
        'accent-2': '#FB923C',      // Orange-400 equivalent - secondary accent for highlights
        'text-base': '#F8FAFC',     // Slate-50 equivalent - for main text on dark backgrounds
        'text-muted': '#D1D5DB',    // Gray-300 equivalent - for secondary text/placeholders
        'glass-bg': 'rgba(255, 255, 255, 0.15)', // Base transparency for glass elements
        'glass-border': 'rgba(255, 255, 255, 0.3)', // Border for glass elements
        'glass-input-bg': 'rgba(255, 255, 255, 0.25)', // Slightly less transparent for inputs
      },
      boxShadow: {
        // Custom shadows for glass elements to add depth
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.17)', // Soft, subtle shadow for cards
        'glass-lg': '0 10px 40px 0 rgba(0, 0, 0, 0.25)', // Larger shadow for prominent elements
      },
      backgroundImage: {
        // Custom gradients for background and buttons
        'gradient-main': 'radial-gradient(circle at 10% 20%, var(--tw-colors-primary-light) 0%, var(--tw-colors-primary-dark) 100%)',
        'gradient-button-primary': 'linear-gradient(to right, var(--tw-colors-primary-light), var(--tw-colors-primary-dark))',
        'gradient-button-accent': 'linear-gradient(to right, var(--tw-colors-accent-1), var(--tw-colors-accent-2))',
      },
      fontFamily: {
        // You can add custom fonts here if you download them, e.g., 'Inter', 'Prompt'
        // 'sans': ['Inter', 'sans-serif'], // Example: If you install Inter font
        // For now, relying on 'Geist' set in layout.tsx and general sans-serif fallback
      }
    },
  },
  plugins: [],
}
