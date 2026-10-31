<!-- Figures on an overview page, in Tabler's row-cards grid. -->
<template>
  <div class="row row-cards">
    <div class="col-sm-6 col-lg-3"><TStatCard label="Projects" :value="3" detail="1 of unlimited" icon="packages" /></div>
    <div class="col-sm-6 col-lg-3"><TStatCard label="Models" :value="14" detail="4 changed since the last build" icon="box" color="info" /></div>
    <div class="col-sm-6 col-lg-3"><TStatCard label="Builds today" :value="9" detail="All succeeded" icon="hammer" color="success" /></div>
    <div class="col-sm-6 col-lg-3"><TStatCard label="License" value="12 days" detail="Until the next check-in" icon="license" color="warning" /></div>
  </div>
</template>
