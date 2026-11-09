<script setup lang="ts">
// A menu under a button. Items come in groups (an array of arrays), split by dividers; an item is
// a link (`to`, `href`), an action (`onSelect`) or a `label` heading. The slot replaces the button.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Dropdown } from '@tabler/core'
import TButton from './TButton.vue'
import DropdownItems from './internal/DropdownItems.vue'
import type { Color, DropdownItem, Size } from '../types'

withDefaults(defineProps<{
  items: DropdownItem[] | DropdownItem[][]
  align?: 'start' | 'end'
  label?: string
  icon?: string
  color?: Color
  variant?: 'solid' | 'outline' | 'ghost' | 'soft'
  size?: Size
  menuClass?: string
}>(), { align: 'start', color: 'neutral', variant: 'solid', size: 'md' })

const emit = defineEmits<{ 'update:open': [open: boolean] }>()

const toggle = ref<HTMLElement>()
let dropdown: Dropdown | null = null

onMounted(() => {
  // A fixed popper escapes containers that clip (cards, tables, the sidebar).
  dropdown = new Dropdown(toggle.value!, { popperConfig: (config: object) => ({ ...config, strategy: 'fixed' }) })
  toggle.value!.addEventListener('show.bs.dropdown', () => emit('update:open', true))
  toggle.value!.addEventListener('hide.bs.dropdown', () => emit('update:open', false))
})
onBeforeUnmount(() => dropdown?.dispose())
</script>

<template>
  <div class="dropdown d-inline-flex">
    <span ref="toggle" class="d-inline-flex" data-bs-toggle="dropdown" aria-haspopup="menu">
      <slot>
        <TButton :label="label" :icon="icon" :color="color" :variant="variant" :size="size" trailing-icon="chevron-down" />
      </slot>
    </span>
    <div :class="['dropdown-menu', align === 'end' && 'dropdown-menu-end', menuClass]" role="menu">
      <DropdownItems :items="items" />
    </div>
  </div>
</template>
