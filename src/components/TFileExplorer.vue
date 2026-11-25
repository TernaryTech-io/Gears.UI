<script setup lang="ts">
// A file explorer over a data provider (ExplorerProvider: the Studio's server, an app's API, or
// anything): the drives and their folders in a tree, the open folder's contents as a list or as
// cards, the path as breadcrumbs, and a toolbar. v-model:location is where it is (a drive, a
// folder, the folders on the way), v-model:selection the chosen items' ids, v-model:view the list
// or the cards. Selection works with the mouse (Ctrl, Shift) and the keyboard (arrows, Shift,
// Ctrl+A); Enter opens a folder (a file emits `open`), F2 renames in place, Delete deletes (after
// asking), Ctrl+X and Ctrl+V move, Backspace goes up. Items drag onto folders (in the list or the
// tree) to move; files dropped from the computer upload, a queue with progress. The context menu
// has the standard actions and `menu`'s own. The `info` slot is a side pane for the selection.
// What the provider can't do is left out.
import { computed, onMounted, reactive, ref, watch } from 'vue'
import TBreadcrumbs from './TBreadcrumbs.vue'
import TButton from './TButton.vue'
import TContextMenu from './TContextMenu.vue'
import TEmpty from './TEmpty.vue'
import TIcon from './TIcon.vue'
import TModal from './TModal.vue'
import TProgress from './TProgress.vue'
import TSpinner from './TSpinner.vue'
import TSplitter from './TSplitter.vue'
import TTree from './TTree.vue'
import type { BreadcrumbItem, ContextMenuItem, ExplorerDrive, ExplorerItem, ExplorerLocation, ExplorerProvider, TreeNode } from '../types'

const props = withDefaults(defineProps<{
  provider: ExplorerProvider
  /** More context menu groups for the items chosen (none for the folder's background). */
  menu?: (items: ExplorerItem[], location: ExplorerLocation) => ContextMenuItem[][]
  /** Remembers the tree's width per browser under this key. */
  storageKey?: string
  /** The explorer's accessible name. */
  label?: string
}>(), { label: 'Files' })

const location = defineModel<ExplorerLocation | null>('location', { default: null })
const selection = defineModel<string[]>('selection', { default: () => [] })
const view = defineModel<'list' | 'grid'>('view', { default: 'list' })
const emit = defineEmits<{ open: [item: ExplorerItem, location: ExplorerLocation]; changed: [location: ExplorerLocation] }>()
defineSlots<{
  info?(scope: { items: ExplorerItem[]; location: ExplorerLocation | null }): unknown
  toolbar?(scope: { items: ExplorerItem[]; location: ExplorerLocation | null }): unknown
}>()

const drives = ref<ExplorerDrive[]>([])
const items = ref<ExplorerItem[]>([])
const cursor = ref<string | null>(null)
const loading = ref(false)
const problem = ref('')
const drive = computed(() => drives.value.find(d => d.id === location.value?.drive) ?? null)
const writable = computed(() => !!drive.value && !drive.value.readOnly && !drive.value.unavailable)
const chosen = computed(() => items.value.filter(i => selection.value.includes(i.id)))

// ---- The tree: drives, then folders, each node's id "drive|folder" ("drive|" for its top) ----
const tree = ref<InstanceType<typeof TTree>>()
const treeSelected = ref<string | null>(null)
const treeExpanded = ref<string[]>([])
// Each folder node's place, to work out the path when it's chosen in the tree.
const places = new Map<string, { drive: string; folder: string | null; name: string; parent: string | null }>()
const nodeId = (driveId: string, folder: string | null) => `${driveId}|${folder ?? ''}`
const treeNodes = computed<TreeNode[]>(() => drives.value.map(d => ({
  id: nodeId(d.id, null), label: d.name, icon: d.icon ?? 'server-2', leaf: !!d.unavailable, disabled: false
})))

