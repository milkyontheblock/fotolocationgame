export default defineEventHandler((event) => {
  const game = getGame(event)
  const stream = createEventStream(event)
  game.streams.add(stream)
  stream.onClosed(() => game.streams.delete(stream))
  stream.push(JSON.stringify(publicState(game)))
  return stream.send()
})
