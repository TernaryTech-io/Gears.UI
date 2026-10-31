<script setup lang="ts">
// A menu under a button. Items come in groups (an array of arrays), split by dividers; an item is
// a link (`to`, `href`), an action (`onSelect`) or a `label` heading. The slot replaces the button.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Dropdown } from '@tabler/core'
import TButton from './TButton.vue'
import TIcon from './TIcon.vue'
import { toTabler, type Color, type DropdownItem, type Size } from '../types'

const props = withDefaults(defineProps<{
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

const groups = computed(() => (Array.isArray(props.items[0]) ? props.items : [props.items]) as DropdownItem[][])

function tag(item: DropdownItem) {
  return item.to && !item.disabled ? RouterLink : item.href ? 'a' : 'button'
}
function attrs(item: DropdownItem) {
  if (item.to && !item.disabled) return { to: item.to }
  if (item.href) return { href: item.disabled ? undefined : item.href }
  return { type: 'button', disabled: item.disabled }
}

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
      <template v-for="(group, g) in groups" :key="g">
        <div v-if="g > 0 && group.length" class="dropdown-divider" />
        <template v-for="(item, i) in group" :key="`${g}-${i}`">
          <div v-if="item.type === 'label'" class="dropdown-header d-block">
            <div class="text-body fw-medium text-truncate">{{ item.label }}</div>
            <div v-if="item.description" class="text-secondary text-truncate fw-normal">{{ item.description }}</div>
          </div>
          <component :is="tag(item)" v-else v-bind="attrs(item)" role="menuitem"
            :class="['dropdown-item', { disabled: item.disabled }, item.color && `text-${toTabler(item.color)}`]"
            @click="item.onSelect?.($event)">
            <TIcon v-if="item.icon" :name="item.icon" class="dropdown-item-icon" />
            <span class="min-w-0">
              <span class="d-block text-truncate">{{ item.label }}</span>
              <span v-if="item.description" class="d-block small text-secondary text-truncate">{{ item.description }}</span>
            </span>
            <TIcon v-if="item.trailingIcon" :name="item.trailingIcon" class="ms-auto ps-2" />
          </component>
        </template>
      </template>
    </div>
  </div>
</template>
