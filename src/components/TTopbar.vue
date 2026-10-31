<script setup lang="ts">
// The bar along the top of a page: things on the left (a switcher, breadcrumbs) and on the right
// (search, actions, the theme and user menus).
</script>

<template>
  <header class="navbar navbar-expand d-print-none border-bottom t-topbar">
    <div class="container-fluid gap-2 flex-nowrap">
      <div class="d-flex align-items-center gap-2 min-w-0">
        <slot name="left" />
      </div>
      <div class="d-flex align-items-center gap-2 ms-auto">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>
