<!-- The group's color, style and size; `vertical` stacks them; `block` shares the full width. -->
<script setup lang="ts">
import type { ButtonGroupItem } from '@ternarytech-io/gears-ui'

const views: ButtonGroupItem[] = [{ label: 'Day', icon: 'calendar' }, { label: 'Week' }, { label: 'Month' }]
</script>

<template>
  <div class="vstack gap-3">
    <div class="d-flex flex-wrap gap-3 align-items-start">
      <TButtonGroup :items="views" color="primary" />
      <TButtonGroup :items="views" color="primary" variant="soft" />
      <TButtonGroup :items="views" variant="ghost" size="lg" />
      <TButtonGroup :items="views" vertical variant="outline" />
    </div>
    <TButtonGroup :items="views" block variant="outline" color="primary" />
  </div>
</template>
