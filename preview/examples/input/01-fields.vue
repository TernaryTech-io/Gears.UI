<!-- TFormField labels the control inside it; `hint` sits at the label's right, `description` under the control. Number inputs give back numbers. -->
<script setup lang="ts">
import { ref } from 'vue'

const name = ref('Online Shop')
const namespace = ref('')
const port = ref<number | null>(5180)
const search = ref('')
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TFormField label="Project name" required>
        <TInput v-model="name" />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Root namespace" hint="Optional" description="Defaults to the name without spaces.">
        <TInput v-model="namespace" placeholder="OnlineShop" />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Port" :description="`Value: ${JSON.stringify(port)} (${typeof port})`">
        <TInput v-model="port" type="number" min="1" max="65535" />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Search">
        <TInput v-model="search" icon="search" placeholder="Models, fields…">
          <template v-if="search" #trailing>
            <a href="#" class="link-secondary" aria-label="Clear" @click.prevent="search = ''"><TIcon name="x" /></a>
          </template>
        </TInput>
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Small, disabled">
        <TInput size="sm" model-value="Can't change this" disabled />
      </TFormField>
    </div>
  </div>
</template>
