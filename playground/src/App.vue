<script setup lang="ts">
// import { type CloudinaryImageProps } from 'vue-cloudinary-image'
// import { ref } from 'vue'
</script>

<template>
  <main class="container">
    <div>
      <CloudinaryImage
        src="/cloudinary-image-example.jpg" crop="fill" :width="200" :aspect-ratio="1" :transforms="{
          a: '90',
        }"
      />
    </div>

    <div>
      <CloudinaryImage
        :style="{
          width: '400px',
          height: '200px',
        }" src="/cloudinary-image-example.jpg" crop="fill" :aspect-ratio="2" :transforms="{
          a: '90',
        }"
      />
    </div>
  </main>
</template>

<style scoped>

</style>
