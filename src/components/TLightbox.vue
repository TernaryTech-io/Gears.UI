<script setup lang="ts">
// Images shown large over the page, one at a time: v-model is the one shown (its index; null when
// closed). Previous and next (buttons, the arrow keys, or a swipe), a counter, its caption, and
// close (the button, Escape, or a click beside the image). Focus moves to it while it's open and
// back to where it was after.
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import TIcon from './TIcon.vue'

export interface LightboxImage { src: string; alt?: string; caption?: string }

const props = withDefaults(defineProps<{ images: LightboxImage[]; loop?: boolean }>(), { loop: true })
const index = defineModel<number | null>({ default: null })

const open = computed(() => index.value != null && index.value >= 0 && index.value < props.images.length)
const image = computed(() => (open.value ? props.images[index.value!] : null))
const many = computed(() => props.images.length > 1)

function step(by: 1 | -1) {
  if (index.value == null || !many.value) return
  const next = index.value + by
  index.value = props.loop ? (next + props.images.length) % props.images.length : Math.min(Math.max(next, 0), props.images.length - 1)
}
const close = () => { index.value = null }

function key(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowRight') step(1)
  else if (event.key === 'ArrowLeft') step(-1)
  else return
  event.preventDefault()
}

// A swipe across moves to the next or previous.
let startX: number | null = null
function touchStart(event: TouchEvent) { startX = event.touches[0]?.clientX ?? null }
function touchEnd(event: TouchEvent) {
  const endX = event.changedTouches[0]?.clientX
  if (startX != null && endX != null && Math.abs(endX - startX) > 50) step(endX < startX ? 1 : -1)
  startX = null
}

const dialog = ref<HTMLElement>()
let before: Element | null = null
watch(open, async now => {
  if (now) {
    before = document.activeElement
    document.addEventListener('keydown', key)
    await nextTick()
    dialog.value?.focus()
  } else {
    document.removeEventListener('keydown', key)
    if (before instanceof HTMLElement) before.focus()
  }
}, { immediate: true })
onBeforeUnmount(() => document.removeEventListener('keydown', key))
</script>

<template>
  <Teleport to="body">
    <div v-if="open && image" ref="dialog" class="t-lightbox" role="dialog" aria-modal="true" :aria-label="image.alt || image.caption || 'Image'" tabindex="-1"
      @click.self="close" @touchstart.passive="touchStart" @touchend="touchEnd">
      <button type="button" class="t-lightbox-close" aria-label="Close" @click="close"><TIcon name="x" /></button>
      <button v-if="many" type="button" class="t-lightbox-step start" aria-label="Previous image" @click="step(-1)"><TIcon name="chevron-left" /></button>
      <figure class="t-lightbox-figure" @click.self="close">
        <img :key="image.src" :src="image.src" :alt="image.alt ?? ''">
        <figcaption v-if="image.caption || many">
          <span v-if="many" class="t-lightbox-count">{{ index! + 1 }} / {{ images.length }}</span>
          <span v-if="image.caption">{{ image.caption }}</span>
        </figcaption>
      </figure>
      <button v-if="many" type="button" class="t-lightbox-step end" aria-label="Next image" @click="step(1)"><TIcon name="chevron-right" /></button>
    </div>
  </Teleport>
</template>

<style scoped>
.t-lightbox {
  position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center;
  background: rgba(10, 12, 16, 0.88); outline: none; animation: t-lightbox-in 0.15s ease-out;
}
@keyframes t-lightbox-in { from { opacity: 0; } }
.t-lightbox-figure { margin: 0; max-width: calc(100vw - 8rem); max-height: calc(100vh - 6rem); display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.t-lightbox-figure img { max-width: 100%; max-height: calc(100vh - 9rem); object-fit: contain; border-radius: var(--tblr-border-radius); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); }
.t-lightbox-figure figcaption { display: flex; gap: 0.75rem; align-items: baseline; color: #e6e7e9; font-size: 0.875rem; text-align: center; }
.t-lightbox-count { color: #9aa0ac; font-variant-numeric: tabular-nums; }
.t-lightbox-close, .t-lightbox-step {
  position: absolute; display: inline-flex; align-items: center; justify-content: center; width: 2.75rem; height: 2.75rem; border: 0; border-radius: 50%;
  background: rgba(255, 255, 255, 0.1); color: #fff; font-size: 1.25rem; cursor: pointer;
}
.t-lightbox-close:hover, .t-lightbox-step:hover { background: rgba(255, 255, 255, 0.2); }
.t-lightbox-close:focus-visible, .t-lightbox-step:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.t-lightbox-close { top: 1rem; right: 1rem; }
.t-lightbox-step { top: 50%; transform: translateY(-50%); }
.t-lightbox-step.start { left: 1rem; }
.t-lightbox-step.end { right: 1rem; }
@media (max-width: 576px) {
  .t-lightbox-figure { max-width: 100vw; }
  .t-lightbox-step { top: auto; bottom: 1rem; transform: none; }
}
</style>
