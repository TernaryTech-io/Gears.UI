<!-- `item-width` is the narrowest a column gets (15rem by default): lower it for short values and more fit in a row. `cols` fixes the number of columns at any width instead (1 to 4), and `gap` makes it denser. -->
<script setup lang="ts">
const server = [
  { label: 'CPU', value: '8 cores' }, { label: 'Memory', value: '32 GB' }, { label: 'Storage', value: '512 GB' },
  { label: 'Region', value: 'eu-central' }, { label: 'Uptime', value: '99.98%' }, { label: 'Backups', value: 'Daily' }
]
</script>

<template>
  <div class="vstack gap-4">
    <TDataGrid item-width="7rem" :items="server" />
    <TDataGrid :cols="2" :items="[
      { label: 'Order', value: '#48213' }, { key: 'status', label: 'Status' },
      { label: 'Placed', value: 'September 12, 2026' }, { key: 'total', label: 'Total' }
    ]">
      <template #status><TBadge color="success" label="Paid" /></template>
      <template #total><strong>$248.00</strong></template>
    </TDataGrid>
    <TDataGrid item-width="7rem" gap="0.75rem" :items="server" />
  </div>
</template>
