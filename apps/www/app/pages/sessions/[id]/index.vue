<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id as string)
</script>

<template>
  <SessionProvider :id="id">
    <div class="h-screen flex p-6 gap-6">
      <div class="flex-1 rounded-2xl overflow-hidden">
        <div class="bg-linear-to-br from-blue-400 to-blue-500 size-full" />
      </div>

      <div class="w-150 flex flex-col gap-6">
        <div class="rounded-2xl overflow-hidden">
          <SessionStatusCard />
        </div>

        <div class="rounded-2xl overflow-hidden flex-1">
          <SessionPlayerOverview />
        </div>
      </div>
    </div>
  </SessionProvider>
</template>
