<script setup lang="ts">
import { sessionKey } from './SessionProvider.vue'
import { teams } from '~/data/teams'

const session = inject(sessionKey)
if (!session) {
  throw new Error('SessionPlayerOverview must be used within a SessionProvider')
}

const { players, currentId, teamId, joinTeam } = session

const unassigned = computed(() => players.value.filter(p => !p.teamId))

function membersOf(id: string) {
  return players.value.filter(p => p.teamId === id)
}
</script>

<template>
  <ul class="p-6 bg-linear-to-br from-gray-200 to-gray-300 h-full flex flex-col gap-6 overflow-y-auto">
    <li v-if="unassigned.length">
      <UCard class="border-dashed">
        <p class="text-sm text-gray-600">
          Kies een team ({{ unassigned.length }} nog niet ingedeeld)
        </p>

        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="player in unassigned"
            :key="player.id"
            class="px-3 py-1 rounded-full border-2 border-gray-300 text-sm"
            :class="{ 'font-semibold': player.id === currentId }"
          >
            {{ player.username }}
          </span>
        </div>
      </UCard>
    </li>

    <li
      v-for="team in teams"
      :key="team.id"
    >
      <UCard
        :style="{ backgroundColor: team.color, borderColor: team.colorDark }"
        class="text-white cursor-pointer transition-shadow"
        :class="{ 'ring-4 ring-white/70': team.id === teamId }"
        @click="joinTeam(team.id)"
      >
        <div class="flex flex-row items-center gap-4">
          <UIcon
            :name="team.icon"
            class="size-8"
          />

          <p class="text-lg font-semibold">
            {{ team.name }}
          </p>

          <span
            v-if="team.id === teamId"
            class="ml-auto text-xs uppercase tracking-wide"
          >
            Jouw team
          </span>
        </div>

        <div class="mt-4">
          <ul
            v-if="membersOf(team.id).length"
            class="grid grid-cols-2 gap-4"
          >
            <li
              v-for="player in membersOf(team.id)"
              :key="player.id"
            >
              <div
                class="flex items-center justify-center gap-2 px-6 py-5 rounded-xl border-2"
                :style="{ borderColor: team.colorDark }"
                :class="{ 'bg-white/20 font-semibold': player.id === currentId }"
              >
                <UIcon
                  name="lucide:user"
                  class="size-5"
                />

                <p>{{ player.username }}</p>
              </div>
            </li>
          </ul>

          <p
            v-else
            class="text-sm text-white/80"
          >
            Nog geen spelers
          </p>
        </div>
      </UCard>
    </li>
  </ul>
</template>
