export default function usePlayer() {
  const username = useCookie('user.name')
  const id = useCookie('user.id')
  // ponytail: team in a global cookie, not per-session. Fine for single-game play; key it per session id if that ever changes.
  const teamId = useCookie('user.team')

  return {
    username,
    id,
    teamId
  }
}
