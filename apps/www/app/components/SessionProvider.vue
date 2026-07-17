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
  joinTeam: (teamId: string) => void
}

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
let channel: RealtimeChannel | undefined

function syncPlayers() {
  if (!channel) return
  const state = channel.presenceState<SessionPlayer>()
  players.value = Object.values(state)
    // re-tracking (team switch) appends a new meta; the current one is last, not first
    .map(entries => entries.at(-1))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(p => ({ id: p.id, username: p.username, teamId: p.teamId }))
}

function track() {
  if (!channel || !player.id.value || !player.username.value) return
  channel.track({
    id: player.id.value,
    username: player.username.value,
    teamId: player.teamId.value || undefined
  })
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
  joinTeam
})
</script>

<template>
  <slot />
</template>
