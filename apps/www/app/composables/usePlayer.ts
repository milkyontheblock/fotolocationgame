// Per-tab identity: sessionStorage is scoped to a single tab, so every tab is
// its own player. useState keeps the ref shared+reactive across components
// within that tab (cookies did this by name); sessionStorage persists it across
// reloads. Cookies were shared across all tabs → every tab was the same user.
function sessionRef(key: string) {
  const state = useState<string>(key, () => '')
  if (import.meta.client) {
    const stored = sessionStorage.getItem(key)
    if (stored !== null) state.value = stored
    watch(state, v => v ? sessionStorage.setItem(key, v) : sessionStorage.removeItem(key))
  }
  return state
}

export default function usePlayer() {
  return {
    username: sessionRef('user.name'),
    id: sessionRef('user.id'),
    teamId: sessionRef('user.team')
  }
}
