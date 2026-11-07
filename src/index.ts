// Gears UI: Vue components on Tabler. Import the styles once (`@ternarytech-io/gears-ui/styles.css`), then either
// install the plugin (registers every component globally) or import components one by one.
// Components that need an optional library have their own entry points, so apps that don't use
// them don't need the library: `@ternarytech-io/gears-ui/code-editor` (Monaco) and `@ternarytech-io/gears-ui/plugins` (Tom
// Select, Coloris, Vanilla Calendar Pro, Dropzone, IMask, noUiSlider, SortableJS, HugeRTE).
import type { App } from 'vue'
import TAccentPicker from './components/TAccentPicker.vue'
import TAdvancedTable from './components/TAdvancedTable.vue'
import TAlert from './components/TAlert.vue'
import TAppLayout from './components/TAppLayout.vue'
import TAuthLayout from './components/TAuthLayout.vue'
import TAvatar from './components/TAvatar.vue'
import TBadge from './components/TBadge.vue'
import TButton from './components/TButton.vue'
import TCard from './components/TCard.vue'
import TCheckbox from './components/TCheckbox.vue'
import TColorModeButton from './components/TColorModeButton.vue'
import TCommandPalette from './components/TCommandPalette.vue'
import TContainerPicker from './components/TContainerPicker.vue'
import TCopyButton from './components/TCopyButton.vue'
import TDataGrid from './components/TDataGrid.vue'
import TDataGridItem from './components/TDataGridItem.vue'
import TDensityPicker from './components/TDensityPicker.vue'
import TDropdown from './components/TDropdown.vue'
import TEditableTable from './components/TEditableTable.vue'
import TEmpty from './components/TEmpty.vue'
import TFieldGroup from './components/TFieldGroup.vue'
import TFileUpload from './components/TFileUpload.vue'
import TFontPicker from './components/TFontPicker.vue'
import TFormField from './components/TFormField.vue'
import TIcon from './components/TIcon.vue'
import TIconPicker from './components/TIconPicker.vue'
import TImageUpload from './components/TImageUpload.vue'
import TInput from './components/TInput.vue'
import TInputNumber from './components/TInputNumber.vue'
import TInputTags from './components/TInputTags.vue'
import TLogView from './components/TLogView.vue'
import TModal from './components/TModal.vue'
import TNav from './components/TNav.vue'
import TNavPositionPicker from './components/TNavPositionPicker.vue'
import TPage from './components/TPage.vue'
import TPagination from './components/TPagination.vue'
import TPanelList from './components/TPanelList.vue'
import TProgress from './components/TProgress.vue'
import TRadioGroup from './components/TRadioGroup.vue'
import TRadiusPicker from './components/TRadiusPicker.vue'
import TRating from './components/TRating.vue'
import TScaledFrame from './components/TScaledFrame.vue'
import TSearchButton from './components/TSearchButton.vue'
import TSectionLayout from './components/TSectionLayout.vue'
import TSelect from './components/TSelect.vue'
import TSelectMenu from './components/TSelectMenu.vue'
import TSeparator from './components/TSeparator.vue'
import TShell from './components/TShell.vue'
import TSkeleton from './components/TSkeleton.vue'
import TSlideover from './components/TSlideover.vue'
import TSparkline from './components/TSparkline.vue'
import TSpinner from './components/TSpinner.vue'
import TSplitter from './components/TSplitter.vue'
import TStatCard from './components/TStatCard.vue'
import TSteps from './components/TSteps.vue'
import TSwitch from './components/TSwitch.vue'
import TTable from './components/TTable.vue'
import TTabs from './components/TTabs.vue'
import TTextarea from './components/TTextarea.vue'
import TThemeBasePicker from './components/TThemeBasePicker.vue'
import TThemeScope from './components/TThemeScope.vue'
import TToaster from './components/TToaster.vue'
import TTooltip from './components/TTooltip.vue'
import TTopbar from './components/TTopbar.vue'
import TVectorMap from './components/TVectorMap.vue'

export {
  TAccentPicker,
  TAdvancedTable,
  TAlert,
  TAppLayout,
  TAuthLayout,
  TAvatar,
  TBadge,
  TButton,
  TCard,
  TCheckbox,
  TColorModeButton,
  TCommandPalette,
  TContainerPicker,
  TCopyButton,
  TDataGrid,
  TDataGridItem,
  TDensityPicker,
  TDropdown,
  TEditableTable,
  TEmpty,
  TFieldGroup,
  TFileUpload,
  TFontPicker,
  TFormField,
  TIcon,
  TIconPicker,
  TImageUpload,
  TInput,
  TInputNumber,
  TInputTags,
  TLogView,
  TModal,
  TNav,
  TNavPositionPicker,
  TPage,
  TPagination,
  TPanelList,
  TProgress,
  TRadioGroup,
  TRadiusPicker,
  TRating,
  TScaledFrame,
  TSearchButton,
  TSectionLayout,
  TSelect,
  TSelectMenu,
  TSeparator,
  TShell,
  TSkeleton,
  TSlideover,
  TSparkline,
  TSpinner,
  TSplitter,
  TStatCard,
  TSteps,
  TSwitch,
  TTable,
  TTabs,
  TTextarea,
  TThemeBasePicker,
  TThemeScope,
  TToaster,
  TTooltip,
  TTopbar,
  TVectorMap
}

