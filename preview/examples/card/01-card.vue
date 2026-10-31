<!-- A header with a title, subtitle and actions on the right; the body; a footer. -->
<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TCard title="Online Shop" subtitle="SQLite · 4 models">
        <template #actions>
          <TButton size="sm" color="neutral" variant="ghost" icon="dots-vertical" aria-label="More" />
        </template>
        <p class="text-secondary mb-0">Products, customers and orders for the demo store.</p>
        <template #footer>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-secondary small">Built 2 hours ago</span>
            <TButton size="sm" label="Open" trailing-icon="arrow-right" />
          </div>
        </template>
      </TCard>
    </div>
    <div class="col-md-6">
      <TCard status="success">
        <h3 class="card-title">Body only</h3>
        <p class="text-secondary mb-0">No header; a colored line along the top shows a status.</p>
      </TCard>
    </div>
  </div>
</template>
