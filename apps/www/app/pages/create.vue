<script setup lang="ts">
// ponytail: code client-side; state leeft in de nuxt-realtime state-key game:{id}.
// Botsingskans 1/32^4 is verwaarloosbaar voor een feestspel — server-registry als het ooit knelt.
function create() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const id = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  void navigateTo(`/sessions/${id}`)
}
</script>

<template>
  <Container>
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900">
        Create new game
      </h1>

      <p class="mt-2 text-sm text-gray-500">
        Open het hoofdscherm en laat spelers joinen
      </p>

      <div class="mt-8">
        <UButton
          size="lg"
          block
          class="bg-blue-500 hover:bg-blue-600"
          @click="create"
        >
          Start hoofdscherm
        </UButton>
      </div>
    </div>
  </Container>
</template>
