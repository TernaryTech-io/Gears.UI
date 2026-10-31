<script setup lang="ts">
// A checkbox with its label and an optional line under it.
import { ref, watchEffect } from 'vue'
import { useField } from '../composables/useField'

const props = defineProps<{
  label?: string
  description?: string
  disabled?: boolean
  indeterminate?: boolean
  invalid?: boolean
  id?: string
}>()

const model = defineModel<boolean>({ default: false })
const field = useField(props)
const el = ref<HTMLInputElement>()

watchEffect(() => { if (el.value) el.value.indeterminate = !!props.indeterminate })
</script>

<template>
  <label class="form-check" :for="field.id.value">
    <input :id="field.id.value" ref="el" v-model="model" type="checkbox" :disabled="disabled"
      :class="['form-check-input', { 'is-invalid': field.invalid.value }]" :aria-describedby="field.describedBy.value">
    <span class="form-check-label"><slot>{{ label }}</slot></span>
    <span v-if="description" class="form-check-description">{{ description }}</span>
  </label>
</template>
