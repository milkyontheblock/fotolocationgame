<script setup lang="ts">
import { sessionKey } from './SessionProvider.vue'

const session = inject(sessionKey)
if (!session) {
  throw new Error('SessionStatusCard must be used within a SessionProvider')
}

const { players, started, start } = session
</script>

<template>
  <div class="p-6 bg-white flex items-center justify-between gap-4">
    <div>
      <h1 class="text-xl font-semibold">
        {{ started ? 'Game bezig' : 'Wachten op spelers' }}
      </h1>

      <p class="text-sm text-gray-500">
        {{ players.length }} {{ players.length === 1 ? 'speler' : 'spelers' }} verbonden
      </p>
    </div>

    <UButton
      v-if="!started"
      size="lg"
      :disabled="!players.length"
      @click="start"
    >
      Start game
    </UButton>
  </div>
</template>
