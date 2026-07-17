// ponytail: hardcoded per opdracht — vervang photo/coords door de echte set uit de Slack-bijlage
export interface GameLocation {
  name: string
  photo: string
  lat: number
  lng: number
}

export const locations: GameLocation[] = [
  { name: 'Eiffeltoren, Parijs', photo: 'https://picsum.photos/seed/round1/1200/800', lat: 48.8584, lng: 2.2945 },
  { name: 'Colosseum, Rome', photo: 'https://picsum.photos/seed/round2/1200/800', lat: 41.8902, lng: 12.4922 },
  { name: 'Sagrada Família, Barcelona', photo: 'https://picsum.photos/seed/round3/1200/800', lat: 41.4036, lng: 2.1744 },
  { name: 'Brandenburger Tor, Berlijn', photo: 'https://picsum.photos/seed/round4/1200/800', lat: 52.5163, lng: 13.3777 },
  { name: 'Big Ben, Londen', photo: 'https://picsum.photos/seed/round5/1200/800', lat: 51.5007, lng: -0.1246 },
  { name: 'Vrijheidsbeeld, New York', photo: 'https://picsum.photos/seed/round6/1200/800', lat: 40.6892, lng: -74.0445 },
  { name: 'Sydney Opera House', photo: 'https://picsum.photos/seed/round7/1200/800', lat: -33.8568, lng: 151.2153 },
  { name: 'Taj Mahal, Agra', photo: 'https://picsum.photos/seed/round8/1200/800', lat: 27.1751, lng: 78.0421 },
  { name: 'Machu Picchu, Peru', photo: 'https://picsum.photos/seed/round9/1200/800', lat: -13.1631, lng: -72.5450 },
  { name: 'De Dam, Amsterdam', photo: 'https://picsum.photos/seed/round10/1200/800', lat: 52.3731, lng: 4.8932 }
]
