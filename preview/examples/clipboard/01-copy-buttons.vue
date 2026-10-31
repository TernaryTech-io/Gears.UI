<!-- Copies the `text` given, or what the `target` field holds. It says “Copied” for a moment after. -->
<script setup lang="ts">
const token = 'gears_pat_8f2c91d07a4be41a'
</script>

<template>
  <div class="vstack gap-3" style="max-width: 32rem">
    <TFormField label="Access token" description="Shown once. Copy it now.">
      <TFieldGroup>
        <input id="token" class="form-control font-monospace" :value="token" readonly>
        <TCopyButton target="#token" />
      </TFieldGroup>
    </TFormField>
    <div class="d-flex align-items-center gap-2">
      <code>gears clone https://gears.example.com/online-shop</code>
      <TCopyButton text="gears clone https://gears.example.com/online-shop" icon-only variant="ghost" size="sm" label="Copy the command" />
    </div>
    <div class="btn-list">
      <TCopyButton text="#3673d1" label="Copy the color" color="primary" />
      <TCopyButton text="https://tabler.io" label="Copy the link" variant="soft" color="primary" />
    </div>
  </div>
</template>
