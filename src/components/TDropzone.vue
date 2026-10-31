<script setup lang="ts">
// Tabler's file drop area (Dropzone): drop files or click to choose them, with previews. With a
// `url`, files upload there as they're added (`uploaded` or `error` follows each); without one,
// they're only collected, and v-model holds the accepted files for the form to send. `accept` is
// a list like "image/*,.pdf"; `maxFilesize` is in MB. Dropzone loads on first use.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type Dropzone from 'dropzone'
import TIcon from './TIcon.vue'
import { loadDropzone } from '../plugins/dropzone'

const props = withDefaults(defineProps<{
  url?: string
  accept?: string
  maxFiles?: number
  maxFilesize?: number
  paramName?: string
  headers?: Record<string, string>
  title?: string
  hint?: string
}>(), { paramName: 'file', title: 'Drop files here or click to choose' })

const model = defineModel<File[]>({ default: () => [] })
const emit = defineEmits<{ uploaded: [file: File, response: unknown]; error: [file: File, message: string] }>()

const el = ref<HTMLElement>()
let dropzone: Dropzone | null = null

function sync() {
  if (dropzone) model.value = dropzone.getAcceptedFiles()
}

onMounted(async () => {
  const DropzoneClass = await loadDropzone()
  if (!el.value) return
  dropzone = new DropzoneClass(el.value, {
    url: props.url ?? '/',
    autoProcessQueue: !!props.url,
    acceptedFiles: props.accept,
    maxFiles: props.maxFiles,
    maxFilesize: props.maxFilesize,
    paramName: props.paramName,
    headers: props.headers,
    addRemoveLinks: true,
    dictRemoveFile: 'Remove',
    dictCancelUpload: 'Cancel',
    dictInvalidFileType: 'This kind of file isn\'t allowed here.',
    dictFileTooBig: 'The file is {{filesize}} MB; the limit is {{maxFilesize}} MB.',
    dictMaxFilesExceeded: 'No more files can be added.'
  })
  // A file is accepted (or rejected) right after it's added.
  dropzone.on('addedfile', () => setTimeout(sync))
  dropzone.on('removedfile', sync)
  dropzone.on('success', (file: File, response: unknown) => emit('uploaded', file, response))
  dropzone.on('error', (file: File, message: string | { error?: string }) => {
    emit('error', file, typeof message === 'string' ? message : message?.error ?? 'The file couldn\'t be added.')
    sync()
  })
})

// Clearing the model from outside clears the area.
watch(model, files => { if (dropzone && !files.length && dropzone.files.length) dropzone.removeAllFiles(true) })
onBeforeUnmount(() => dropzone?.destroy())

// Uploads the queued files, for a dropzone with a `url`.
defineExpose({ upload: () => dropzone?.processQueue() })
</script>

<template>
  <div ref="el" class="dropzone t-dropzone">
    <div class="dz-message">
      <TIcon name="cloud-upload" class="d-block mx-auto mb-2 fs-1 text-secondary" />
      <h3 class="dropzone-msg-title">{{ title }}</h3>
      <span v-if="hint" class="dropzone-msg-desc text-secondary">{{ hint }}</span>
    </div>
  </div>
</template>
