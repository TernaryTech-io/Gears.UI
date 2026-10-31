<!-- Click the field for the picker. The swatch shows the color; the value is text you can also type. -->
<script setup lang="ts">
import { ref } from 'vue'

const brand = ref('#3673d1')
const overlay = ref('rgba(28, 29, 29, 0.6)')
const accent = ref('#2fb344')
const swatches = ['#3673d1', '#4263eb', '#ae3ec9', '#d6336c', '#d63939', '#f76707', '#f59f00', '#2fb344', '#0ca678', '#17a2b8']
</script>

<template>
  <div class="row g-3">
    <div class="col-md-4">
      <TFormField label="Brand color" :description="brand">
        <TColorPicker v-model="brand" :swatches="swatches" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Overlay" description="With transparency, as rgba()">
        <TColorPicker v-model="overlay" alpha format="rgb" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Accent" description="Only the preset colors">
        <TColorPicker v-model="accent" :swatches="swatches" swatches-only />
      </TFormField>
    </div>
    <div class="col-12">
      <div class="d-flex gap-2">
        <span class="badge text-white" :style="{ background: brand }">Brand</span>
        <span class="badge text-white" :style="{ background: accent }">Accent</span>
      </div>
    </div>
  </div>
</template>
