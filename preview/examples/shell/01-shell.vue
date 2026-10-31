<!-- This site's frame is a TShell: the dark sidebar folds to icons with the round button on its edge (remembered), and becomes a top menu on small screens. Nav items with children are accordion groups, or flyouts when folded. -->
<script setup lang="ts">
const source = `<TShell :nav="nav" brand="Gears" tagline="Studio" logo="/gears-logo.png" storage-key="gears-studio">
  <template #sidebar-footer="{ folded }">…the signed-in user…</template>
  <TTopbar>…</TTopbar>
  <RouterView />
</TShell>

const nav: NavItem[] = [
  { label: 'All projects', icon: 'packages', to: '/projects', exact: true },
  { label: 'Online Shop', icon: 'box', defaultOpen: true, children: [
    { label: 'Model', to: '/projects/1/model' },
    { label: 'Data', to: '/projects/1/data' },
    { label: 'Code', to: '/projects/1/code' }
  ] },
  { label: 'Administration', icon: 'shield', badge: '!', children: [
    { label: 'Users', to: '/users' },
    { label: 'License', to: '/license', badge: { label: '!', color: 'warning' } }
  ] }
]`
</script>

<template>
  <pre class="preview-code rounded">{{ source }}</pre>
</template>
