// Eén host-knop: lobby → ronde → reveal → (tussenstand na 5) → ... → finished
export default defineEventHandler((event) => {
  const game = getGame(event)
  switch (game.status) {
    case 'lobby':
      if (!game.teams.length) throw createError({ statusCode: 409, statusMessage: 'No teams joined yet' })
      startRound(game, 1)
      break
    case 'round':
      game.status = 'reveal'
      game.roundEndsAt = null
      break
    case 'reveal':
      if (game.round >= game.answers.length) game.status = 'finished'
      else if (game.round === HALFTIME_AFTER) game.status = 'intermission'
      else startRound(game, game.round + 1)
      break
    case 'intermission':
      startRound(game, game.round + 1)
      break
    case 'finished':
      throw createError({ statusCode: 409, statusMessage: 'Game is finished' })
  }
  broadcast(game)
  return publicState(game)
})
