<!-- Lines and areas over categories, such as months. Colors come from the theme: the accent first, then Tabler's chart colors. `format` writes the values in the axis and tooltips. -->
<script setup lang="ts">
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenue = [{ name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100, 120, 80, 95, 110, 130] }]
const traffic = [
  { name: 'Visitors', data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160] },
  { name: 'Sign-ups', data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16] }
]
const dollars = (v: number) => `$${v}k`
</script>

<template>
  <div class="row row-cards">
    <div class="col-lg-6">
      <TCard title="Revenue">
        <TChart type="area" :series="revenue" :categories="months" :format="dollars" label="Revenue by month" />
      </TCard>
    </div>
    <div class="col-lg-6">
      <TCard title="Traffic">
        <TChart type="line" :series="traffic" :categories="months" label="Visitors and sign-ups by month" />
      </TCard>
    </div>
  </div>
</template>