async function loadFolders(node: TreeNode): Promise<TreeNode[]> {
  const place = places.get(node.id) ?? { drive: node.id.split('|')[0]!, folder: null }
  const found: TreeNode[] = []
  let next: string | null = null
  // Folders come first: read pages until a file shows up.
  do {
    const page = await props.provider.list(place.drive, place.folder, next)
    const folders = page.items.filter(i => i.folder)
    for (const f of folders) {
      const id = nodeId(place.drive, f.id)
      places.set(id, { drive: place.drive, folder: f.id, name: f.name, parent: node.id })
      found.push({ id, label: f.name, icon: 'folder', openIcon: 'folder-open' })
    }
    next = folders.length === page.items.length ? page.cursor : null
  } while (next)
  return found
}
function pathTo(id: string): { id: string; name: string }[] {
  const path: { id: string; name: string }[] = []
  for (let at = places.get(id); at && at.folder; at = at.parent ? places.get(at.parent) : undefined)
    path.unshift({ id: at.folder, name: at.name })
  return path
}
function treeChose(node: TreeNode) {
  const [driveId] = node.id.split('|')
  const place = places.get(node.id)
  go({ drive: driveId!, folder: place?.folder ?? null, path: place ? pathTo(node.id) : [] })
}

// ---- Where it is ----
function go(to: ExplorerLocation) {
  location.value = to
}
async function load(more = false) {
  const at = location.value
  if (!at || !drive.value || drive.value.unavailable) {
    items.value = []
    cursor.value = null
    return
  }
  loading.value = true
  problem.value = ''
  try {
    const page = await props.provider.list(at.drive, at.folder, more ? cursor.value : null)
    if (location.value !== at) return
    items.value = more ? [...items.value, ...page.items] : page.items
    cursor.value = page.cursor
    if (!more) selection.value = selection.value.filter(id => items.value.some(i => i.id === id))
  } catch (e) {
    problem.value = e instanceof Error ? e.message : 'The folder couldn\'t be read.'
  } finally {
    loading.value = false
  }
}
watch(location, async at => {
  await load()
  if (!at) return
  treeSelected.value = nodeId(at.drive, at.folder)
  const ids = [nodeId(at.drive, null), ...at.path.map(p => nodeId(at.drive, p.id))]
  if (ids.length > 1) await tree.value?.reveal(ids)
}, { deep: true })

onMounted(async () => {
  try {
    drives.value = await props.provider.drives()
  } catch (e) {
    problem.value = e instanceof Error ? e.message : 'The drives couldn\'t be read.'
    return
  }
  if (!location.value || !drives.value.some(d => d.id === location.value!.drive)) {
    const first = drives.value.find(d => !d.unavailable) ?? drives.value[0]
    if (first) go({ drive: first.id, folder: null, path: [] })
  } else await load()
})

const crumbs = computed<BreadcrumbItem[]>(() => {
  const at = location.value
  if (!at || !drive.value) return []
  return [
    { label: drive.value.name, icon: drive.value.icon ?? 'server-2', onSelect: () => go({ drive: at.drive, folder: null, path: [] }) },
    ...at.path.map((p, i) => ({ label: p.name, onSelect: () => go({ drive: at.drive, folder: p.id, path: at.path.slice(0, i + 1) }) }))
  ]
})
function openItem(item: ExplorerItem) {
  const at = location.value
  if (!at) return
  if (item.folder) go({ drive: at.drive, folder: item.id, path: [...at.path, { id: item.id, name: item.name }] })
  else emit('open', item, at)
}
function up() {
  const at = location.value
  if (!at || !at.path.length) return
  const path = at.path.slice(0, -1)
  go({ drive: at.drive, folder: path.at(-1)?.id ?? null, path })
}
/** After a change: the list, and the tree's node for this folder. */
async function changed() {
  await load()
  const at = location.value
  if (!at) return
  await tree.value?.reload(nodeId(at.drive, at.folder))
  emit('changed', at)
}
async function attempt(what: string, work: () => Promise<unknown>) {
  problem.value = ''
  try {
    await work()
  } catch (e) {
    problem.value = e instanceof Error ? e.message : `${what} didn't work.`
  }
}

