<!-- `0` is a digit, `a` a letter, `*` either; other characters are written for you. `unmasked` keeps only what was typed. -->
<script setup lang="ts">
import { ref } from 'vue'

const phone = ref('')
const date = ref('')
const sku = ref('')
const card = ref('4242424242424242')
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TFormField label="Phone" :description="`Value: “${phone}”`">
        <TInputMask v-model="phone" mask="(000) 000-0000" icon="phone" placeholder="(555) 123-4567" />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Date" description="The pattern shows before typing">
        <TInputMask v-model="date" mask="00/00/0000" show-mask />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="SKU" :description="`Value: “${sku}”`">
        <TInputMask v-model="sku" mask="aaa-0000" placeholder="ABC-1234" />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Card number" :description="`Unmasked value: “${card}”`">
        <TInputMask v-model="card" mask="0000 0000 0000 0000" unmasked icon="credit-card" />
      </TFormField>
    </div>
  </div>
</template>
