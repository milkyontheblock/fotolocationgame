<script lang="ts">
export interface PlayerCardProps {
  username: string
}
</script>

<script setup lang="ts">
const props = defineProps<PlayerCardProps>()
</script>

<template>
  <UCard class="px-4 py-3">
    <UAvatar />
    <strong>{{ props.username }}</strong>
  </UCard>
</template>
