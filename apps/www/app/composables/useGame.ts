export interface GameTeam {
  id: string
  name: string
  answered: boolean
  score: number
}

export interface GameResult {
  teamId: string
  name: string
  score: number
  lat?: number
  lng?: number
  distanceKm?: number
}

export interface GameState {
  id: string
  status: 'lobby' | 'round' | 'reveal' | 'intermission' | 'finished'
  round: number
  totalRounds: number
  roundEndsAt: number | null
  photo: string | null
  teams: GameTeam[]
  reveal: {
    location: { name: string, lat: number, lng: number }
    results: GameResult[]
  } | null
}

// Realtime state via SSE; EventSource reconnect (en refresh) krijgt altijd de volle state terug
export function useGame(id: string) {
  const state = ref<GameState | null>(null)
  onMounted(() => {
    const source = new EventSource(`/api/games/${id}/events`)
    source.onmessage = event => state.value = JSON.parse(event.data)
    onUnmounted(() => source.close())
  })
  return state
}

export function useCountdown(endsAt: () => number | null) {
  const now = ref(Date.now())
  onMounted(() => {
    const timer = setInterval(() => now.value = Date.now(), 1000)
    onUnmounted(() => clearInterval(timer))
  })
  const secondsLeft = computed(() => {
    const end = endsAt()
    return end ? Math.max(0, Math.ceil((end - now.value) / 1000)) : null
  })
  const label = computed(() => secondsLeft.value === null
    ? ''
    : `${Math.floor(secondsLeft.value / 60)}:${String(secondsLeft.value % 60).padStart(2, '0')}`)
  return { secondsLeft, label }
}
