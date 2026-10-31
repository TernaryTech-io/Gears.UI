/// <reference path="../shims.d.ts" />
// Loads the plugin components' libraries the first time one is shown, so an app downloads only the
// ones it uses (each is an optional peer dependency). Only the `@gears/ui/plugins` entry reaches
// this module, so apps that don't use it never need these libraries. Tabler's own wrappers for the date picker,
// input mask and sortable find their library on `window`, so those loaders put it there.

type Globals = { VanillaCalendarPro?: unknown; IMask?: unknown; Sortable?: unknown }
const globals = window as unknown as Globals

const once = <T>(load: () => Promise<T>) => {
  let promise: Promise<T> | undefined
  return () => promise ??= load()
}

export const loadDatepicker = once(async () => {
  globals.VanillaCalendarPro = await import('vanilla-calendar-pro')
  return (await import('@tabler/core')).Datepicker
})

export const loadInputMask = once(async () => {
  globals.IMask = (await import('imask')).default
  return (await import('@tabler/core')).InputMask
})

export const loadSortable = once(async () => {
  globals.Sortable = (await import('sortablejs')).default
  return (await import('@tabler/core')).Sortable
})

export const loadTomSelect = once(async () => (await import('tom-select')).default)

export const loadColoris = once(async () => {
  const Coloris = (await import('@melloware/coloris')).default
  Coloris.init()
  return Coloris
})

// Dropzone 6's module build doesn't look for dropzones in the page; TDropzone creates them.
export const loadDropzone = once(async () => (await import('dropzone')).default)

export const loadSlider = once(async () => (await import('nouislider')).default)


// HugeRTE with everything bundled: theme, model, icons, both skins and both content styles, and
// the plugins TRichEditor offers. Skins are registered as resources, so nothing is fetched.
export const richEditorPlugins = {
  advlist: () => import('hugerte/plugins/advlist'),
  autolink: () => import('hugerte/plugins/autolink'),
  autoresize: () => import('hugerte/plugins/autoresize'),
  code: () => import('hugerte/plugins/code'),
  codesample: () => import('hugerte/plugins/codesample'),
  fullscreen: () => import('hugerte/plugins/fullscreen'),
  image: () => import('hugerte/plugins/image'),
  link: () => import('hugerte/plugins/link'),
  lists: () => import('hugerte/plugins/lists'),
  searchreplace: () => import('hugerte/plugins/searchreplace'),
  table: () => import('hugerte/plugins/table'),
  wordcount: () => import('hugerte/plugins/wordcount')
}
export type RichEditorPlugin = keyof typeof richEditorPlugins

export const loadRichEditor = once(async () => {
  const hugerte = (await import('hugerte')).default
  await Promise.all([
    import('hugerte/models/dom'),
    import('hugerte/themes/silver'),
    import('hugerte/icons/default'),
    import('hugerte/skins/ui/oxide/skin.js'),
    import('hugerte/skins/ui/oxide/content.js'),
    import('hugerte/skins/ui/oxide-dark/skin.js'),
    import('hugerte/skins/ui/oxide-dark/content.js'),
    import('hugerte/skins/content/default/content.js'),
    import('hugerte/skins/content/dark/content.js'),
    ...Object.values(richEditorPlugins).map(load => load())
  ])
  return hugerte
})
