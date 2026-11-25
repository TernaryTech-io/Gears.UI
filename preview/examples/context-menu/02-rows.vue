<!-- Each row its own menu: `items` is a function of the event, which finds the row it came from. A "…" button opens it from code. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ContextMenuItem } from '@ternarytech-io/gears-ui'

const files = ref([
  { name: 'lease.pdf', locked: false },
  { name: 'deed.pdf', locked: true },
  { name: 'memo.txt', locked: false }
])
const last = ref('')
const menu = ref<{ open: (x: number, y: number, items?: ContextMenuItem[]) => boolean }>()

function itemsOf(name: string | undefined): ContextMenuItem[] {
  const file = files.value.find(f => f.name === name)
  if (!file) return []
  return [
    { type: 'label', label: file.name },
    { label: 'Rename', icon: 'pencil', disabled: file.locked, reason: file.locked ? 'It\'s on hold' : undefined, onSelect: () => { last.value = `Rename ${file.name}` } },
    { label: 'Delete', icon: 'trash', color: 'error', disabled: file.locked, reason: file.locked ? 'It\'s on hold' : undefined, onSelect: () => { last.value = `Delete ${file.name}` } }
  ]
}
const forEvent = (event: MouseEvent | KeyboardEvent) => itemsOf((event.target as HTMLElement).closest<HTMLElement>('[data-file]')?.dataset.file)
function more(event: MouseEvent, name: string) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  menu.value?.open(rect.left, rect.bottom + 2, itemsOf(name))
}
</script>

<template>
  <div class="vstack gap-2">
    <TContextMenu ref="menu" :items="forEvent" class="list-group">
      <div v-for="f in files" :key="f.name" :data-file="f.name" tabindex="0" class="list-group-item d-flex align-items-center gap-2">
        <TIcon :name="f.locked ? 'lock' : 'file'" class="text-secondary" />
        <span class="flex-fill">{{ f.name }}</span>
        <TButton size="sm" variant="ghost" color="neutral" icon="dots" :aria-label="`Actions for ${f.name}`" @click="more($event, f.name)" />
      </div>
    </TContextMenu>
    <span v-if="last" class="small text-secondary">Chose: {{ last }}</span>
  </div>
</template>
