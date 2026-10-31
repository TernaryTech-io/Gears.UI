<!-- A smaller toolbar for short texts such as descriptions. -->
<script setup lang="ts">
import { ref } from 'vue'

const description = ref('<p>Products have a <em>name</em>, a price and a stock count.</p>')
</script>

<template>
  <TFormField label="Model description">
    <TRichEditor v-model="description" :height="180" toolbar="bold italic | bullist numlist | link" :plugins="['lists', 'link', 'autolink']" />
  </TFormField>
</template>
