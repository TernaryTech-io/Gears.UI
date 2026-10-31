<script setup lang="ts">
// A code editor (Monaco) for any language: queries, generated code, settings, JSON. It follows the
// light and dark theme, offers the completions it's given, and emits `run` on Ctrl+Enter. Monaco
// loads the first time an editor is shown. Give it a height (a class, or flex in a column);
// `flush` drops the border, for an editor that fills a card.
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type * as Monaco from 'monaco-editor'
import TSpinner from './TSpinner.vue'
import { useColorMode } from '../composables/useColorMode'
import type { CodeCompletion } from '../types'

const props = withDefaults(defineProps<{
  language: string
  readOnly?: boolean
  completions?: CodeCompletion[]
  // The editor's accessible name.
  label?: string
  flush?: boolean
  lineNumbers?: boolean
}>(), { completions: () => [], label: 'Code editor', lineNumbers: true })

const value = defineModel<string>({ default: '' })
const emit = defineEmits<{ run: [] }>()

const host = ref<HTMLDivElement>()
const loading = ref(true)
const { isDark } = useColorMode()
let monaco: typeof Monaco | undefined
const editor = shallowRef<Monaco.editor.IStandaloneCodeEditor>()
let completionProvider: Monaco.IDisposable | undefined

const theme = () => isDark.value ? 'gears-dark' : 'gears-light'

onMounted(async () => {
  monaco = (await import('../monaco')).default
  if (!host.value) return
  editor.value = monaco.editor.create(host.value, {
    value: value.value,
    language: props.language,
    readOnly: props.readOnly,
    theme: theme(),
    automaticLayout: true,
    minimap: { enabled: false },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    scrollBeyondLastLine: false,
    lineNumbers: props.lineNumbers ? 'on' : 'off',
    fontSize: 13,
    fontFamily: "ui-monospace, 'Cascadia Code', Consolas, monospace",
    tabSize: 2,
    wordWrap: 'on',
    ariaLabel: props.label,
    padding: { top: 8, bottom: 8 }
  })
  editor.value.onDidChangeModelContent(() => {
    const text = editor.value!.getValue()
    if (text !== value.value) value.value = text
  })
  editor.value.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => emit('run'))
  registerCompletions()
  loading.value = false
})

// The editor goes before its model: a model disposed under a live editor throws "Model is disposed!".
onBeforeUnmount(() => {
  completionProvider?.dispose()
  const model = editor.value?.getModel()
  editor.value?.dispose()
  model?.dispose()
})

watch(value, text => {
  if (editor.value && text !== editor.value.getValue()) editor.value.setValue(text)
})
watch(() => props.readOnly, readOnly => editor.value?.updateOptions({ readOnly }))
watch(() => props.language, language => {
  const model = editor.value?.getModel()
  if (monaco && model) monaco.editor.setModelLanguage(model, language)
  registerCompletions()
})
watch(isDark, () => monaco?.editor.setTheme(theme()))
watch(() => props.completions, registerCompletions)

// Offers this editor's completions, only in this editor's model.
function registerCompletions() {
  completionProvider?.dispose()
  completionProvider = undefined
  if (!monaco || !editor.value || props.completions.length === 0) return
  const m = monaco
  const kinds = {
    keyword: m.languages.CompletionItemKind.Keyword, table: m.languages.CompletionItemKind.Class,
    field: m.languages.CompletionItemKind.Field, function: m.languages.CompletionItemKind.Function,
    value: m.languages.CompletionItemKind.Value, snippet: m.languages.CompletionItemKind.Snippet
  }
  const own = editor.value.getModel()
  completionProvider = m.languages.registerCompletionItemProvider(props.language, {
    provideCompletionItems(model, position) {
      if (model !== own) return { suggestions: [] }
      const word = model.getWordUntilPosition(position)
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn }
      return {
        suggestions: props.completions.map(c => ({
          label: c.label,
          kind: kinds[c.kind ?? 'keyword'],
          insertText: c.insertText ?? c.label,
          detail: c.detail,
          range
        }))
      }
    }
  })
}

// Focuses the editor.
function focus() {
  editor.value?.focus()
}
defineExpose({ focus })
</script>

<template>
  <div :class="['t-code-editor', { 't-code-editor-flush': flush }]">
    <div ref="host" class="t-code-editor-host" />
    <div v-if="loading" class="t-code-editor-loading">
      <TSpinner size="sm" show-label label="Loading the editor…" />
    </div>
  </div>
</template>
