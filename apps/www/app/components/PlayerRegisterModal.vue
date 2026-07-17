<script lang="ts">
</script>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

interface UserForm { username?: string, id: string }

const player = usePlayer()
const open = ref(false)

const state = reactive<UserForm>({
  id: crypto.randomUUID() })

function onSubmit(event: FormSubmitEvent<UserForm>) {
  player.id.value = event.data.id
  player.username.value = event.data.username ?? ''

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
            label="Email"
            name="email"
          >
            <UInput v-model="state.username" />
          </UFormField>

          <UButton type="submit">
            Submit
          </UButton>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
