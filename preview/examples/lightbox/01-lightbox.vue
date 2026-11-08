<!-- Images shown large, one at a time: previous and next (buttons, arrow keys or a swipe), a counter, captions; Escape or a click beside it closes it. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { LightboxImage } from '@ternarytech-io/gears-ui'

// Pictures drawn here, so the page needs nothing from the network.
const picture = (from: string, to: string, text: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><text x="600" y="420" font-family="sans-serif" font-size="72" fill="white" text-anchor="middle">${text}</text></svg>`)}`
const images: LightboxImage[] = [
  { src: picture('#066fd1', '#7e4ed8', 'Harbor'), alt: 'Harbor', caption: 'The harbor at dawn' },
  { src: picture('#2fb344', '#0ca678', 'Forest'), alt: 'Forest', caption: 'A forest path' },
  { src: picture('#f76707', '#d63939', 'Desert'), alt: 'Desert', caption: 'Dunes at sunset' },
  { src: picture('#17a2b8', '#4263eb', 'Glacier'), alt: 'Glacier' }
]
const open = ref<number | null>(null)
</script>

<template>
  <div class="row g-2">
    <div v-for="(image, i) in images" :key="i" class="col-6 col-md-3">
      <button type="button" class="btn p-0 border-0 w-100" :aria-label="`Open ${image.alt}`" @click="open = i">
        <img :src="image.src" :alt="image.alt" class="w-100 rounded" style="aspect-ratio: 3 / 2; object-fit: cover">
      </button>
    </div>
  </div>
  <TLightbox v-model="open" :images="images" />
</template>
