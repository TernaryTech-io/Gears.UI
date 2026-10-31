<script setup lang="ts">
// Shows the toasts added with useToast(), stacked in the bottom corner. Put one in the app's frame.
import TIcon from './TIcon.vue'
import { useToast } from '../composables/useToast'
import { toTabler } from '../types'

const { toasts, remove } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite">
      <TransitionGroup name="t-toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast show t-toast" role="status">
          <div class="toast-body d-flex align-items-start gap-2">
            <TIcon v-if="toast.icon" :name="toast.icon" :class="['mt-1', toast.color && toast.color !== 'neutral' ? `text-${toTabler(toast.color)}` : 'text-secondary']" />
            <div class="flex-fill min-w-0">
              <div class="fw-medium">{{ toast.title }}</div>
              <div v-if="toast.description" class="text-secondary small mt-1">{{ toast.description }}</div>
            </div>
            <button type="button" class="btn-close ms-2" aria-label="Close" @click="remove(toast.id)" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
