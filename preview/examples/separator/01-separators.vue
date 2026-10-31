<!-- A plain line, one with a label, and a vertical one between items in a row. -->
<template>
  <div>
    <p class="mb-0">Above</p>
    <TSeparator />
    <p>Below</p>
    <TSeparator label="or" />
    <div class="d-flex align-items-center gap-3" style="height: 1.5rem">
      <span>Model</span>
      <TSeparator orientation="vertical" />
      <span>Data</span>
      <TSeparator orientation="vertical" />
      <span>Code</span>
    </div>
  </div>
</template>
