<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

export interface SessionProviderProps {
  id: string
}

const props = defineProps<SessionProviderProps>()
const runtimeConfig = useRuntimeConfig()

const supabase = createClient(runtimeConfig.public.supabaseUrl, runtimeConfig.public.supabaseKey)

const channel = shallowRef(supabase.channel(`game:${props.id}:players`))

onMounted(() => {
  channel.value.on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('join', key, newPresences)
  }).on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('leave', key, leftPresences)
  })
})
</script>

<template>
  <slot />
</template>
