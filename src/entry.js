// Import vue component
import component from './cloudinary-image.vue'
import defaultScreenSizes from './default-screen-sizes'

export default {
  install: (app, options) => {
    let { screenSizes, cloudinaryBaseUrl, placeholderTransformation = null } = options

    const isObj = (obj) => typeof obj === 'object' && obj !== null

    console.log('i am published')
    console.log('defaultScreenSizes:', defaultScreenSizes)

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
          cloudinaryBaseUrl.length === 0
    ) {
      throw new Error('cloudinaryBaseUrl was not properly configured.')
    }

    app.config.globalProperties.$cloudinaryImage = {
      screenSizes,
      cloudinaryBaseUrl,
      placeholderTransformation,
    }

    app.component('CloudinaryImage', component)
  },
}
