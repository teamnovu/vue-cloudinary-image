// Import vue component
import component from '@/cloudinary-image.vue'
import defaultScreenSizes from './default-screen-sizes'

// install function executed by Vue.use()
const install = function installCloudinaryImage (Vue, options) {
  if (install.installed) return
  install.installed = true

  let { screenSizes, cloudinaryBaseUrl, placeholderTransformation = null } = options

  const isObj = (obj) => typeof obj === 'object' && obj !== null

  if (
    !screenSizes ||
    !isObj(screenSizes) ||
    Object.keys(screenSizes).length === 0
  ) {
    screenSizes = defaultScreenSizes
  }

  if (
    !cloudinaryBaseUrl ||
    typeof cloudinaryBaseUrl !== 'string' ||
    !(cloudinaryBaseUrl instanceof String) ||
    cloudinaryBaseUrl.length === 0
  ) {
    throw new Error('cloudinaryBaseUrl was not properly configured.')
  }

  Vue.prototype.$cloudinaryImage = {
    screenSizes,
    cloudinaryBaseUrl,
    placeholderTransformation,
  }

  Vue.component('CloudinaryImage', component)
}

// Create module definition for Vue.use()
const plugin = {
  install,
}

// To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare
/* global window, global */
if (process.env.ES_BUILD === 'false') {
  let GlobalVue = null
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue
  }
  if (GlobalVue) {
    GlobalVue.use(plugin)
  }
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
component.install = install

// Export component by default
export default component

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
