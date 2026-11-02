<!-- `horizontal` puts each label beside its value, a pair to a row, which is easy to scan when values are long. `title-width` sets the labels' width, and `cols` shows several pairs in a row. -->
<template>
  <div class="vstack gap-4">
    <TDataGrid horizontal :items="[
      { label: 'Plan', value: 'Business' },
      { key: 'status', label: 'Status' },
      { label: 'Address', value: '44 Harbor Street, Portland, OR 97209, United States' }
    ]">
      <template #status><span class="status status-green">Active</span></template>
    </TDataGrid>
    <TDataGrid horizontal :cols="2" title-width="5rem" :items="[
      { label: 'CPU', value: '8 cores' }, { label: 'Memory', value: '32 GB' },
      { label: 'Storage', value: '512 GB' }, { label: 'Region', value: 'eu-central' }
    ]" />
  </div>
</template>
