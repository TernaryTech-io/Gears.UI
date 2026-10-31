<!-- This site has one: press Ctrl+K (⌘K on a Mac) or use the search in the top bar. Type to filter, arrows to move, Enter to open. Items go to a page (`to`) or run an action (`onSelect`). -->
<script setup lang="ts">
import { useCommandPalette } from '@gears/ui'

const { open } = useCommandPalette()

const source = `<!-- In the app's frame, once -->
<TCommandPalette :groups="groups" placeholder="Search pages and projects…" @update:open="loadProjects" />

<!-- In the top bar -->
<TSearchButton class="d-none d-lg-inline-flex" />
<TSearchButton collapsed class="d-lg-none" />

const groups = computed<CommandGroup[]>(() => [
  { id: 'pages', label: 'Go to', items: [{ label: 'Users', icon: 'users', to: '/users' }, …] },
  { id: 'projects', label: 'Projects', items: projects.value.map(p => ({ label: p.name, suffix: p.rootNamespace, icon: 'box', to: \`/projects/\${p.id}\` })) }
])`
</script>

<template>
  <div class="vstack gap-3">
    <div class="d-flex flex-wrap align-items-center gap-3">
      <TSearchButton />
      <TSearchButton collapsed />
      <TButton color="neutral" variant="outline" icon="command" label="Open it from code" @click="open = true" />
    </div>
    <pre class="preview-code rounded mb-0">{{ source }}</pre>
  </div>
</template>
