// Loads Vanilla Calendar Pro and Tabler's date picker, the first time a TDatePicker is shown.
import { globals, once } from './once'

export const loadDatepicker = once(async () => {
  globals.VanillaCalendarPro = await import('vanilla-calendar-pro')
  return (await import('@tabler/core')).Datepicker
})
