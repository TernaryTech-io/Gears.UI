<script setup lang="ts">
// Shows the toasts added with useToast(), stacked where each asks to be (`position`), or where this
// says: a bottom or top corner, or the middle of the top or bottom. Put one in the app's frame.
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import { useToast, type Toast, type ToastPosition } from '../composables/useToast'
import { toTabler } from '../types'

const props = withDefaults(defineProps<{ position?: ToastPosition }>(), { position: 'bottom-end' })

const { toasts, remove } = useToast()

const places: Record<ToastPosition, string> = {
  'top-start': 'top-0 start-0',
  'top-center': 'top-0 start-50 translate-middle-x',
  'top-end': 'top-0 end-0',
  'bottom-start': 'bottom-0 start-0',
  'bottom-center': 'bottom-0 start-50 translate-middle-x',
  'bottom-end': 'bottom-0 end-0'
}
const stacks = computed(() => {
  const by = new Map<ToastPosition, Toast[]>()
  for (const toast of toasts.value) {
    const at = toast.position ?? props.position
    by.set(at, [...(by.get(at) ?? []), toast])
  }
  return [...by].map(([position, list]) => ({ position, list }))
})
const iconClass = (toast: Toast) => (toast.accent ? 't-toast-accent-icon' : toast.color && toast.color !== 'neutral' ? `text-${toTabler(toast.color)}` : 'text-secondary')
</script>

<template>
  <Teleport to="body">
    <div v-for="stack in stacks" :key="stack.position" :class="['toast-container position-fixed p-3', places[stack.position]]" aria-live="polite">
      <TransitionGroup name="t-toast">
        <div v-for="toast in stack.list" :key="toast.id" :class="['toast show t-toast', { 't-toast-accent': toast.accent, 't-toast-clickable': toast.onClick }]"
          :style="toast.accent ? { '--t-toast-accent': toast.accent } : undefined" role="status">
          <div class="toast-body d-flex align-items-start gap-2">
            <TIcon v-if="toast.icon" :name="toast.icon" :class="['mt-1', iconClass(toast)]" />
            <component :is="toast.onClick ? 'button' : 'div'" :type="toast.onClick ? 'button' : undefined" class="flex-fill min-w-0 t-toast-text"
              @click="toast.onClick?.()">
              <div class="fw-medium">{{ toast.title }}</div>
              <div v-if="toast.description" class="text-secondary small mt-1">{{ toast.description }}</div>
            </component>
            <button type="button" class="btn-close ms-2" aria-label="Close" @click="remove(toast.id)" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.t-toast-accent { border-inline-start: 3px solid var(--t-toast-accent); }
.t-toast-accent-icon { color: var(--t-toast-accent); }
.t-toast-text { text-align: start; padding: 0; border: 0; background: none; color: inherit; font: inherit; }
.t-toast-clickable .t-toast-text { cursor: pointer; }
</style>
