<!-- Loading keeps the button's size and blocks clicks. `to` makes a router link, `href` a plain one. -->
<script setup lang="ts">
import { ref } from 'vue'

const saving = ref(false)
function save() {
  saving.value = true
  setTimeout(() => { saving.value = false }, 1500)
}
</script>

<template>
  <div class="vstack gap-3">
    <div class="btn-list">
      <TButton icon="device-floppy" label="Save" :loading="saving" @click="save" />
      <TButton label="Disabled" disabled />
      <TButton label="Disabled link" to="/" disabled variant="outline" />
    </div>
    <div class="btn-list">
      <TButton to="/" icon="home" label="Router link" color="neutral" />
      <TButton href="https://tabler.io" target="_blank" label="External link" variant="link" trailing-icon="external-link" />
    </div>
    <TButton block label="Block: the whole width" variant="soft" />
  </div>
</template>
