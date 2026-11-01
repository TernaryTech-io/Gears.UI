<!-- The Studio's user menu: an avatar trigger, the person's name and email as a heading. -->
<script setup lang="ts">
import type { DropdownItem } from '@ternarytech-io/gears-ui'

const items: DropdownItem[][] = [
  [{ type: 'label', label: 'Jordan Diaz', description: 'jordan@example.com' }],
  [{ label: 'Account', icon: 'user-circle', to: '/' }],
  [{ label: 'Sign out', icon: 'logout', onSelect: () => {} }]
]
</script>

<template>
  <TDropdown :items="items">
    <TButton color="neutral" variant="ghost" square aria-label="User menu">
      <TAvatar text="JD" size="sm" />
    </TButton>
  </TDropdown>
</template>
