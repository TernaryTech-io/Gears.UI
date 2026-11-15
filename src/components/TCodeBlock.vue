<script setup lang="ts">
// Code to read and copy, not to edit: JSON or YAML with light highlighting (`text` for none), on a
// sunken surface like TLogView. Give `code`, or a `value` to show as JSON. Lines wrap unless `wrap`
// is off (then it scrolls sideways); `maxHeight` caps it with a scroll. A `title` (or the `title`
// slot) gives it a header, with the copy button and any `actions`; without one the copy button sits
// in the corner. No editor is loaded: for editing, use TCodeEditor.
import { computed, useSlots } from 'vue'
import TCopyButton from './TCopyButton.vue'
import { codeTokens, type CodeLanguage } from '../codeTokens'

const props = withDefaults(defineProps<{
  code?: string
  // Shown as JSON, indented by two spaces; `code` wins when both are given.
  value?: unknown
  language?: CodeLanguage
  title?: string
  // The block's name for screen readers, when there's no title.
  label?: string
  wrap?: boolean
  copy?: boolean
  maxHeight?: string
}>(), { language: 'json', wrap: true, copy: true })

defineEmits<{ copied: [] }>()

const slots = useSlots()

const text = computed(() => props.code ?? (props.value === undefined ? '' : JSON.stringify(props.value, null, 2) ?? ''))
const language = computed<CodeLanguage>(() => props.code === undefined && props.value !== undefined ? 'json' : props.language)
const tokens = computed(() => codeTokens(text.value, language.value))
const header = computed(() => !!props.title || !!slots.title || !!slots.actions)
</script>

<template>
  <div :class="['t-code', { 't-code-nowrap': !wrap, 't-code-headed': header }]">
    <div v-if="header" class="t-code-header">
      <span class="t-code-title"><slot name="title">{{ title }}</slot></span>
      <span class="t-code-actions">
        <slot name="actions" />
        <TCopyButton v-if="copy" :text="text" icon-only variant="ghost" size="sm" label="Copy" @copied="$emit('copied')" />
      </span>
    </div>
    <TCopyButton v-else-if="copy" :text="text" icon-only variant="ghost" size="sm" label="Copy" class="t-code-copy" @copied="$emit('copied')" />
    <pre class="t-code-body" :style="maxHeight ? { maxHeight } : undefined" tabindex="0" :aria-label="label ?? title"><code :data-language="language"><span
      v-for="(token, i) in tokens" :key="i" :class="token.kind === 'plain' ? undefined : `t-code-${token.kind}`">{{ token.text }}</span></code></pre>
  </div>
</template>