// ---- Selection ----
const focus = ref<string | null>(null)
let anchor: string | null = null
function click(event: MouseEvent, item: ExplorerItem) {
  const ids = items.value.map(i => i.id)
  if (event.shiftKey && anchor) {
    const [a, b] = [ids.indexOf(anchor), ids.indexOf(item.id)].sort((x, y) => x - y)
    selection.value = ids.slice(a, b + 1)
  } else if (event.ctrlKey || event.metaKey) {
    selection.value = selection.value.includes(item.id) ? selection.value.filter(id => id !== item.id) : [...selection.value, item.id]
    anchor = item.id
  } else {
    selection.value = [item.id]
    anchor = item.id
  }
  focus.value = item.id
}
function key(event: KeyboardEvent) {
  if (renaming.value) return
  const list = items.value
  const at = list.findIndex(i => i.id === focus.value)
  const step = (by: number) => {
    const next = list[Math.max(0, Math.min(list.length - 1, at + by))]
    if (!next) return
    focus.value = next.id
    if (event.shiftKey && anchor) {
      const ids = list.map(i => i.id)
      const [a, b] = [ids.indexOf(anchor), ids.indexOf(next.id)].sort((x, y) => x - y)
      selection.value = ids.slice(a, b + 1)
    } else {
      selection.value = [next.id]
      anchor = next.id
    }
    document.getElementById(rowId(next.id))?.scrollIntoView({ block: 'nearest' })
  }
  const ctrl = event.ctrlKey || event.metaKey
  if (event.key === 'ArrowDown' || (view.value === 'grid' && event.key === 'ArrowRight')) step(1)
  else if (event.key === 'ArrowUp' || (view.value === 'grid' && event.key === 'ArrowLeft')) step(-1)
  else if (event.key === 'Home') step(-list.length)
  else if (event.key === 'End') step(list.length)
  else if (ctrl && event.key.toLowerCase() === 'a') selection.value = list.map(i => i.id)
  else if (event.key === 'Enter' && chosen.value.length === 1) openItem(chosen.value[0]!)
  else if (event.key === 'Backspace') up()
  else if (event.key === 'F2' && chosen.value.length === 1 && canRename(chosen.value[0]!)) startRename(chosen.value[0]!)
  else if (event.key === 'Delete' && chosen.value.length && canDelete(chosen.value)) askDelete(chosen.value)
  else if (ctrl && event.key.toLowerCase() === 'x' && chosen.value.length && canMove(chosen.value)) cut(chosen.value)
  else if (ctrl && event.key.toLowerCase() === 'v' && clipboard.value) void paste(location.value!.folder)
  else if (event.key === 'Escape') selection.value = []
  else return
  event.preventDefault()
}
const rowId = (id: string) => `t-explorer-${uid}-${id}`
const uid = Math.random().toString(36).slice(2, 8)

// ---- Actions ----
const canRename = (item: ExplorerItem) => !!props.provider.rename && writable.value && item.can?.rename !== false
const canMove = (list: ExplorerItem[]) => !!props.provider.move && writable.value && list.every(i => i.can?.move !== false)
const canDelete = (list: ExplorerItem[]) => !!props.provider.remove && writable.value && list.every(i => i.can?.delete !== false)

const renaming = ref<string | null>(null)
const newName = ref('')
function startRename(item: ExplorerItem) {
  renaming.value = item.id
  newName.value = item.name
}
async function finishRename(item: ExplorerItem) {
  const name = newName.value.trim()
  renaming.value = null
  if (!name || name === item.name || !location.value) return
  await attempt('Renaming', async () => {
    await props.provider.rename!(location.value!.drive, item, name)
    await changed()
  })
}

const clipboard = ref<{ drive: string; items: ExplorerItem[] } | null>(null)
function cut(list: ExplorerItem[]) {
  clipboard.value = { drive: location.value!.drive, items: [...list] }
}
async function paste(folder: string | null) {
  const held = clipboard.value
  const at = location.value
  if (!held || !at) return
  if (held.drive !== at.drive) {
    problem.value = 'Items move within their drive here.'
    return
  }
  clipboard.value = null
  await moveTo(held.items, folder)
}
async function moveTo(list: ExplorerItem[], folder: string | null) {
  const at = location.value
  if (!at || !list.length) return
  // A folder can't go into itself.
  const moving = list.filter(i => i.id !== folder)
  if (!moving.length) return
  await attempt('Moving', async () => {
    await props.provider.move!(at.drive, moving, folder)
    await changed()
    await tree.value?.reload(nodeId(at.drive, folder))
  })
}

