import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL
})
