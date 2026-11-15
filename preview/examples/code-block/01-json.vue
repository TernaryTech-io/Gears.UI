<!-- Give a `value` and it's shown as JSON; keys, strings, numbers and literals each have a color, in both themes. The copy button sits in the corner. -->
<script setup lang="ts">
const product = {
  id: '65f1c2a9e4b0a1b2c3d4e5f6',
  name: 'Example name',
  price: 19.99,
  inStock: true,
  released: '2026-01-31',
  photo: null,
  labels: ['Example text']
}
</script>

<template>
  <TCodeBlock :value="product" label="A product" />
</template>
