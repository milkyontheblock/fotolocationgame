<script setup lang="ts">
const value = ref([])
</script>

<template>
  <Container>
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900">
        Join a game
      </h1>

      <p class="mt-2 text-sm text-gray-500">
        Vul de 4-cijferige gamecode in
      </p>

      <div class="mt-8 flex justify-center">
        <UPinInput
          v-model="value"
          size="xl"
          :length="4"
        />
      </div>
    </div>
  </Container>
</template>
