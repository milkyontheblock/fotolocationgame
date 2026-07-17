<script lang="ts">
import type { InjectionKey, Ref } from 'vue'

export interface SessionPlayer {
  id: string
  username: string
  teamId?: string
}

export interface SessionContext {
  players: Readonly<Ref<SessionPlayer[]>>
  currentId: Readonly<Ref<string | undefined>>
  teamId: Readonly<Ref<string | undefined>>
  started: Readonly<Ref<boolean>>
  joinTeam: (teamId: string) => void
  start: () => void
}

// server-authoritative shared state, synced to every client on this session key.
// keyed by player id so each client can write/remove just its own entry.
export interface SessionState {
  players: Record<string, SessionPlayer>
  started: boolean
}

export const sessionKey = Symbol('session') as InjectionKey<SessionContext>
</script>

<script setup lang="ts">
export interface SessionProviderProps {
  id: string
}

const props = defineProps<SessionProviderProps>()
const player = usePlayer()

// TODO(socket.io): replace this local ref with the server-synced session state.
// Wire `socket` (~/lib/socket) to emit track/untrack/start and to assign incoming
// snapshots into `state.value` for `game:${props.id}`.
const state = ref<SessionState>({ players: {}, started: false })

const players = computed(() => Object.values(state.value.players))
const started = computed(() => state.value.started)

function track() {
  const id = player.id.value
  if (!id || !player.username.value) return
  state.value.players[id] = { id, username: player.username.value, teamId: player.teamId.value || undefined }
}

function untrack() {
  const id = player.id.value
  if (id) delete state.value.players[id]
}

function start() {
  state.value.started = true
}

function joinTeam(teamId: string) {
  player.teamId.value = teamId
  // watcher below re-tracks with the new team
}

onMounted(() => {
  // re-track when identity/team changes (e.g. after the register modal)
  watch(
    () => [player.id.value, player.username.value, player.teamId.value],
    track,
    { immediate: true }
  )
})

onUnmounted(untrack)

provide(sessionKey, {
  players: players as Readonly<Ref<SessionPlayer[]>>,
  currentId: readonly(player.id) as Readonly<Ref<string | undefined>>,
  teamId: readonly(player.teamId) as Readonly<Ref<string | undefined>>,
  started: started as Readonly<Ref<boolean>>,
  joinTeam,
  start
})
</script>

<template>
  <slot />
</template>
