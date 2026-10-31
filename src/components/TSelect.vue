<script setup lang="ts" generic="T">
// A native select. Items are values or { label, value, group } objects; values keep their type (a
// number stays a number), since options are matched by position. Grouped items are listed under
// their group's name.
import { computed } from 'vue'
import { useField } from '../composables/useField'
import type { SelectItem } from '../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  items: (T | SelectItem<T>)[]
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { size: 'md' })

const model = defineModel<T | null | undefined>()
const field = useField(props)

const isItem = (item: unknown): item is SelectItem<T> =>
  typeof item === 'object' && item !== null && 'label' in item && 'value' in item

const options = computed<SelectItem<T>[]>(() =>
  props.items.map(item => isItem(item) ? item : { label: String(item), value: item as T }))

const selected = computed(() => String(options.value.findIndex(o => o.value === model.value)))

// Options in runs of the same group, keeping their positions.
const runs = computed(() => {
  const result: { group?: string; options: { option: SelectItem<T>; index: number }[] }[] = []
  options.value.forEach((option, index) => {
    const last = result.at(-1)
    if (last && last.group === option.group) last.options.push({ option, index })
    else result.push({ group: option.group, options: [{ option, index }] })
  })
  return result
})

function change(event: Event) {
  const index = Number((event.target as HTMLSelectElement).value)
  model.value = index >= 0 ? options.value[index].value : null
}
</script>

<template>
  <select v-bind="$attrs" :id="field.id.value" :value="selected" :disabled="disabled"
    :aria-describedby="field.describedBy.value" :aria-invalid="field.invalid.value || undefined"
    :class="['form-select', size !== 'md' && `form-select-${size}`, { 'is-invalid': field.invalid.value }]" @change="change">
    <option v-if="placeholder || selected === '-1'" value="-1" disabled>{{ placeholder ?? '' }}</option>
    <template v-for="(run, r) in runs" :key="r">
      <optgroup v-if="run.group" :label="run.group">
        <option v-for="{ option, index } in run.options" :key="index" :value="String(index)" :disabled="option.disabled">{{ option.label }}</option>
      </optgroup>
      <option v-for="{ option, index } in run.options" v-else :key="index" :value="String(index)" :disabled="option.disabled">{{ option.label }}</option>
    </template>
  </select>
</template>
