// Speelt een heel spel via de API: node scripts/smoke.mjs (dev server moet draaien)
import assert from 'node:assert'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

async function api(path, body) {
  const res = await fetch(`${BASE}/api${path}`, body
    ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }
    : undefined)
  return { status: res.status, data: await res.json().catch(() => null) }
}

const game = (await api('/games', {})).data
assert.equal(game.status, 'lobby')

// SSE stream geeft direct de state
const sse = await fetch(`${BASE}/api/games/${game.id}/events`)
const chunk = new TextDecoder().decode((await sse.body.getReader().read()).value)
assert.ok(chunk.includes('"lobby"'), 'SSE initial state')

const teamA = (await api(`/games/${game.id}/join`, { name: 'Alpha' })).data.teamId
const teamB = (await api(`/games/${game.id}/join`, { name: 'Beta' })).data.teamId
assert.equal((await api(`/games/${game.id}/join`, { name: 'alpha' })).data.teamId, teamA, 'dubbele naam = zelfde team')
assert.equal((await api(`/games/${game.id}/join`, { name: '' })).status, 400)

let state = (await api(`/games/${game.id}/advance`, {})).data
assert.equal(state.status, 'round')
assert.equal(state.round, 1)
assert.ok(state.photo, 'foto zichtbaar in ronde')
assert.equal(state.reveal, null, 'geen reveal-lek tijdens ronde')

// Alpha raadt exact goed (Eiffeltoren), Beta antwoordt niet
assert.deepEqual((await api(`/games/${game.id}/answer`, { teamId: teamA, lat: 48.8584, lng: 2.2945 })).data, { submitted: true, lat: 48.8584, lng: 2.2945 })
assert.equal((await api(`/games/${game.id}/answer`, { teamId: teamA, lat: 0, lng: 0 })).status, 409, 'antwoord is geblokkeerd na insturen')
assert.equal((await api(`/games/${game.id}/answer`, { teamId: teamB, lat: 999, lng: 0 })).status, 400, 'ongeldige coords')

state = (await api(`/games/${game.id}/advance`, {})).data
assert.equal(state.status, 'reveal')
const [alpha, beta] = state.reveal.results.toSorted((a, b) => b.score - a.score)
assert.equal(alpha.score, 1000, 'exact goed = 1000 punten')
assert.equal(beta.score, 0, 'geen antwoord = 0 punten')
assert.equal((await api(`/games/${game.id}/join`, { name: 'Gamma' })).status, 409, 'joinen kan alleen in de lobby')

// Doorspelen: tussenstand na ronde 5, finished na ronde 10
for (let round = 2; round <= 10; round++) {
  state = (await api(`/games/${game.id}/advance`, {})).data
  if (round === 6) {
    assert.equal(state.status, 'intermission', 'tussenstand na ronde 5')
    state = (await api(`/games/${game.id}/advance`, {})).data
  }
  assert.equal(state.status, 'round')
  assert.equal(state.round, round)
  state = (await api(`/games/${game.id}/advance`, {})).data
  assert.equal(state.status, 'reveal')
}
state = (await api(`/games/${game.id}/advance`, {})).data
assert.equal(state.status, 'finished')
assert.equal(state.teams.find(t => t.id === teamA).score, 1000, 'eindscore telt op')
assert.equal((await api(`/games/${game.id}/advance`, {})).status, 409)
assert.equal((await api('/games/ZZZZ')).status, 404)

console.log('smoke ok')
process.exit(0)
