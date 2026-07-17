<script lang="ts">
import { createClient, type RealtimeChannel } from '@supabase/supabase-js'
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

// presence meta carries the game state so late joiners recover it on first sync
type PresenceMeta = SessionPlayer & { started?: boolean }

export const sessionKey = Symbol('session') as InjectionKey<SessionContext>
</script>

<script setup lang="ts">
export interface SessionProviderProps {
  id: string
}

const props = defineProps<SessionProviderProps>()
const runtimeConfig = useRuntimeConfig()
const player = usePlayer()

const supabase = createClient(runtimeConfig.public.supabaseUrl, runtimeConfig.public.supabaseKey)

const players = ref<SessionPlayer[]>([])
const started = ref(false)
// this client's own intent to start — separates the host from late joiners for the redirect
let hostStarted = false
let firstSync = true
let channel: RealtimeChannel | undefined

function syncPlayers() {
  if (!channel) return
  const metas = Object.values(channel.presenceState<PresenceMeta>())
    // track() untracks first, so each key holds exactly one meta
    .map(entries => entries[0])
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  players.value = metas.map(p => ({ id: p.id, username: p.username, teamId: p.teamId }))
  started.value = metas.some(p => p.started)

  // a game session is either waiting for players or already in progress;
  // landing on the URL after it started sends you back to the main menu
  if (firstSync) {
    firstSync = false
    if (started.value && !hostStarted) navigateTo('/')
  }
}

async function track() {
  if (!channel || !player.id.value || !player.username.value) return
  // untrack first: re-tracking otherwise appends a new meta and the stale one lingers
  await channel.untrack()
  await channel.track({
    id: player.id.value,
    username: player.username.value,
    teamId: player.teamId.value || undefined,
    started: hostStarted || undefined
  })
}

function start() {
  hostStarted = true
  started.value = true
  track()
}

function joinTeam(teamId: string) {
  player.teamId.value = teamId
  // watcher below re-tracks presence with the new team
}

onMounted(() => {
  channel = supabase.channel(`game:${props.id}:players`, {
    config: { presence: { key: player.id.value || crypto.randomUUID() } }
  })

  channel
    .on('presence', { event: 'sync' }, syncPlayers)
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') track()
    })

  // re-track once identity/team is known or changes (e.g. after the register modal)
  watch(() => [player.id.value, player.username.value, player.teamId.value], track)
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})

provide(sessionKey, {
  players: readonly(players) as Readonly<Ref<SessionPlayer[]>>,
  currentId: readonly(player.id) as Readonly<Ref<string | undefined>>,
  teamId: readonly(player.teamId) as Readonly<Ref<string | undefined>>,
  started: readonly(started) as Readonly<Ref<boolean>>,
  joinTeam,
  start
})
</script>

<template>
  <slot />
</template>
