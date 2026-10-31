# Gears UI

Vue 3 components on [Tabler](https://docs.tabler.io/ui) (Bootstrap 5 underneath), for the Gears Studio
and the apps Gears builds, plus a site that previews them.

```shell
npm install
npm run dev        # the preview site at http://localhost:5175
npm run typecheck
npm run build      # type-checks, then builds the preview site into dist/
```

Or run the preview site in Docker, at <http://localhost:5175>:

```shell
docker compose up -d   # builds the image every time (pull_policy: build), then serves it with nginx
docker compose down
```

## Using it

```ts
// main.ts
import '@gears/ui/styles.css'
import { createApp } from 'vue'
import GearsUI, { useColorMode } from '@gears/ui'

useColorMode()   // applies the saved light/dark choice to <html>
createApp(App).use(router).use(GearsUI).mount('#app')
```

Apps that use the plugin components also import `@gears/ui/plugins.css`, after `styles.css`.

The plugin registers every component globally (typed for templates). Components can also be imported
one by one: `import { TButton } from '@gears/ui'`. `vue` and `vue-router` are peer dependencies;
`monaco-editor` is too, for apps that use `TCodeEditor` (it loads Monaco the first time an editor shows,
with bundled workers, so it works offline).

The package ships its sources (`exports` points at `src/`), so it's consumed by a Vite app, as the Studio is.
Within the repo, an app can depend on it with `"@gears/ui": "file:../../Gears.UI"`.

## How it's built

- **Styles.** `src/styles/gears.css` imports Tabler's CSS and the Tabler Icons webfont (self-hosted: a
  Gears server may have no internet), then sets the Gears palette through Tabler's CSS variables: primary
  #3673d1, darkest black #1c1d1d, pages a shade off white, cards white (#232525 dark). Tabler 1.7 builds its
  shades and dark mode from those variables with `light-dark()`, so there's no SCSS build.
- **Dark mode.** `data-bs-theme` on `<html>`, set by `useColorMode()` (light, dark or system; remembered).
  The sidebar is dark in both themes.
- **Interactive components** (tooltip, dropdown, modal, slideover) drive Tabler's bundled Bootstrap JS
  from Vue: created on mount, disposed on unmount, opened and closed through `v-model`.
- **Props follow Nuxt UI** (`color`, `variant`, `size`, `icon`, `trailingIcon`, `label`, `v-model:open`), so the
  Studio's components move over mostly by renaming. Colors are `primary`, `neutral`, `success`, `warning`,
  `error` and `info`; `toTabler()` maps them to Tabler's names (`neutral` → `secondary`, `error` → `danger`).
- **Icons** are Tabler Icons by name: `icon="plus"`. Browse them at <https://tabler.io/icons>.
- Tabler's own classes work alongside the components: the grid, spacing, `btn-list`, `row-cards`,
  `list-group`, `datagrid`, `text-secondary`, …

## The preview site

`preview/` is a Vite app that uses the library the way an app does. Each component page lists the
examples in `preview/examples/{slug}/`, in file name order, live with their source under them; the file
name gives the title (`02-colors.vue` → "Colors") and a leading `<!-- comment -->` the description. To
add a page, add an entry to `preview/registry.ts` and a folder of examples.

## Components

| Group | Components |
| --- | --- |
| Elements | `TButton`, `TBadge`, `TAvatar`, `TAlert`, `TCard`, `TIcon`, `TTooltip`, `TEmpty`, `TSpinner`, `TSkeleton`, `TProgress`, `TSeparator` |
| Forms | `TFormField`, `TInput`, `TTextarea`, `TSelect`, `TSelectMenu`, `TInputTags`, `TCheckbox`, `TSwitch`, `TRadioGroup`, `TFieldGroup`, `TCodeEditor` |
| Overlays | `TModal`, `TSlideover`, `TDropdown` |
| Navigation | `TTabs`, `TPagination`, `TSteps`, `TNav`, `TPanelList` |
| Data | `TTable`, `TStatCard`, `TLogView` |
| Layout | `TShell`, `TTopbar`, `TPage`, `TSectionLayout`, `TSplitter`, `TAuthLayout`, `TColorModeButton` |
| Plugins | `TAdvancedSelect`, `TCopyButton`, `TColorPicker`, `TDatePicker`, `TDropzone`, `TInputMask`, `TRangeSlider`, `TSortable`, `TVectorMap`, `TRichEditor` |

### Plugins

