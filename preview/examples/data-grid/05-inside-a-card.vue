<!-- A datagrid has no border or background of its own: in a card it makes a detail panel, the title and actions in the header, more actions in the footer. -->
<template>
  <TCard title="Domain details">
    <template #actions>
      <TButton size="sm" color="neutral" icon="pencil" label="Edit" />
    </template>
    <TDataGrid item-width="12rem" :items="[
      { key: 'domain', label: 'Domain' },
      { label: 'Registrar', value: 'Third Party' },
      { key: 'ssl', label: 'SSL certificate' },
      { label: 'Expiration date', value: null }
    ]">
      <template #domain><a href="#" @click.prevent>tabler.io</a></template>
      <template #ssl><TIcon name="lock" class="text-green icon-inline" /> Valid until May 2, 2027</template>
    </TDataGrid>
    <template #footer>
      <div class="text-end"><TButton label="Renew domain" /></div>
    </template>
  </TCard>
</template>
