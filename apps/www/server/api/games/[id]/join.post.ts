export default defineEventHandler(async (event) => {
  const game = getGame(event)
  const { name } = await readBody(event)
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 30) {
    throw createError({ statusCode: 400, statusMessage: 'Team name required (max 30 chars)' })
  }
  const trimmed = name.trim()
  // ponytail: zelfde naam = zelfde team terug — dekt refresh/verloren localStorage, anti-cheat is buiten scope
  const existing = game.teams.find(team => team.name.toLowerCase() === trimmed.toLowerCase())
  if (existing) return { teamId: existing.id }
  if (game.status !== 'lobby') {
    throw createError({ statusCode: 409, statusMessage: 'Game already started' })
  }
  const team = { id: crypto.randomUUID(), name: trimmed }
  game.teams.push(team)
  broadcast(game)
  return { teamId: team.id }
})
