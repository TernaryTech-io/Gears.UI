<!-- Charts follow the theme around them: light or dark, and a TThemeScope's accent and grays, as an application's pages do. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ThemeSettings } from '@ternarytech-io/gears-ui'

const accent = ref('purple')
const dark = ref(false)
const theme = (): ThemeSettings => ({ accent: accent.value, base: 'zinc', radius: '2', mode: dark.value ? 'dark' : 'light' })
const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
</script>

<template>
  <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
    <TAccentPicker v-model="accent" />
    <TSwitch v-model="dark" label="Dark" class="mb-0" />
  </div>
  <TThemeScope :theme="theme()" class="p-3 rounded">
    <TCard title="Active users">
      <TChart type="area" :series="[{ name: 'Users', data: [12, 19, 15, 28, 24, 31, 38, 42] }]" :categories="weeks" label="Active users by week" />
    </TCard>
  </TThemeScope>
</template>
