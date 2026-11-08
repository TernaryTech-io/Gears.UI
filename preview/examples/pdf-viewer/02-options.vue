<!-- `zoom` starts it at a fit or a percent; `toolbar` and `download` can be switched off. A PDF that can't be read says so. -->
<template>
  <div class="row g-3">
    <div class="col-md-6"><TPdfViewer src="/sample.pdf" zoom="page" :download="false" :height="360" label="Fit page" /></div>
    <div class="col-md-6"><TPdfViewer src="/missing.pdf" :height="360" label="A missing PDF" /></div>
  </div>
</template>
