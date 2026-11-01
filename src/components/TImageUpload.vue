<script setup lang="ts">
// One image, such as a logo: drop it or click to choose, see it, replace or remove it. The image is
// checked before it's taken: its type (`accept`), that it's `square` when asked, and that its
// sides are between `minSize` and `maxSize` pixels. A refused image says why, under the area, and
// in a `rejected` event. v-model holds the File chosen, or the address of the current image (a
// string); nothing uploads.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'

const props = withDefaults(defineProps<{
  accept?: string
  square?: boolean
  minSize?: number
  maxSize?: number
  label?: string
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { accept: 'image/png,image/jpeg,image/webp', label: 'Drop an image here or click to choose' })

const model = defineModel<File | string | null | undefined>()
const emit = defineEmits<{ rejected: [reason: string, file: File] }>()
const field = useField(props)

const input = ref<HTMLInputElement>()
const over = ref(false)
const problem = ref('')
const dimensions = ref<{ width: number; height: number } | null>(null)

// What the area shows: the chosen file through an object URL, or the address it was given.
const objectUrl = ref<string | null>(null)
watch(model, value => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = value instanceof File ? URL.createObjectURL(value) : null
}, { immediate: true })
onBeforeUnmount(() => { if (objectUrl.value) URL.revokeObjectURL(objectUrl.value) })
const src = computed(() => objectUrl.value ?? (typeof model.value === 'string' ? model.value : null))
const chosenFile = computed(() => model.value instanceof File ? model.value : null)

const rules = computed(() => {
  const parts: string[] = []
  if (props.square) parts.push('Square')
  if (props.minSize && props.maxSize) parts.push(`${props.minSize}×${props.minSize} to ${props.maxSize}×${props.maxSize} pixels`)
  else if (props.minSize) parts.push(`at least ${props.minSize}×${props.minSize} pixels`)
  else if (props.maxSize) parts.push(`at most ${props.maxSize}×${props.maxSize} pixels`)
  const types = props.accept.split(',').map(t => t.trim().replace(/^image\//, '').replace(/^\./, '').toUpperCase()).filter(Boolean)
  if (types.length) parts.push(types.join(', ').replace('JPEG', 'JPG'))
  return parts.join(' · ')
})

function accepted(file: File) {
  return props.accept.split(',').map(a => a.trim().toLowerCase()).filter(Boolean).some(rule =>
    rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule)
      : rule.endsWith('/*') ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
        : file.type.toLowerCase() === rule)
}

function measure(file: File) {
  return new Promise<{ width: number; height: number } | null>(resolve => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(url) }
    image.onerror = () => { resolve(null); URL.revokeObjectURL(url) }
    image.src = url
  })
}

function refuse(reason: string, file: File) {
  problem.value = reason
  emit('rejected', reason, file)
}

async function take(file: File | undefined) {
  if (!file || props.disabled) return
  problem.value = ''
  if (!accepted(file)) return refuse(`${file.name} isn't an image of a type this takes (${rules.value}).`, file)
  const size = await measure(file)
  if (!size) return refuse(`${file.name} couldn't be read as an image.`, file)
  const { width, height } = size
  if (props.square && width !== height) return refuse(`The image is ${width}×${height}; it must be square.`, file)
  if (props.minSize && (width < props.minSize || height < props.minSize))
    return refuse(`The image is ${width}×${height}; it must be at least ${props.minSize}×${props.minSize}.`, file)
  if (props.maxSize && (width > props.maxSize || height > props.maxSize))
    return refuse(`The image is ${width}×${height}; it must be at most ${props.maxSize}×${props.maxSize}.`, file)
  dimensions.value = size
  model.value = file
}

function chosen() {
  take(input.value!.files?.[0])
  // The same file can be chosen again after it's removed.
  input.value!.value = ''
}

function drop(event: DragEvent) {
  over.value = false
  take(event.dataTransfer?.files?.[0])
}

function remove() {
  model.value = null
  dimensions.value = null
  problem.value = ''
}
</script>

<template>
  <div class="t-image-upload">
    <label :for="field.id.value" :class="['t-file-upload-area t-image-upload-area', { over, disabled, 'is-invalid': field.invalid.value || !!problem }]"
      @dragover.prevent="over = !disabled" @dragleave="over = false" @drop.prevent="drop">
      <span :class="['t-image-upload-preview', { square }]">
        <img v-if="src" :src="src" alt="">
        <TIcon v-else name="photo" class="fs-1 text-secondary" />
      </span>
      <span class="d-flex flex-column align-items-start text-start gap-1 min-w-0">
        <span class="fw-medium">{{ src ? 'Drop or click to replace' : label }}</span>
        <span class="small text-secondary">{{ rules }}</span>
        <span v-if="chosenFile" class="small text-secondary text-truncate mw-100">
          {{ chosenFile.name }}<template v-if="dimensions"> · {{ dimensions.width }}×{{ dimensions.height }}</template>
        </span>
      </span>
      <input :id="field.id.value" ref="input" type="file" class="visually-hidden" :accept="accept" :disabled="disabled"
        :aria-describedby="field.describedBy.value" @change="chosen">
    </label>
    <div v-if="problem" class="invalid-feedback d-block" role="alert">{{ problem }}</div>
    <button v-if="src && !disabled" type="button" class="btn btn-link btn-sm px-0 text-danger" @click="remove">
      <TIcon name="trash" class="me-1" />Remove image
    </button>
  </div>
</template>
