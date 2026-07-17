<template>
  <Container>
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Geoguessr
      </h1>

      <p class="mt-2 text-sm text-gray-500">
        Speel het foto-locatiespel met je team
      </p>

      <div class="mt-8 flex flex-col gap-3">
        <UButton
          href="/create"
          size="lg"
          block
          class="bg-blue-500 hover:bg-blue-600"
        >
          Create new game
        </UButton>

        <UButton
          href="/join"
          size="lg"
          block
          variant="outline"
          class="ring-blue-500 text-blue-600 hover:bg-blue-50"
        >
          Join game
        </UButton>
      </div>
    </div>
  </Container>
</template>
