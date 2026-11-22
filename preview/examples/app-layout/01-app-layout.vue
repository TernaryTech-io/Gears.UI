<!-- An application's frame, laid out by its theme: navigation on the left (foldable) or the top (sticky, floating), its colors, density, the page's width: default (the content capped and centered), fluid or boxed, and a footer with its own colors. TScaledFrame shows it at a wide screen's width, scaled to fit. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ThemeSettings } from '@ternarytech-io/gears-ui'

const theme = ref<ThemeSettings>({ nav: 'left', navFoldable: true, navSticky: true, navFloating: false, density: 'comfortable', container: 'default' })
const folded = ref(false)
const footer = ref(true)
const pages = ['Dashboard', 'Orders', 'Customers', 'Settings']
</script>

<template>
  <div class="row g-4">
    <div class="col-lg-4 vstack gap-3">
      <TNavPositionPicker v-model="theme.nav" legend="Navigation" />
      <TSwitch v-if="theme.nav === 'left'" v-model="theme.navFoldable" label="Foldable" />
      <template v-else>
        <TSwitch v-model="theme.navSticky" label="Sticky" />
        <TSwitch v-model="theme.navFloating" label="Floating" />
      </template>
      <div class="row g-2">
        <TFormField label="Menu background" class="col-6"><TColorPicker v-model="theme.navColor" placeholder="The theme's" /></TFormField>
        <TFormField label="Menu text" class="col-6"><TColorPicker v-model="theme.navText" placeholder="The theme's" /></TFormField>
      </div>
      <TSwitch v-model="footer" label="Footer" />
      <div v-if="footer" class="row g-2">
        <TFormField label="Footer background" class="col-6"><TColorPicker v-model="theme.footerColor" placeholder="The theme's" /></TFormField>
        <TFormField label="Footer text" class="col-6"><TColorPicker v-model="theme.footerText" placeholder="The theme's" /></TFormField>
      </div>
      <TDensityPicker v-model="theme.density" legend="Density" />
      <TContainerPicker v-model="theme.container" legend="Container" />
    </div>
    <div class="col-lg-8">
      <div class="border rounded overflow-hidden" style="height: 26rem">
        <TScaledFrame :width="1920">
          <TThemeScope :theme="theme" class="h-100">
            <TAppLayout v-model:folded="folded" :theme="theme" brand="Online Shop">
              <template #nav>
                <ul class="navbar-nav">
                  <li v-for="(p, i) in pages" :key="p" :class="['nav-item', { active: i === 1 }]">
                    <a href="#" :class="['nav-link', { active: i === 1 }]" @click.prevent><span class="nav-link-title">{{ p }}</span></a>
                  </li>
                </ul>
              </template>
              <template v-if="footer" #footer>
                <div class="d-flex justify-content-between">
                  <span>© Online Shop</span>
                  <span class="d-flex gap-3"><a href="#" @click.prevent>Privacy</a><a href="#" @click.prevent>Contact</a></span>
                </div>
              </template>
              <div v-for="n in 3" :key="n" class="card mb-3">
                <div class="card-body">
                  <h3 class="card-title">Card {{ n }}</h3>
                  <p class="text-secondary mb-0">Scroll to see a sticky top bar stay put.</p>
                </div>
              </div>
            </TAppLayout>
          </TThemeScope>
        </TScaledFrame>
      </div>
    </div>
  </div>
</template>
