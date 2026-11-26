<!-- Over an in-memory provider (a short delay, as a server takes): two drives, one read-only, and one that can't be opened. Right-click, drag onto folders, F2, Delete, Ctrl+X and Ctrl+V; drop files to upload. -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ContextMenuItem, ExplorerDrive, ExplorerItem, ExplorerLocation, ExplorerProvider } from '@ternarytech-io/gears-ui'

interface Entry { id: string; drive: string; parent: string | null; name: string; folder: boolean; size?: number; type?: string; at: string; locked?: boolean }
let ids = 0
const now = () => new Date().toISOString()
const entries = ref<Entry[]>([])
function add(drive: string, parent: string | null, name: string, folder = false, size = 0, type = '', locked = false) {
  const entry = { id: `e${++ids}`, drive, parent, name, folder, size, type, at: now(), locked }
  entries.value.push(entry)
  return entry.id
}
const contracts = add('app', null, 'Contracts', true)
const y2026 = add('app', contracts, '2026', true)
add('app', y2026, 'lease.pdf', false, 184_000, 'application/pdf')
add('app', y2026, 'deed.pdf', false, 92_000, 'application/pdf', true)
add('app', null, 'Invoices', true)
add('app', null, 'logo.png', false, 24_000, 'image/png')
add('app', null, 'notes.txt', false, 1_200, 'text/plain')
const reports = add('share', null, 'Reports', true)
add('share', reports, 'q1.xlsx', false, 58_000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
for (let i = 1; i <= 60; i++) add('share', null, `scan-${String(i).padStart(3, '0')}.png`, false, 300_000 + i * 1000, 'image/png')

const wait = <T,>(value: T, ms = 250) => new Promise<T>(resolve => setTimeout(() => resolve(value), ms))
const asItem = (e: Entry): ExplorerItem => ({
  id: e.id, name: e.name, folder: e.folder, size: e.size, mimeType: e.type, modifiedAt: e.at,
  kind: e.folder ? null : e.type?.split('/')[1]?.toUpperCase() ?? null, can: e.locked ? { rename: false, move: false, delete: false } : undefined
})
const children = (drive: string, folder: string | null) => entries.value
  .filter(e => e.drive === drive && e.parent === folder)
  .sort((a, b) => (a.folder === b.folder ? a.name.localeCompare(b.name) : a.folder ? -1 : 1))

const provider: ExplorerProvider = {
  drives: () => wait<ExplorerDrive[]>([
    { id: 'app', name: 'App files', icon: 'database' },
    { id: 'share', name: 'Share', icon: 'server-2', readOnly: true },
    { id: 'backup', name: 'Backup', icon: 'archive' },
    { id: 'bucket', name: 'Bucket', icon: 'bucket', unavailable: 'It has no location in this environment yet.' }
  ]),
  // Pages of 25: folders first, then files.
  list: (drive, folder, cursor) => {
    const all = children(drive, folder)
    const start = Number(cursor ?? 0)
    return wait({ items: all.slice(start, start + 25).map(asItem), cursor: start + 25 < all.length ? String(start + 25) : null })
  },
  createFolder: async (drive, parent, name) => {
    const id = add(drive, parent, name, true)
    return asItem(entries.value.find(e => e.id === id)!)
  },
  rename: async (_drive, item, name) => {
    const e = entries.value.find(x => x.id === item.id)!
    if (children(e.drive, e.parent).some(x => x.name.toLowerCase() === name.toLowerCase() && x.id !== e.id)) throw new Error(`There's already ${name} here.`)
    e.name = name
    return asItem(e)
  },
  move: async (_drive, items, folder) => { for (const item of items) entries.value.find(e => e.id === item.id)!.parent = folder },
  remove: async (_drive, items) => { entries.value = entries.value.filter(e => !items.some(i => i.id === e.id)) },
  // Copy to… and Move to…: a file into a folder of any drive.
  copy: async (_drive, item, toDrive, toFolder) => {
    const from = entries.value.find(e => e.id === item.id)!
    const id = add(toDrive, toFolder, from.name, false, from.size, from.type)
    return wait(asItem(entries.value.find(e => e.id === id)!), 600)
  },
  transfer: async (_drive, item, toDrive, toFolder) => {
    const entry = entries.value.find(e => e.id === item.id)!
    entry.drive = toDrive
    entry.parent = toFolder
    return wait(asItem(entry), 600)
  },
  upload: (drive, folder, file, progress, signal) => new Promise((resolve, reject) => {
    let sent = 0
    const timer = setInterval(() => {
      if (signal.aborted) { clearInterval(timer); reject(new Error('Canceled')); return }
      sent = Math.min(file.size, sent + Math.max(1, file.size / 8))
      progress(sent)
      if (sent >= file.size) {
        clearInterval(timer)
        const id = add(drive, folder, file.name, false, file.size, file.type)
        resolve(asItem(entries.value.find(e => e.id === id)!))
      }
    }, 150)
  }),
  href: (_drive, item) => `data:text/plain,${encodeURIComponent(item.name)}`
}

const location = ref<ExplorerLocation | null>(null)
const selection = ref<string[]>([])
const opened = ref('')
const extra = (items: ExplorerItem[]): ContextMenuItem[][] => items.length === 1 && !items[0]!.folder
  ? [[{ label: 'Tags…', icon: 'tags', onSelect: () => { opened.value = `Tags of ${items[0]!.name}` } }]]
  : []
const chosen = computed(() => entries.value.filter(e => selection.value.includes(e.id)))
</script>

<template>
  <div class="vstack gap-2">
    <div style="height: 32rem">
      <TFileExplorer v-model:location="location" v-model:selection="selection" :provider="provider" :menu="extra" storage-key="preview-explorer"
        @open="item => { opened = `Opened ${item.name}` }">
        <template #info="{ items }">
          <div class="p-3 small">
            <div v-if="!items.length" class="text-secondary">Choose something to see its details.</div>
            <template v-else-if="items.length === 1">
              <div class="fw-medium mb-2 text-break">{{ items[0]!.name }}</div>
              <div class="text-secondary">{{ items[0]!.folder ? 'Folder' : items[0]!.mimeType }}</div>
            </template>
            <div v-else>{{ items.length }} chosen</div>
          </div>
        </template>
      </TFileExplorer>
    </div>
    <div class="small text-secondary">
      {{ opened || 'Double-click a file to open it.' }} · At: {{ location ? `${location.drive}/${location.path.map(p => p.name).join('/')}` : '…' }} · Chosen: {{ chosen.map(c => c.name).join(', ') || 'none' }}
    </div>
  </div>
</template>
