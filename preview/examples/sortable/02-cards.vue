<!-- Without handles, the whole item drags. -->
<script setup lang="ts">
import { ref } from 'vue'

const steps = ref(['Validate the order', 'Charge the card', 'Reserve the stock', 'Send the email'])
</script>

<template>
  <TSortable v-model="steps" class="vstack gap-2" style="max-width: 24rem">
    <template #item="{ item, index }">
      <div class="card card-sm mb-0">
        <div class="card-body d-flex align-items-center gap-2">
          <span class="avatar avatar-xs rounded-circle bg-primary-lt">{{ index + 1 }}</span>
          {{ item }}
        </div>
      </div>
    </template>
  </TSortable>
</template>
