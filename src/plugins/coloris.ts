// Loads Coloris, the first time a TColorPicker is shown.
import { once } from './once'

export const loadColoris = once(async () => {
  const Coloris = (await import('@melloware/coloris')).default
  Coloris.init()
  return Coloris
})
