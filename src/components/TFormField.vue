<script setup lang="ts">
// A labelled form field around one control (TInput, TSelect, …). The label points at the control;
// `hint` sits at the label's right, `description` under the control, and an error replaces it.
import { computed, useId } from 'vue'
import { provideField } from '../composables/useField'

const props = defineProps<{
  label?: string
  hint?: string
  description?: string
  // A message, or `true` to mark the control invalid without one.
  error?: string | boolean
  required?: boolean
  id?: string
}>()

const generated = useId()
const id = computed(() => props.id ?? generated)
const message = computed(() => typeof props.error === 'string' && props.error ? props.error : null)

provideField({
  id: id.value,
  invalid: computed(() => !!props.error),
  describedBy: computed(() => message.value || props.description ? `${id.value}-help` : undefined)
})
</script>

<template>
  <div>
    <label v-if="label || $slots.label" :for="id" :class="['form-label', { required }]">
      <slot name="label">{{ label }}</slot>
      <span v-if="hint" class="form-label-description">{{ hint }}</span>
    </label>
    <slot />
    <div v-if="message" :id="`${id}-help`" class="invalid-feedback d-block">{{ message }}</div>
    <small v-else-if="description || $slots.description" :id="`${id}-help`" class="form-hint">
      <slot name="description">{{ description }}</slot>
    </small>
  </div>
</template>
