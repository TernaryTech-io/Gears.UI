<!-- v-model is the HTML. It follows the light and dark theme; the editor and its skins are bundled, nothing is fetched. -->
<script setup lang="ts">
import { ref } from 'vue'

const html = ref('<h2>Welcome</h2><p>This is the <strong>Online Shop</strong> help page. Edit it, then publish.</p><ul><li>Orders ship in two days</li><li>Returns within 30 days</li></ul>')
</script>

<template>
  <div class="vstack gap-3">
    <TRichEditor v-model="html" :height="320" placeholder="Write the page…" />
    <details>
      <summary class="text-secondary small">HTML</summary>
      <pre class="preview-code rounded mt-2">{{ html }}</pre>
    </details>
  </div>
</template>
