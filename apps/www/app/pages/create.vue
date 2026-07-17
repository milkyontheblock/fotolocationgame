<script setup lang="ts">
async function create() {
  const game = await $fetch('/api/games', { method: 'POST' })
  await navigateTo(`/sessions/${game.id}`)
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