const deleting = ref<ExplorerItem[] | null>(null)
const deleteOpen = computed({ get: () => !!deleting.value, set: open => { if (!open) deleting.value = null } })
function askDelete(list: ExplorerItem[]) {
  deleting.value = [...list]
}
async function confirmDelete() {
  const list = deleting.value
  deleting.value = null
  if (!list || !location.value) return
  await attempt('Deleting', async () => {
    await props.provider.remove!(location.value!.drive, list)
    selection.value = []
    await changed()
  })
}

const creating = ref(false)
const folderName = ref('')
async function createFolder() {
  const name = folderName.value.trim()
  creating.value = false
  folderName.value = ''
  if (!name || !location.value) return
  await attempt('Making the folder', async () => {
    await props.provider.createFolder!(location.value!.drive, location.value!.folder, name)
    await changed()
  })
}

// ---- Uploads: one at a time, each with its progress, cancelable ----
interface Upload { id: number; name: string; size: number; sent: number; state: 'waiting' | 'sending' | 'done' | 'failed' | 'canceled'; error?: string; abort: AbortController; drive: string; folder: string | null; file: File }
const uploads = reactive<Upload[]>([])
let uploadIds = 0
let uploading = false
const picker = ref<HTMLInputElement>()
function queue(files: File[]) {
  const at = location.value
  if (!at || !props.provider.upload || !writable.value) return
  for (const file of files)
    uploads.push({ id: ++uploadIds, name: file.name, size: file.size, sent: 0, state: 'waiting', abort: new AbortController(), drive: at.drive, folder: at.folder, file })
  void run()
}
async function run() {
  if (uploading) return
  uploading = true
  try {
    for (let next = uploads.find(u => u.state === 'waiting'); next; next = uploads.find(u => u.state === 'waiting')) {
      const upload = next
      upload.state = 'sending'
      try {
        await props.provider.upload!(upload.drive, upload.folder, upload.file, sent => { upload.sent = sent }, upload.abort.signal)
        upload.state = 'done'
        upload.sent = upload.size
        if (location.value?.drive === upload.drive && location.value.folder === upload.folder) await load()
      } catch (e) {
        if (upload.abort.signal.aborted) upload.state = 'canceled'
        else {
          upload.state = 'failed'
          upload.error = e instanceof Error ? e.message : 'It couldn\'t be uploaded.'
        }
      }
    }
  } finally {
    uploading = false
  }
}
function cancel(upload: Upload) {
  if (upload.state === 'waiting') upload.state = 'canceled'
  else if (upload.state === 'sending') upload.abort.abort()
}
function clearUploads() {
  for (let i = uploads.length - 1; i >= 0; i--)
    if (uploads[i]!.state !== 'waiting' && uploads[i]!.state !== 'sending') uploads.splice(i, 1)
}
const picked = (event: Event) => {
  const input = event.target as HTMLInputElement
  queue([...(input.files ?? [])])
  input.value = ''
}

// ---- Dragging: items onto folders (list or tree) to move; files from the computer to upload ----
const dragType = 'application/x-t-explorer'
const over = ref<string | null>(null)
let dragged: ExplorerItem[] = []
function dragStart(event: DragEvent, item: ExplorerItem) {
  // The model updates only once the parent has it, so the items are worked out here, not read back.
  dragged = selection.value.includes(item.id) ? [...chosen.value] : [item]
  if (!selection.value.includes(item.id)) selection.value = [item.id]
  if (!canMove(dragged)) {
    event.preventDefault()
    return
  }
  event.dataTransfer?.setData(dragType, uid)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}
const carriesItems = (event: DragEvent) => event.dataTransfer?.types.includes(dragType) ?? false
const carriesFiles = (event: DragEvent) => event.dataTransfer?.types.includes('Files') ?? false
function rowDragOver(event: DragEvent, item: ExplorerItem) {
  if (item.folder && carriesItems(event) && !dragged.some(d => d.id === item.id)) {
    event.preventDefault()
    over.value = item.id
  }
}
async function rowDrop(event: DragEvent, item: ExplorerItem) {
  over.value = null
  if (!item.folder || !carriesItems(event)) return
  event.preventDefault()
  event.stopPropagation()
  await moveTo(dragged, item.id)
}
const areaOver = ref(false)
function areaDragOver(event: DragEvent) {
  if (carriesFiles(event) && writable.value && props.provider.upload) {
    event.preventDefault()
    areaOver.value = true
  }
}
function areaDrop(event: DragEvent) {
  areaOver.value = false
  if (!carriesFiles(event)) return
  event.preventDefault()
  queue([...(event.dataTransfer?.files ?? [])])
}
const treeDroppable = (node: TreeNode, event: DragEvent) =>
  carriesItems(event) && node.id.startsWith(`${location.value?.drive}|`) && !dragged.some(d => nodeId(location.value!.drive, d.id) === node.id)
