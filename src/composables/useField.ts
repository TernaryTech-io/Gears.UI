// A form field shares its id and state with the control inside it, so the label points at the
// control and an error marks it invalid without wiring each one by hand.
import { computed, inject, provide, useId, type ComputedRef, type InjectionKey } from 'vue'

export interface FieldContext {
  id: string
  invalid: ComputedRef<boolean>
  describedBy: ComputedRef<string | undefined>
}

const fieldKey: InjectionKey<FieldContext> = Symbol('t-field')

export function provideField(context: FieldContext) {
  provide(fieldKey, context)
}

// The control's id (its own, its field's or a new one), whether it's invalid, and what describes it.
export function useField(props: { id?: string; invalid?: boolean }) {
  const field = inject(fieldKey, null)
  const fallback = useId()
  return {
    id: computed(() => props.id ?? field?.id ?? fallback),
    invalid: computed(() => props.invalid || (field?.invalid.value ?? false)),
    describedBy: computed(() => field?.describedBy.value)
  }
}
