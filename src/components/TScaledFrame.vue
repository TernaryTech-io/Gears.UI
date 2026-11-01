<script setup lang="ts">
// Shows its content at a screen's width (`width`, in pixels), scaled down to fit: a preview of a
// whole page, such as an application's layout, in a smaller space. It fills its parent's height;
// the content scrolls inside it, and fixed or sticky parts stay inside the frame.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ width?: number }>(), { width: 1440 })

const frame = ref<HTMLElement>()
const size = ref({ width: 0, height: 0 })
let observer: ResizeObserver | undefined

onMounted(() => {
  observer = new ResizeObserver(([entry]) => { size.value = { width: entry.contentRect.width, height: entry.contentRect.height } })
  observer.observe(frame.value!)
})
onBeforeUnmount(() => observer?.disconnect())

// Never larger than life.
const scale = computed(() => size.value.width ? Math.min(1, size.value.width / props.width) : 1)
const screen = computed(() => ({
  width: `${props.width}px`,
  height: `${size.value.height / scale.value}px`,
  transform: `scale(${scale.value})`
}))
</script>

<template>
  <div ref="frame" class="t-scaled-frame">
    <div class="t-scaled-screen" :style="screen">
      <div class="t-scaled-scroll">
        <slot :scale="scale" />
      </div>
    </div>
  </div>
</template>
