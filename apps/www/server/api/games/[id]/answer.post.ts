export default defineEventHandler(async (event) => {
  const game = getGame(event)
  const { teamId, lat, lng } = await readBody(event)
  if (!game.teams.some(team => team.id === teamId)) {
    throw createError({ statusCode: 404, statusMessage: 'Team not found' })
  }
  if (game.status !== 'round') {
    throw createError({ statusCode: 409, statusMessage: 'No active round' })
  }
  if (Date.now() > game.roundEndsAt!) {
    throw createError({ statusCode: 409, statusMessage: 'Time is up' })
  }
  if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid coordinates' })
  }
  const answers = game.answers[game.round - 1]!
  if (answers[teamId]) {
    throw createError({ statusCode: 409, statusMessage: 'Answer already submitted' })
  }
  answers[teamId] = scoreAnswer(game, lat, lng)
  broadcast(game)
  // score/afstand pas bij de reveal, anders lekt het antwoord
  return { submitted: true, lat, lng }
})
