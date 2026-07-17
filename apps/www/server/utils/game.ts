import type { EventStream, H3Event } from 'h3'
import { locations } from '../data/locations'

export const ROUND_MS = 15 * 60 * 1000
export const HALFTIME_AFTER = 5
const SCORE_FACTOR = 1 // ponytail: 1 punt per km eraf — tunen op de echte locatieset

export interface Team {
  id: string
  name: string
}

export interface Answer {
  lat: number
  lng: number
  distanceKm: number
  score: number
}

export type GameStatus = 'lobby' | 'round' | 'reveal' | 'intermission' | 'finished'

export interface Game {
  id: string
  status: GameStatus
  round: number
  roundEndsAt: number | null
  teams: Team[]
  answers: Record<string, Answer>[]
  streams: Set<EventStream>
}

// ponytail: in-memory, weg bij server restart — spellen opslaan is buiten scope
const games = new Map<string, Game>()

export function createGame(): Game {
  let id = randomCode()
  while (games.has(id)) id = randomCode()
  const game: Game = {
    id,
    status: 'lobby',
    round: 0,
    roundEndsAt: null,
    teams: [],
    answers: locations.map(() => ({})),
    streams: new Set()
  }
  games.set(id, game)
  return game
}

export function getGame(event: H3Event): Game {
  const game = games.get(getRouterParam(event, 'id')?.toUpperCase() ?? '')
  if (!game) throw createError({ statusCode: 404, statusMessage: 'Game not found' })
  return game
}

export function startRound(game: Game, round: number) {
  game.round = round
  game.status = 'round'
  game.roundEndsAt = Date.now() + ROUND_MS
}

export function scoreAnswer(game: Game, lat: number, lng: number): Answer {
  const loc = locations[game.round - 1]!
  const km = haversineKm(lat, lng, loc.lat, loc.lng)
  return { lat, lng, distanceKm: Math.round(km), score: Math.max(0, Math.round(1000 - km * SCORE_FACTOR)) }
}

export function publicState(game: Game) {
  const revealedRounds = game.status === 'round' ? game.round - 1 : game.round
  const totals: Record<string, number> = {}
  for (let r = 0; r < revealedRounds; r++) {
    for (const [teamId, answer] of Object.entries(game.answers[r]!)) {
      totals[teamId] = (totals[teamId] ?? 0) + answer.score
    }
  }
  const loc = locations[game.round - 1]
  const roundAnswers = game.answers[game.round - 1]
  return {
    id: game.id,
    status: game.status,
    round: game.round,
    totalRounds: locations.length,
    roundEndsAt: game.roundEndsAt,
    photo: loc && (game.status === 'round' || game.status === 'reveal') ? loc.photo : null,
    teams: game.teams.map(team => ({
      id: team.id,
      name: team.name,
      answered: !!roundAnswers?.[team.id],
      score: totals[team.id] ?? 0
    })),
    reveal: loc && game.status !== 'round' && game.round > 0
      ? {
          location: { name: loc.name, lat: loc.lat, lng: loc.lng },
          results: game.teams.map(team => ({
            teamId: team.id,
            name: team.name,
            ...(roundAnswers?.[team.id] ?? { score: 0 })
          }))
        }
      : null
  }
}

export function broadcast(game: Game) {
  const data = JSON.stringify(publicState(game))
  for (const stream of game.streams) stream.push(data)
}

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rad = (deg: number) => deg * Math.PI / 180
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2
    + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}
