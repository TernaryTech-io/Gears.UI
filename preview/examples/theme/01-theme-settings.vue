<!-- An application's theme: accent color, font, corner radius and base grays, with Tabler's theme settings. TThemeScope applies them to what's inside it, here a small sample of an app. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ThemeSettings } from '@ternarytech-io/gears-ui'

const theme = ref<ThemeSettings>({ accent: 'green', font: 'sans-serif', radius: '1', base: 'slate' })
</script>

<template>
  <div class="row g-4">
    <div class="col-lg-6 vstack gap-4">
      <TAccentPicker v-model="theme.accent" custom legend="Accent color" />
      <TFontPicker v-model="theme.font" legend="Font family" />
      <TRadiusPicker v-model="theme.radius" legend="Corner radius" />
      <TThemeBasePicker v-model="theme.base" legend="Theme base" />
    </div>
    <div class="col-lg-6">
      <TThemeScope :theme="theme" class="border rounded p-3">
        <div class="card mb-3">
          <div class="card-body">
            <h3 class="card-title">Orders</h3>
            <p class="text-secondary">Twelve orders are waiting to ship.</p>
            <div class="btn-list">
              <button type="button" class="btn btn-primary">Ship them</button>
              <button type="button" class="btn">Later</button>
            </div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <span class="badge bg-primary-lt">New</span>
          <span class="badge bg-secondary-lt">Draft</span>
          <span class="badge bg-success-lt">Shipped</span>
        </div>
      </TThemeScope>
    </div>
  </div>
</template>
