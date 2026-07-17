<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-400 to-blue-500 p-6">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="size-8 rounded-lg bg-linear-to-br from-blue-400 to-blue-500" />
        <span class="text-lg font-bold tracking-tight text-gray-900">Social Deal</span>
      </div>

      <slot />
    </div>
  </div>
</template>
