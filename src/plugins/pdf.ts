// Loads PDF.js (Mozilla, Apache-2.0) the first time a TPdfViewer is shown, with its worker (which
// reads the PDF off the page's thread). The worker's address comes from the bundler (Vite's `?url`).
import { once } from './once'

export const loadPdfJs = once(async () => {
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url')
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  return pdfjs
})
