<script setup lang="ts">
// A date field with Tabler's date picker (Vanilla Calendar Pro underneath). Dates are `YYYY-MM-DD`
// strings: one for `single`, or an array for `multiple` and `range` (from and to). `inline` shows
// the calendar in place instead of a field. `format` is how dates show in the field ('DD.MM.YYYY',
// 'iso', …); the model keeps `YYYY-MM-DD`. The calendar loads on first use.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Datepicker } from '@tabler/core'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'
import { loadDatepicker } from '../plugins/load'

const props = withDefaults(defineProps<{
  mode?: 'single' | 'multiple' | 'range'
  inline?: boolean
  min?: string
  max?: string
  // Months shown side by side.
  months?: number
  // 0 for Sunday, 1 for Monday.
  firstWeekday?: 0 | 1
  weekNumbers?: boolean
  format?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { mode: 'single', months: 1, size: 'md' })

const model = defineModel<string | string[] | null | undefined>()
const field = useField(props)
const el = ref<HTMLElement>()
let picker: Datepicker | null = null

// Tabler types dates as `YYYY-MM-DD` template strings and months as 1 to 12; props are plain.
type IsoDate = `${number}-${string}-${string}`
type MonthsCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

const dates = () => Array.isArray(model.value) ? model.value : model.value ? [model.value] : []
const same = (a: string[], b: string[]) => a.length === b.length && a.every((d, i) => d === b[i])

async function create() {
  const DatepickerClass = await loadDatepicker()
  if (!el.value) return
  picker?.dispose()
  picker = new DatepickerClass(el.value, {
    selectionMode: props.mode === 'range' ? 'multiple-ranged' : props.mode,
    inline: props.inline,
    dateMin: (props.min ?? null) as IsoDate | null,
    dateMax: (props.max ?? null) as IsoDate | null,
    displayMonthsCount: props.months as MonthsCount,
    ...(props.firstWeekday != null ? { firstWeekday: props.firstWeekday } : {}),
    weekNumbers: props.weekNumbers,
    ...(props.format ? { dateFormat: props.format } : {}),
    selectedDates: dates()
  })
}

onMounted(() => {
  create()
  el.value!.addEventListener('change.bs.datepicker', event => {
    const picked = (event as Event & { dates: string[] }).dates ?? []
    if (same(picked, dates())) return
    model.value = props.mode === 'single' ? picked[0] ?? null : picked
  })
})

watch(model, () => {
  if (picker && !same(picker.getSelectedDates(), dates())) picker.setSelectedDates(dates())
}, { deep: true })
watch(() => [props.mode, props.inline, props.min, props.max, props.months, props.firstWeekday, props.weekNumbers, props.format], create, { flush: 'post' })
onBeforeUnmount(() => picker?.dispose())
</script>

<template>
  <div v-if="inline" ref="el" class="t-datepicker-inline" :aria-label="placeholder ?? 'Calendar'" />
  <div v-else class="input-icon">
    <span class="input-icon-addon"><TIcon name="calendar" /></span>
    <input :id="field.id.value" ref="el" type="text" :placeholder="placeholder" :disabled="disabled" autocomplete="off"
      :aria-describedby="field.describedBy.value" :aria-invalid="field.invalid.value || undefined"
      :class="['form-control', size !== 'md' && `form-control-${size}`, { 'is-invalid': field.invalid.value }]">
  </div>
</template>
