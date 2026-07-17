<script setup lang="ts">
// ponytail: code client-side; state leeft in het Supabase Realtime channel game:{id}.
// Botsingskans 1/32^4 is verwaarloosbaar voor een feestspel — server-registry als het ooit knelt.
function create() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const id = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return navigateTo(`/sessions/${id}`)
}
</script>

<template>
  <Container>
    <div>
      <h1>Create new game</h1>

      <UButton @click="create">
        Start hoofdscherm
      </UButton>
    </div>
  </Container>
</template>
