<script setup lang="ts">
// A page's header (pretitle, title, description, actions on the right) and body. Bodies are capped
// in width; `narrow` suits forms and wizards, `wide` uses the whole width. `fill` pages take the
// height left and scroll inside their own panels; `flush` pages also drop the header and padding,
// for work sections that bring their own panels (TSectionLayout).
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  pretitle?: string
  description?: string
  fill?: boolean
  flush?: boolean
  wide?: boolean
  narrow?: boolean
}>()

const container = computed(() => props.narrow ? 'container-narrow' : props.wide || props.fill ? 'container-fluid' : 'container-xl')
</script>

<template>
  <div :class="['t-page', { 't-page-fill t-fill': fill || flush }]">
    <div v-if="!flush && (title || $slots.header || $slots.actions)" class="page-header d-print-none">
      <div :class="container">
        <div class="row g-2 align-items-center">
          <div class="col">
            <slot name="header">
              <div v-if="pretitle" class="page-pretitle">{{ pretitle }}</div>
              <h2 class="page-title">{{ title }}</h2>
              <div v-if="description" class="text-secondary mt-1">{{ description }}</div>
            </slot>
          </div>
          <div v-if="$slots.actions" class="col-auto ms-auto d-print-none">
            <div class="btn-list">
              <slot name="actions" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot v-if="flush" />
    <div v-else :class="['page-body', { 't-fill': fill }]">
      <div :class="[container, { 't-fill': fill }]">
        <slot />
      </div>
    </div>
  </div>
</template>
