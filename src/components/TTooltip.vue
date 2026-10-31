<script setup lang="ts">
// A short hint on hover or focus, around whatever is in the slot. The text is read when the
// tooltip shows, so it can change; with no text it doesn't show.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Tooltip } from '@tabler/core'

const props = withDefaults(defineProps<{ text?: string; placement?: 'top' | 'bottom' | 'start' | 'end'; disabled?: boolean }>(),
  { placement: 'top' })

const el = ref<HTMLElement>()
let tooltip: Tooltip | null = null

const placements = { top: 'top', bottom: 'bottom', start: 'left', end: 'right' } as const

onMounted(() => {
  tooltip = new Tooltip(el.value!, {
    title: () => props.text ?? '',
    placement: placements[props.placement],
    trigger: 'hover focus',
    delay: { show: 150, hide: 0 }
  })
  el.value!.addEventListener('show.bs.tooltip', event => { if (!props.text || props.disabled) event.preventDefault() })
})

watch(() => props.disabled, disabled => { if (disabled) tooltip?.hide() })
onBeforeUnmount(() => tooltip?.dispose())
</script>

<template>
  <span ref="el" class="d-inline-flex">
    <slot />
  </span>
</template>
