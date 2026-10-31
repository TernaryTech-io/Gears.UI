// Short notices in the corner ("Saved.", "Deleted."), shown by a TToaster in the app's frame:
// `useToast().add({ title, description, color, icon })`. They close by themselves after
// `duration` milliseconds (5 seconds; 0 keeps one until it's closed).
import { ref } from 'vue'
import type { Color } from '../types'

export interface Toast {
  id: number
  title: string
  description?: string
  color?: Color
  icon?: string
  duration?: number
}

const toasts = ref<Toast[]>([])
let nextId = 1

function remove(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function add(toast: Omit<Toast, 'id'>) {
  const id = nextId++
  toasts.value = [...toasts.value, { ...toast, id }]
  const duration = toast.duration ?? 5000
  if (duration > 0) setTimeout(() => remove(id), duration)
  return id
}

export function useToast() {
  return { toasts, add, remove }
}
