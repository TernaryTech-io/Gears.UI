<script setup lang="ts">
// A dialog over the page, opened with v-model:open. Its content renders only while it's open.
// Without `dismissible`, Esc and the backdrop don't close it (for a step that must be finished).
import { ref } from 'vue'
import { Modal } from '@tabler/core'
import { useOverlay } from '../composables/useOverlay'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  dismissible?: boolean
  scrollable?: boolean
}>(), { size: 'md', dismissible: true })

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ 'after-leave': [] }>()

const el = ref<HTMLElement>()
const rendered = useOverlay(el, 'modal', open,
  element => new Modal(element, { backdrop: props.dismissible ? true : 'static', keyboard: props.dismissible }),
  () => emit('after-leave'))

const sizes = { sm: 'modal-sm', md: '', lg: 'modal-lg', xl: 'modal-xl', full: 'modal-full-width' }
const close = () => { open.value = false }
</script>

<template>
  <Teleport to="body">
    <div ref="el" class="modal modal-blur fade" tabindex="-1" :aria-label="title" aria-modal="true" role="dialog">
      <div :class="['modal-dialog modal-dialog-centered', sizes[size], { 'modal-dialog-scrollable': scrollable }]">
        <div v-if="rendered" class="modal-content">
          <div v-if="title || $slots.header" class="modal-header">
            <slot name="header">
              <div class="min-w-0">
                <h5 class="modal-title">{{ title }}</h5>
                <p v-if="description" class="text-secondary small mb-0 mt-1">{{ description }}</p>
              </div>
            </slot>
            <button v-if="dismissible" type="button" class="btn-close" aria-label="Close" @click="close" />
          </div>
          <div class="modal-body">
            <slot :close="close" />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" :close="close" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
