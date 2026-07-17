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
// nuxt-realtime holds one value per key (no presence meta list), so each client
// just writes/removes its own entry keyed by player id.
interface SessionState {
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

const state = useRealtimeState(`game:${props.id}`, { players: {}, started: false } as SessionState)

const players = computed(() => Object.values(state.value.players))
const started = computed(() => state.value.started)

// this client's own intent to start — separates the host from late joiners for the redirect
let hostStarted = false

// set while leaving the page so the self-heal watcher can't undo our own untrack
let leaving = false

function track() {
  const id = player.id.value
  // never write while loading: the module's storage:set is a full overwrite, so
  // pushing our default state would wipe every other player (and the started flag)
  if (leaving || state.loading.value || !id || !player.username.value) return
  state.value = {
    ...state.value,
    players: {
      ...state.value.players,
      [id]: { id, username: player.username.value, teamId: player.teamId.value || undefined }
    }
  }
}

function untrack() {
  leaving = true
  const id = player.id.value
  if (!id || !state.value.players[id]) return
  const rest = Object.fromEntries(Object.entries(state.value.players).filter(([key]) => key !== id))
  state.value = { ...state.value, players: rest }
}

function start() {
  hostStarted = true
  state.value = { ...state.value, started: true }
}

function joinTeam(teamId: string) {
  player.teamId.value = teamId
  // watcher below re-tracks with the new team
}

onMounted(() => {
  // first write waits for the server snapshot (loading), then re-runs when
  // identity/team changes (e.g. after the register modal)
  watch(
    [state.loading, () => [player.id.value, player.username.value, player.teamId.value]],
    track,
    { immediate: true }
  )

  // self-heal lost updates: concurrent joins are last-write-wins on the server,
  // so an incoming state may be missing us — re-add ourselves on top of it
  watch(state, () => {
    const id = player.id.value
    if (id && !state.value.players[id]) track()
  }, { deep: true })

  // landing on an already-started game sends you back to the main menu. Decide once,
  // on the first server snapshot, so a player already in the lobby isn't bounced
  // when the host later starts.
  let decided = false
  watch(state.loading, (loading) => {
    if (loading || decided) return
    decided = true
    if (state.value.started && !hostStarted) navigateTo('/')
  })

  // best-effort prune on tab close; the socket usually flushes the frame before dying.
  // pageshow restores us after a bfcache return (back button on mobile).
  // ponytail: if the frame is lost, the stale player sits until the game ends — add
  // server-side socket-disconnect pruning if it ever bites.
  window.addEventListener('pagehide', untrack)
  window.addEventListener('pageshow', retrack)
})

function retrack() {
  leaving = false
  track()
}

onUnmounted(() => {
  window.removeEventListener('pagehide', untrack)
  window.removeEventListener('pageshow', retrack)
  untrack()
})

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
