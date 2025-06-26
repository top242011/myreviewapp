// postcss.config.mjs
// This file uses ES Module syntax (import/export)
// Following the error message: "you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration."

const config = {
  plugins: {
    // Reverting to use @tailwindcss/postcss as suggested by the error message.
    // This plugin typically handles the integration of Tailwind CSS within PostCSS.
    "@tailwindcss/postcss": {},
    // autoprefixer is still necessary for adding vendor prefixes
    autoprefixer: {},
  },
};

export default config; // Use ES Module export syntax
