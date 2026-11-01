<script setup lang="ts">
import { groups, pages } from '../registry'

const install = `npm install @ternarytech-io/gears-ui`

const setup = `// main.ts
import '@ternarytech-io/gears-ui/styles.css'
import { createApp } from 'vue'
import GearsUI, { useColorMode } from '@ternarytech-io/gears-ui'

useColorMode()   // applies the saved light/dark choice to <html>
createApp(App).use(router).use(GearsUI).mount('#app')`

const usage = `<TCard title="Models" subtitle="Online Shop">
  <template #actions>
    <TButton icon="plus" label="New model" />
  </template>
  <TEmpty icon="box" title="No models yet" />
</TCard>`
</script>

<template>
  <TPage pretitle="Gears UI" title="Getting started"
    description="Vue components on Tabler for the Gears Studio and the apps it builds.">
    <div class="row g-4">
      <div class="col-lg-7 vstack gap-4">
        <TCard title="What it is">
          <p>
            Gears UI wraps <a href="https://tabler.io" target="_blank">Tabler</a> (Bootstrap 5 underneath) in Vue components.
            Tabler supplies the look and its JavaScript for dropdowns, modals and tooltips; the components give them props,
            <code>v-model</code> and slots.
          </p>
          <ul class="mb-0">
            <li>Prop names follow Nuxt UI (<code>color</code>, <code>variant</code>, <code>size</code>, <code>icon</code>), so the Studio's components move over mostly by renaming <code>U</code> to <code>T</code>.</li>
            <li>Colors: <code>primary</code> (#3673d1), <code>neutral</code>, <code>success</code>, <code>warning</code>, <code>error</code>, <code>info</code>.</li>
            <li>Icons are <a href="https://tabler.io/icons" target="_blank">Tabler Icons</a> by name (<code>icon="plus"</code>), from a self-hosted webfont.</li>
            <li>Tabler's own classes still work anywhere: <code>btn-list</code>, <code>row-cards</code>, <code>text-secondary</code>, …</li>
          </ul>
        </TCard>
        <TCard title="Set up" flush>
          <pre class="preview-code rounded-0">{{ install }}</pre>
          <pre class="preview-code">{{ setup }}</pre>
        </TCard>
        <TCard title="Use" flush>
          <pre class="preview-code">{{ usage }}</pre>
        </TCard>
      </div>
      <div class="col-lg-5">
        <TCard title="Components" :subtitle="`${pages.length} pages`">
          <div v-for="group in groups" :key="group" class="mb-3">
            <div class="subheader mb-2">{{ group }}</div>
            <div class="d-flex flex-wrap gap-2">
              <TButton v-for="p in pages.filter(p => p.group === group)" :key="p.slug" :to="`/components/${p.slug}`"
                size="sm" color="neutral" :label="p.name" />
            </div>
          </div>
        </TCard>
      </div>
    </div>
  </TPage>
</template>
