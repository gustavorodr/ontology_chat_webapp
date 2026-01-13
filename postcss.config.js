/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // TailwindCSS v4 PostCSS plugin
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

module.exports = config;
