<!-- Folders read as they open (a short delay, as a server takes): the keyboard works it, and one folder fails to load, with Try again. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { TreeNode } from '@ternarytech-io/gears-ui'

const folder = (id: string, label: string): TreeNode => ({ id, label, icon: 'folder', openIcon: 'folder-open' })
const drives: TreeNode[] = [
  { id: 'app', label: 'App files', icon: 'database', leaf: false },
  { id: 'share', label: 'Share', icon: 'server-2', leaf: false },
  { id: 'archive', label: 'Archive', icon: 'archive', leaf: true, disabled: true }
]
const contents: Record<string, TreeNode[]> = {
  app: [folder('app/contracts', 'Contracts'), folder('app/invoices', 'Invoices')],
  'app/contracts': [folder('app/contracts/2025', '2025'), folder('app/contracts/2026', '2026')],
  'app/contracts/2025': [],
  'app/contracts/2026': [folder('app/contracts/2026/acme', 'Acme')],
  'app/contracts/2026/acme': [],
  'app/invoices': [],
  share: [folder('share/projects', 'Projects'), folder('share/broken', 'Unreachable')],
  'share/projects': []
}
let tries = 0
function load(node: TreeNode): Promise<TreeNode[]> {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (node.id === 'share/broken' && tries++ % 2 === 0) reject(new Error('The share couldn\'t be reached.'))
    else resolve(contents[node.id] ?? [])
  }, 400))
}
const selected = ref<string | null>('app')
const expanded = ref<string[]>([])
const tree = ref<{ reveal: (ids: string[]) => Promise<void> }>()
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TTree v-model:selected="selected" v-model:expanded="expanded" :nodes="drives" :load="load" label="Folders" ref="tree" />
    </div>
    <div class="col-md-6 vstack gap-2 small">
      <div><span class="text-secondary">Chosen:</span> {{ selected ?? 'none' }}</div>
      <div><span class="text-secondary">Open:</span> {{ expanded.join(', ') || 'none' }}</div>
      <div>
        <TButton size="sm" variant="outline" label="Reveal Acme" @click="tree?.reveal(['app', 'app/contracts', 'app/contracts/2026', 'app/contracts/2026/acme'])" />
      </div>
    </div>
  </div>
</template>
