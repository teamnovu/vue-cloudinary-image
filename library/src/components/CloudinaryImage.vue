<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { encodePath, joinURL } from 'ufo'
import type { CloudinaryConfig } from '..'

export interface CloudinaryImageProps {
  src: string
  quality?: number | string
  blur?: number
  crop?: string
  format?: string
  aspectRatio?: number
  placeholderQuality?: number
  placeholderWidth?: number
  usePlaceholder?: boolean
  placeholderDataUrl?: string
  focal?: Array<number> | string
  fallbackWidth?: number
  width?: string | number
  height?: string | number
  zoom?: string | number
  transforms?: string | Record<string, unknown>
  sizes?: string
  loading?: 'eager' | 'lazy' | undefined
}

const props = withDefaults(defineProps<CloudinaryImageProps>(), {
  quality: 'auto',
  blur: undefined,
  crop: 'lfill',
  format: 'auto',
  aspectRatio: undefined,
  placeholderQuality: 30,
  placeholderWidth: 300,
  usePlaceholder: true,
  placeholderDataUrl: undefined,
  focal: 'auto',
  fallbackWidth: 2000,
  zoom: undefined,
  transforms: undefined,
  sizes: undefined,
  loading: 'lazy',
})

const cloudinaryImage = inject<CloudinaryConfig>('cloudinaryImage')

if (!cloudinaryImage) {
  throw new Error('CloudinaryImage was not properly configured.')
}

const imageRef = ref<HTMLImageElement | null>(null)
const internalSizes = ref('1px')

const fileTypeSupported = computed(() => {
  const regex = /(?:\.([^.]+))?$/
  const fileExtension = regex.exec(props.src)?.[1]

  return (
    fileExtension
    && ['jpg', 'png', 'gif', 'webp', 'jpeg', 'avif'].includes(fileExtension.toLowerCase())
  )
})

const screens = computed(() => {
  return Object.entries(cloudinaryImage.screenSizes)
    .map(([key, value]) => ({
      breakpoint: key,
      media: `min-width: ${value}`,
      size: value,
    }))
    .sort((a, b) => +b.size.replace('px', '') - +a.size.replace('px', ''))
})

const breakpointSizes = computed(() => {
  return screens.value.map(screen => Number.parseInt(screen.size.replace('px', ''), 10))
})

const largestBreakpointSize = computed(() => {
  return breakpointSizes.value[0]
})

const placeholderUrl = computed(() => {
  if (props.placeholderDataUrl && !props.aspectRatio) {
    return props.placeholderDataUrl
  }

  return generateSrc({
    quality: props.placeholderQuality,
    width: props.placeholderWidth,
    format: props.format,
    aspectRatio: props.aspectRatio,
    crop: props.crop,
    focal: props.focal,
    placeholder: true,
    zoom: props.zoom,
    transforms: props.transforms,
  })
})

const imgSrcSet = computed(() => {
  const srcSet = breakpointSizes.value.map(
    breakpointSize =>
      `${generateSrc({
        quality: props.quality,
        width: breakpointSize,
        format: props.format,
        aspectRatio: props.aspectRatio,
        crop: props.crop,
        focal: props.focal,
        zoom: props.zoom,
      })} ${breakpointSize}w`,
  )

  if (props.usePlaceholder) {
    srcSet.push(`${placeholderUrl.value} 32w`)
  }

  return srcSet.join(',')
})

const originalUrl = computed(() =>
  generateSrc({
    quality: props.quality,
    blur: props.blur,
    width: props.fallbackWidth,
    format: props.format,
    aspectRatio: props.aspectRatio,
    crop: props.crop,
    focal: props.focal,
    zoom: props.zoom,
    transforms: props.transforms,
  }),
)

const imgWidth = computed(() => {
  if ((props.width && props.height) || (props.width && props.aspectRatio)) {
    return Number(props.width)
  }

  if (props.aspectRatio && props.height && Number(props.height) > 0) {
    return Number(props.height) * props.aspectRatio
  }

  return Number(largestBreakpointSize.value)
})

const imgHeight = computed(() => {
  if ((props.width && props.height) || (props.height && props.aspectRatio)) {
    return Number(props.height)
  }

  if (props.aspectRatio && props.width && Number(props.width) > 0) {
    return Number(props.width) / props.aspectRatio
  }

  if (props.aspectRatio) {
    return largestBreakpointSize.value / props.aspectRatio
  }

  return undefined
})

const imgAspectRatio = computed(() => {
  if (props.aspectRatio) {
    return props.aspectRatio
  }

  if (imgWidth.value && imgHeight.value) {
    return imgWidth.value / imgHeight.value
  }

  return undefined
})

const imgSizes = computed(() => {
  return props.sizes || internalSizes.value
})

onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true })

  if (!fileTypeSupported.value) {
    return
  }

  imageRef.value?.addEventListener('load', onLoad, { passive: true })

  if (imageRef.value?.complete) {
    onLoad()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

async function updateSizes() {
  if (!imageRef.value) {
    return
  }

  const objectFit = await getObjectFit(imageRef.value)
  const containerWidth = imageRef.value.getBoundingClientRect().width

  if (objectFit === 'cover') {
    const containerHeight = imageRef.value.getBoundingClientRect().height
    const containerAspectRatio = containerWidth / containerHeight

    if (imgAspectRatio.value && imgAspectRatio.value > containerAspectRatio) {
      const size = Math.ceil(
        (Math.round(containerHeight) / Math.round(window.innerHeight)) * 100,
      )
      internalSizes.value = `${size}vh`
    }
    else {
      const size = Math.ceil(
        (Math.round(containerWidth) / Math.round(window.innerWidth)) * 100,
      )
      internalSizes.value = `${size}vw`
    }
  }
  else {
    const size = Math.ceil(
      (Math.round(containerWidth) / Math.round(window.innerWidth)) * 100,
    )
    internalSizes.value = `${size}vw`
  }
}

function getObjectFit(element: HTMLImageElement, counter = 0): Promise<string> {
  return new Promise((resolve) => {
    if (counter === 100) {
      console.error('display of app-image never became non-empty. Tell Tom or Manu or Kyle or Nattha to fix this.')
      return resolve('')
    }

    requestAnimationFrame(() => {
      const display = getComputedStyle(element).getPropertyValue('display')

      if (display) {
        resolve(getComputedStyle(element).getPropertyValue('object-fit'))
      }
      else {
        getObjectFit(element, ++counter).then(resolve)
      }
    })
  })
}

function onResize() {
  updateSizes()
}

async function onLoad() {
  await updateSizes()
}

function generateSrc({
  quality,
  width,
  aspectRatio,
  blur,
  crop,
  format,
  focal,
  placeholder = false,
  zoom,
  transforms: additionalTransforms,
}: any) {
  if (!cloudinaryImage) {
    throw new Error('CloudinaryImage was not properly configured.')
  }

  if (!fileTypeSupported.value) {
    return joinURL(cloudinaryImage.cloudinaryBaseUrl, encodePath(props.src))
  }

  const transformations: string[] = []

  if (!placeholder) {
    if (width) {
      transformations.push(`w_${width}`)
    }
    if (quality) {
      transformations.push(`q_${quality}`)
    }
    if (blur) {
      transformations.push(`e_blur:${blur}`)
    }
    if (format) {
      transformations.push(`f_${format}`)
    }
    if (zoom) {
      transformations.push(`z_${zoom}`)
    }
    if (width && aspectRatio) {
      transformations.push(`h_${Math.round(width / aspectRatio)}`)
    }
    else if (!width && aspectRatio) {
      transformations.push(`ar_${aspectRatio}`)
    }
  }
  else {
    if (cloudinaryImage.placeholderTransformation) {
      transformations.push(`t_${cloudinaryImage.placeholderTransformation}`)
    }
    else {
      transformations.push('e_blur:2000,f_auto,q_auto:eco,w_300,z_1.1')
    }
    if (aspectRatio) {
      transformations.push(`ar_${aspectRatio}`)
    }
  }
  if (crop) {
    transformations.push(`c_${crop}`)
  }

  if (focal && props.crop && ['crop', 'fill', 'lfill', 'lpad', 'mpad', 'pad', 'thumb'].includes(props.crop)) {
    if (Array.isArray(focal)) {
      transformations.push(`x_${focal[0]},y_${focal[1]},g_xy_center`)
    }
    else {
      transformations.push(`g_${focal}`)
    }
  }

  if (additionalTransforms) {
    if (typeof additionalTransforms === 'object') {
      Object.entries(additionalTransforms).forEach(([key, value]) => {
        transformations.push(`${key}_${value}`)
      })
    }
    else {
      transformations.push(additionalTransforms as string)
    }
  }

  const remoteFolderMapping = cloudinaryImage.cloudinaryBaseUrl.match(/\/image\/upload\/(.*)/)

  if (remoteFolderMapping?.length && remoteFolderMapping?.length >= 1) {
    const remoteFolder = remoteFolderMapping[1]
    const baseURLWithoutRemoteFolder = cloudinaryImage.cloudinaryBaseUrl.replace(new RegExp(`${remoteFolder}$`), '')

    return joinURL(baseURLWithoutRemoteFolder, transformations.join(','), remoteFolder, encodePath(props.src))
  }

  return joinURL(cloudinaryImage.cloudinaryBaseUrl, transformations.join(','), encodePath(props.src))
}
</script>

<template>
  <img
    ref="imageRef" :src="originalUrl" :width="imgWidth" :height="imgHeight" v-bind="fileTypeSupported && {
      srcset: imgSrcSet,
      sizes: imgSizes,
    }"
    :loading="loading"
  >
</template>
