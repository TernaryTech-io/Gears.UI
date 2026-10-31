<script setup lang="ts">
// A number field with minus and plus buttons, on Tabler's number input: the buttons (held down,
// they repeat), the arrow keys, Home and End all step within `min` and `max`, rounded to `step`.
// v-model is a number, or null when the field is empty.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { NumberInput } from '@tabler/core'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'

const props = withDefaults(defineProps<{
  min?: number
  max?: number
  step?: number
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { size: 'md' })

const model = defineModel<number | null | undefined>()
const field = useField(props)
const wrapper = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
let numberInput: NumberInput | null = null

const text = (value: number | null | undefined) => value == null ? '' : String(value)

function create() {
  numberInput?.dispose()
  numberInput = new NumberInput(wrapper.value!, { min: props.min ?? null, max: props.max ?? null, step: props.step ?? null })
}

// Typing, the buttons and the keys all end in the input's own input event.
function read() {
  const raw = input.value!.value.trim()
  const value = raw === '' || isNaN(Number(raw)) ? null : Number(raw)
  if (value !== (model.value ?? null)) model.value = value
}

onMounted(() => {
  input.value!.value = text(model.value)
  create()
})
watch(model, value => { if (input.value && input.value.value !== text(value) && Number(input.value.value) !== value) input.value.value = text(value) })
watch(() => [props.min, props.max, props.step], create)
onBeforeUnmount(() => numberInput?.dispose())
</script>

<template>
  <div ref="wrapper" :class="['number-input', size !== 'md' && `number-input-${size}`]">
    <button type="button" class="btn btn-icon" data-bs-number-input-action="decrement" aria-label="Decrease" :disabled="disabled">
      <TIcon name="minus" />
    </button>
    <input :id="field.id.value" ref="input" type="text" inputmode="decimal" :placeholder="placeholder" :disabled="disabled" autocomplete="off"
      :aria-describedby="field.describedBy.value" :aria-invalid="field.invalid.value || undefined"
      :class="['form-control', size !== 'md' && `form-control-${size}`, { 'is-invalid': field.invalid.value }]" @input="read">
    <button type="button" class="btn btn-icon" data-bs-number-input-action="increment" aria-label="Increase" :disabled="disabled">
      <TIcon name="plus" />
    </button>
  </div>
</template>
