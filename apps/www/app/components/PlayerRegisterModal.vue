<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

interface UserForm { username: string, id: string }

const player = usePlayer()
const open = ref(false)

const state = reactive<UserForm>({
  username: '',
  id: crypto.randomUUID()
})

function onSubmit(event: FormSubmitEvent<UserForm>) {
  const username = event.data.username.trim()
  if (!username) return

  player.id.value = event.data.id
  player.username.value = username

  open.value = false
}

onMounted(() => {
  if (!player.id.value || !player.username.value) {
    open.value = true
  }
})
</script>

<template>
  <UModal :open="open">
    <template #content>
      <div class="px-6 py-5 text-center flex flex-col gap-2">
        <h2 class="text-xl font-medium">
          Enter your name
        </h2>

        <UForm
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            label="Naam"
            name="username"
            required
          >
            <UInput v-model="state.username" />
          </UFormField>

          <UButton
            type="submit"
            :disabled="!state.username.trim()"
          >
            Submit
          </UButton>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
