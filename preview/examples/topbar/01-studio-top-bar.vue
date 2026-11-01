<!-- The Studio's top bar: the project switcher on the left; search, the page's actions, the theme and the user menu on the right. -->
<script setup lang="ts">
import type { DropdownItem } from '@ternarytech-io/gears-ui'

const projects: DropdownItem[][] = [[{ label: 'Online Shop', icon: 'box', trailingIcon: 'check' }, { label: 'Inventory', icon: 'box' }]]
const user: DropdownItem[][] = [[{ type: 'label', label: 'Jordan Diaz', description: 'jordan@example.com' }], [{ label: 'Sign out', icon: 'logout' }]]
</script>

<template>
  <div class="preview-frame">
    <TTopbar>
      <template #left>
        <TDropdown :items="projects">
          <TButton color="neutral" variant="ghost" icon="box" trailing-icon="selector" class="fw-semibold" label="Online Shop" />
        </TDropdown>
      </template>
      <template #right>
        <TInput icon="search" placeholder="Search… (Ctrl K)" size="sm" class="d-none d-md-block" style="width: 14rem" aria-label="Search" />
        <TButton size="sm" icon="hammer" label="Build" />
        <TSeparator orientation="vertical" />
        <TColorModeButton />
        <TDropdown :items="user" align="end">
          <TButton color="neutral" variant="ghost" square aria-label="User menu"><TAvatar text="JD" size="sm" /></TButton>
        </TDropdown>
      </template>
    </TTopbar>
    <div class="p-4 text-secondary">Page content</div>
  </div>
</template>
