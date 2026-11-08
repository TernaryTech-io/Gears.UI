// Gears UI's plugin components, on the libraries Tabler's plugins use. Each library is an optional
// peer dependency that loads the first time its component is shown. Installing this plugin needs
// all of them; to use only some, import those components from `@ternarytech-io/gears-ui/components/…` instead.
import type { App } from 'vue'
import TAdvancedSelect from '../components/TAdvancedSelect.vue'
import TChart from '../components/TChart.vue'
import TColorPicker from '../components/TColorPicker.vue'
import TDatePicker from '../components/TDatePicker.vue'
import TDropzone from '../components/TDropzone.vue'
import TInputMask from '../components/TInputMask.vue'
import TPdfViewer from '../components/TPdfViewer.vue'
import TRangeSlider from '../components/TRangeSlider.vue'
import TRichEditor from '../components/TRichEditor.vue'
import TSortable from '../components/TSortable.vue'
import TSortableTree from '../components/TSortableTree.vue'

export {
  TAdvancedSelect,
  TChart,
  TColorPicker,
  TDatePicker,
  TDropzone,
  TInputMask,
  TPdfViewer,
  TRangeSlider,
  TRichEditor,
  TSortable,
  TSortableTree
}

export type { RichEditorPlugin } from './richEditor'
export type { PdfZoom } from '../components/TPdfViewer.vue'

const components = {
  TAdvancedSelect, TChart, TColorPicker, TDatePicker, TDropzone, TInputMask, TPdfViewer, TRangeSlider, TRichEditor,
  TSortable, TSortableTree
}

export const GearsUIPlugins = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) app.component(name, component)
  }
}

declare module 'vue' {
  export interface GlobalComponents {
    TAdvancedSelect: typeof TAdvancedSelect
    TChart: typeof TChart
    TColorPicker: typeof TColorPicker
    TDatePicker: typeof TDatePicker
    TDropzone: typeof TDropzone
    TInputMask: typeof TInputMask
    TPdfViewer: typeof TPdfViewer
    TRangeSlider: typeof TRangeSlider
    TRichEditor: typeof TRichEditor
    TSortable: typeof TSortable
    TSortableTree: typeof TSortableTree
  }
}
