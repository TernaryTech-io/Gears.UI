<script setup lang="ts">
// An HTTP method as a badge, each in its own color: GET info, POST success, PUT warning, PATCH
// primary, DELETE error, others neutral. The method's name is always shown, so the color only
// helps. Monospaced and of one width, so paths beside a column of them line up.
import { computed } from 'vue'
import TBadge from './TBadge.vue'
import type { Color } from '../types'

const props = withDefaults(defineProps<{
  method: string
  variant?: 'soft' | 'solid' | 'outline'
}>(), { variant: 'soft' })

const colors: Record<string, Color> = { GET: 'info', POST: 'success', PUT: 'warning', PATCH: 'primary', DELETE: 'error' }

const name = computed(() => props.method.toUpperCase())
</script>

<template>
  <TBadge :color="colors[name] ?? 'neutral'" :variant="variant" :label="name" class="t-method-badge" />
</template>