The components for [Tabler's plugins](https://docs.tabler.io/ui/plugins). Each library is an optional peer
dependency and loads the first time its component is shown (`src/plugins.ts`), so an app installs and
downloads only what it uses. Their CSS is in `@gears/ui/plugins.css`: each library's own styles, then
Tabler's restyling of them (`tabler-vendors.css`), which must come after.

| Component | Library | Notes |
| --- | --- | --- |
| `TAdvancedSelect` | Tom Select | One or several (`multiple`, as chips); `create` adds new values; icons and avatars beside labels. Overlaps `TSelectMenu`, which has no dependency. |
| `TCopyButton` | Tabler's clipboard | Copies `text`, or the field `target` selects. Needs https or localhost. |
| `TColorPicker` | Coloris | `format`, `alpha`, `swatches`, `swatchesOnly`. The field isn't wrapped by Coloris (Vue owns it); the swatch is ours. |
| `TDatePicker` | Tabler's date picker, on Vanilla Calendar Pro | `single`, `multiple` or `range`; `inline`; the model is `YYYY-MM-DD`, `format` only changes the display. |
| `TDropzone` | Dropzone | With `url`, uploads; without, v-model collects the files. |
| `TInputMask` | Tabler's input mask, on IMask | `mask` like "(000) 000-0000"; `unmasked`; `showMask`. |
| `TRangeSlider` | noUiSlider | A number, or a range with `[from, to]`. |
| `TSortable` | Tabler's sortable, on SortableJS | Reorders v-model's array. Lists within one container; dragging between lists isn't wired up yet. |
| `TVectorMap` | Tabler's vector map | The world map: `values`, `markers`, `lines`, `legend`, `select` with v-model:selected, `zoom`. |
| `TRichEditor` | HugeRTE (open-source TinyMCE fork) | v-model is HTML. Bundled skins and plugins, nothing fetched; follows the theme by rebuilding the editor. |

### From the Studio's components

| Studio (Nuxt UI) | Gears UI |
| --- | --- |
| `UButton`, `UBadge`, `UAvatar`, `UAlert`, `UCard`, `UIcon`, `UTooltip`, `UEmpty`, `USkeleton`, `USeparator`, `UProgress` | `T…` with the same name. Icons change from `i-lucide-*` to Tabler names. `UCard`'s header slot content moves to `title`/`subtitle`/`#actions`. |
| `UFormField`, `UInput`, `UTextarea`, `USelect`, `UCheckbox`, `USwitch`, `URadioGroup`, `UFieldGroup` | `TFormField` (`help` → `description`), `TInput`, `TTextarea`, `TSelect`, `TCheckbox`, `TSwitch`, `TRadioGroup`, `TFieldGroup` |
| `UModal`, `USlideover`, `UDropdownMenu` | `TModal`, `TSlideover`, `TDropdown` (same item groups; `onSelect`, `to`, `type: 'label'`) |
| `UTabs`, `UPagination`, `UStepper`, `UTable` | `TTabs` (`:content="false"` switches become `variant="segmented"`), `TPagination`, `TSteps`, `TTable` (cell slots get the row itself, not `row.original`; `#cell` draws any cell, `sticky` keeps the header) |
| `USelectMenu`, `UInputTags`, `USplitter` | `TSelectMenu` (`multiple`; items take a `group` instead of `type: 'label'` rows), `TInputTags`, `TSplitter` (`#start` and `#end` slots, `storageKey`) |
| `UDashboardGroup` + `UDashboardSidebar` + `UNavigationMenu` | `TShell` with `nav` items (`TNav`) |
| `UDashboardPanel` + `UDashboardNavbar` | `TTopbar` + `TPage` |
| `UColorModeButton` | `TColorModeButton` |
| `StatCard`, `AuthCard`, `SectionLayout` | `TStatCard`, `TAuthLayout` (brand and logo are props), `TSectionLayout` |
| `BuildLog`, `AppLog` | Their polling stays in the Studio; the display is `TLogView` (`text`, or `lines` with times and levels, and `v-model:follow`) |
| `CodeEditor` | `TCodeEditor` (same props; `Completion` is `CodeCompletion`; `flush` replaces the border overrides). Monaco's setup moves to `src/monaco.ts`, with themes `gears-light` and `gears-dark` |
| `CodePanel`, `QueryPanel`, `FilterGroupEditor` | Stay in the Studio (they call its API). Rebuilt on Gears UI in the preview's Studio pages, against mock data in `preview/studio/`: the side-panel lists are `TPanelList`, and the results card is a component of its own instead of VueUse's reusable template |
| `StudioPage`, `ProjectSwitcher`, user menu | Compositions of `TTopbar`, `TDropdown`, `TAvatar` and `TPage`: see the Top bar and Dropdown pages |

### Not built yet

These Nuxt UI components are used in the Studio and have no Gears UI version yet: `UInputNumber` (a
number `TInput` covers most uses), `UFileUpload`, and `UDashboardSearch` with `UDashboardSearchButton` (the
Ctrl+K command palette). The preview site has no generated props tables yet; the examples are the reference.

## License

[Mozilla Public License 2.0](LICENSE), as Ternary.Data.