async function treeDrop({ node }: { node: TreeNode; event: DragEvent }) {
  await moveTo(dragged, places.get(node.id)?.folder ?? null)
}

// ---- The context menu ----
function menuFor(event: MouseEvent | KeyboardEvent): ContextMenuItem[][] {
  const row = (event.target as HTMLElement).closest<HTMLElement>('[data-item]')
  const at = location.value
  if (!at) return []
  if (row) {
    const item = items.value.find(i => i.id === row.dataset.item)
    // A row outside the selection becomes it; the model updates only once the parent has it, so the list is worked out here.
    const list = !item ? chosen.value : selection.value.includes(item.id) ? chosen.value : [item]
    if (item && !selection.value.includes(item.id)) selection.value = [item.id]
    const one = list.length === 1 ? list[0]! : null
    const groups: ContextMenuItem[][] = [[
      ...(one ? [{ label: 'Open', icon: one.folder ? 'folder-open' : 'external-link', kbd: 'Enter', onSelect: () => openItem(one) }] : []),
      ...(one && !one.folder && props.provider.href ? [{ label: 'Download', icon: 'download', onSelect: () => download(one) }] : [])
    ], [
      ...(props.provider.rename && one ? [{ label: 'Rename', icon: 'pencil', kbd: 'F2', disabled: !canRename(one), reason: reasonFor(one, 'rename'), onSelect: () => startRename(one) }] : []),
      ...(props.provider.move ? [{ label: 'Cut', icon: 'scissors', kbd: 'Ctrl+X', disabled: !canMove(list), reason: list.length === 1 ? reasonFor(list[0]!, 'move') : undefined, onSelect: () => cut(list) }] : []),
      ...(clipboard.value && one?.folder ? [{ label: 'Paste into', icon: 'clipboard', onSelect: () => void paste(one.id) }] : [])
    ], ...(props.menu?.(list, at) ?? []), [
      ...(props.provider.remove ? [{ label: 'Delete', icon: 'trash', color: 'error' as const, kbd: 'Del', disabled: !canDelete(list), reason: list.length === 1 ? reasonFor(list[0]!, 'delete') : undefined, onSelect: () => askDelete(list) }] : [])
    ]]
    return groups.filter(g => g.length)
  }
  // The folder's background.
  selection.value = []
  return [[
    ...(props.provider.createFolder ? [{ label: 'New folder', icon: 'folder-plus', disabled: !writable.value, onSelect: () => { creating.value = true } }] : []),
    ...(props.provider.upload ? [{ label: 'Upload files…', icon: 'upload', disabled: !writable.value, onSelect: () => picker.value?.click() }] : []),
    ...(clipboard.value ? [{ label: 'Paste', icon: 'clipboard', kbd: 'Ctrl+V', onSelect: () => void paste(at.folder) }] : [])
  ], [{ label: 'Refresh', icon: 'refresh', onSelect: () => void load() }]].filter(g => g.length)
}
function reasonFor(item: ExplorerItem, what: 'rename' | 'move' | 'delete') {
  if (drive.value?.readOnly) return 'The drive is read-only'
  return item.can?.[what] === false ? 'You may not' : undefined
}
function download(item: ExplorerItem) {
  const href = props.provider.href?.(location.value!.drive, item)
  if (!href) return
  const a = document.createElement('a')
  a.href = href
  a.download = item.name
  a.click()
}

