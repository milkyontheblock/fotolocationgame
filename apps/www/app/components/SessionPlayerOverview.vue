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
    <Transition name="fade">
      <li v-if="unassigned.length">
        <UCard class="border-dashed">
          <p class="text-sm text-gray-600">
            Kies een team ({{ unassigned.length }} nog niet ingedeeld)
          </p>

          <TransitionGroup
            tag="div"
            name="player"
            class="relative mt-3 flex flex-wrap gap-2"
          >
            <span
              v-for="player in unassigned"
              :key="player.id"
              class="px-3 py-1 rounded-full border-2 border-gray-300 text-sm"
              :class="{ 'font-semibold': player.id === currentId }"
            >
              {{ player.username }}
            </span>
          </TransitionGroup>
        </UCard>
      </li>
    </Transition>

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
          <TransitionGroup
            v-if="membersOf(team.id).length"
            tag="ul"
            name="player"
            class="relative grid grid-cols-2 gap-4"
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
          </TransitionGroup>

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

<style scoped>
/* Players enter/leave/reorder as they join a team (joinTeam mutates teamId) */
.player-move,
.player-enter-active,
.player-leave-active {
  transition: all 0.3s ease;
}

.player-enter-from,
.player-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

/* take leavers out of flow so remaining players slide into place */
.player-leave-active {
  position: absolute;
}

/* fade the "unassigned" card once everyone is placed */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
