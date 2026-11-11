<script setup lang="ts">
// A main action with a menu of others beside it (Tabler's split dropdown): the button runs `click`;
// the arrow opens the menu, whose items are TDropdown's (groups split by dividers, icons,
// Disabled, a color such as error for a dangerous one, `onSelect`, `to`, `href`). `select` reports
// the item chosen.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Dropdown } from '@tabler/core'
import TButton from './TButton.vue'
import DropdownItems from './internal/DropdownItems.vue'
import type { Color, DropdownItem, Size } from '../types'

withDefaults(defineProps<{
  label?: string
  icon?: string
  items: DropdownItem[] | DropdownItem[][]
  color?: Color
  variant?: 'solid' | 'outline' | 'ghost' | 'soft'
  size?: Size
  disabled?: boolean
  /** Only the menu is off. */
  menuDisabled?: boolean
  loading?: boolean
  block?: boolean
  align?: 'start' | 'end'
  /** The arrow's name, for screen readers. */
  menuLabel?: string
}>(), { color: 'primary', variant: 'solid', size: 'md', align: 'end', menuLabel: 'More actions' })

const emit = defineEmits<{ click: [event: MouseEvent]; select: [item: DropdownItem, event: Event]; 'update:open': [open: boolean] }>()

const toggle = ref<InstanceType<typeof TButton>>()
let dropdown: Dropdown | null = null

onMounted(() => {
  const el = toggle.value!.$el as HTMLElement
  // A fixed popper escapes containers that clip (cards, tables, the sidebar).
  dropdown = new Dropdown(el, { popperConfig: (config: object) => ({ ...config, strategy: 'fixed' }) })
  el.addEventListener('show.bs.dropdown', () => emit('update:open', true))
  el.addEventListener('hide.bs.dropdown', () => emit('update:open', false))
})
onBeforeUnmount(() => dropdown?.dispose())
</script>

<template>
  <div :class="['btn-group', { 'w-100 d-flex': block }]" role="group">
    <TButton :label="label" :icon="icon" :color="color" :variant="variant" :size="size" :disabled="disabled" :loading="loading"
      :class="{ 'flex-fill': block }" @click="(event: MouseEvent) => emit('click', event)" />
    <TButton ref="toggle" :color="color" :variant="variant" :size="size" :disabled="disabled || menuDisabled" class="dropdown-toggle dropdown-toggle-split flex-grow-0"
      data-bs-toggle="dropdown" aria-haspopup="menu" aria-expanded="false" :aria-label="menuLabel" />
    <div :class="['dropdown-menu', align === 'end' && 'dropdown-menu-end']" role="menu">
      <DropdownItems :items="items" @select="(item, event) => emit('select', item, event)" />
    </div>
  </div>
</template>
