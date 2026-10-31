<!-- An error message replaces the description and marks the control invalid. -->
<script setup lang="ts">
import { computed, ref } from 'vue'

const email = ref('jordan@')
const tried = ref(false)
const error = computed(() => tried.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value) ? 'Enter an email address, like name@example.com.' : undefined)
</script>

<template>
  <form class="vstack gap-3" style="max-width: 28rem" @submit.prevent="tried = true">
    <TFormField label="Email" required description="We send the invitation here." :error="error">
      <TInput v-model="email" type="email" icon="mail" autocomplete="email" />
    </TFormField>
    <div><TButton type="submit" label="Invite" /></div>
  </form>
</template>
