<script setup lang="ts" generic="T">
// One choice from a few, all shown. Items are values or { label, value, description } objects.
// `cards` shows each choice as a box (Tabler's select group), laid out in `columns` on wider
// screens: for choices that need their description, such as a project's database. `tiles` shows
// each choice as a picture with its label under it (the `preview` slot draws it), in a grid of
// tiles at least `tileWidth` wide: for choices you judge by eye, such as a theme's font.
import { computed, useId } from 'vue'
import type { SelectItem } from '../types'

const props = withDefaults(defineProps<{
  items: (T | SelectItem<T>)[]
  orientation?: 'vertical' | 'horizontal'
  variant?: 'list' | 'cards' | 'tiles'
  columns?: 1 | 2 | 3
  tileWidth?: string
  disabled?: boolean
  legend?: string
}>(), { variant: 'list', columns: 2, tileWidth: '7rem' })

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
    <div v-if="variant === 'cards'" class="form-selectgroup-boxes row g-3">
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
    <div v-else-if="variant === 'tiles'" class="t-radio-tiles" :style="{ '--t-tile-width': tileWidth }">
      <label v-for="(option, i) in options" :key="i" :class="['t-radio-tile', { active: option.value === model, disabled: disabled || option.disabled }]">
        <input type="radio" :name="name" class="t-radio-tile-input" :checked="option.value === model" :disabled="disabled || option.disabled"
          @change="model = option.value">
        <span class="t-radio-tile-check" aria-hidden="true" />
        <span class="t-radio-tile-preview">
          <slot name="preview" :item="option" :selected="option.value === model">
            <span class="fw-medium">{{ option.label }}</span>
          </slot>
        </span>
        <span class="t-radio-tile-label">{{ option.label }}</span>
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
