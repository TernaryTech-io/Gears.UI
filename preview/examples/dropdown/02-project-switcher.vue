<!-- The Studio's project switcher: the list loads when the menu opens, and the open project has a check. -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DropdownItem } from '@gears/ui'

const current = ref('Online Shop')
const projects = ref<string[]>([])

const items = computed<DropdownItem[][]>(() => [
  [{ type: 'label', label: 'Projects' }],
  projects.value.map(name => ({
    label: name, icon: 'box', trailingIcon: name === current.value ? 'check' : undefined,
    onSelect: () => { current.value = name }
  })),
  [
    { label: 'All projects', icon: 'packages', to: '/' },
    { label: 'New project', icon: 'plus', to: '/' }
  ]
])

function load(open: boolean) {
  if (open) projects.value = ['Online Shop', 'Inventory', 'Help Desk']
}
</script>

<template>
  <TDropdown :items="items" menu-class="dropdown-menu-arrow" @update:open="load">
    <TButton color="neutral" variant="ghost" icon="box" trailing-icon="selector" class="fw-semibold" :label="current" aria-label="Switch project" />
  </TDropdown>
</template>
