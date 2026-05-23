<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Categorias', to: '/categorias' },
  { label: 'Productos', to: '/productos' },
]

const linkClass = (to) => {
  const isActive = route.path === to

  return isActive
    ? 'rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-md'
    : 'rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition hover:bg-slate-700'
}
</script>

<template>
  <header class="bg-slate-900 text-white shadow-2xl">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400 text-lg font-black text-slate-900 shadow-lg">
          OS
        </div>
        <div>
          <p class="text-lg font-bold tracking-wide">Overskull Frontend</p>
          <p class="text-xs text-slate-300">CRUD Categorias y Productos</p>
        </div>
      </RouterLink>

      <nav class="flex flex-wrap gap-2">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="linkClass(item.to)"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
