module.exports = {
  loading: false,
  build: {
    babel: {
      presets: ['vue-app'],
      plugins: [
        "transform-class-properties",
        "transform-object-rest-spread",
        "transform-custom-element-classes",
        "transform-es2015-classes",
        "transform-async-to-generator"
      ]
    },
    extend(config, { isDev }) {
      config.output.globalObject = "this"

      config.node = {
        fs: 'empty'
      }

    }
  },
  plugins: [
    '~/plugins/webcomponents.js',
    { src: '~/plugins/customElements.js', ssr: false },
    { src: '~/plugins/webComponentPolyfill.js', ssr: false },
  ],
}