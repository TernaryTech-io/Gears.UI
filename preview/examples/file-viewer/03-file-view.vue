<!-- TFileView is the file alone, filling its box. A file it can't read, or has no preview for, offers its download. -->
<template>
  <div class="row g-3">
    <div class="col-md-6"><TFileView :file="{ name: 'expenses.csv', src: '/viewer/expenses.csv' }" :height="300" class="border rounded" /></div>
    <div class="col-md-6"><TFileView :file="{ name: 'notes.txt', src: '/viewer/missing.txt' }" :height="300" class="border rounded" /></div>
  </div>
</template>
