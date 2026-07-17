export default function usePlayer() {
  const username = useCookie('user.name')
  const id = useCookie('user.id')

  return {
    username,
    id
  }
}
