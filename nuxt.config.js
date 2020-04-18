const path = require('path');

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/app.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/composition-api', '~/plugins/inject-combined',
  { src: '~/plugins/cdk-editor', mode: 'client' }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxt/typescript-build'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources',
    'nuxt-purgecss'
  ],
  styleResources: {
    scss: [
      './node_modules/@material/data-table/mdc-data-table'
      ]
  },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    postcss: {
      autoprefixer: {},
      plugins: {
        tailwindcss: path.resolve(__dirname, './tailwind.config.js')
      }
    },
    extend (config, { isClient }) {
      // Extend only webpack config for client-bundle
      const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
      if (isClient) {
        // const webpack = require('webpack');
        config.plugins.push(
            new MonacoWebpackPlugin({
              features: ['accessibilityHelp', 'bracketMatching', 'clipboard', 'codeAction', 'colorDetector', 'comment', 'cursorUndo', 'dnd', 'fontZoom', 'format', 'gotoError', 'gotoLine', 'hover', 'iPadShowKeyboard', 'links', 'parameterHints', 'rename', 'smartSelect', 'suggest', 'wordHighlighter', 'wordOperations', 'wordPartOperations'],
              languages: ['bat', 'kotlin', 'cpp', 'csharp', 'css', 'dockerfile', 'fsharp', 'go', 'html', 'java', 'javascript', 'json', 'less', 'nim',
              'markdown', 'objective', 'elixir', 'php', 'powershell', 'python', 'r', 'graphql', 'ruby', 'rust', 'scheme', 'scss', 'shell', 'solidity', 'swift', 'typescript', 'xml', 'yaml']
            })
        )
      }
    }

  },
  purgeCSS: {
    mode: 'postcss'
  }
}
