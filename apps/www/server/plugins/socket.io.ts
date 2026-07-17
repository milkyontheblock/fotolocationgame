import type { NitroApp } from 'nitropack'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'

// Exposed so server-side logic (event handlers, API routes) can reach the io instance.
export let io: Server

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  io = new Server()
  io.bind(engine)

  io.on('connection', (socket) => {
    // Schrijf hier je realtime game-logica
    console.log('socket connected', socket.id)
  })

  nitroApp.router.use('/socket.io/', defineEventHandler({
    handler(event) {
      // @ts-expect-error engine.io types don't line up with h3 node req/res
      engine.handleRequest(event.node.req, event.node.res)
      event._handled = true
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq)
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket)
      }
    }
  }))
})