export * from './types'
export { isCustomAccent, themeAccents, themeBases, themeContainers, themeDensities, themeFonts, themeNavs, themeRadii, themeRadiusSizes } from './theme'
export { useColorMode, type ColorMode } from './composables/useColorMode'
export { useCommandPalette } from './composables/useCommandPalette'
export { useField } from './composables/useField'
export { useToast, type Toast } from './composables/useToast'

const components = {
  TAccentPicker, TAdvancedTable, TAlert, TAppLayout, TAuthLayout, TAvatar, TBadge, TButton, TCard,
  TCheckbox, TColorModeButton, TCommandPalette, TContainerPicker, TCopyButton, TDataGrid, TDataGridItem, TDensityPicker,
  TDropdown, TEditableTable, TEmpty, TFieldGroup, TFileUpload, TFontPicker, TFormField, TIcon, TIconPicker, TImageUpload,
  TInput, TInputNumber, TInputTags, TLogView, TModal, TNav, TNavPositionPicker, TPage, TPagination,
  TPanelList, TProgress, TRadioGroup, TRadiusPicker, TRating, TScaledFrame, TSearchButton, TSectionLayout,
  TSelect, TSelectMenu, TSeparator, TShell, TSkeleton, TSlideover, TSparkline, TSpinner, TSplitter, TStatCard,
  TSteps, TSwitch, TTable, TTabs, TTextarea, TThemeBasePicker, TThemeScope, TToaster, TTooltip,
  TTopbar, TVectorMap
}

export default {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) app.component(name, component)
  }
}

declare module 'vue' {
  export interface GlobalComponents {
    TAccentPicker: typeof TAccentPicker
    TAdvancedTable: typeof TAdvancedTable
    TAlert: typeof TAlert
    TAppLayout: typeof TAppLayout
    TAuthLayout: typeof TAuthLayout
    TAvatar: typeof TAvatar
    TBadge: typeof TBadge
    TButton: typeof TButton
    TCard: typeof TCard
    TCheckbox: typeof TCheckbox
    TColorModeButton: typeof TColorModeButton
    TCommandPalette: typeof TCommandPalette
    TContainerPicker: typeof TContainerPicker
    TCopyButton: typeof TCopyButton
    TDataGrid: typeof TDataGrid
    TDataGridItem: typeof TDataGridItem
    TDensityPicker: typeof TDensityPicker
    TDropdown: typeof TDropdown
    TEditableTable: typeof TEditableTable
    TEmpty: typeof TEmpty
    TFieldGroup: typeof TFieldGroup
    TFileUpload: typeof TFileUpload
    TFontPicker: typeof TFontPicker
    TFormField: typeof TFormField
    TIcon: typeof TIcon
    TIconPicker: typeof TIconPicker
    TImageUpload: typeof TImageUpload
    TInput: typeof TInput
    TInputNumber: typeof TInputNumber
    TInputTags: typeof TInputTags
    TLogView: typeof TLogView
    TModal: typeof TModal
    TNav: typeof TNav
    TNavPositionPicker: typeof TNavPositionPicker
    TPage: typeof TPage
    TPagination: typeof TPagination
    TPanelList: typeof TPanelList
    TProgress: typeof TProgress
    TRadioGroup: typeof TRadioGroup
    TRadiusPicker: typeof TRadiusPicker
    TRating: typeof TRating
    TScaledFrame: typeof TScaledFrame
    TSearchButton: typeof TSearchButton
    TSectionLayout: typeof TSectionLayout
    TSelect: typeof TSelect
    TSelectMenu: typeof TSelectMenu
    TSeparator: typeof TSeparator
    TShell: typeof TShell
    TSkeleton: typeof TSkeleton
    TSlideover: typeof TSlideover
    TSparkline: typeof TSparkline
    TSpinner: typeof TSpinner
    TSplitter: typeof TSplitter
    TStatCard: typeof TStatCard
    TSteps: typeof TSteps
    TSwitch: typeof TSwitch
    TTable: typeof TTable
    TTabs: typeof TTabs
    TTextarea: typeof TTextarea
    TThemeBasePicker: typeof TThemeBasePicker
    TThemeScope: typeof TThemeScope
    TToaster: typeof TToaster
    TTooltip: typeof TTooltip
    TTopbar: typeof TTopbar
    TVectorMap: typeof TVectorMap
  }
}
