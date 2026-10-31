<script setup lang="ts">
// An on/off switch, for settings that apply right away.
import { useField } from '../composables/useField'

const props = defineProps<{ label?: string; description?: string; disabled?: boolean; id?: string }>()

const model = defineModel<boolean>({ default: false })
const field = useField(props)
</script>

<template>
  <label class="form-check form-switch" :for="field.id.value">
    <input :id="field.id.value" v-model="model" type="checkbox" role="switch" class="form-check-input" :disabled="disabled"
      :aria-describedby="field.describedBy.value">
    <span class="form-check-label"><slot>{{ label }}</slot></span>
    <span v-if="description" class="form-check-description">{{ description }}</span>
  </label>
</template>
