<!-- The sign-in page. In an app it fills the window; here it sits in a frame. -->
<script setup lang="ts">
import { ref } from 'vue'

const user = ref('')
const password = ref('')
</script>

<template>
  <div class="preview-frame">
    <TAuthLayout brand="Gears Studio" logo="/gears-logo.png" title="Sign in" subtitle="Use your Gears account, or Ternary's.">
      <form class="vstack gap-3" @submit.prevent>
        <TFormField label="User name">
          <TInput v-model="user" autocomplete="username" />
        </TFormField>
        <TFormField label="Password">
          <TInput v-model="password" type="password" autocomplete="current-password" />
        </TFormField>
        <TButton type="submit" block label="Sign in" />
        <TSeparator label="or" />
        <TButton block color="neutral" icon="login" label="Sign in with Ternary" />
      </form>
      <template #footer>No account? Ask an admin to add you.</template>
    </TAuthLayout>
  </div>
</template>
