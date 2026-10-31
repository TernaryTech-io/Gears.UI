<script setup lang="ts">
// A text input. Attributes (name, autocomplete, min, …) go to the <input>. `type="number"` gives
// back numbers, and null when it's empty. Icons sit inside the input; the `trailing` slot can hold
// a small button. `autofocus` focuses it when it appears (the HTML attribute only works on page load).
import { computed, onMounted, ref } from 'vue'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  type?: string
  placeholder?: string
  icon?: string
  trailingIcon?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  autofocus?: boolean
  id?: string
}>(), { type: 'text', size: 'md' })

const model = defineModel<string | number | null | undefined>()
const field = useField(props)
const el = ref<HTMLInputElement>()

onMounted(() => { if (props.autofocus) el.value?.focus() })

const value = computed(() => model.value ?? '')

function input(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  model.value = props.type === 'number' ? (raw === '' ? null : Number(raw)) : raw
}
</script>

<template>
  <div :class="{ 'input-icon': icon || trailingIcon || $slots.trailing }">
    <span v-if="icon" class="input-icon-addon">
      <TIcon :name="icon" />
    </span>
    <input v-bind="$attrs" :id="field.id.value" ref="el" :type="type" :value="value" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
      :aria-describedby="field.describedBy.value" :aria-invalid="field.invalid.value || undefined"
      :class="['form-control', size !== 'md' && `form-control-${size}`, { 'is-invalid': field.invalid.value }]" @input="input">
    <span v-if="trailingIcon || $slots.trailing" class="input-icon-addon" :style="$slots.trailing ? { pointerEvents: 'auto' } : undefined">
      <slot name="trailing">
        <TIcon :name="trailingIcon!" />
      </slot>
    </span>
  </div>
</template>
