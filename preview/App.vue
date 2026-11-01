<script setup lang="ts">
// The preview site's frame: a TShell whose sidebar lists the component pages by group.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useColorMode, type CommandGroup, type NavItem } from '@ternarytech-io/gears-ui'
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

// Ctrl+K: every page, found by its name, its group, its components and its description.
const { toggle } = useColorMode()
const searchGroups = computed<CommandGroup[]>(() => [
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { label: 'Getting started', icon: 'rocket', to: '/' },
      { label: 'Foundations', icon: 'palette', to: '/foundations', keywords: ['colors', 'type'] },
      ...pages.map(p => ({ label: p.name, icon: icons[p.group], suffix: p.group, keywords: [...p.components, p.description], to: `/components/${p.slug}` }))
    ]
  },
  { id: 'actions', label: 'Actions', items: [{ label: 'Switch the light or dark theme', icon: 'moon', onSelect: toggle }] }
])
</script>

<template>
  <TShell :nav="nav" brand="Gears UI" tagline="Components" logo="/gears-logo.png" storage-key="gears-ui-preview">
    <template #sidebar-footer="{ folded }">
      <div v-if="!folded" class="px-3 small text-secondary">@ternarytech-io/gears-ui 0.1.0 · Tabler 1.7.1</div>
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
        <TSearchButton label="Search components…" class="d-none d-lg-inline-flex" />
        <TSearchButton collapsed class="d-lg-none" />
        <TButton href="https://docs.tabler.io/ui" target="_blank" color="neutral" variant="ghost" icon="book" label="Tabler" />
        <TColorModeButton />
      </template>
    </TTopbar>
    <RouterView :key="route.fullPath" />
    <TCommandPalette :groups="searchGroups" placeholder="Search components and pages…" />
    <TToaster />
  </TShell>
</template>
