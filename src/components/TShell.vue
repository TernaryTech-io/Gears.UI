<script setup lang="ts">
// An app's frame: the sidebar (dark in both themes) with the brand, the links and a footer, and
// the page beside it. The sidebar folds to icons (remembered per `storageKey`); on small screens
// it's a top bar whose menu opens below it.
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import TIcon from './TIcon.vue'
import TNav from './TNav.vue'
import type { NavItem, Target } from '../types'

const props = withDefaults(defineProps<{
  nav: NavItem[]
  footerNav?: NavItem[]
  brand?: string
  // A line under the brand name, in small capitals.
  tagline?: string
  logo?: string
  brandTo?: Target
  foldable?: boolean
  storageKey?: string
}>(), { brandTo: '/', foldable: true, storageKey: 'gears-sidebar' })

function storedFold() {
  try { return localStorage.getItem(props.storageKey) === 'folded' } catch { return false }
}

const folded = ref(props.foldable && storedFold())
const menuOpen = ref(false)
const route = useRoute()

watch(folded, value => {
  try { localStorage.setItem(props.storageKey, value ? 'folded' : 'open') } catch { /* storage blocked */ }
})
watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <div class="page">
    <aside :class="['navbar navbar-vertical navbar-expand-lg', { 'navbar-folded': folded }]" data-bs-theme="dark">
      <div class="container-fluid">
        <button type="button" class="navbar-toggler" :aria-expanded="menuOpen" aria-label="Menu" @click="menuOpen = !menuOpen">
          <span class="navbar-toggler-icon" />
        </button>
        <div class="navbar-brand">
          <slot name="brand" :folded="folded">
            <RouterLink :to="brandTo" class="d-flex align-items-center gap-2 text-reset text-decoration-none">
              <img v-if="logo" :src="logo" alt="" class="navbar-brand-image" width="32" height="32">
              <span v-if="!folded && brand" class="text-start lh-sm">
                <span class="d-block fw-bold">{{ brand }}</span>
                <span v-if="tagline" class="d-block text-secondary text-uppercase fw-medium" style="font-size: 0.625rem; letter-spacing: 0.18em">{{ tagline }}</span>
              </span>
            </RouterLink>
          </slot>
        </div>
        <button v-if="foldable" type="button" class="t-fold-toggle d-none d-lg-grid"
          :aria-label="folded ? 'Expand the menu' : 'Fold the menu'" @click="folded = !folded">
          <TIcon :name="folded ? 'chevron-right' : 'chevron-left'" />
        </button>
        <div :class="['collapse navbar-collapse', { show: menuOpen }]">
          <TNav :items="nav" :folded="folded" class="pt-lg-3" />
          <div v-if="footerNav || $slots['sidebar-footer']" class="navbar-footer">
            <TNav v-if="footerNav" :items="footerNav" :folded="folded" />
            <slot name="sidebar-footer" :folded="folded" />
          </div>
        </div>
      </div>
    </aside>
    <div class="page-wrapper">
      <slot />
    </div>
  </div>
</template>
