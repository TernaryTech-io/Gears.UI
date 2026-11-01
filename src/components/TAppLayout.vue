<script setup lang="ts">
// An application's frame, laid out by a theme's layout settings (`theme`): the navigation down the
// left (it can fold to icons) or across the top (it can stay at the top as the page scrolls, and
// float apart from the edges), and the page boxed (centered, the background around it) or fluid.
// The brand is the logo and name, or the `brand` slot; the links are `items` (TNav), or the `nav`
// slot for links of your own. `actions` go at the top bar's end, or at the foot of the sidebar.
// Tabler's page, navbar and layout-boxed classes do the work, so it looks like Tabler's layouts.
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import TNav from './TNav.vue'
import type { NavItem, ThemeSettings } from '../types'

const props = withDefaults(defineProps<{
  theme?: ThemeSettings
  items?: NavItem[]
  brand?: string
  logo?: string
}>(), { theme: () => ({}), items: () => [] })

const folded = defineModel<boolean>('folded', { default: false })

const top = computed(() => props.theme.nav === 'top')
const boxed = computed(() => props.theme.container === 'boxed')
const foldable = computed(() => !top.value && props.theme.navFoldable === true)
const container = computed(() => boxed.value ? 'container-xl' : 'container-fluid')
</script>

<template>
  <div :class="['t-app', { 'layout-boxed': boxed }]">
    <div class="page">
      <aside v-if="!top" :class="['navbar navbar-vertical navbar-expand-lg t-app-sidebar', { 'navbar-folded': foldable && folded }]">
        <div class="container-fluid">
          <div class="navbar-brand">
            <slot name="brand" :folded="foldable && folded">
              <img v-if="logo" :src="logo" alt="" class="t-app-logo">
              <span v-if="brand && !(foldable && folded)" class="text-truncate">{{ brand }}</span>
            </slot>
          </div>
          <button v-if="foldable" type="button" class="t-fold-toggle d-none d-lg-grid" :aria-label="folded ? 'Expand the menu' : 'Fold the menu'"
            @click="folded = !folded">
            <TIcon :name="folded ? 'chevron-right' : 'chevron-left'" />
          </button>
          <div class="collapse navbar-collapse">
            <slot name="nav" orientation="vertical" :folded="foldable && folded">
              <TNav :items="items" :folded="foldable && folded" class="pt-lg-3" />
            </slot>
            <div v-if="$slots.actions" class="navbar-footer"><slot name="actions" /></div>
          </div>
        </div>
      </aside>
      <header v-else :class="['navbar navbar-expand-md t-app-topbar', { 'sticky-top': theme.navSticky, 't-app-floating': theme.navFloating }]">
        <div :class="[container, 'gap-3']">
          <div class="navbar-brand">
            <slot name="brand" :folded="false">
              <img v-if="logo" :src="logo" alt="" class="t-app-logo">
              <span v-if="brand" class="text-truncate">{{ brand }}</span>
            </slot>
          </div>
          <div class="collapse navbar-collapse">
            <slot name="nav" orientation="horizontal" :folded="false">
              <TNav :items="items" />
            </slot>
          </div>
          <div v-if="$slots.actions" class="ms-auto d-flex align-items-center gap-2"><slot name="actions" /></div>
        </div>
      </header>
      <div class="page-wrapper">
        <div class="page-body">
          <div :class="container">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
