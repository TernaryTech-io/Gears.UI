// Runs a loader once; later calls get the same promise.
export function once<T>(load: () => Promise<T>) {
  let promise: Promise<T> | undefined
  return () => promise ??= load()
}

// Tabler's wrappers for the date picker, input mask and sortable find their library on `window`.
export const globals = window as unknown as { VanillaCalendarPro?: unknown; IMask?: unknown; Sortable?: unknown }
