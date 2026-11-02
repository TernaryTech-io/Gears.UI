<!-- A value can be anything: a slot named by the item's `key` draws it (avatars, a status, an icon, a field), or write TDataGridItem children with their own content. -->
<template>
  <TDataGrid :items="[
    { label: 'Registrar', value: 'Third Party' },
    { label: 'Port number', value: 3306 },
    { key: 'creator', label: 'Creator' },
    { key: 'network', label: 'Edge network' },
    { key: 'team', label: 'Team' },
    { key: 'checked', label: 'Icon' }
  ]">
    <template #creator>
      <span class="d-flex align-items-center gap-2"><TAvatar text="PK" size="xs" /> Paweł Kuna</span>
    </template>
    <template #network><span class="status status-green">Active</span></template>
    <template #team>
      <div class="avatar-list avatar-list-stacked">
        <TAvatar text="JL" size="sm" /><TAvatar text="AP" size="sm" /><TAvatar text="BO" size="sm" /><TAvatar text="+3" size="sm" />
      </div>
    </template>
    <template #checked><TIcon name="check" class="text-green icon-inline" /> Checked</template>
    <TDataGridItem label="Checkbox"><TCheckbox :model-value="true" label="Click me" class="mb-0" /></TDataGridItem>
    <TDataGridItem label="Longer description" value="Lorem ipsum dolor sit amet, consectetur adipisicing elit." />
  </TDataGrid>
</template>
