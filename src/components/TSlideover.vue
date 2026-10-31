<script setup lang="ts">
// A panel that slides in from an edge, opened with v-model:open: details or a form beside the page.
import { ref } from 'vue'
import { Offcanvas } from '@tabler/core'
import { useOverlay } from '../composables/useOverlay'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  side?: 'start' | 'end' | 'top' | 'bottom'
  dismissible?: boolean
}>(), { side: 'end', dismissible: true })

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ 'after-leave': [] }>()

const el = ref<HTMLElement>()
const rendered = useOverlay(el, 'offcanvas', open,
  element => new Offcanvas(element, { backdrop: props.dismissible ? true : 'static', keyboard: props.dismissible }),
  () => emit('after-leave'))

const close = () => { open.value = false }
</script>

<template>
  <Teleport to="body">
    <div ref="el" :class="['offcanvas', `offcanvas-${side}`]" tabindex="-1" :aria-label="title" role="dialog">
      <template v-if="rendered">
        <div v-if="title || $slots.header" class="offcanvas-header border-bottom">
          <slot name="header">
            <div class="min-w-0">
              <h2 class="offcanvas-title">{{ title }}</h2>
              <p v-if="description" class="text-secondary small mb-0 mt-1">{{ description }}</p>
            </div>
          </slot>
          <button v-if="dismissible" type="button" class="btn-close" aria-label="Close" @click="close" />
        </div>
        <div class="offcanvas-body">
          <slot :close="close" />
        </div>
        <div v-if="$slots.footer" class="border-top p-3 d-flex justify-content-end gap-2">
          <slot name="footer" :close="close" />
        </div>
      </template>
    </div>
  </Teleport>
</template>
