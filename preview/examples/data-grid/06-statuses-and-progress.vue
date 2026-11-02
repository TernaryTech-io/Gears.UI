<!-- A resource's state as a status, a badge or a progress bar. -->
<template>
  <TDataGrid :items="[{ key: 'state', label: 'State' }, { key: 'environment', label: 'Environment' }, { key: 'disk', label: 'Disk usage' }]">
    <template #state><span class="status status-green">Running</span></template>
    <template #environment><TBadge color="info" label="Production" /></template>
    <template #disk>
      <div class="mb-1">68%</div>
      <TProgress :value="68" size="sm" label="68% used" />
    </template>
  </TDataGrid>
</template>
