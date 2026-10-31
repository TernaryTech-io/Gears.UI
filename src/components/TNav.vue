<script setup lang="ts">
// The sidebar's links. An item with children is an accordion group, open at first when it holds
// the current page or says `defaultOpen`. In a folded sidebar a group opens as a flyout instead,
// and closes when a page is chosen.
import { reactive, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import TIcon from './TIcon.vue'
import { toTabler, type NavItem, type Target } from '../types'

const props = defineProps<{ items: NavItem[]; folded?: boolean }>()

const route = useRoute()
const router = useRouter()

function isActive(to: Target | undefined, exact?: boolean) {
  if (!to) return false
  const path = router.resolve(to as never).path
  return exact ? route.path === path : route.path === path || route.path.startsWith(path.replace(/\/$/, '') + '/')
}
const groupActive = (item: NavItem) => item.children?.some(child => isActive(child.to, child.exact)) ?? false

const open = reactive(new Set<string>(props.items.filter(i => i.children && (i.defaultOpen || groupActive(i))).map(i => i.label)))

function toggle(item: NavItem) {
  if (open.has(item.label)) {
    open.delete(item.label)
  } else {
    // A folded sidebar shows one flyout at a time.
    if (props.folded) open.clear()
    open.add(item.label)
  }
}

// Going to a page opens its group (the route isn't known yet when the app first renders); in a
// folded sidebar it closes the flyout instead.
watch(() => route.fullPath, () => {
  if (props.folded) open.clear()
  else props.items.filter(groupActive).forEach(i => open.add(i.label))
})
watch(() => props.folded, folded => { if (folded) open.clear() })

// A badge is a label (shown in warning colors) or a label and color.
const badgeLabel = (item: NavItem) => typeof item.badge === 'string' ? item.badge : item.badge?.label
const badgeClass = (item: NavItem) => `badge badge-sm ms-auto bg-${toTabler((typeof item.badge === 'object' && item.badge.color) || 'warning')}-lt`
</script>

<template>
  <ul class="navbar-nav">
    <template v-for="item in items" :key="item.label">
      <li v-if="item.children" :class="['nav-item dropdown', { active: groupActive(item) }]">
        <a href="#" :class="['nav-link dropdown-toggle', { show: open.has(item.label) }]" role="button" :aria-expanded="open.has(item.label)"
          :title="folded ? item.label : undefined" @click.prevent="toggle(item)">
          <span v-if="item.icon" class="nav-link-icon"><TIcon :name="item.icon" /></span>
          <span class="nav-link-title">{{ item.label }}</span>
          <span v-if="item.badge" :class="[badgeClass(item), 'me-2']">{{ badgeLabel(item) }}</span>
        </a>
        <div :class="['dropdown-menu', { show: open.has(item.label) }]">
          <RouterLink v-for="child in item.children" :key="child.label" :to="child.to ?? '#'"
            :class="['dropdown-item', { active: isActive(child.to, child.exact) }]">
            <TIcon v-if="child.icon" :name="child.icon" class="me-2" />
            {{ child.label }}
            <span v-if="child.badge" :class="badgeClass(child)">{{ badgeLabel(child) }}</span>
          </RouterLink>
        </div>
      </li>
      <li v-else :class="['nav-item', { active: isActive(item.to, item.exact) }]">
        <RouterLink :to="item.to ?? '#'" :class="['nav-link', { active: isActive(item.to, item.exact) }]" :title="folded ? item.label : undefined">
          <span v-if="item.icon" class="nav-link-icon"><TIcon :name="item.icon" /></span>
          <span class="nav-link-title">{{ item.label }}</span>
          <span v-if="item.badge" :class="badgeClass(item)">{{ badgeLabel(item) }}</span>
        </RouterLink>
      </li>
    </template>
  </ul>
</template>
