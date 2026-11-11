<script setup lang="ts">
// A time of day, typed (masked with IMask: hours, minutes, seconds if wanted, and AM or PM in 12
// hours) or picked from a list at `step` minutes. v-model is always "HH:mm" (or "HH:mm:ss" with
// `seconds`), 24-hour, however it's shown; null when empty. `min` and `max` ("HH:mm") limit the
// list, and a typed time outside them shows as invalid. IMask loads on first use.
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { Dropdown } from '@tabler/core'
import TInputMask from './TInputMask.vue'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'

const props = withDefaults(defineProps<{
  /** Shown with AM and PM. */
  hour12?: boolean
  seconds?: boolean
  /** The list's step, in minutes (none: no list). */
  step?: 1 | 5 | 10 | 15 | 30 | 60 | null
  min?: string | null
  max?: string | null
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { hour12: false, seconds: false, step: 30, min: null, max: null, size: 'md' })

const model = defineModel<string | null | undefined>()
const field = useField(props)

// ---- Times as seconds since midnight ----
const parse = (text: string | null | undefined): number | null => {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(text ?? '')
  if (!m) return null
  const [h, mi, s] = [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)]
  return h < 24 && mi < 60 && s < 60 ? h * 3600 + mi * 60 + s : null
}
const pad = (n: number) => String(n).padStart(2, '0')
/** The model's text: 24-hour, with seconds or not. */
const toModel = (t: number) => `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}${props.seconds ? `:${pad(t % 60)}` : ''}`
/** As it's shown and typed. */
function toText(t: number) {
  const h = Math.floor(t / 3600)
  const rest = `${pad(Math.floor(t / 60) % 60)}${props.seconds ? `:${pad(t % 60)}` : ''}`
  return props.hour12 ? `${pad(h % 12 || 12)}:${rest} ${h < 12 ? 'AM' : 'PM'}` : `${pad(h)}:${rest}`
}
/** A typed text's time, when it's complete. */
function fromText(text: string): number | null {
  const m = props.hour12
    ? /^(\d{2}):(\d{2})(?::(\d{2}))? (AM|PM)$/i.exec(text.trim())
    : /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(text.trim())
  if (!m || (props.seconds && m[3] === undefined)) return null
  let h = Number(m[1])
  if (props.hour12) {
    if (h < 1 || h > 12) return null
    h = (h % 12) + (m[4]!.toUpperCase() === 'PM' ? 12 : 0)
  }
  const t = h * 3600 + Number(m[2]) * 60 + Number(m[3] ?? 0)
  return h < 24 && Number(m[2]) < 60 && Number(m[3] ?? 0) < 60 ? t : null
}

const lowest = computed(() => parse(props.min))
const highest = computed(() => parse(props.max))
const outside = (t: number) => (lowest.value !== null && t < lowest.value) || (highest.value !== null && t > highest.value)
const current = computed(() => parse(model.value))

// ---- The masked text ----
const text = ref('')
watch([() => model.value, () => props.hour12, () => props.seconds], () => {
  const t = current.value
  if (t === null ? text.value !== '' && fromText(text.value) !== null : fromText(text.value) !== t) text.value = t === null ? '' : toText(t)
}, { immediate: true })
function typed(value: string | null | undefined) {
  text.value = value ?? ''
  if (!text.value.trim()) {
    if (model.value != null) model.value = null
    return
  }
  const t = fromText(text.value)
  if (t !== null && toModel(t) !== model.value) model.value = toModel(t)
}
// Left half-typed: back to the time it holds.
function settle() {
  if (text.value.trim() && fromText(text.value) === null) text.value = current.value === null ? '' : toText(current.value)
}

// IMask's ranges and AM/PM, once it's loaded.
const imask = shallowRef<{ MaskedRange: unknown; MaskedEnum: unknown } | null>(null)
onMounted(async () => { imask.value = (await import('imask')).default as unknown as { MaskedRange: unknown; MaskedEnum: unknown } })
const options = computed(() => {
  const I = imask.value
  if (!I) return undefined
  const range = (from: number, to: number) => ({ mask: I.MaskedRange, from, to, maxLength: 2, autofix: 'pad' })
  return {
    mask: `HH:MM${props.seconds ? ':SS' : ''}${props.hour12 ? ' aa' : ''}`,
    blocks: {
      HH: props.hour12 ? range(1, 12) : range(0, 23), MM: range(0, 59), SS: range(0, 59),
      aa: { mask: I.MaskedEnum, enum: ['AM', 'PM'], prepareChar: (c: string) => c.toUpperCase() }
    },
    lazy: true, overwrite: true
  }
})
const shownPlaceholder = computed(() => props.placeholder ?? `${props.hour12 ? 'hh' : 'HH'}:mm${props.seconds ? ':ss' : ''}${props.hour12 ? ' AM' : ''}`)

// ---- The list ----
const times = computed(() => {
  if (!props.step) return []
  const from = lowest.value ?? 0
  const to = highest.value ?? 24 * 3600 - 1
  const list: number[] = []
  for (let t = Math.ceil(from / (props.step * 60)) * props.step * 60; t <= to && list.length < 1440; t += props.step * 60) list.push(t)
  return list
})
const toggle = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()
let dropdown: Dropdown | null = null
onMounted(() => {
  if (!toggle.value) return
  dropdown = new Dropdown(toggle.value, { popperConfig: (config: object) => ({ ...config, strategy: 'fixed' }) })
  // The chosen time (or the nearest after it) is scrolled into view.
  toggle.value.addEventListener('shown.bs.dropdown', () => {
    const at = current.value ?? 0
    const index = Math.max(0, times.value.findIndex(t => t >= at))
    const item = menu.value?.children[index] as HTMLElement | undefined
    if (item && menu.value) menu.value.scrollTop = item.offsetTop - menu.value.clientHeight / 2 + item.clientHeight / 2
  })
})
onBeforeUnmount(() => dropdown?.dispose())
function pick(t: number) {
  model.value = toModel(t)
  text.value = toText(t)
}

const wrong = computed(() => field.invalid.value || (current.value !== null && outside(current.value)))
</script>

<template>
  <div :class="['input-group flex-nowrap t-time-input', size !== 'md' && `input-group-${size}`]">
    <TInputMask :id="field.id.value" :model-value="text" :options="options" :placeholder="shownPlaceholder" :size="size" :disabled="disabled" :invalid="wrong"
      class="flex-fill" @update:model-value="typed" @focusout="settle" />
    <template v-if="step">
      <button ref="toggle" type="button" class="btn btn-icon" data-bs-toggle="dropdown" aria-haspopup="listbox" aria-expanded="false"
        :disabled="disabled" aria-label="Choose a time">
        <TIcon name="clock" />
      </button>
      <div ref="menu" class="dropdown-menu dropdown-menu-end t-time-list" role="listbox">
        <button v-for="t in times" :key="t" type="button" role="option" :aria-selected="t === current"
          :class="['dropdown-item', { active: t === current }]" @click="pick(t)">{{ toText(t) }}</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.t-time-input :deep(.form-control) { min-width: 0; }
.t-time-input > :first-child { min-width: 0; }
/* The field joins the clock button, as an input group's own fields do. */
.t-time-input:has(> .btn) > :first-child :deep(.form-control) { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.t-time-list { max-height: 16rem; overflow-y: auto; min-width: 8rem; }
</style>
