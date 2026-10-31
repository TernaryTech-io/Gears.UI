<script setup lang="ts">
// A multi-line text input. `autoresize` grows it with its text instead of scrolling.
import { nextTick, onMounted, ref, watch } from 'vue'
import { useField } from '../composables/useField'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  placeholder?: string
  rows?: number
  autoresize?: boolean
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  id?: string
}>(), { rows: 3 })

const model = defineModel<string | null | undefined>()
const field = useField(props)
const el = ref<HTMLTextAreaElement>()

function resize() {
  if (!props.autoresize || !el.value) return
  el.value.style.height = 'auto'
  el.value.style.height = `${el.value.scrollHeight + 2}px`
}

onMounted(resize)
watch(model, () => nextTick(resize))
</script>

<template>
  <textarea v-bind="$attrs" :id="field.id.value" ref="el" :value="model ?? ''" :rows="rows" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
    :aria-describedby="field.describedBy.value" :aria-invalid="field.invalid.value || undefined"
    :class="['form-control', { 'is-invalid': field.invalid.value }]" :style="autoresize ? { resize: 'none', overflow: 'hidden' } : undefined"
    @input="model = ($event.target as HTMLTextAreaElement).value" />
</template>
