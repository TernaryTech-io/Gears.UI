<script setup lang="ts">
// A Tabler icon from the webfont, by name ("plus", "player-play"; a "ti-" prefix is allowed). It
// takes the size and color of the text around it. Browse names at https://tabler.io/icons.
import { computed } from 'vue'

const props = defineProps<{ name: string; spin?: boolean }>()
const glyph = computed(() => 'ti-' + props.name.replace(/^ti-/, ''))
</script>

<template>
  <i :class="['ti', glyph, 'icon', { 'ti-spin': spin }]" aria-hidden="true" />
</template>
