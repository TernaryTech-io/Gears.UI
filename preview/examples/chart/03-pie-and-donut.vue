<!-- A pie or donut uses the first series, a slice per category, with a legend. Clicking a slice (or any point) emits `point-click`. -->
<script setup lang="ts">
import { ref } from 'vue'

const channels = ['Email', 'Phone', 'Chat', 'Web form']
const cases = [{ name: 'Cases', data: [44, 25, 18, 13] }]
const clicked = ref('')
</script>

<template>
  <div class="row row-cards">
    <div class="col-md-6">
      <TCard title="Cases by channel">
        <TChart type="donut" :series="cases" :categories="channels" label="Cases by channel" @point-click="p => clicked = String(p.category)" />
        <div class="small text-secondary text-center mt-2">{{ clicked ? `Clicked: ${clicked}` : 'Click a slice.' }}</div>
      </TCard>
    </div>
    <div class="col-md-6">
      <TCard title="Plans">
        <TChart type="pie" :series="[{ name: 'Accounts', data: [62, 28, 10] }]" :categories="['Free', 'Team', 'Enterprise']" label="Accounts by plan" />
      </TCard>
    </div>
  </div>
</template>
