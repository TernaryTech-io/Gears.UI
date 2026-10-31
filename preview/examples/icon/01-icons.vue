<!-- Icons by name from Tabler Icons (tabler.io/icons). They take the size and color of the text around them. -->
<script setup lang="ts">
const names = ['box', 'packages', 'database', 'table', 'code', 'git-branch', 'player-play', 'player-stop', 'refresh', 'settings',
  'users', 'user-circle', 'shield', 'badge', 'license', 'search', 'plus', 'pencil', 'trash', 'copy', 'download', 'upload',
  'check', 'x', 'alert-triangle', 'info-circle', 'history', 'server', 'cloud', 'lock', 'key', 'logout']
</script>

<template>
  <div class="vstack gap-4">
    <div class="row g-2">
      <div v-for="name in names" :key="name" class="col-6 col-sm-4 col-md-3 col-xl-2">
        <div class="d-flex align-items-center gap-2 p-2 border rounded">
          <TIcon :name="name" />
          <code class="small text-truncate">{{ name }}</code>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center gap-3">
      <TIcon name="settings" class="fs-5" />
      <TIcon name="settings" class="fs-2" />
      <TIcon name="settings" class="fs-1 text-primary" />
      <TIcon name="loader-2" spin class="fs-2 text-secondary" />
    </div>
  </div>
</template>
