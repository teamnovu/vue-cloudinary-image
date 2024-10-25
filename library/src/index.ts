import CloudinaryImage from './components/CloudinaryImage.vue'

export type { CloudinaryImageProps } from './components/CloudinaryImage.vue'

export interface CloudinaryConfig {
  screenSizes: Record<string, string>
  cloudinaryBaseUrl: string
  placeholderTransformation: any | null
}

export default {
  install(app: any, options: any) {
    let { screenSizes, cloudinaryBaseUrl, placeholderTransformation = null } = options

    const isObj = (obj: any) => typeof obj === 'object' && obj !== null

    if (
      !screenSizes
      || !isObj(screenSizes)
      || Object.keys(screenSizes).length === 0
    ) {
      screenSizes = {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1600px',
        '3xl': '2000px',
      }
    }

    if (
      !cloudinaryBaseUrl
      || typeof cloudinaryBaseUrl !== 'string'
      || cloudinaryBaseUrl.length === 0
    ) {
      throw new Error('cloudinaryBaseUrl was not properly configured.')
    }

    const cloudinaryConfig: CloudinaryConfig = {
      screenSizes,
      cloudinaryBaseUrl,
      placeholderTransformation,
    }

    app.provide('cloudinaryImage', cloudinaryConfig)
    app.component('CloudinaryImage', CloudinaryImage)
  },
}
