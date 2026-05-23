<script setup>
const menuItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Categorias', path: '/categorias' },
  { label: 'Productos', path: '/productos' },
  { label: 'Nuevo Producto', path: '/productos/nuevo' },
]

const quickStats = [
  { label: 'Categorias activas', value: '12', color: 'bg-blue-100 text-blue-900' },
  { label: 'Productos totales', value: '184', color: 'bg-emerald-100 text-emerald-900' },
  { label: 'Stock bajo', value: '7', color: 'bg-amber-100 text-amber-900' },
  { label: 'Ventas del mes', value: '$23.4k', color: 'bg-rose-100 text-rose-900' },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100">
    <header class="bg-slate-900 text-white shadow-2xl">
      <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400 text-lg font-black text-slate-900 shadow-lg">
            OS
          </div>
          <div>
            <p class="text-lg font-bold tracking-wide">Overskull Frontend</p>
            <p class="text-xs text-slate-300">Prueba tecnica</p>
          </div>
        </div>

        <nav class="flex flex-wrap gap-2">
          <a
            v-for="item in menuItems"
            :key="item.path"
            :href="item.path"
            class="rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 shadow-md transition hover:bg-emerald-400 hover:text-slate-900"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-6 py-10">
      <section class="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
        <h1 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">Dashboard inicial</h1>
        <p class="mt-3 max-w-2xl text-slate-600">
          Vista base para validar Tailwind CSS: colores de fondo, grid, flexbox, sombras y espaciados.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="stat in quickStats"
            :key="stat.label"
            :class="['rounded-xl p-5 shadow-md ring-1 ring-black/5', stat.color]"
          >
            <p class="text-sm font-medium">{{ stat.label }}</p>
            <p class="mt-2 text-2xl font-black">{{ stat.value }}</p>
          </article>
        </div>
      </section>

      <section class="mt-6 rounded-xl bg-amber-100 p-4 text-sm font-semibold text-amber-900 shadow-md">
        Si ves este layout con gradientes, sombras y tarjetas de colores, Tailwind v4 esta funcionando.
      </section>
    </main>
  </div>
</template>
