<!-- Click to rate, click again to clear; the arrow keys work too. Stars, hearts or circles, in any color. -->
<script setup lang="ts">
import { ref } from 'vue'

const stars = ref<number | null>(3)
const hearts = ref<number | null>(null)
</script>

<template>
  <div class="row g-3">
    <div class="col-md-4">
      <TFormField label="Stars" :description="stars ? `${stars} of 5` : 'Not rated'">
        <TRating v-model="stars" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Hearts, out of 10" :description="hearts ? `${hearts} of 10` : 'Not rated'">
        <TRating v-model="hearts" shape="heart" color="red" :max="10" size="sm" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Read only">
        <TRating :model-value="4" shape="circle" color="primary" size="lg" readonly />
      </TFormField>
    </div>
  </div>
</template>
