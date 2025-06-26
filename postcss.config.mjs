// postcss.config.js
module.exports = {
  plugins: {
    // These plugins are essential for Tailwind CSS to work correctly
    tailwindcss: {}, // This plugin transforms @tailwind directives into actual CSS
    autoprefixer: {}, // This plugin adds vendor prefixes to CSS rules for browser compatibility
  },
};
