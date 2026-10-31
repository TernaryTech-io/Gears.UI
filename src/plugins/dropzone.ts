// Loads Dropzone, the first time a TDropzone is shown. Dropzone 6's module build doesn't look for
// dropzones in the page; TDropzone creates them.
import { once } from './once'

export const loadDropzone = once(async () => (await import('dropzone')).default)
