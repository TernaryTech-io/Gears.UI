<!-- Labels and their values, in as many columns as fit: the grid reflows on its own. An empty value is written as a dash. -->
<template>
  <TDataGrid :items="[
    { label: 'Registrar', value: 'Third Party' },
    { label: 'Port number', value: 3306 },
    { label: 'Age', value: '15 days' },
    { label: 'Expiration date', value: null }
  ]" />
</template>