// ---- Showing things ----
function sizeOf(bytes?: number | null) {
  if (bytes == null) return ''
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++ }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`
}
function dateOf(value?: string | null) {
  return value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : ''
}
function iconOf(item: ExplorerItem) {
  if (item.icon) return item.icon
  if (item.folder) return 'folder'
  const type = item.mimeType ?? ''
  if (type.startsWith('image/')) return 'photo'
  if (type === 'application/pdf') return 'file-type-pdf'
  if (type.startsWith('video/')) return 'movie'
  if (type.startsWith('audio/')) return 'music'
  if (type.includes('zip')) return 'file-zip'
  if (type.includes('sheet') || type.includes('csv')) return 'file-spreadsheet'
  if (type.startsWith('text/')) return 'file-text'
  return 'file'
}
const infoShown = ref(true)
</script>

<template>
  <div class="t-explorer" :aria-label="label" role="region">
    <TSplitter :default-size="24" :min-start="12" :min-end="40" :storage-key="storageKey ? `${storageKey}:tree` : undefined" class="t-explorer-split">
      <template #start>
        <div class="t-explorer-tree">
          <TTree ref="tree" v-model:selected="treeSelected" v-model:expanded="treeExpanded" :nodes="treeNodes" :load="loadFolders"
            :droppable="treeDroppable" size="sm" :label="`${label}: folders`" @select="treeChose" @drop="treeDrop" />
        </div>
      </template>
      <template #end>
        <div class="t-explorer-main">
          <div class="t-explorer-bar">
            <TBreadcrumbs :items="crumbs" :max="5" size="sm" class="flex-fill min-w-0" />
            <slot name="toolbar" :items="chosen" :location="location" />
            <TButton v-if="provider.createFolder" size="sm" variant="ghost" color="neutral" icon="folder-plus" :disabled="!writable" title="New folder"
              aria-label="New folder" @click="creating = true" />
            <TButton v-if="provider.upload" size="sm" variant="ghost" color="neutral" icon="upload" label="Upload" :disabled="!writable" @click="picker?.click()" />
            <input ref="picker" type="file" multiple class="d-none" @change="picked" />
            <div class="btn-group" role="group" aria-label="View">
              <TButton size="sm" :variant="view === 'list' ? 'soft' : 'ghost'" color="neutral" icon="list" aria-label="List" @click="view = 'list'" />
              <TButton size="sm" :variant="view === 'grid' ? 'soft' : 'ghost'" color="neutral" icon="layout-grid" aria-label="Cards" @click="view = 'grid'" />
            </div>
            <TButton v-if="$slots.info" size="sm" variant="ghost" color="neutral" :icon="infoShown ? 'layout-sidebar-right-collapse' : 'layout-sidebar-right-expand'"
              :aria-label="infoShown ? 'Hide details' : 'Show details'" @click="infoShown = !infoShown" />
          </div>
          <div v-if="problem" class="alert alert-danger py-2 px-3 m-2 mb-0 small d-flex align-items-center gap-2" role="alert">
            <TIcon name="alert-circle" /> <span class="flex-fill">{{ problem }}</span>
            <button type="button" class="btn-close" aria-label="Dismiss" @click="problem = ''" />
          </div>
          <div class="t-explorer-body">
            <!-- The menu's area is inside: TContextMenu has two roots (the area, the menu on the body), so the explorer's scoped styles stay on its own element. -->
            <div :class="['t-explorer-items', { over: areaOver }]" tabindex="0" :aria-label="`${label}: contents`"
              @keydown="key" @dragover="areaDragOver" @dragleave="areaOver = false" @drop="areaDrop">
            <TContextMenu :items="menuFor" style="min-height: 100%">
              <div v-if="drive?.unavailable" class="p-4"><TEmpty icon="plug-connected-x" :title="`${drive.name} can't be opened here`" :description="drive.unavailable" /></div>
              <div v-else-if="loading && !items.length" class="p-4 text-center"><TSpinner /></div>
              <div v-else-if="!items.length && !creating" class="p-4">
                <TEmpty icon="folder-open" title="This folder is empty" :description="writable && provider.upload ? 'Drop files here, or use Upload.' : undefined" />
              </div>
              <template v-else>
                <div v-if="creating" class="t-explorer-new">
                  <TIcon name="folder-plus" />
                  <input v-model="folderName" class="form-control form-control-sm" placeholder="New folder's name" aria-label="New folder's name" autofocus
                    @keydown.enter.stop="createFolder" @keydown.esc.stop="creating = false; folderName = ''" @blur="folderName.trim() ? createFolder() : (creating = false)" />
                </div>
                <table v-if="view === 'list'" class="table table-sm table-hover t-explorer-table mb-0">
                  <thead><tr><th>Name</th><th class="d-none d-md-table-cell">Kind</th><th class="text-end">Size</th><th class="d-none d-lg-table-cell">Changed</th></tr></thead>
                  <tbody>
                    <tr v-for="item in items" :id="rowId(item.id)" :key="item.id" :data-item="item.id" :draggable="canMove([item]) || undefined"
                      :class="{ selected: selection.includes(item.id), focused: focus === item.id, over: over === item.id, cut: clipboard?.items.some(c => c.id === item.id) }"
                      :aria-selected="selection.includes(item.id)" @click="click($event, item)" @dblclick="openItem(item)"
                      @dragstart="dragStart($event, item)" @dragover="rowDragOver($event, item)" @dragleave="over = null" @drop="rowDrop($event, item)">
                      <td class="t-explorer-name">
                        <TIcon :name="iconOf(item)" :class="item.folder ? 'text-primary' : 'text-secondary'" />
                        <input v-if="renaming === item.id" v-model="newName" class="form-control form-control-sm" :aria-label="`New name for ${item.name}`" autofocus
                          @click.stop @keydown.enter.stop="finishRename(item)" @keydown.esc.stop="renaming = null" @blur="finishRename(item)" />
                        <span v-else class="text-truncate">{{ item.name }}</span>
                      </td>
                      <td class="d-none d-md-table-cell text-secondary">{{ item.folder ? 'Folder' : item.kind ?? '' }}</td>
                      <td class="text-end text-secondary text-nowrap">{{ item.folder ? '' : sizeOf(item.size) }}</td>
                      <td class="d-none d-lg-table-cell text-secondary text-nowrap">{{ dateOf(item.modifiedAt) }}</td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="t-explorer-grid">
                  <div v-for="item in items" :id="rowId(item.id)" :key="item.id" :data-item="item.id" :draggable="canMove([item]) || undefined"
                    :class="['t-explorer-card', { selected: selection.includes(item.id), focused: focus === item.id, over: over === item.id, cut: clipboard?.items.some(c => c.id === item.id) }]"
                    :aria-selected="selection.includes(item.id)" @click="click($event, item)" @dblclick="openItem(item)"
                    @dragstart="dragStart($event, item)" @dragover="rowDragOver($event, item)" @dragleave="over = null" @drop="rowDrop($event, item)">
                    <TIcon :name="iconOf(item)" :class="['t-explorer-card-icon', item.folder ? 'text-primary' : 'text-secondary']" />
                    <input v-if="renaming === item.id" v-model="newName" class="form-control form-control-sm" :aria-label="`New name for ${item.name}`" autofocus
                      @click.stop @keydown.enter.stop="finishRename(item)" @keydown.esc.stop="renaming = null" @blur="finishRename(item)" />
                    <span v-else class="t-explorer-card-name">{{ item.name }}</span>
                    <span class="small text-secondary">{{ item.folder ? 'Folder' : sizeOf(item.size) }}</span>
                  </div>
                </div>
                <div v-if="cursor" class="p-2 text-center">
                  <TButton size="sm" variant="ghost" color="neutral" label="Show more" :loading="loading" @click="load(true)" />
                </div>
              </template>
            </TContextMenu>
            </div>
            <aside v-if="$slots.info && infoShown" class="t-explorer-info" :aria-label="`${label}: details`">
              <slot name="info" :items="chosen" :location="location" />
            </aside>
          </div>
          <div v-if="uploads.length" class="t-explorer-uploads" aria-label="Uploads">
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="small fw-medium flex-fill">Uploads</span>
              <TButton size="sm" variant="ghost" color="neutral" label="Clear finished" @click="clearUploads" />
            </div>
            <div v-for="u in uploads" :key="u.id" class="t-explorer-upload">
              <TIcon :name="u.state === 'done' ? 'circle-check' : u.state === 'failed' ? 'alert-circle' : u.state === 'canceled' ? 'circle-x' : 'upload'"
                :class="u.state === 'done' ? 'text-success' : u.state === 'failed' ? 'text-danger' : 'text-secondary'" />
              <span class="text-truncate small" style="min-width: 6rem; max-width: 16rem">{{ u.name }}</span>
              <TProgress v-if="u.state === 'sending' || u.state === 'waiting'" :value="u.state === 'waiting' ? 0 : u.sent" :max="u.size || 1" size="sm" class="flex-fill" :label="`${u.name} sent`" />
              <span v-else class="small text-secondary flex-fill text-truncate">{{ u.state === 'failed' ? u.error : u.state === 'canceled' ? 'Canceled' : sizeOf(u.size) }}</span>
              <TButton v-if="u.state === 'waiting' || u.state === 'sending'" size="sm" variant="ghost" color="neutral" icon="x" :aria-label="`Cancel ${u.name}`" @click="cancel(u)" />
            </div>
          </div>
        </div>
      </template>
    </TSplitter>
    <TModal v-model:open="deleteOpen" title="Delete?" size="sm">
      <p class="mb-0">
        {{ deleting?.length === 1 ? `Delete ${deleting[0]!.name}?` : `Delete these ${deleting?.length} items?` }}
      </p>
      <template #footer>
        <TButton color="neutral" variant="ghost" label="Cancel" @click="deleting = null" />
        <TButton color="error" icon="trash" label="Delete" @click="confirmDelete" />
      </template>
    </TModal>
  </div>
