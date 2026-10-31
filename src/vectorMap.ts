/// <reference path="./shims.d.ts" />
// Loads Tabler's vector map and the world map data the first time a TVectorMap is shown. Both ship
// with @tabler/core, so this needs no optional library.
let promise: Promise<typeof import('@tabler/core/dist/js/tabler-vector-map.esm.js').VectorMap> | undefined

export function loadVectorMap() {
  return promise ??= Promise.all([
    import('@tabler/core/dist/js/tabler-vector-map.esm.js'),
    import('@tabler/core/dist/js/maps/world.esm.js')
  ]).then(([{ VectorMap }, { world }]) => {
    VectorMap.addMap('world', world)
    return VectorMap
  })
}
