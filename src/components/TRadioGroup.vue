<script setup lang="ts" generic="T">
// One choice from a few, all shown. Items are values or { label, value, description } objects.
// `cards` shows each choice as a box (Tabler's select group), laid out in `columns` on wider
// screens: for choices that need their description, such as a project's database.
import { computed, useId } from 'vue'
import type { SelectItem } from '../types'

const props = withDefaults(defineProps<{
  items: (T | SelectItem<T>)[]
  orientation?: 'vertical' | 'horizontal'
  variant?: 'list' | 'cards'
  columns?: 1 | 2 | 3
  disabled?: boolean
  legend?: string
}>(), { variant: 'list', columns: 2 })

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
    <div v-if="variant === 'cards'" class="form-selectgroup form-selectgroup-boxes row g-3 mx-0">
      <label v-for="(option, i) in options" :key="i" :class="['form-selectgroup-item ps-0', columns > 1 && `col-sm-${12 / columns}`]">
        <input type="radio" :name="name" class="form-selectgroup-input" :checked="option.value === model" :disabled="disabled || option.disabled"
          @change="model = option.value">
        <span class="form-selectgroup-label d-flex align-items-start gap-3 p-3 h-100 text-start">
          <span class="form-selectgroup-check flex-shrink-0 mt-1" />
          <span class="form-selectgroup-label-content">
            <span class="d-block fw-medium text-body">{{ option.label }}</span>
            <span v-if="option.description" class="d-block small text-secondary mt-1">{{ option.description }}</span>
          </span>
        </span>
      </label>
    </div>
    <template v-else>
      <label v-for="(option, i) in options" :key="i" :class="['form-check', { 'form-check-inline': orientation === 'horizontal' }]">
        <input class="form-check-input" type="radio" :name="name" :checked="option.value === model" :disabled="disabled || option.disabled"
          @change="model = option.value">
        <span class="form-check-label">{{ option.label }}</span>
        <span v-if="option.description" class="form-check-description">{{ option.description }}</span>
      </label>
    </template>
  </div>
</template>
