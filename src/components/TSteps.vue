<script setup lang="ts">
// A wizard's progress: the steps, with the current one bound by v-model (from 0). Steps already
// done can be clicked to go back to them.
import { toTabler, type Color, type StepItem } from '../types'

withDefaults(defineProps<{ items: StepItem[]; color?: Color; counter?: boolean }>(), { color: 'primary', counter: true })

const step = defineModel<number>({ default: 0 })
</script>

<template>
  <div :class="['steps', `steps-${toTabler(color)}`, { 'steps-counter': counter }]">
    <component :is="i < step ? 'a' : 'span'" v-for="(item, i) in items" :key="i" :href="i < step ? '#' : undefined"
      :class="['step-item', { active: i === step }]" :aria-current="i === step ? 'step' : undefined" @click.prevent="i < step && (step = i)">
      <span class="d-block">{{ item.title }}</span>
      <span v-if="item.description" class="d-block small text-secondary fw-normal">{{ item.description }}</span>
    </component>
  </div>
</template>
