<script setup lang="ts">
// A text input that follows a pattern, with Tabler's input mask (IMask): `0` is a digit, `a` a
// letter, `*` either, and other characters are written for you, as in "(000) 000-0000".
// `showMask` shows the pattern before typing. v-model is the text as shown, or with `unmasked`,
// only what was typed. IMask loads on first use.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { InputMask } from '@tabler/core'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'
import { loadInputMask } from '../plugins'

type Mask = { value: string; unmaskedValue: string; on(event: 'accept', handler: () => void): void }

const props = withDefaults(defineProps<{
  mask: string
  unmasked?: boolean
  showMask?: boolean
  placeholder?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { size: 'md' })

const model = defineModel<string | null | undefined>()
const field = useField(props)
const input = ref<HTMLInputElement>()
let instance: InputMask | null = null

const mask = () => (instance as unknown as { mask: Mask | null } | null)?.mask ?? null
const current = () => props.unmasked ? mask()?.unmaskedValue : mask()?.value

function write(value: string) {
  const m = mask()
  if (!m) return
  if (props.unmasked) m.unmaskedValue = value
  else m.value = value
}

async function create() {
  const InputMaskClass = await loadInputMask()
  if (!input.value) return
  instance?.dispose()
  instance = new InputMaskClass(input.value, { mask: props.mask, lazy: !props.showMask })
  write(model.value ?? '')
  mask()?.on('accept', () => {
    const value = current() ?? ''
    if (value !== (model.value ?? '')) model.value = value
  })
}

onMounted(() => {
  // Shown as is until IMask takes over.
  if (input.value) input.value.value = model.value ?? ''
  create()
})
watch(model, value => { if (mask() && (value ?? '') !== current()) write(value ?? '') })
watch(() => [props.mask, props.showMask, props.unmasked], create)
onBeforeUnmount(() => instance?.dispose())
</script>

<template>
  <div :class="{ 'input-icon': icon }">
    <span v-if="icon" class="input-icon-addon"><TIcon :name="icon" /></span>
    <input :id="field.id.value" ref="input" type="text" :placeholder="placeholder" :disabled="disabled" autocomplete="off"
      :aria-describedby="field.describedBy.value" :aria-invalid="field.invalid.value || undefined"
      :class="['form-control', size !== 'md' && `form-control-${size}`, { 'is-invalid': field.invalid.value }]">
  </div>
</template>
