<!-- Tabler's sparklines: tiny charts in a line of text, drawn as SVG without a library. A line, bars, or a circle for one percentage; the color names it. -->
<template>
  <div class="d-flex flex-wrap align-items-center gap-4">
    <span class="d-inline-flex align-items-center gap-2">Visits <TSparkline :values="[5, 8, 6, 12, 9, 14, 13]" spot="last" /></span>
    <span class="d-inline-flex align-items-center gap-2">Orders <TSparkline type="bar" :values="[4, 6, 3, 8, 7, 9]" color="success" /></span>
    <span class="d-inline-flex align-items-center gap-2">Disk <TSparkline type="circle" :values="[72]" color="warning" :width="24" :height="24" /> 72%</span>
  </div>
</template>
