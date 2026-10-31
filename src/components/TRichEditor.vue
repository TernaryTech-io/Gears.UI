<script setup lang="ts">
// A rich text editor with Tabler's WYSIWYG plugin (HugeRTE, an open-source fork of TinyMCE).
// v-model is the HTML. `toolbar` and `plugins` use HugeRTE's names; the plugins offered are those
// in src/plugins.ts. It follows the light and dark theme (switching rebuilds the editor). Nothing
// is fetched: the editor, its skins and plugins are bundled and load on first use.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Editor } from 'hugerte'
import { useColorMode } from '../composables/useColorMode'
import { useField } from '../composables/useField'
import { loadRichEditor, type RichEditorPlugin } from '../plugins'

const props = withDefaults(defineProps<{
  height?: number
  toolbar?: string
  plugins?: RichEditorPlugin[]
  menubar?: boolean
  statusbar?: boolean
  placeholder?: string
  disabled?: boolean
  id?: string
}>(), {
  height: 300,
  toolbar: 'undo redo | blocks | bold italic underline | bullist numlist | link image table | code',
  plugins: () => ['advlist', 'autolink', 'lists', 'link', 'image', 'table', 'code']
})

const model = defineModel<string>({ default: '' })
const field = useField(props)
const { isDark } = useColorMode()
const textarea = ref<HTMLTextAreaElement>()
const loading = ref(true)
let editor: Editor | null = null
let stopped = false

async function create() {
  const hugerte = await loadRichEditor()
  if (stopped || !textarea.value) return
  editor?.remove()
  textarea.value.value = model.value
  const [created] = await hugerte.init({
    target: textarea.value,
    // The skins and content styles are bundled resources, named 'default' and 'dark'.
    skin_url: isDark.value ? 'dark' : 'default',
    content_css: isDark.value ? 'dark' : 'default',
    // The page's font, and in the dark theme the card color rather than HugeRTE's navy.
    content_style: 'body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; font-size: 14px; }'
      + (isDark.value ? ' body { background-color: #232525; color: #e6e7e9; }' : ''),
    height: props.height,
    menubar: props.menubar,
    statusbar: props.statusbar,
    plugins: props.plugins,
    toolbar: props.toolbar,
    placeholder: props.placeholder,
    branding: false,
    setup: (ed: Editor) => {
      ed.on('input change undo redo ExecCommand', () => {
        const html = ed.getContent()
        if (html !== model.value) model.value = html
      })
    }
  })
  editor = created ?? null
  if (editor && props.disabled) editor.mode.set('readonly')
  loading.value = false
}

onMounted(create)
watch(model, html => { if (editor && html !== editor.getContent()) editor.setContent(html) })
watch(() => props.disabled, disabled => editor?.mode.set(disabled ? 'readonly' : 'design'))
watch(() => [isDark.value, props.toolbar, props.plugins, props.menubar, props.statusbar, props.height], create)
onBeforeUnmount(() => {
  stopped = true
  editor?.remove()
})
</script>

<template>
  <!-- HugeRTE hides the textarea and adds its editor beside it, inside this wrapper. -->
  <div class="t-rich-editor" :style="loading ? { minHeight: `${height}px` } : undefined">
    <textarea :id="field.id.value" ref="textarea" class="form-control" :placeholder="placeholder" :aria-describedby="field.describedBy.value" />
  </div>
</template>
