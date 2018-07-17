import Vue from 'vue'

if(!process.browser) {
  global.HTMLElement = () => {}
  global.customElements = { define: () => {} }
}

// Render web components server-side
if(!process.browser) {
  require('@skatejs/ssr/register')
}

Vue.config.ignoredElements = [
  'my-element',
]
