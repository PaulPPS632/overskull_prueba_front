# Overskull Frontend

Frontend de la prueba tecnica construido con:

- Vue 3 (`<script setup>` + Composition API)
- Vite
- Tailwind CSS v4
- Pinia
- Vue Router
- Axios
- vue-toastification

## Requisitos

- Node.js 18+
- npm 9+
- Backend disponible en `http://localhost:8080/api`

## Como levantar el proyecto

1. Clona el repositorio y entra a la carpeta del frontend.
2. Instala dependencias:

```bash
npm install
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

4. Abre la URL que muestra Vite en consola (normalmente `http://localhost:5173`).

## Scripts disponibles

- `npm run dev`: levanta el proyecto en modo desarrollo.
- `npm run build`: compila para produccion.
- `npm run preview`: sirve la build local para validacion.

## Notas importantes

- La API esta configurada en `src/services/api.js` con base URL fija `http://localhost:8080/api`.
- El interceptor global de Axios muestra toast rojo para errores `4xx/5xx`.
- Los toasts de exito se disparan desde las acciones CRUD de los stores.
- Cada vista muestra spinner mientras hay peticiones en curso.
