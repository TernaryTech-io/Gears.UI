<!-- Countries shaded by a number each, with a legend for the scale. Hover for the values. -->
<script setup lang="ts">
const visits = { US: 1240, CA: 310, MX: 120, BR: 260, GB: 480, DE: 620, FR: 390, ES: 210, IT: 180, PL: 140, IN: 540, JP: 300, AU: 230, ZA: 90 }
</script>

<template>
  <TCard title="Visits by country" flush>
    <div class="card-body">
      <TVectorMap :values="visits" legend label="Visits by country" height="22rem" />
    </div>
  </TCard>
</template>
