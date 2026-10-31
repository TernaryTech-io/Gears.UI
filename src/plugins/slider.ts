// Loads noUiSlider, the first time a TRangeSlider is shown.
import { once } from './once'

export const loadSlider = once(async () => (await import('nouislider')).default)
