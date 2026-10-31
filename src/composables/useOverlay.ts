// Drives a Bootstrap modal or offcanvas from a v-model: opening the model shows it, and closing it
// any way (the close button, Esc, the backdrop) sets the model back. Content renders while it's
// open and until it has faded out.
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

interface Overlay {
  show(): void
  hide(): void
  dispose(): void
}

export function useOverlay(el: Ref<HTMLElement | undefined>, kind: 'modal' | 'offcanvas', open: Ref<boolean>,
  create: (el: HTMLElement) => Overlay, afterLeave: () => void) {
  const rendered = ref(open.value)
  let overlay: Overlay | null = null
  let shown = false

  onMounted(() => {
    const element = el.value!
    overlay = create(element)
    element.addEventListener(`show.bs.${kind}`, () => { shown = true })
    element.addEventListener(`hide.bs.${kind}`, () => {
      shown = false
      if (open.value) open.value = false
    })
    element.addEventListener(`hidden.bs.${kind}`, () => {
      if (!open.value) rendered.value = false
      afterLeave()
    })
    if (open.value) overlay.show()
  })

  watch(open, value => {
    if (value) {
      rendered.value = true
      overlay?.show()
    } else {
      overlay?.hide()
    }
  })

  onBeforeUnmount(() => {
    overlay?.dispose()
    // Bootstrap leaves its backdrop and scroll lock behind when an open overlay is disposed.
    if (shown) {
      document.querySelectorAll(`.${kind}-backdrop`).forEach(backdrop => backdrop.remove())
      document.body.classList.remove('modal-open')
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('padding-right')
    }
  })

  return rendered
}
