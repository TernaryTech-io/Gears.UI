<!-- `copy` puts a copy button beside a value people copy, such as an API key or a URL. -->
<template>
  <TDataGrid :cols="1" :items="[
    { label: 'Client ID', value: 'tblr_live_8f3a2c91d7e4', copy: true },
    { label: 'Webhook URL', value: 'https://example.com/hooks/tabler', copy: true }
  ]" />
</template>
