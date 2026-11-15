<!-- A `title` gives it a header, with the copy button and any `actions`. YAML is highlighted too, comments and block text included. -->
<script setup lang="ts">
const spec = `openapi: 3.1.1
info:
  title: Online Shop API
  version: v12 # the release
  description: |
    The Production environment's API.
    Send an Api Key as: Authorization: Bearer gak_…
paths:
  /online-shop/product:
    get:
      tags:
        - Product
      deprecated: false
`
</script>

<template>
  <TCodeBlock :code="spec" language="yaml" title="openapi.yaml">
    <template #actions>
      <TButton variant="ghost" size="sm" icon="download" label="Download" />
    </template>
  </TCodeBlock>
</template>
