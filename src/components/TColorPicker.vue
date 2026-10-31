<script setup lang="ts">
// A color field with Tabler's color picker (Coloris): a swatch of the color, the value as text, and
// a picker on focus. `format` is how the value is written (hex by default); `alpha` allows
// transparency; `swatches` offers preset colors, and `swatchesOnly` limits the choice to them.
// Coloris loads on first use.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useColorMode } from '../composables/useColorMode'
import { useField } from '../composables/useField'
import { loadColoris } from '../plugins'

const props = withDefaults(defineProps<{
  format?: 'hex' | 'rgb' | 'hsl' | 'auto' | 'mixed'
  alpha?: boolean
  swatches?: string[]
  swatchesOnly?: boolean
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { format: 'hex', size: 'md' })

const model = defineModel<string | null | undefined>()
const field = useField(props)
const { isDark } = useColorMode()
const input = ref<HTMLInputElement>()
let coloris: Awaited<ReturnType<typeof loadColoris>> | null = null

const selector = computed(() => `#${CSS.escape(field.id.value)}`)

function configure() {
  coloris?.setInstance(selector.value, {
    format: props.format,
    alpha: props.alpha,
    swatches: props.swatches ?? [],
    swatchesOnly: props.swatchesOnly,
    themeMode: isDark.value ? 'dark' : 'light'
  })
}

onMounted(async () => {
  coloris = await loadColoris()
  // Coloris listens for fields by selector; ours are marked with a class and left unwrapped
  // (wrapping would move the input out of Vue's hands), so the swatch here is our own.
  coloris({ el: '.t-color-input', wrap: false, selectInput: false, theme: 'default' })
  configure()
})
watch(() => [props.format, props.alpha, props.swatches, props.swatchesOnly, isDark.value], configure, { deep: true })
onBeforeUnmount(() => coloris?.removeInstance(selector.value))
</script>

<template>
  <div :class="['input-group t-color-picker', size !== 'md' && `input-group-${size}`]">
    <span class="input-group-text p-1">
      <span class="t-color-swatch" :style="{ background: model || 'transparent' }" />
    </span>
    <input :id="field.id.value" ref="input" type="text" :value="model ?? ''" :placeholder="placeholder ?? (format === 'hex' ? '#3673d1' : '')"
      :disabled="disabled" autocomplete="off" spellcheck="false" :aria-describedby="field.describedBy.value"
      :class="['form-control t-color-input font-monospace', { 'is-invalid': field.invalid.value }]"
      @input="model = ($event.target as HTMLInputElement).value">
  </div>
</template>
