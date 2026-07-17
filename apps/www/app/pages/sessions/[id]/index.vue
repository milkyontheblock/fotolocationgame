<script setup lang="ts">
import SessionProviderClient from '~/components/SessionProvider.vue'

const players = [
  {
    id: 'oergiojeiorggiojr',
    username: 'milkyontheblock'
  }
] as const

const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex">
    <div class="flex-1" />

    <div class="w-150">
      <ul class="p-8">
        <li
          v-for="player in players"
          :key="player.id"
        >
          <PlayerCard :username="player.username" />
        </li>
      </ul>
    </div>
  </div>
</template>
