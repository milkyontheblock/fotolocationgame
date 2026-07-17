import { io } from 'socket.io-client'

// Client-side singleton. Import waar je 'm nodig hebt: `import { socket } from '~/lib/socket'`
export const socket = io()
