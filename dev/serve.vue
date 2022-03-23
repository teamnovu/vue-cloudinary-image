<script>
import Vue from 'vue'
import CloudinaryImage from '@/cloudinary-image.vue'

export default Vue.extend({
  name: 'ServeDev',
  components: {
    CloudinaryImage,
  },
})
</script>

<template>
  <div id="app">
    <div>
      <cloudinary-image
          src="/sample.jpg"
          crop="fill"
          :width="200"
          :aspect-ratio="1"
          :transforms="{
          a: '90',
        }"
      />
    </div>

    <div>
      <cloudinary-image
        :style="{
          width: '100px',
          height: '200px',
          objectFit: 'cover',
        }"
        src="/sample.jpg"
        crop="fill"
        :aspect-ratio="2"
        :transforms="{
          a: '90',
        }"
      />
    </div>
  </div>
</template>