</template>

<style scoped>
.t-explorer { display: flex; flex-direction: column; height: 100%; min-height: 24rem; border: var(--tblr-border-width) solid var(--tblr-border-color); border-radius: var(--tblr-border-radius); background: var(--tblr-bg-surface); overflow: hidden; }
.t-explorer-split { flex: 1 1 auto; min-height: 0; }
.t-explorer-tree { height: 100%; overflow: auto; padding: .375rem; border-inline-end: var(--tblr-border-width) solid var(--tblr-border-color); }
.t-explorer-main { display: flex; flex-direction: column; height: 100%; min-width: 0; }
.t-explorer-bar { display: flex; align-items: center; gap: .25rem; padding: .375rem .5rem; border-bottom: var(--tblr-border-width) solid var(--tblr-border-color); min-width: 0; }
.t-explorer-body { display: flex; flex: 1 1 auto; min-height: 0; }
.t-explorer-items { flex: 1 1 auto; overflow: auto; min-width: 0; outline: none; }
.t-explorer-items.over { box-shadow: inset 0 0 0 2px var(--tblr-primary); background: var(--tblr-primary-lt); }
.t-explorer-table th { position: sticky; top: 0; background: var(--tblr-bg-surface); z-index: 1; font-weight: var(--tblr-font-weight-medium, 500); }
.t-explorer-table tr { cursor: default; user-select: none; }
.t-explorer-table tr.selected td { background: var(--tblr-primary-lt); }
.t-explorer-table tr.focused td:first-child { box-shadow: inset 2px 0 0 var(--tblr-primary); }
.t-explorer-table tr.over td { background: var(--tblr-primary-lt); box-shadow: inset 0 1px 0 var(--tblr-primary), inset 0 -1px 0 var(--tblr-primary); }
.t-explorer-table tr.cut, .t-explorer-card.cut { opacity: .5; }
.t-explorer-name { display: flex; align-items: center; gap: .5rem; min-width: 0; max-width: 32rem; }
.t-explorer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr)); gap: .5rem; padding: .5rem; }
.t-explorer-card { display: flex; flex-direction: column; align-items: center; gap: .25rem; padding: .75rem .5rem; border-radius: var(--tblr-border-radius); border: 1px solid transparent; cursor: default; user-select: none; text-align: center; min-width: 0; }
.t-explorer-card:hover { background: var(--tblr-bg-surface-secondary); }
.t-explorer-card.selected { background: var(--tblr-primary-lt); border-color: var(--tblr-primary); }
.t-explorer-card.over { border-color: var(--tblr-primary); }
.t-explorer-card-icon { font-size: 2rem; line-height: 1; display: block; height: 2rem; }
.t-explorer-card-name { font-size: .8125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.t-explorer-new { display: flex; align-items: center; gap: .5rem; padding: .375rem .75rem; }
.t-explorer-info { width: 18rem; flex: none; overflow: auto; border-inline-start: var(--tblr-border-width) solid var(--tblr-border-color); }
.t-explorer-uploads { border-top: var(--tblr-border-width) solid var(--tblr-border-color); padding: .5rem .75rem; max-height: 11rem; overflow: auto; }
.t-explorer-upload { display: flex; align-items: center; gap: .5rem; padding-block: .125rem; }
</style>
