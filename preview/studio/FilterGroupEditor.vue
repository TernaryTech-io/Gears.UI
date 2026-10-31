<script setup lang="ts">
// The Studio's filter builder on Gears UI: one group of conditions and nested groups, matching
// all or any of them. Edits the group in place.
import type { FieldType, FilterCondition, FilterGroup, FilterOperator, QueryField } from './mock'

const props = withDefaults(defineProps<{ group: FilterGroup; fields: QueryField[]; depth?: number }>(), { depth: 0 })
const emit = defineEmits<{ remove: [] }>()

const MaxDepth = 3
const operatorLabels: Record<FilterOperator, string> = {
  Equals: 'is', NotEquals: 'is not', Contains: 'contains', NotContains: "doesn't contain", StartsWith: 'starts with',
  EndsWith: 'ends with', GreaterThan: 'greater than', GreaterThanOrEqual: 'at least', LessThan: 'less than',
  LessThanOrEqual: 'at most', Between: 'between', In: 'is any of', NotIn: 'is none of', IsEmpty: 'is empty', IsNotEmpty: 'is not empty'
}
const logicItems = [{ label: 'all', value: 'And' as const }, { label: 'any', value: 'Or' as const }]

function field(name: string) { return props.fields.find(f => f.name === name) }
function operators(c: FilterCondition) {
  return (field(c.field)?.operators ?? []).map(op => ({ label: operatorLabels[op], value: op }))
}
function kind(c: FilterCondition): 'none' | 'one' | 'two' | 'many' {
  if (c.operator === 'IsEmpty' || c.operator === 'IsNotEmpty') return 'none'
  if (c.operator === 'Between') return 'two'
  if (c.operator === 'In' || c.operator === 'NotIn') return 'many'
  return 'one'
}
function inputType(type: FieldType | undefined) {
  return type === 'DateTime' ? 'datetime-local' : type === 'Date' ? 'date' : type === 'Time' ? 'time' : 'text'
}
function placeholder(type: FieldType | undefined) {
  switch (type) {
    case 'Integer': return 'e.g. 42'
    case 'Decimal': case 'Double': return 'e.g. 19.99'
    case 'Key': return '24 hex digits'
    case 'Guid': return 'e.g. 3f2504e0-4f89-…'
    default: return 'Value'
  }
}

// The comparison a field starts with: "contains" for text, "is" otherwise.
function defaultOperator(f: QueryField | undefined): FilterOperator {
  return f?.operators.includes('Contains') ? 'Contains' : f?.operators[0] ?? 'Equals'
}
function newCondition(): FilterCondition {
  const first = props.fields.find(f => f.name !== 'Id') ?? props.fields[0]
  return { kind: 'condition', field: first?.name ?? '', operator: defaultOperator(first), value: first?.type === 'Boolean' ? 'true' : '', values: [] }
}
function addCondition() { props.group.children.push(newCondition()) }
function addGroup() {
  props.group.children.push({ kind: 'group', logic: props.group.logic === 'And' ? 'Or' : 'And', children: [newCondition()] })
}
function removeAt(index: number) { props.group.children.splice(index, 1) }

function setField(c: FilterCondition, name: string) {
  c.field = name
  if (!(field(name)?.operators ?? []).includes(c.operator)) c.operator = defaultOperator(field(name))
  c.value = field(name)?.type === 'Boolean' ? 'true' : ''
  c.values = []
}
function setOperator(c: FilterCondition, op: FilterOperator) {
  c.operator = op
  if (op === 'Between') c.values = [c.value ?? '', '']
  else if (op === 'In' || op === 'NotIn') c.values = c.value ? [c.value] : []
}
function setBetween(c: FilterCondition, index: number, value: string) {
  const values = [...(c.values ?? ['', ''])]
  values[index] = value
  c.values = values
}
</script>

<template>
  <div :class="['d-flex flex-column gap-2', { 'border rounded p-3 bg-surface-secondary': depth > 0 }]">
    <div class="d-flex align-items-center gap-2 small">
      <span class="text-secondary">Match</span>
      <TSelect v-model="group.logic" :items="logicItems" size="sm" style="width: 5rem" aria-label="Match all or any" />
      <span class="text-secondary">of these</span>
      <TButton v-if="depth > 0" size="xs" color="neutral" variant="ghost" icon="x" class="ms-auto" aria-label="Remove group" @click="emit('remove')" />
    </div>

    <template v-for="(child, index) in group.children" :key="index">
      <FilterGroupEditor v-if="child.kind === 'group'" :group="child" :fields="fields" :depth="depth + 1" @remove="removeAt(index)" />
      <div v-else class="d-flex flex-wrap align-items-start gap-1">
        <TSelect :model-value="child.field" :items="fields.map(f => f.name)" size="sm" style="width: 8rem" aria-label="Field"
          @update:model-value="setField(child, String($event))" />
        <TSelect :model-value="child.operator" :items="operators(child)" size="sm" style="width: 9rem" aria-label="Comparison"
          @update:model-value="setOperator(child, $event as FilterOperator)" />
        <template v-if="kind(child) === 'one'">
          <TSelect v-if="field(child.field)?.type === 'Boolean'" :model-value="child.value ?? 'true'" :items="['true', 'false']" size="sm"
            style="width: 6rem" aria-label="Value" @update:model-value="child.value = String($event)" />
          <TInput v-else :model-value="child.value ?? ''" :type="inputType(field(child.field)?.type)" :placeholder="placeholder(field(child.field)?.type)"
            size="sm" class="flex-fill" style="min-width: 8rem" aria-label="Value" @update:model-value="child.value = String($event)" />
        </template>
        <div v-else-if="kind(child) === 'two'" class="d-flex flex-fill align-items-center gap-1" style="min-width: 12rem">
          <TInput :model-value="child.values?.[0] ?? ''" :type="inputType(field(child.field)?.type)" size="sm" class="flex-fill" aria-label="From"
            @update:model-value="setBetween(child, 0, String($event))" />
          <span class="small text-secondary">and</span>
          <TInput :model-value="child.values?.[1] ?? ''" :type="inputType(field(child.field)?.type)" size="sm" class="flex-fill" aria-label="To"
            @update:model-value="setBetween(child, 1, String($event))" />
        </div>
        <TInputTags v-else-if="kind(child) === 'many'" :model-value="child.values ?? []" size="sm" class="flex-fill" style="min-width: 10rem"
          placeholder="Type, then Enter" aria-label="Values" @update:model-value="child.values = $event" />
        <TButton size="sm" color="neutral" variant="ghost" icon="x" aria-label="Remove condition" @click="removeAt(index)" />
      </div>
    </template>

    <div class="d-flex gap-1">
      <TButton size="xs" color="neutral" variant="ghost" icon="plus" label="Condition" @click="addCondition" />
      <TButton v-if="depth + 1 < MaxDepth" size="xs" color="neutral" variant="ghost" icon="brackets" label="Group" @click="addGroup" />
    </div>
  </div>
</template>
