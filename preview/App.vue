<script setup lang="ts">
// The preview site's frame: a TShell whose sidebar lists the component pages by group.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { NavItem } from '@gears/ui'
import { groups, pages } from './registry'

const route = useRoute()

const icons: Record<string, string> = {
  Elements: 'components', Forms: 'forms', Overlays: 'stack-2', Navigation: 'directions', Data: 'table', Layout: 'layout-dashboard', Plugins: 'plug', Studio: 'settings-cog'
}

const nav = computed<NavItem[]>(() => [
  { label: 'Getting started', icon: 'rocket', to: '/', exact: true },
  { label: 'Foundations', icon: 'palette', to: '/foundations' },
  ...groups.map(group => ({
    label: group,
    icon: icons[group],
    children: pages.filter(p => p.group === group).map(p => ({ label: p.name, to: `/components/${p.slug}` }))
  }))
])

const current = computed(() => pages.find(p => p.slug === route.params.slug))
</script>

<template>
  <TShell :nav="nav" brand="Gears UI" tagline="Components" logo="/gears-logo.png" storage-key="gears-ui-preview">
    <template #sidebar-footer="{ folded }">
      <div v-if="!folded" class="px-3 small text-secondary">@gears/ui 0.1.0 · Tabler 1.7.1</div>
    </template>
    <TTopbar>
      <template #left>
        <span class="fw-semibold text-secondary">{{ current ? current.group : 'Gears UI' }}</span>
        <template v-if="current">
          <TIcon name="chevron-right" class="text-secondary" />
          <span class="fw-medium text-truncate">{{ current.name }}</span>
        </template>
      </template>
      <template #right>
        <TButton href="https://docs.tabler.io/ui" target="_blank" color="neutral" variant="ghost" icon="book" label="Tabler" />
        <TColorModeButton />
      </template>
    </TTopbar>
    <RouterView :key="route.fullPath" />
  </TShell>
</template>
