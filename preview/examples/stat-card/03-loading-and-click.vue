<!-- `loading` holds placeholders while the value is worked out; `clickable` makes the card a button that emits `click` (Enter and Space too). -->
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
const clicks = ref(0)
</script>

<template>
  <div class="d-flex align-items-center gap-3 mb-3">
    <TSwitch v-model="loading" label="Loading" class="mb-0" />
    <span class="small text-secondary">Clicked {{ clicks }} times.</span>
  </div>
  <div class="row row-cards">
    <div class="col-sm-6 col-lg-3">
      <TStatCard label="Orders" value="1,284" detail="This month" icon="shopping-cart" :loading="loading" />
    </div>
    <div class="col-sm-6 col-lg-3">
      <TStatCard label="Revenue" value="$48.2k" :trend="12.4" trend-label="vs last month" :sparkline="[4, 6, 5, 8, 7, 9, 11]" :loading="loading"
        clickable @click="clicks++" />
    </div>
  </div>
</template>
