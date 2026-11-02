<!-- `column` draws upright bars, `bar` bars across. `stacked` piles the series up; `colors` takes named colors (success, warning…) or any CSS color. -->
<script setup lang="ts">
const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
const tickets = [
  { name: 'Open', data: [44, 55, 41, 67] },
  { name: 'Solved', data: [13, 23, 20, 8] },
  { name: 'Closed', data: [11, 17, 15, 15] }
]
const regions = ['West', 'East', 'North', 'South', 'Central']
const sales = [{ name: 'Orders', data: [420, 380, 290, 240, 120] }]
</script>

<template>
  <div class="row row-cards">
    <div class="col-lg-6">
      <TCard title="Tickets by quarter">
        <TChart type="column" stacked :series="tickets" :categories="quarters" :colors="['warning', 'success', 'neutral']" label="Tickets by quarter" />
      </TCard>
    </div>
    <div class="col-lg-6">
      <TCard title="Orders by region">
        <TChart type="bar" :series="sales" :categories="regions" label="Orders by region" />
      </TCard>
    </div>
  </div>
</template>
