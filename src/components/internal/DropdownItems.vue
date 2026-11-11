<script setup lang="ts">
// A dropdown menu's items, in groups split by dividers: links (`to`, `href`), actions (`onSelect`)
// and `label` headings. Shared by TDropdown and TSplitButton; `select` reports the item chosen.
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import TIcon from '../TIcon.vue'
import { toTabler, type DropdownItem } from '../../types'

const props = defineProps<{ items: DropdownItem[] | DropdownItem[][] }>()
const emit = defineEmits<{ select: [item: DropdownItem, event: Event] }>()

const groups = computed(() => (Array.isArray(props.items[0]) ? props.items : [props.items]) as DropdownItem[][])

function tag(item: DropdownItem) {
  return item.to && !item.disabled ? RouterLink : item.href ? 'a' : 'button'
}
function attrs(item: DropdownItem) {
  if (item.to && !item.disabled) return { to: item.to }
  if (item.href) return { href: item.disabled ? undefined : item.href }
  return { type: 'button', disabled: item.disabled }
}
function choose(item: DropdownItem, event: Event) {
  if (item.disabled) return
  item.onSelect?.(event)
  emit('select', item, event)
}
</script>

<template>
  <template v-for="(group, g) in groups" :key="g">
    <div v-if="g > 0 && group.length" class="dropdown-divider" />
    <template v-for="(item, i) in group" :key="`${g}-${i}`">
      <div v-if="item.type === 'label'" class="dropdown-header d-block">
        <div class="text-body fw-medium text-truncate">{{ item.label }}</div>
        <div v-if="item.description" class="text-secondary text-truncate fw-normal">{{ item.description }}</div>
      </div>
      <component :is="tag(item)" v-else v-bind="attrs(item)" role="menuitem"
        :class="['dropdown-item', { disabled: item.disabled }, item.color && `text-${toTabler(item.color)}`]"
        @click="choose(item, $event)">
        <TIcon v-if="item.icon" :name="item.icon" class="dropdown-item-icon" />
        <span class="min-w-0">
          <span class="d-block text-truncate">{{ item.label }}</span>
          <span v-if="item.description" class="d-block small text-secondary text-truncate">{{ item.description }}</span>
        </span>
        <TIcon v-if="item.trailingIcon" :name="item.trailingIcon" class="ms-auto ps-2" />
      </component>
    </template>
  </template>
</template>
