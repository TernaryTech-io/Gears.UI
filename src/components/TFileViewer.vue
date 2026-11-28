<script setup lang="ts">
// Files shown one at a time (TFileView) under a toolbar: the file's name and size, previous and
// next with a counter (and the arrow keys), Download, Share when `share` is on (it emits `share`;
// the host shows its own dialog), any `actions`, and close (the button or Escape). v-model is the
// one shown: its index in `files`, null when closed. Over the whole window by default, with focus
// moved into it and back after; `inline` shows it in its box instead, always open, without close.
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import TFileView from './TFileView.vue'
import TIcon from './TIcon.vue'
import { sizeText, viewerIcon, viewerKind, type ViewerFile } from '../plugins/viewers'

const props = withDefaults(defineProps<{
  files: ViewerFile[]
  inline?: boolean
  share?: boolean
  loop?: boolean
  // The inline viewer's height.
  height?: number | string
}>(), { loop: false, height: 640 })
const index = defineModel<number | null>({ default: null })
const emit = defineEmits<{ share: [file: ViewerFile]; close: []; error: [file: ViewerFile, message: string] }>()

const at = computed(() => (props.inline ? Math.min(Math.max(index.value ?? 0, 0), props.files.length - 1) : index.value))
const open = computed(() => at.value != null && at.value >= 0 && at.value < props.files.length)
const file = computed(() => (open.value ? props.files[at.value!]! : null))
const many = computed(() => props.files.length > 1)
const canBack = computed(() => many.value && (props.loop || (at.value ?? 0) > 0))
const canOn = computed(() => many.value && (props.loop || (at.value ?? 0) < props.files.length - 1))
const downloadHref = computed(() => (!file.value || file.value.download === false ? null : file.value.download ?? file.value.src))
const cssHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height))

function step(by: 1 | -1) {
  if (at.value == null || !many.value) return
  const next = at.value + by
  index.value = props.loop ? (next + props.files.length) % props.files.length : Math.min(Math.max(next, 0), props.files.length - 1)
}
function close() {
  if (props.inline) return
  index.value = null
  emit('close')
}

/** Keys that belong to what's in the file (a page number, a player) are left to it. */
function typing(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'VIDEO', 'AUDIO'].includes(target.tagName))
}
function key(event: KeyboardEvent) {
  if (!open.value || event.altKey || event.ctrlKey || event.metaKey) return
  if (event.key === 'Escape' && !props.inline) close()
  else if (event.key === 'ArrowRight' && !typing(event.target) && canOn.value) step(1)
  else if (event.key === 'ArrowLeft' && !typing(event.target) && canBack.value) step(-1)
  else return
  event.preventDefault()
}

const dialog = ref<HTMLElement>()
let before: Element | null = null
let overflow = ''
watch(() => open.value && !props.inline, async now => {
  if (now) {
    before = document.activeElement
    overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', key)
    await nextTick()
    dialog.value?.focus()
  } else {
    document.removeEventListener('keydown', key)
    document.body.style.overflow = overflow
    if (before instanceof HTMLElement) before.focus()
    before = null
  }
}, { immediate: true })
onBeforeUnmount(() => {
  document.removeEventListener('keydown', key)
  if (before) document.body.style.overflow = overflow
})
</script>

<template>
  <Teleport to="body" :disabled="inline">
    <div v-if="open && file" ref="dialog" :class="['t-file-viewer', { 't-file-viewer-inline card': inline }]" :role="inline ? 'region' : 'dialog'"
      :aria-modal="inline ? undefined : 'true'" :aria-label="file.name" tabindex="-1" :style="inline ? { height: cssHeight } : undefined"
      @keydown="inline ? key($event) : undefined">
      <div class="t-file-viewer-bar">
        <TIcon :name="viewerIcon(viewerKind(file))" class="t-file-viewer-icon" />
        <div class="t-file-viewer-title">
          <div class="t-file-viewer-name" :title="file.name">{{ file.name }}</div>
          <div v-if="file.size != null || many" class="t-file-viewer-meta">
            <span v-if="file.size != null">{{ sizeText(file.size) }}</span>
            <span v-if="many" class="t-file-viewer-count">{{ at! + 1 }} of {{ files.length }}</span>
          </div>
        </div>
        <div class="t-file-viewer-actions">
          <template v-if="many">
            <button type="button" class="btn btn-icon btn-ghost-secondary" :disabled="!canBack" aria-label="Previous file" title="Previous (←)" @click="step(-1)">
              <TIcon name="chevron-left" />
            </button>
            <button type="button" class="btn btn-icon btn-ghost-secondary" :disabled="!canOn" aria-label="Next file" title="Next (→)" @click="step(1)">
              <TIcon name="chevron-right" />
            </button>
            <span class="t-file-viewer-divider" />
          </template>
          <slot name="actions" :file="file" />
          <button v-if="share" type="button" class="btn btn-ghost-secondary" @click="emit('share', file)"><TIcon name="share" class="me-1" />Share</button>
          <a v-if="downloadHref" :href="downloadHref" :download="file.name" class="btn btn-ghost-secondary"><TIcon name="download" class="me-1" />Download</a>
          <button v-if="!inline" type="button" class="btn btn-icon btn-ghost-secondary" aria-label="Close" title="Close (Esc)" @click="close">
            <TIcon name="x" />
          </button>
        </div>
      </div>
      <TFileView :key="file.id ?? `${at}:${file.src}`" :file="file" class="t-file-viewer-body" @error="m => emit('error', file!, m)" />
    </div>
  </Teleport>
</template>

<style scoped>
.t-file-viewer {
  position: fixed; inset: 0; z-index: 2000; display: flex; flex-direction: column; background: var(--tblr-bg-surface-secondary);
  outline: none; animation: t-file-viewer-in 0.12s ease-out;
}
.t-file-viewer-inline { position: relative; inset: auto; z-index: auto; overflow: hidden; animation: none; }
@keyframes t-file-viewer-in { from { opacity: 0; } }
.t-file-viewer-bar {
  display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem 0.5rem 1rem; flex: none;
  background: var(--tblr-bg-surface); border-bottom: 1px solid var(--tblr-border-color);
}
.t-file-viewer-icon { font-size: 1.25rem; color: var(--tblr-secondary); flex: none; }
.t-file-viewer-title { min-width: 0; flex: 1 1 auto; }
.t-file-viewer-name { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.t-file-viewer-meta { display: flex; gap: 0.75rem; color: var(--tblr-secondary); font-size: 0.8125rem; }
.t-file-viewer-count { font-variant-numeric: tabular-nums; }
.t-file-viewer-actions { display: flex; align-items: center; gap: 0.25rem; flex: none; }
.t-file-viewer-divider { width: 1px; align-self: stretch; margin: 0.25rem 0.25rem; background: var(--tblr-border-color); }
.t-file-viewer-body { flex: 1 1 auto; height: auto !important; }
@media (max-width: 576px) {
  .t-file-viewer-actions .btn:not(.btn-icon) { font-size: 0; padding-inline: 0.5rem; }
  .t-file-viewer-actions .btn:not(.btn-icon) :deep(.ti) { font-size: 1.25rem; margin: 0 !important; }
}
</style>
