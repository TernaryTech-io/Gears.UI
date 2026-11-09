<script setup lang="ts">
// Buttons joined in a row (or a column, `vertical`), with Tabler's btn-group: each has a label
// and/or an icon, a tooltip and Disabled; they share a color, style and size. `click` reports the
// button clicked and its index. To choose one of several, use a segmented TTabs instead.
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Tooltip } from '@tabler/core'
import TButton from './TButton.vue'
import type { ButtonGroupItem, Color, Size } from '../types'

const props = withDefaults(defineProps<{
  items: ButtonGroupItem[]
  color?: Color
  variant?: 'solid' | 'outline' | 'ghost' | 'soft'
  size?: Size
  vertical?: boolean
  /** Full width: the buttons share it. */
  block?: boolean
  /** The group's name, for screen readers. */
  label?: string
}>(), { color: 'neutral', variant: 'solid', size: 'md' })

const emit = defineEmits<{ click: [item: ButtonGroupItem, index: number, event: MouseEvent] }>()

const root = ref<HTMLElement>()
let tips: Tooltip[] = []

// Each button's tooltip is Tabler's, on the button itself, so the group's joined edges stay.
function tooltips() {
  tips.forEach(t => t.dispose())
  tips = []
  const buttons = [...(root.value?.children ?? [])] as HTMLElement[]
  props.items.forEach((item, i) => {
    const el = buttons[i]
    if (el && item.tooltip) tips.push(new Tooltip(el, { title: item.tooltip, placement: props.vertical ? 'right' : 'top', trigger: 'hover focus', delay: { show: 150, hide: 0 } }))
  })
}
onMounted(tooltips)
watch(() => props.items.map(i => i.tooltip).join('\n') + props.vertical, () => nextTick(tooltips))
onBeforeUnmount(() => tips.forEach(t => t.dispose()))
</script>

<template>
  <div ref="root" :class="[vertical ? 'btn-group-vertical' : 'btn-group', { 'w-100 d-flex': block }]" role="group" :aria-label="label">
    <TButton v-for="(item, i) in items" :key="item.value ?? i" :label="item.label" :icon="item.icon" :color="item.color ?? color" :variant="variant"
      :size="size" :disabled="item.disabled" :class="{ 'flex-fill': block }" :aria-label="!item.label ? item.tooltip : undefined"
      @click="(event: MouseEvent) => emit('click', item, i, event)" />
  </div>
</template>
