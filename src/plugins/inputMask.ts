// Loads IMask and Tabler's input mask, the first time a TInputMask is shown.
import { globals, once } from './once'

export const loadInputMask = once(async () => {
  globals.IMask = (await import('imask')).default
  return (await import('@tabler/core')).InputMask
})
