<script setup lang="ts">
const value = ref([])
</script>

<template>
  <Container>
    <div class="text-center">
      <h1 class="text-3xl font-semibold">
        Join a game
      </h1>

      <div class="mt-4">
        <UPinInput
          v-model="value"
          size="xl"
          :length="4"
        />
      </div>
    </div>
  </Container>
</template>
