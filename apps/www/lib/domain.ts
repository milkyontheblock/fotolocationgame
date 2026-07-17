export interface IPlayer {
  id: string
  username: string
}

export interface ITeam {
  name: string
  players: string[]
}

export interface IGame {
  id: string
  teams: ITeam[]
  players: IPlayer[]
}
