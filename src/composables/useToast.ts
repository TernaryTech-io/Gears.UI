// Short notices ("Saved.", "Deleted."), shown by a TToaster in the app's frame:
// `useToast().add({ title, description, color, icon })`. They close by themselves after
// `duration` milliseconds (5 seconds; 0 keeps one until it's closed), and always have a close
// button. `color` is a preset (neutral, success, warning, error, info, primary); `accent` is any CSS
// color instead, for the icon and the edge. `position` puts it in a corner, or the middle of the top
// or bottom (the TToaster's `position` when left out). `onClick` makes it clickable; `onClose` is
// called however it closes.
import { ref } from 'vue'
import type { Color } from '../types'

export type ToastPosition = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end'

export interface Toast {
  id: number
  title: string
  description?: string
  color?: Color
  /** A CSS color (#d63939, rgb(…), var(--tblr-…)) for the icon and the edge, instead of `color`. */
  accent?: string
  icon?: string
  duration?: number
  position?: ToastPosition
  onClick?: () => void
  onClose?: () => void
}

const toasts = ref<Toast[]>([])
let nextId = 1
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function remove(id: number) {
  const toast = toasts.value.find(t => t.id === id)
  if (!toast) return
  clearTimeout(timers.get(id))
  timers.delete(id)
  toasts.value = toasts.value.filter(t => t.id !== id)
  toast.onClose?.()
}

function add(toast: Omit<Toast, 'id'>) {
  const id = nextId++
  toasts.value = [...toasts.value, { ...toast, id }]
  const duration = toast.duration ?? 5000
  if (duration > 0) timers.set(id, setTimeout(() => remove(id), duration))
  return id
}

/** Closes every toast. */
function clear() {
  for (const t of [...toasts.value]) remove(t.id)
}

export function useToast() {
  return { toasts, add, remove, clear }
}
