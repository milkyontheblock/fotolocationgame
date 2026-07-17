<script setup lang="ts">
const players = [
  {
    id: 'oergiojeiorggiojr',
    username: 'Jordan'
  },
  {
    id: 'oergiojeiorggiojr',
    username: 'Pascal'
  },
  {
    id: 'oergiojeiorggiojr',
    username: 'Daan G'
  }
]

const teams = [
  {
    id: 'uih235uih23455uih',
    name: 'Leeuw',
    icon: 'game-icons:lion',
    color: 'var(--color-blue-400)',
    colorDark: 'var(--color-blue-600)'
  },
  {
    id: '3roeriogjeiojrg',
    name: 'Neushoorn',
    icon: 'game-icons:lion',
    color: 'var(--color-purple-400)',
    colorDark: 'var(--color-purple-600)'
  },
  {
    id: 'oinwerfgiojiou34t',
    name: 'Olifant',
    icon: 'game-icons:lion',
    color: 'var(--color-orange-400)',
    colorDark: 'var(--color-orange-600)'
  },
  {
    id: 'ergvionergiojejriog',
    name: 'Giraffe',
    icon: 'game-icons:lion',
    color: 'var(--color-green-400)',
    colorDark: 'var(--color-green-600)'
  },
  {
    id: 'zebra12345zebra67',
    name: 'Zebra',
    icon: 'game-icons:lion',
    color: 'var(--color-yellow-400)',
    colorDark: 'var(--color-yellow-600)'
  },
  {
    id: 'hyena98765hyena12',
    name: 'Hyena',
    icon: 'game-icons:lion',
    color: 'var(--color-rose-400)',
    colorDark: 'var(--color-rose-600)'
  },
  {
    id: 'luipaard5555luip3',
    name: 'Luipaard',
    icon: 'game-icons:lion',
    color: 'var(--color-pink-400)',
    colorDark: 'var(--color-pink-600)'
  },
  {
    id: 'buffel77778buffel',
    name: 'Buffel',
    icon: 'game-icons:lion',
    color: 'var(--color-amber-400)',
    colorDark: 'var(--color-amber-600)'
  },
  {
    id: 'krokodil99999kroko',
    name: 'Krokodil',
    icon: 'game-icons:lion',
    color: 'var(--color-emerald-400)',
    colorDark: 'var(--color-emerald-600)'
  }
]
</script>

<template>
  <ul class="p-6 bg-linear-to-br from-gray-200 to-gray-300 h-full flex flex-col gap-6 overflow-y-auto">
    <li
      v-for="team in teams"
      :key="team.id"
    >
      <UCard
        :style="{ backgroundColor: team.color, borderColor: team.colorDark }"
        class="text-white"
      >
        <div class="flex flex-row gap-4">
          <UIcon
            :name="team.icon"
            class="size-8"
          />

          <p class="text-lg font-semibold">
            {{ team.name }}
          </p>
        </div>

        <div class="mt-4">
          <ul class="grid grid-cols-2 gap-4">
            <li
              v-for="player in players"
              :key="player.id"
            >
              <div
                class="flex items-center justify-center px-6 py-5 rounded-xl border-2"
                :style="{ borderColor: team.colorDark }"
              >
                <UIcon
                  name="lucide:user"
                  class="size-5"
                />

                <p>{{ player.username }}</p>
              </div>
            </li>
          </ul>
        </div>
      </UCard>
    </li>
  </ul>
</template>
