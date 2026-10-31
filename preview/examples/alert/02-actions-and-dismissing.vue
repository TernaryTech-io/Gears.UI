<!-- Actions go under the message. `important` fills the alert with its color. Dismissible alerts emit `close`. -->
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <div class="vstack gap-2">
    <TAlert color="warning" title="Unsaved changes" description="Two models changed since the last build.">
      <template #actions>
        <TButton size="sm" color="warning" label="Build now" />
        <TButton size="sm" color="neutral" variant="ghost" label="Review changes" />
      </template>
    </TAlert>
    <TAlert color="error" variant="important" title="Read-only" description="The license expired, so projects can be viewed but not changed." />
    <TAlert v-if="visible" color="info" dismissible description="Tip: press Ctrl+K to search pages and projects." @close="visible = false" />
    <TButton v-else size="sm" variant="link" label="Show the tip again" @click="visible = true" />
  </div>
</template>
