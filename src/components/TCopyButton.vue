<script setup lang="ts">
// Copies text with Tabler's clipboard plugin: the `text` given, or the value (or text) of the
// element `target` selects. It says "Copied" for a moment after. Without a label it's a square
// icon button; its tooltip carries the label. Emits `copied`, or `error` when the browser refuses
// (the clipboard needs https or localhost).
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Clipboard } from '@tabler/core'
import TIcon from './TIcon.vue'
import TTooltip from './TTooltip.vue'
import { toTabler, type Color, type Size } from '../types'

const props = withDefaults(defineProps<{
  text?: string
  target?: string
  label?: string
  copiedLabel?: string
  // Show only the icon.
  iconOnly?: boolean
  color?: Color
  variant?: 'solid' | 'outline' | 'ghost' | 'soft'
  size?: Size
  delay?: number
}>(), { label: 'Copy', copiedLabel: 'Copied', color: 'neutral', variant: 'solid', size: 'md', delay: 2000 })

const emit = defineEmits<{ copied: []; error: [] }>()

const button = ref<HTMLButtonElement>()
const copied = ref(false)
let clipboard: Clipboard | null = null

const classes = computed(() => {
  const c = toTabler(props.color)
  const look = props.variant === 'solid' ? (props.color === 'neutral' ? '' : `btn-${c}`)
    : props.variant === 'soft' ? `btn-soft btn-soft-${c}` : `btn-${props.variant}-${c}`
  return ['btn', look, {
    'btn-xs': props.size === 'xs', 'btn-sm': props.size === 'sm', 'btn-lg': props.size === 'lg', 'btn-icon': props.iconOnly,
    'btn-success': copied.value && props.variant === 'solid' && props.color === 'neutral'
  }]
})

function create() {
  clipboard?.dispose()
  clipboard = new Clipboard(button.value!, { text: props.text ?? null, target: props.target ?? null, delay: props.delay })
}

onMounted(() => {
  create()
  button.value!.addEventListener('copied.bs.clipboard', () => {
    copied.value = true
    emit('copied')
    setTimeout(() => { copied.value = false }, props.delay)
  })
  button.value!.addEventListener('error.bs.clipboard', () => emit('error'))
})
watch(() => [props.text, props.target, props.delay], create)
onBeforeUnmount(() => clipboard?.dispose())
</script>

<template>
  <TTooltip :text="iconOnly ? (copied ? copiedLabel : label) : undefined">
    <button ref="button" type="button" :class="classes" :aria-label="iconOnly ? label : undefined" @click="clipboard?.copy()">
      <span class="clipboard-label t-copy-part">
        <TIcon name="copy" :class="{ 'me-2': !iconOnly }" />
        <template v-if="!iconOnly">{{ label }}</template>
      </span>
      <span class="clipboard-feedback t-copy-part" hidden>
        <TIcon name="check" :class="iconOnly ? 'text-success' : 'me-2'" />
        <template v-if="!iconOnly">{{ copiedLabel }}</template>
      </span>
    </button>
  </TTooltip>
</template>
