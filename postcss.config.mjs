// postcss.config.mjs
// This file uses ES Module syntax (import/export)

const config = {
  plugins: {
    // These plugins are essential for Tailwind CSS to work correctly
    // 'tailwindcss' is the plugin that processes @tailwind directives and Tailwind classes
    tailwindcss: {},
    // 'autoprefixer' adds vendor prefixes (e.g., -webkit-, -moz-) for browser compatibility
    autoprefixer: {},
  },
};

export default config; // Use ES Module export syntax
