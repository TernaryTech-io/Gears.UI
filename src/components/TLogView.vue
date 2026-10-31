<script setup lang="ts">
// Log output: either one block of `text` (a build log) or `lines` with times and levels (an app's
// output). It follows the end as output arrives, unless the reader scrolls up, which turns
// v-model:follow off; scrolling back to the end turns it on again. `fill` takes the height it's
// given instead of a capped scroll box.
import { nextTick, ref, watch } from 'vue'
import type { LogLine } from '../types'

const props = withDefaults(defineProps<{ text?: string; lines?: LogLine[]; fill?: boolean; maxHeight?: string; empty?: string }>(),
  { maxHeight: '20rem', empty: 'No output yet.' })

const follow = defineModel<boolean>('follow', { default: true })
const box = ref<HTMLElement>()

const levels = { error: 'text-danger', warning: 'text-warning', highlight: 'text-primary', muted: 'text-secondary' }

function toEnd() {
  if (box.value) box.value.scrollTop = box.value.scrollHeight
}

function scrolled() {
  if (!box.value) return
  follow.value = box.value.scrollHeight - box.value.scrollTop - box.value.clientHeight < 24
}

watch(() => [props.text, props.lines?.length, props.lines?.at(-1)], () => { if (follow.value) nextTick(toEnd) }, { immediate: true })
watch(follow, value => { if (value) nextTick(toEnd) })
</script>

<template>
  <pre v-if="!lines" ref="box" :class="['t-log', { 't-fill': fill }]" :style="fill ? undefined : { maxHeight }" @scroll="scrolled">{{ text || empty }}</pre>
  <div v-else ref="box" :class="['t-log', { 't-fill': fill }]" :style="fill ? undefined : { maxHeight }" role="log" @scroll="scrolled">
    <p v-if="!lines.length" class="text-secondary m-0">{{ empty }}</p>
    <div v-for="(line, i) in lines" :key="line.id ?? i" class="t-log-line">
      <span v-if="line.time" class="t-log-time">{{ line.time }}</span>
      <span :class="line.level && levels[line.level]">{{ line.text }}</span>
    </div>
  </div>
</template>
