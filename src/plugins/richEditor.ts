/// <reference path="../shims.d.ts" />
import { once } from './once'

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
