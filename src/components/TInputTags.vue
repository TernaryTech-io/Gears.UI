<script setup lang="ts">
// A list of short values typed one at a time: Enter or a comma adds one, Backspace in the empty
// box removes the last. The model is an array of strings.
import { ref } from 'vue'
import { useField } from '../composables/useField'

const props = withDefaults(defineProps<{
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  // Allow the same value twice.
  duplicates?: boolean
  id?: string
}>(), { size: 'md' })

const model = defineModel<string[]>({ default: () => [] })
const field = useField(props)
const input = ref<HTMLInputElement>()
const draft = ref('')

function add() {
  const value = draft.value.trim()
  draft.value = ''
  if (!value || (!props.duplicates && model.value.includes(value))) return
  model.value = [...model.value, value]
}

function remove(index: number) {
  model.value = model.value.filter((_, i) => i !== index)
}

function key(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    add()
  } else if (event.key === 'Backspace' && !draft.value && model.value.length) {
    remove(model.value.length - 1)
  }
}
</script>

<template>
  <div :class="['form-control t-tags', size !== 'md' && `form-control-${size}`, { 'is-invalid': field.invalid.value, disabled }]"
    @click="input?.focus()">
    <span v-for="(tag, i) in model" :key="`${i}-${tag}`" class="badge bg-secondary-lt t-tag">
      {{ tag }}
      <button v-if="!disabled" type="button" class="btn-close" :aria-label="`Remove ${tag}`" @click.stop="remove(i)" />
    </span>
    <input :id="field.id.value" ref="input" v-model="draft" class="t-tags-input" :disabled="disabled"
      :placeholder="model.length ? '' : placeholder" :aria-describedby="field.describedBy.value" @keydown="key" @blur="add">
  </div>
</template>
