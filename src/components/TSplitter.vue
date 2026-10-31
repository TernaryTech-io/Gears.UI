<script setup lang="ts">
// Two panes with a handle between them to resize, by dragging or with the arrow keys: the `start`
// and `end` slots. `vertical` stacks them; otherwise they sit side by side. v-model:size is the
// start pane's share in percent, remembered per browser under `storageKey`. Panes are flex
// columns, so a card in one can fill it.
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  defaultSize?: number
  // The smallest each pane may get, in percent.
  minStart?: number
  minEnd?: number
  storageKey?: string
}>(), { orientation: 'horizontal', defaultSize: 50, minStart: 10, minEnd: 10 })

const size = defineModel<number>('size')
const root = ref<HTMLElement>()
const dragging = ref(false)

const clamp = (value: number) => Math.min(100 - props.minEnd, Math.max(props.minStart, value))

onMounted(() => {
  let saved: number | null = null
  try { saved = props.storageKey ? Number(localStorage.getItem(`gears-split:${props.storageKey}`)) || null : null } catch { /* storage blocked */ }
  size.value = clamp(size.value ?? saved ?? props.defaultSize)
})

function save() {
  if (!props.storageKey || size.value == null) return
  try { localStorage.setItem(`gears-split:${props.storageKey}`, String(Math.round(size.value))) } catch { /* storage blocked */ }
}

// A drag saves once, when it ends.
watch(size, () => { if (!dragging.value) save() })

function moveTo(event: PointerEvent) {
  const box = root.value!.getBoundingClientRect()
  size.value = clamp(props.orientation === 'vertical'
    ? (event.clientY - box.top) / box.height * 100
    : (event.clientX - box.left) / box.width * 100)
}

function start(event: PointerEvent) {
  dragging.value = true
  const handle = event.currentTarget as HTMLElement
  handle.setPointerCapture(event.pointerId)
  const move = (e: PointerEvent) => moveTo(e)
  const end = () => {
    dragging.value = false
    save()
    handle.removeEventListener('pointermove', move)
    handle.removeEventListener('pointerup', end)
    handle.removeEventListener('pointercancel', end)
  }
  handle.addEventListener('pointermove', move)
  handle.addEventListener('pointerup', end)
  handle.addEventListener('pointercancel', end)
}

function key(event: KeyboardEvent) {
  const back = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const forward = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  if (event.key !== back && event.key !== forward) return
  event.preventDefault()
  size.value = clamp((size.value ?? props.defaultSize) + (event.key === forward ? 5 : -5))
}
</script>

<template>
  <div ref="root" :class="['t-splitter', `t-splitter-${orientation}`, { 't-splitter-dragging': dragging }]">
    <div class="t-splitter-pane" :style="{ flexBasis: `${size ?? defaultSize}%` }">
      <slot name="start" />
    </div>
    <div class="t-splitter-handle" role="separator" tabindex="0" aria-label="Resize"
      :aria-orientation="orientation === 'vertical' ? 'horizontal' : 'vertical'"
      :aria-valuenow="Math.round(size ?? defaultSize)" :aria-valuemin="minStart" :aria-valuemax="100 - minEnd"
      @pointerdown.prevent="start" @keydown="key">
      <span class="t-splitter-grip" />
    </div>
    <div class="t-splitter-pane t-splitter-pane-end">
      <slot name="end" />
    </div>
  </div>
</template>
