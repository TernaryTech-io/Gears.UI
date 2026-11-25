<!-- Drop targets: drag a file onto a folder (not the read-only one); folders drag too. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { TreeNode } from '@ternarytech-io/gears-ui'

const nodes: TreeNode[] = [
  {
    id: 'share', label: 'Share', icon: 'server-2', children: [
      { id: 'reports', label: 'Reports', icon: 'folder', openIcon: 'folder-open', children: [] },
      { id: 'scans', label: 'Scans', icon: 'folder', openIcon: 'folder-open', children: [] },
      { id: 'locked', label: 'Read-only', icon: 'lock', children: [] }
    ]
  }
]
const expanded = ref(['share'])
const files = ['q1.pdf', 'scan-01.png']
const moved = ref<string[]>([])
const droppable = (node: TreeNode, event: DragEvent) => node.id !== 'locked' && (event.dataTransfer?.types.includes('text/x-item') ?? false)
function start(event: DragEvent, name: string) {
  event.dataTransfer?.setData('text/x-item', name)
}
function drop({ node, event }: { node: TreeNode; event: DragEvent }) {
  moved.value.push(`${event.dataTransfer?.getData('text/x-item')} → ${node.label}`)
}
function dragFolder({ node, event }: { node: TreeNode; event: DragEvent }) {
  event.dataTransfer?.setData('text/x-item', `the ${node.label} folder`)
}
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TTree v-model:expanded="expanded" :nodes="nodes" :droppable="droppable" :draggable="n => n.id !== 'share'" label="Folders"
        @drop="drop" @dragstart="dragFolder" />
    </div>
    <div class="col-md-6 vstack gap-2">
      <div v-for="f in files" :key="f" draggable="true" class="border rounded px-2 py-1 d-inline-flex align-items-center gap-2" @dragstart="start($event, f)">
        <TIcon name="file" /> {{ f }}
      </div>
      <div v-for="(m, i) in moved" :key="i" class="small text-secondary">{{ m }}</div>
    </div>
  </div>
</template>
