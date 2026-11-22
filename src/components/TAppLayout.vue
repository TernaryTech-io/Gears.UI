<script setup lang="ts">
// An application's frame, laid out by a theme's layout settings (`theme`): the navigation down the
// left (it can fold to icons) or across the top (it can stay at the top as the page scrolls, and
// float apart from the edges), and the page's width (`container`): default, the content capped and
// centered with the navigation at the window's edge (a top bar runs the full width, its links within
// the content's width), as Tabler lays out; fluid, the full width; boxed, the whole page, navigation
// too, in a centered box with the background around it. Without a setting, it's default.
// The brand is the logo and name, or the `brand` slot; the links are `items` (TNav), or the `nav`
// slot for links of your own. `actions` go at the top bar's end, or at the foot of the sidebar.
// The `footer` slot is a footer under the page's content, across the content's width: at the
// window's bottom when the page is short, after the content when it's long.
// The theme's navColor/navText and footerColor/footerText color the navigation and the footer
// (unset, the theme's own), the same in light and dark mode.
// Tabler's page, navbar and layout-boxed classes do the work, so it looks like Tabler's layouts.
// On small screens the links fold away behind a menu button, and close again on navigating.
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
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
const container = computed(() => props.theme.container === 'fluid' ? 'container-fluid' : 'container-xl')

// The colors, as custom properties gears.css turns into Tabler's navbar and footer variables.
const navClasses = computed(() => ({ 't-app-nav-bg': !!props.theme.navColor, 't-app-nav-text': !!props.theme.navText }))
const navStyle = computed(() => ({ '--t-nav-bg': props.theme.navColor || undefined, '--t-nav-text': props.theme.navText || undefined }))
const footerClasses = computed(() => ({ 't-app-footer-bg': !!props.theme.footerColor, 't-app-footer-text': !!props.theme.footerText }))
const footerStyle = computed(() => ({ '--t-footer-bg': props.theme.footerColor || undefined, '--t-footer-text': props.theme.footerText || undefined }))

const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <div :class="['t-app', { 'layout-boxed': boxed }]">
    <div class="page">
      <aside v-if="!top" :class="['navbar navbar-vertical navbar-expand-lg t-app-sidebar', navClasses, { 'navbar-folded': foldable && folded }]" :style="navStyle">
        <div class="container-fluid">
          <button type="button" class="navbar-toggler" :aria-expanded="menuOpen" aria-label="Menu" @click="menuOpen = !menuOpen">
            <span class="navbar-toggler-icon" />
          </button>
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
          <div :class="['collapse navbar-collapse', { show: menuOpen }]">
            <slot name="nav" orientation="vertical" :folded="foldable && folded">
              <TNav :items="items" :folded="foldable && folded" class="pt-lg-3" />
            </slot>
            <div v-if="$slots.actions" class="navbar-footer"><slot name="actions" /></div>
          </div>
        </div>
      </aside>
      <header v-else :class="['navbar navbar-expand-md t-app-topbar', navClasses, { 'sticky-top': theme.navSticky, 't-app-floating': theme.navFloating }]"
        :style="navStyle">
        <div :class="[container, 'gap-3']">
          <button type="button" class="navbar-toggler" :aria-expanded="menuOpen" aria-label="Menu" @click="menuOpen = !menuOpen">
            <span class="navbar-toggler-icon" />
          </button>
          <div class="navbar-brand">
            <slot name="brand" :folded="false">
              <img v-if="logo" :src="logo" alt="" class="t-app-logo">
              <span v-if="brand" class="text-truncate">{{ brand }}</span>
            </slot>
          </div>
          <div :class="['collapse navbar-collapse', { show: menuOpen }]">
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
        <footer v-if="$slots.footer" :class="['footer t-app-footer', footerClasses]" :style="footerStyle">
          <div :class="container">
            <slot name="footer" />
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>
