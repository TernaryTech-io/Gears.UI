// Gears UI: Vue components on Tabler. Import the styles once (`@gears/ui/styles.css`, and
// `@gears/ui/plugins.css` for the plugin components), then either install the plugin (registers
// every component globally) or import components one by one. TCodeEditor and the plugin components
// (TAdvancedSelect, TColorPicker, TDatePicker, TDropzone, TInputMask, TRangeSlider, TRichEditor,
// TSortable) need their library installed; each loads it the first time it's shown.
import type { App } from 'vue'
import TAdvancedSelect from './components/TAdvancedSelect.vue'
import TAlert from './components/TAlert.vue'
import TAuthLayout from './components/TAuthLayout.vue'
import TAvatar from './components/TAvatar.vue'
import TBadge from './components/TBadge.vue'
import TButton from './components/TButton.vue'
import TCard from './components/TCard.vue'
import TCheckbox from './components/TCheckbox.vue'
import TCodeEditor from './components/TCodeEditor.vue'
import TColorModeButton from './components/TColorModeButton.vue'
import TColorPicker from './components/TColorPicker.vue'
import TCopyButton from './components/TCopyButton.vue'
import TDatePicker from './components/TDatePicker.vue'
import TDropdown from './components/TDropdown.vue'
import TDropzone from './components/TDropzone.vue'
import TEmpty from './components/TEmpty.vue'
import TFieldGroup from './components/TFieldGroup.vue'
import TFormField from './components/TFormField.vue'
import TIcon from './components/TIcon.vue'
import TInput from './components/TInput.vue'
import TInputMask from './components/TInputMask.vue'
import TInputTags from './components/TInputTags.vue'
import TLogView from './components/TLogView.vue'
import TModal from './components/TModal.vue'
import TNav from './components/TNav.vue'
import TPage from './components/TPage.vue'
import TPagination from './components/TPagination.vue'
import TPanelList from './components/TPanelList.vue'
import TProgress from './components/TProgress.vue'
import TRadioGroup from './components/TRadioGroup.vue'
import TRangeSlider from './components/TRangeSlider.vue'
import TRichEditor from './components/TRichEditor.vue'
import TSectionLayout from './components/TSectionLayout.vue'
import TSelect from './components/TSelect.vue'
import TSelectMenu from './components/TSelectMenu.vue'
import TSeparator from './components/TSeparator.vue'
import TShell from './components/TShell.vue'
import TSkeleton from './components/TSkeleton.vue'
import TSlideover from './components/TSlideover.vue'
import TSortable from './components/TSortable.vue'
import TSpinner from './components/TSpinner.vue'
import TSplitter from './components/TSplitter.vue'
import TStatCard from './components/TStatCard.vue'
import TSteps from './components/TSteps.vue'
import TSwitch from './components/TSwitch.vue'
import TTable from './components/TTable.vue'
import TTabs from './components/TTabs.vue'
import TTextarea from './components/TTextarea.vue'
import TTooltip from './components/TTooltip.vue'
import TTopbar from './components/TTopbar.vue'
import TVectorMap from './components/TVectorMap.vue'

export {
  TAdvancedSelect,
  TAlert,
  TAuthLayout,
  TAvatar,
  TBadge,
  TButton,
  TCard,
  TCheckbox,
  TCodeEditor,
  TColorModeButton,
  TColorPicker,
  TCopyButton,
  TDatePicker,
  TDropdown,
  TDropzone,
  TEmpty,
  TFieldGroup,
  TFormField,
  TIcon,
  TInput,
  TInputMask,
  TInputTags,
  TLogView,
  TModal,
  TNav,
  TPage,
  TPagination,
  TPanelList,
  TProgress,
  TRadioGroup,
  TRangeSlider,
  TRichEditor,
  TSectionLayout,
  TSelect,
  TSelectMenu,
  TSeparator,
  TShell,
  TSkeleton,
  TSlideover,
  TSortable,
  TSpinner,
  TSplitter,
  TStatCard,
  TSteps,
  TSwitch,
  TTable,
  TTabs,
  TTextarea,
  TTooltip,
  TTopbar,
  TVectorMap
}

export * from './types'
export { useColorMode, type ColorMode } from './composables/useColorMode'
export { useField } from './composables/useField'
export type { RichEditorPlugin } from './plugins'

const components = {
  TAdvancedSelect, TAlert, TAuthLayout, TAvatar, TBadge, TButton, TCard, TCheckbox, TCodeEditor,
  TColorModeButton, TColorPicker, TCopyButton, TDatePicker, TDropdown, TDropzone, TEmpty,
  TFieldGroup, TFormField, TIcon, TInput, TInputMask, TInputTags, TLogView, TModal, TNav, TPage,
  TPagination, TPanelList, TProgress, TRadioGroup, TRangeSlider, TRichEditor, TSectionLayout,
  TSelect, TSelectMenu, TSeparator, TShell, TSkeleton, TSlideover, TSortable, TSpinner, TSplitter,
  TStatCard, TSteps, TSwitch, TTable, TTabs, TTextarea, TTooltip, TTopbar, TVectorMap
}

export default {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) app.component(name, component)
  }
}

declare module 'vue' {
  export interface GlobalComponents {
    TAdvancedSelect: typeof TAdvancedSelect
    TAlert: typeof TAlert
    TAuthLayout: typeof TAuthLayout
    TAvatar: typeof TAvatar
    TBadge: typeof TBadge
    TButton: typeof TButton
    TCard: typeof TCard
    TCheckbox: typeof TCheckbox
    TCodeEditor: typeof TCodeEditor
    TColorModeButton: typeof TColorModeButton
    TColorPicker: typeof TColorPicker
    TCopyButton: typeof TCopyButton
    TDatePicker: typeof TDatePicker
    TDropdown: typeof TDropdown
    TDropzone: typeof TDropzone
    TEmpty: typeof TEmpty
    TFieldGroup: typeof TFieldGroup
    TFormField: typeof TFormField
    TIcon: typeof TIcon
    TInput: typeof TInput
    TInputMask: typeof TInputMask
    TInputTags: typeof TInputTags
    TLogView: typeof TLogView
    TModal: typeof TModal
    TNav: typeof TNav
    TPage: typeof TPage
    TPagination: typeof TPagination
    TPanelList: typeof TPanelList
    TProgress: typeof TProgress
    TRadioGroup: typeof TRadioGroup
    TRangeSlider: typeof TRangeSlider
    TRichEditor: typeof TRichEditor
    TSectionLayout: typeof TSectionLayout
    TSelect: typeof TSelect
    TSelectMenu: typeof TSelectMenu
    TSeparator: typeof TSeparator
    TShell: typeof TShell
    TSkeleton: typeof TSkeleton
    TSlideover: typeof TSlideover
    TSortable: typeof TSortable
    TSpinner: typeof TSpinner
    TSplitter: typeof TSplitter
    TStatCard: typeof TStatCard
    TSteps: typeof TSteps
    TSwitch: typeof TSwitch
    TTable: typeof TTable
    TTabs: typeof TTabs
    TTextarea: typeof TTextarea
    TTooltip: typeof TTooltip
    TTopbar: typeof TTopbar
    TVectorMap: typeof TVectorMap
  }
}
