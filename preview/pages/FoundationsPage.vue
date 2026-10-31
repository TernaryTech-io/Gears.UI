<script setup lang="ts">
import type { Color } from '@gears/ui'

const colors: { name: Color; tabler: string; use: string }[] = [
  { name: 'primary', tabler: 'primary', use: 'Main actions, links, the current item' },
  { name: 'neutral', tabler: 'secondary', use: 'Everything else' },
  { name: 'success', tabler: 'success', use: 'Done, healthy, valid' },
  { name: 'warning', tabler: 'warning', use: 'Needs attention soon' },
  { name: 'error', tabler: 'danger', use: 'Failed, invalid, destructive' },
  { name: 'info', tabler: 'info', use: 'Neutral news, in progress' }
]

const surfaces = [
  { name: 'Page', css: 'var(--tblr-body-bg)', note: '#f6f7f9 · dark #1c1d1d' },
  { name: 'Card', css: 'var(--tblr-bg-surface)', note: '#fff · dark #232525' },
  { name: 'Sidebar', css: '#1c1d1d', note: 'Darkest black, both themes' },
  { name: 'Border', css: 'var(--tblr-border-color)', note: '#e3e6eb · dark #2f3232' }
]
</script>

<template>
  <TPage pretitle="Gears UI" title="Foundations" description="Color, surfaces and type. Tabler derives its shades and tints from these.">
    <div class="vstack gap-4">
      <TCard title="Colors" subtitle="The color prop's names, and the Tabler name used in classes (btn-danger, bg-danger-lt).">
        <div class="row g-3">
          <div v-for="c in colors" :key="c.name" class="col-sm-6 col-lg-4">
            <div class="preview-swatch" :style="{ background: `var(--tblr-${c.tabler})` }" />
            <div class="d-flex align-items-center gap-2 mt-2">
              <strong>{{ c.name }}</strong>
              <code class="small">{{ c.tabler }}</code>
            </div>
            <div class="text-secondary small">{{ c.use }}</div>
            <div class="d-flex gap-1 mt-2">
              <TBadge :color="c.name" label="Soft" />
              <TBadge :color="c.name" variant="solid" label="Solid" />
              <TBadge :color="c.name" variant="outline" label="Outline" />
            </div>
          </div>
        </div>
      </TCard>

      <TCard title="Surfaces" subtitle="Pages are a shade off white; cards sit on them. The sidebar stays dark in both themes.">
        <div class="row g-3">
          <div v-for="s in surfaces" :key="s.name" class="col-sm-6 col-lg-3">
            <div class="preview-swatch" :style="{ background: s.css }" />
            <strong class="d-block mt-2">{{ s.name }}</strong>
            <div class="text-secondary small">{{ s.note }}</div>
          </div>
        </div>
      </TCard>

      <TCard title="Type" subtitle="The system font stack; monospace for code and logs.">
        <h1>Heading 1 · Page title</h1>
        <h2>Heading 2 · Section</h2>
        <h3>Heading 3 · Card title</h3>
        <p>Body text. Gears builds a project's code, database and app from its models.</p>
        <p class="text-secondary">Secondary text, for descriptions and details.</p>
        <div class="subheader mb-2">Subheader</div>
        <code>Ternary.Data 1.0.0</code>
      </TCard>

      <TCard id="tabler" title="Tabler" subtitle="Tabler's own classes and components work alongside these.">
        <p class="mb-2">Layout and utilities come straight from Tabler and Bootstrap 5: the grid (<code>row</code>, <code>col-lg-6</code>),
          spacing (<code>mb-3</code>, <code>gap-2</code>), <code>btn-list</code>, <code>row-cards</code>, <code>text-secondary</code>.</p>
        <TButton href="https://docs.tabler.io/ui" target="_blank" variant="soft" icon="external-link" label="Tabler documentation" />
      </TCard>
    </div>
  </TPage>
</template>
