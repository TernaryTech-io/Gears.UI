<!-- `multiple` shows chips you can remove; `create` adds values that aren't in the list (they come back as strings). -->
<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>(['catalog', 'public'])
const roles = ref<string[]>(['Developer'])
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TFormField label="Tags" description="Type a new tag and press Enter." hint="Any words">
        <TAdvancedSelect v-model="tags" :items="['catalog', 'public', 'internal', 'archived']" multiple create placeholder="Add tags" />
      </TFormField>
      <code class="small">{{ JSON.stringify(tags) }}</code>
    </div>
    <div class="col-md-6">
      <TFormField label="Roles that can edit" hint="Up to 2">
        <TAdvancedSelect v-model="roles" :items="['Owner', 'Developer', 'Editor', 'Viewer']" multiple :max-items="2" />
      </TFormField>
    </div>
  </div>
</template>
