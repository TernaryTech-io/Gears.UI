<script setup lang="ts" generic="T">
// One choice from a few, all shown. Items are values or { label, value, description } objects.
import { computed, useId } from 'vue'
import type { SelectItem } from '../types'

const props = defineProps<{
  items: (T | SelectItem<T>)[]
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  legend?: string
}>()

const model = defineModel<T | null | undefined>()
const name = useId()

const isItem = (item: unknown): item is SelectItem<T> =>
  typeof item === 'object' && item !== null && 'label' in item && 'value' in item

const options = computed<SelectItem<T>[]>(() =>
  props.items.map(item => isItem(item) ? item : { label: String(item), value: item as T }))
</script>

<template>
  <div role="radiogroup" :aria-label="legend">
    <div v-if="legend" class="form-label">{{ legend }}</div>
    <label v-for="(option, i) in options" :key="i" :class="['form-check', { 'form-check-inline': orientation === 'horizontal' }]">
      <input class="form-check-input" type="radio" :name="name" :checked="option.value === model" :disabled="disabled || option.disabled"
        @change="model = option.value">
      <span class="form-check-label">{{ option.label }}</span>
      <span v-if="option.description" class="form-check-description">{{ option.description }}</span>
    </label>
  </div>
</template>
