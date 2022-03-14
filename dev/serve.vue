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
</template>
