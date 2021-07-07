<template>
  <img
    v-if="fileTypeSupported"
    ref="imageRef"
    :src="originalUrl"
    :srcset="imgSrcSet"
    :sizes="sizes"
    width="100%"
    @load="onLoaded"
  >
  <img
    v-else
    :src="originalUrl"
    width="100%"
  >
</template>

<script>
import urlJoin from 'url-join'

export default {
  props: {
    src: {
      required: true,
      type: String,
    },
    quality: {
      required: false,
      type: Number,
      default: 85,
    },
    blur: {
      required: false,
      type: Number,
    },
    crop: {
      required: false,
      type: String,
    },
    format: {
      required: false,
      type: String,
      default: 'auto',
    },
    aspectRatio: {
      required: false,
      type: Number,
    },
    placeholderQuality: {
      required: false,
      type: Number,
      default: 30,
    },
    placeholderWidth: {
      required: false,
      type: Number,
      default: 300,
    },
    usePlaceholder: {
      required: false,
      type: Boolean,
      default: true,
    },
    placeholderDataUrl: {
      required: false,
      type: String,
    },
    focal: {
      required: false,
      type: [Array, String],
      default: 'auto',
    },
  },
  data () {
    return {
      sizes: '1px',
      isLoading: true,
    }
  },
  computed: {
    fileTypeSupported () {
      const regex = /(?:\.([^.]+))?$/
      const fileExtension = regex.exec(this.src)[1]

      return (
        fileExtension &&
        ['jpg', 'png', 'gif', 'webp', 'jpeg', 'avif'].includes(fileExtension.toLowerCase())
      )
    },
    imgSrcSet () {
      const sizes = this.screens.map((screen) => screen.size.replace('px', ''))
      const srcSet = sizes.map(
        (size) =>
          this.generateSrc({
            width: size,
            quality: this.quality,
            format: this.format,
            crop: this.crop,
            aspectRatio: this.aspectRatio,
          }) + ` ${size}w`,
      )

      if (this.usePlaceholder) {
        srcSet.push(this.placeholderUrl + ' 32w')
      }
      return srcSet.join(',')
    },
    originalUrl () {
      return this.generateSrc({
        quality: this.quality,
        blur: this.blur,
        width: this.fallbackWidth,
        format: this.format,
        aspectRatio: this.aspectRatio,
        crop: this.crop,
        focal: this.focal,
      })
    },
    placeholderUrl () {
      if (this.placeholderDataUrl && !this.aspectRatio) {
        return this.placeholderDataUrl
      }

      return this.generateSrc({
        quality: this.placeholderQuality,
        width: this.placeholderWidth,
        format: this.format,
        aspectRatio: this.aspectRatio,
        crop: this.crop,
        focal: this.focal,
        placeholder: true,
      })
    },
  },
  created () {
    const screens = Object.entries(this.$cloudinaryImage.screenSizes)
      .map(([key, value]) => ({
        breakpoint: key,
        media: `min-width: ${value}`,
        size: value,
      }))
      .sort((a, b) => +b.size.replace('px', '') - +a.size.replace('px', ''))

    this.screens = screens
  },
  mounted () {
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    updateSizes () {
      return new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          if (this.$refs.imageRef) {
            const imageWidth = this.$refs.imageRef.getBoundingClientRect()
              .width
            const size = Math.ceil((imageWidth / window.innerWidth) * 100)
            this.sizes = `${size}vw`
          }
          resolve()
        })
      })
    },
    onResize () {
      this.updateSizes()
    },
    async onLoaded () {
      await this.updateSizes()
      this.isLoading = false
    },
    generateSrc ({
      quality,
      width,
      aspectRatio,
      blur,
      crop,
      format,
      focal,
      placeholder = false,
    }) {
      if (!this.fileTypeSupported) {
        return urlJoin(this.$cloudinaryImage.cloudinaryBaseUrl, this.src)
      }

      const transformations = []

      if (!placeholder) {
        if (width) transformations.push(`w_${width}`)
        if (width && aspectRatio) transformations.push(`h_${Math.round(width / aspectRatio)}`)
        if (quality) transformations.push(`q_${quality}`)
        if (blur) transformations.push(`e_blur:${blur}`)
        if (format) transformations.push(`f_${format}`)
      } else {
        if (this.$cloudinaryImage.placeholderTransformation) {
          transformations.push(`t_${this.$cloudinaryImage.placeholderTransformation}`)
        } else {
          transformations.push('e_blur:2000,f_auto,q_auto:eco,w_300,z_1.1')
        }
      }
      if (crop) transformations.push(`c_${crop}`)
      if (focal && ['crop', 'fill', 'lfill', 'lpad', 'mpad', 'pad'].includes(this.crop)) {
        if (Array.isArray(focal)) {
          transformations.push(`x_${focal[0]},y_${focal[1]}`)
        } else {
          transformations.push(`g_${focal}`)
        }
      }

      const remoteFolderMapping = this.$cloudinaryImage.cloudinaryBaseUrl.match(/\/image\/upload\/(.*)/)

      // Handle delivery remote media file URLs
      // Note: Non-remote images will pass into this function if the baseURL is not using a sub directory
      if (remoteFolderMapping?.length >= 1) {
        // need to do some weird logic to get the remote folder after image/upload after the operations and before the src
        const remoteFolder = remoteFolderMapping[1]
        const baseURLWithoutRemoteFolder = this.$cloudinaryImage.cloudinaryBaseUrl.replace(remoteFolder, '')

        return urlJoin(baseURLWithoutRemoteFolder, transformations.join(','), remoteFolder, this.src)
      }

      return urlJoin(this.$cloudinaryImage.cloudinaryBaseUrl, transformations.join(','), this.src)
    },
  },
}
</script>

<style>
</style>
