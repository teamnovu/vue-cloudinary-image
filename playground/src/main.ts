import { createApp } from 'vue'
import CloudinaryImage from 'vue-cloudinary-image'
import App from './App.vue'

import '@/assets/main.css'

// import 'vue-cloudinary-image/style.css'

const app = createApp(App)
app.use(CloudinaryImage, {
  screenSizes: {
    'xs': '320px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1600px',
    '3xl': '2000px',
  },
  cloudinaryBaseUrl: 'https://res.cloudinary.com/teamnovu/image/upload/',
})
app.mount('#app')
