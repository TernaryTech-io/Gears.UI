<!-- Long lines wrap by default; with `wrap` off they scroll sideways. `maxHeight` caps the height with a scroll. -->
<script setup lang="ts">
const problem = {
  type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
  title: 'One or more validation errors occurred: name is required, and price must be at least 0.',
  status: 400,
  errors: { name: ['The Name field is required.'], price: ['The field Price must be between 0 and 79228162514264337593543950335.'] }
}
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TCodeBlock :value="problem" title="Wrapped" />
    </div>
    <div class="col-md-6">
      <TCodeBlock :value="problem" title="Scrolls sideways, 8rem high" :wrap="false" max-height="8rem" />
    </div>
  </div>
</template>
