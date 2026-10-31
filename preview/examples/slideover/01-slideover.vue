<!-- Details or a form beside the page. Slides in from either side, the top or the bottom. -->
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const side = ref<'start' | 'end'>('end')
const show = (s: 'start' | 'end') => { side.value = s; open.value = true }
</script>

<template>
  <div class="btn-list">
    <TButton color="neutral" icon="layout-sidebar-right" label="From the end" @click="show('end')" />
    <TButton color="neutral" icon="layout-sidebar" label="From the start" @click="show('start')" />
  </div>
  <TSlideover v-model:open="open" :side="side" title="Product #1042" description="Catalog · Product">
    <div class="datagrid">
      <div class="datagrid-item"><div class="datagrid-title">Name</div><div class="datagrid-content">Desk lamp</div></div>
      <div class="datagrid-item"><div class="datagrid-title">Price</div><div class="datagrid-content">$34.00</div></div>
      <div class="datagrid-item"><div class="datagrid-title">Stock</div><div class="datagrid-content">18</div></div>
      <div class="datagrid-item"><div class="datagrid-title">Status</div><div class="datagrid-content"><TBadge color="success" label="Active" /></div></div>
    </div>
    <template #footer="{ close }">
      <TButton color="neutral" variant="ghost" label="Close" @click="close" />
      <TButton icon="pencil" label="Edit" />
    </template>
  </TSlideover>
</template>
