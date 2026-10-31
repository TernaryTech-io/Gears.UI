<!-- Checkboxes for choices saved with a form; switches for settings that apply right away. -->
<script setup lang="ts">
import { ref } from 'vue'

const required = ref(true)
const unique = ref(false)
const follow = ref(true)
const dark = ref(false)
</script>

<template>
  <div class="row g-4">
    <div class="col-md-6">
      <div class="form-label">Property</div>
      <TCheckbox v-model="required" label="Required" description="A value must be given." />
      <TCheckbox v-model="unique" label="Unique" description="No two rows share a value." />
      <TCheckbox label="Indexed" indeterminate description="Some selected properties are indexed." />
      <TCheckbox label="Disabled" disabled />
    </div>
    <div class="col-md-6">
      <div class="form-label">Log</div>
      <TSwitch v-model="follow" label="Follow the output" />
      <TSwitch v-model="dark" label="Dark theme" description="Applies right away." />
      <TSwitch label="Disabled" disabled />
    </div>
  </div>
</template>
