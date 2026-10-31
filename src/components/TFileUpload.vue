<script setup lang="ts">
// Choose files by dropping them on the area or clicking it, with no upload: v-model holds them
// (one File, or an array with `multiple`) for the page to read or send. Chosen files are listed
// under it with their size, and can be removed. `accept` limits the kinds (".txt,image/*"); files
// that don't match are left out, and `rejected` says which. For uploading with previews, see
// TDropzone.
import { computed, ref } from 'vue'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'

const props = withDefaults(defineProps<{
  accept?: string
  multiple?: boolean
  label?: string
  description?: string
  icon?: string
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { label: 'Drop a file here or click to choose', icon: 'upload' })

const model = defineModel<File | File[] | null | undefined>()
const emit = defineEmits<{ rejected: [files: File[]] }>()
const field = useField(props)

const input = ref<HTMLInputElement>()
const over = ref(false)

const files = computed<File[]>(() => Array.isArray(model.value) ? model.value : model.value ? [model.value] : [])

// Does the file match `accept`: extensions (".txt"), types ("text/plain") or families ("image/*").
function accepted(file: File) {
  if (!props.accept) return true
  return props.accept.split(',').map(a => a.trim().toLowerCase()).filter(Boolean).some(rule =>
    rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule)
      : rule.endsWith('/*') ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
        : file.type.toLowerCase() === rule)
}

function add(list: FileList | null) {
  if (!list?.length || props.disabled) return
  const all = [...list]
  const good = all.filter(accepted)
  const bad = all.filter(f => !accepted(f))
  if (bad.length) emit('rejected', bad)
  if (!good.length) return
  model.value = props.multiple ? [...files.value, ...good] : good[0]
}

function remove(file: File) {
  model.value = props.multiple ? files.value.filter(f => f !== file) : null
}

function drop(event: DragEvent) {
  over.value = false
  add(event.dataTransfer?.files ?? null)
}

function chosen() {
  add(input.value!.files)
  // The same file can be chosen again after it's removed.
  input.value!.value = ''
}

function size(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
</script>

<template>
  <div class="t-file-upload">
    <label :for="field.id.value" :class="['t-file-upload-area', { over, disabled, 'is-invalid': field.invalid.value }]"
      @dragover.prevent="over = !disabled" @dragleave="over = false" @drop.prevent="drop">
      <TIcon :name="icon" class="fs-2 text-secondary" />
      <span class="fw-medium">{{ label }}</span>
      <span v-if="description" class="small text-secondary">{{ description }}</span>
      <input :id="field.id.value" ref="input" type="file" class="visually-hidden" :accept="accept" :multiple="multiple" :disabled="disabled"
        :aria-describedby="field.describedBy.value" @change="chosen">
    </label>
    <ul v-if="files.length" class="list-group mt-2">
      <li v-for="(file, i) in files" :key="`${i}-${file.name}`" class="list-group-item d-flex align-items-center gap-2 py-2">
        <TIcon name="file" class="text-secondary" />
        <span class="text-truncate">{{ file.name }}</span>
        <span class="small text-secondary flex-shrink-0">{{ size(file.size) }}</span>
        <button type="button" class="btn btn-ghost-secondary btn-icon btn-sm ms-auto" :aria-label="`Remove ${file.name}`" :disabled="disabled"
          @click="remove(file)"><TIcon name="x" /></button>
      </li>
    </ul>
  </div>
</template>
