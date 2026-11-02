// The preview site's pages. Each component page shows the examples in examples/{slug}/, in file
// name order: "01-variants.vue" is titled "Variants", and a leading <!-- comment --> describes it.

export interface ComponentPage {
  slug: string
  name: string
  group: string
  description: string
  // The components the page covers, as written in templates.
  components: string[]
}

export const groups = ['Elements', 'Forms', 'Overlays', 'Navigation', 'Data', 'Layout', 'Plugins', 'Studio'] as const

export const pages: ComponentPage[] = [
  { slug: 'button', name: 'Button', group: 'Elements', components: ['TButton'], description: 'Actions, and links that look like actions.' },
  { slug: 'badge', name: 'Badge', group: 'Elements', components: ['TBadge'], description: 'Short status labels.' },
  { slug: 'avatar', name: 'Avatar', group: 'Elements', components: ['TAvatar'], description: 'People and things as a picture, initials or an icon.' },
  { slug: 'alert', name: 'Alert', group: 'Elements', components: ['TAlert'], description: 'Messages on the page: what happened and what to do.' },
  { slug: 'card', name: 'Card', group: 'Elements', components: ['TCard'], description: 'The surface most content sits on.' },
  { slug: 'icon', name: 'Icon', group: 'Elements', components: ['TIcon'], description: 'Tabler Icons, self-hosted as a webfont.' },
  { slug: 'tooltip', name: 'Tooltip', group: 'Elements', components: ['TTooltip'], description: 'Short hints on hover and focus.' },
  { slug: 'toast', name: 'Toast', group: 'Overlays', components: ['TToaster'], description: 'Short notices in the corner: saved, deleted, failed.' },
  { slug: 'empty', name: 'Empty state', group: 'Elements', components: ['TEmpty'], description: 'Nothing here yet, and the action that fills it.' },
  { slug: 'loading', name: 'Loading', group: 'Elements', components: ['TSpinner', 'TSkeleton', 'TProgress'], description: 'Spinners, placeholders and progress bars.' },
  { slug: 'separator', name: 'Separator', group: 'Elements', components: ['TSeparator'], description: 'Lines between things.' },

  { slug: 'input', name: 'Form field & input', group: 'Forms', components: ['TFormField', 'TInput', 'TTextarea'], description: 'Labelled fields, text inputs and validation.' },
  { slug: 'select', name: 'Select', group: 'Forms', components: ['TSelect'], description: 'One choice from a list.' },
  { slug: 'choices', name: 'Checkbox, switch & radio', group: 'Forms', components: ['TCheckbox', 'TSwitch', 'TRadioGroup'], description: 'Yes or no, on or off, one of a few.' },
  { slug: 'image-upload', name: 'Image upload', group: 'Forms', components: ['TImageUpload'], description: 'One image, such as a logo, checked for its shape and size.' },
  { slug: 'theme', name: 'Theme settings', group: 'Forms', components: ['TAccentPicker', 'TFontPicker', 'TRadiusPicker', 'TThemeBasePicker', 'TThemeScope'], description: 'An application\'s accent, font, corners and grays, and a scope that applies them.' },
  { slug: 'input-number', name: 'Number input', group: 'Forms', components: ['TInputNumber'], description: 'Numbers with minus and plus buttons, within limits.' },
  { slug: 'file-upload', name: 'File upload', group: 'Forms', components: ['TFileUpload'], description: 'Choose files by dropping or clicking, without uploading.' },
  { slug: 'select-menu', name: 'Select menu & tags', group: 'Forms', components: ['TSelectMenu', 'TInputTags'], description: 'Searchable and multiple choice; lists of typed values.' },
  { slug: 'code-editor', name: 'Code editor', group: 'Forms', components: ['TCodeEditor'], description: 'Monaco, in the light and dark theme.' },
  { slug: 'field-group', name: 'Field group', group: 'Forms', components: ['TFieldGroup'], description: 'An input joined with buttons or fixed text.' },

  { slug: 'modal', name: 'Modal', group: 'Overlays', components: ['TModal'], description: 'Dialogs over the page.' },
  { slug: 'slideover', name: 'Slideover', group: 'Overlays', components: ['TSlideover'], description: 'Panels that slide in from an edge.' },
  { slug: 'dropdown', name: 'Dropdown menu', group: 'Overlays', components: ['TDropdown'], description: 'Menus under a button.' },

  { slug: 'tabs', name: 'Tabs', group: 'Navigation', components: ['TTabs'], description: 'Views of one thing, side by side.' },
  { slug: 'pagination', name: 'Pagination', group: 'Navigation', components: ['TPagination'], description: 'Pages of a long list.' },
  { slug: 'command-palette', name: 'Command palette', group: 'Navigation', components: ['TCommandPalette', 'TSearchButton'], description: 'Ctrl+K search over pages and things.' },
  { slug: 'panel-list', name: 'Panel list', group: 'Navigation', components: ['TPanelList'], description: 'Compact choices in a section\'s side panel.' },
  { slug: 'steps', name: 'Steps', group: 'Navigation', components: ['TSteps'], description: 'A wizard\'s progress.' },

  { slug: 'table', name: 'Table', group: 'Data', components: ['TTable'], description: 'Rows and columns, with sorting, custom cells and selectable rows.' },
  { slug: 'advanced-table', name: 'Advanced table', group: 'Data', components: ['TAdvancedTable'], description: 'A table that filters its rows by each column.' },
  { slug: 'editable-table', name: 'Editable table', group: 'Data', components: ['TEditableTable'], description: 'Cells changed in place, selectable rows with bulk actions, search and pages.' },
  { slug: 'data-grid', name: 'Data grid', group: 'Data', components: ['TDataGrid', 'TDataGridItem'], description: 'Labels and values in a grid that reflows: detail panels and summaries.' },
  { slug: 'stat-card', name: 'Stat card', group: 'Data', components: ['TStatCard'], description: 'Figures on an overview page, with a trend and recent values.' },
  { slug: 'sparkline', name: 'Sparkline', group: 'Data', components: ['TSparkline'], description: 'Tiny charts in a line of text.' },
  { slug: 'log-view', name: 'Log view', group: 'Data', components: ['TLogView'], description: 'Build logs and live app output.' },

  { slug: 'shell', name: 'Shell & nav', group: 'Layout', components: ['TShell', 'TNav'], description: 'The app frame: a dark sidebar that folds, and the page.' },
  { slug: 'topbar', name: 'Top bar', group: 'Layout', components: ['TTopbar', 'TColorModeButton'], description: 'The bar along the top of a page.' },
  { slug: 'page', name: 'Page', group: 'Layout', components: ['TPage'], description: 'A page\'s header and body.' },
  { slug: 'section-layout', name: 'Section layout', group: 'Layout', components: ['TSectionLayout'], description: 'A side panel and a large work area.' },
  { slug: 'splitter', name: 'Splitter', group: 'Layout', components: ['TSplitter'], description: 'Two panes and a handle to resize them.' },
  { slug: 'app-layout', name: 'App layout', group: 'Layout', components: ['TAppLayout', 'TScaledFrame', 'TNavPositionPicker', 'TDensityPicker', 'TContainerPicker'], description: 'An application\'s frame, laid out by its theme, and the pickers for it.' },
  { slug: 'auth-layout', name: 'Auth layout', group: 'Layout', components: ['TAuthLayout'], description: 'One centered card: sign-in, setup.' },

  { slug: 'advanced-select', name: 'Advanced select', group: 'Plugins', components: ['TAdvancedSelect'], description: 'Tom Select: type to filter, chips, new values.' },
  { slug: 'chart', name: 'Chart', group: 'Plugins', components: ['TChart'], description: 'ApexCharts, as Tabler draws them: lines, areas, bars, pies and donuts.' },
  { slug: 'clipboard', name: 'Clipboard', group: 'Plugins', components: ['TCopyButton'], description: 'Copy buttons, with Tabler\'s clipboard plugin.' },
  { slug: 'color-picker', name: 'Color picker', group: 'Plugins', components: ['TColorPicker'], description: 'Coloris: colors with swatches and transparency.' },
  { slug: 'date-picker', name: 'Date picker', group: 'Plugins', components: ['TDatePicker'], description: 'Dates, ranges and inline calendars (Vanilla Calendar Pro).' },
  { slug: 'dropzone', name: 'Dropzone', group: 'Plugins', components: ['TDropzone'], description: 'Drop files to add or upload them.' },
  { slug: 'input-mask', name: 'Input mask', group: 'Plugins', components: ['TInputMask'], description: 'Inputs that follow a pattern (IMask).' },
  { slug: 'range-slider', name: 'Range slider', group: 'Plugins', components: ['TRangeSlider'], description: 'noUiSlider: a number or a range.' },
  { slug: 'sortable', name: 'Sortable', group: 'Plugins', components: ['TSortable'], description: 'Lists you reorder by dragging (SortableJS).' },
  { slug: 'sortable-tree', name: 'Sortable tree', group: 'Plugins', components: ['TSortableTree'], description: 'A tree you reorder and nest by dragging (SortableJS).' },
  { slug: 'vector-map', name: 'Vector map', group: 'Plugins', components: ['TVectorMap'], description: 'A world map with values, markers and selection.' },
  { slug: 'rich-editor', name: 'Rich text editor', group: 'Plugins', components: ['TRichEditor'], description: 'HugeRTE, the WYSIWYG editor.' },

  { slug: 'code-section', name: 'Code section', group: 'Studio', components: ['TSectionLayout', 'TPanelList', 'TCodeEditor'], description: 'The Studio\'s CodePanel, rebuilt on Gears UI.' },
  { slug: 'query-builder', name: 'Query builder', group: 'Studio', components: ['TSectionLayout', 'TSplitter', 'TSelectMenu', 'TCodeEditor', 'TTable'], description: 'The Studio\'s QueryPanel and filter builder, rebuilt on Gears UI.' }
]

export interface Example {
  title: string
  description?: string
  source: string
  component: object
}

const modules = import.meta.glob<{ default: object }>('./examples/*/*.vue', { eager: true })
const sources = import.meta.glob<string>('./examples/*/*.vue', { eager: true, query: '?raw', import: 'default' })

export function examples(slug: string): Example[] {
  return Object.keys(modules)
    .filter(path => path.startsWith(`./examples/${slug}/`))
    .sort()
    .map(path => {
      const raw = sources[path]
      const comment = raw.match(/^<!--\s*([\s\S]*?)\s*-->\s*/)
      const file = path.split('/').pop()!.replace(/\.vue$/, '').replace(/^\d+-/, '')
      return {
        title: file.charAt(0).toUpperCase() + file.slice(1).replace(/-/g, ' '),
        description: comment?.[1].replace(/\s+/g, ' '),
        source: (comment ? raw.slice(comment[0].length) : raw).trim(),
        component: modules[path].default
      }
    })
}
