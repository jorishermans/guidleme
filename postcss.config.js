const path = require('path');

module.exports = {
  autoprefixer: {},
  plugins: {
    tailwindcss: path.resolve(__dirname, './tailwind.config.js')
  }
}
