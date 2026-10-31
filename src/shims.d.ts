// Types for module files that ship without their own declarations next to them.

declare module '@tabler/core/dist/js/tabler-vector-map.esm.js' {
  export { default as VectorMap } from '@tabler/core/dist/types/src/vector-map'
}

declare module '@tabler/core/dist/js/maps/world.esm.js' {
  import type { VectorMapData } from '@tabler/core/dist/types/src/vector-map'
  export const world: VectorMapData
}

// HugeRTE's models, themes, icons, skins and plugins register themselves with the editor.
declare module 'hugerte/models/*'
declare module 'hugerte/themes/*'
declare module 'hugerte/icons/*'
declare module 'hugerte/skins/*'
declare module 'hugerte/plugins/*'
