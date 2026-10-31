<!-- `flush` drops the body's padding, so a table or list runs to the card's edges. -->
<script setup lang="ts">
const members = [
  { id: 1, name: 'Jordan Diaz', email: 'jordan@example.com', role: 'Owner' },
  { id: 2, name: 'Alex Brown', email: 'alex@example.com', role: 'Developer' },
  { id: 3, name: 'Casey Dunn', email: 'casey@example.com', role: 'Viewer' }
]
</script>

<template>
  <div class="row g-3">
    <div class="col-md-7">
      <TCard title="Members" flush>
        <TTable card :rows="members" :columns="[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }]" />
      </TCard>
    </div>
    <div class="col-md-5">
      <TCard title="Categories" flush>
        <div class="list-group list-group-flush">
          <a href="#" class="list-group-item list-group-item-action active" @click.prevent>Catalog</a>
          <a href="#" class="list-group-item list-group-item-action" @click.prevent>Customers</a>
          <a href="#" class="list-group-item list-group-item-action" @click.prevent>Orders</a>
        </div>
      </TCard>
    </div>
  </div>
</template>
