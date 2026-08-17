# MARVEL MISSION CONTROL - MOBILE APP (REACT NATIVE)

**Clasificación:** TOP SECRET - Nivel 8 Acreditación
**Desarrollado por:** Stark Industries AI Division (Mobile Sector)

## Resumen del Proyecto

Marvel Mission Control Mobile es la interfaz de campo para los agentes de S.H.I.E.L.D. Permite consultar la base de datos de superhéroes y revisar asignaciones de misiones desde cualquier lugar.

La arquitectura móvil consta de:
- **Framework:** React Native con Expo (Expo Go).
- **Backend:** Conexión directa a la API REST central (Laravel 11, SQLite, JWT Auth).
- **Diseño Visual:** Estética "Sci-Fi HUD" (J.A.R.V.I.S. / Stark Protocol).

## Requisitos de Sistema

- Node.js (v18+)
- npm o yarn
- Aplicación **Expo Go** instalada en dispositivo físico (iOS/Android).
- Backend Laravel ejecutándose en un entorno accesible por red (ver configuración de Red).

## Inicio Rápido (Quickstart)

### 1. Clonación e Instalación
```bash
git clone <repository_url> marvel-mobile
cd marvel-mobile
npm install
```

### 2. Configuración de Red (¡IMPORTANTE!)
Para que el dispositivo físico o emulador pueda comunicarse con el backend Laravel, **no puedes usar `localhost`**. 

Abre `src/api/client.ts` (o tu archivo de entorno) y configura la `API_BASE_URL` con la IP local de tu ordenador:
```typescript
// Ejemplo: Reemplaza con la IP de tu máquina en la red local
export const API_BASE_URL = 'http://192.168.x.x:8000/api';
```
*Si usas Laravel Herd, puedes acceder por red si tienes Herd Pro o exponiendo el puerto con `php artisan serve --host=0.0.0.0`.*

### 3. Ejecutar la Aplicación
```bash
npx expo start
```
Escanea el código QR generado en la terminal con la app **Expo Go**.

## Arquitectura y Módulos

```text
src/
├── api/              # Cliente Axios y configuración central (client.ts)
├── components/       # Componentes reusables (Botones, Tarjetas, Loading, Error)
├── context/          # Manejo de sesión global (AuthContext)
├── navigation/       # React Navigation (Stack, Tab, Protected)
├── screens/          # Pantallas obligatorias:
│   ├── LoginScreen
│   ├── HomeScreen
│   ├── HeroesScreen
│   ├── HeroDetailScreen
│   ├── FavoritesScreen
│   ├── MissionsScreen
├── services/         # Servicios de llamadas a la API
├── storage/          # Persistencia (AsyncStorage) para JWT y Favoritos
├── theme/            # Sistema de colores y estilos globales
```

## Características y Requisitos Académicos Cumplidos

- **Consumo de API Real:** Ningún dato (héroes, misiones o usuarios) está hardcodeado. Todo proviene del servidor Laravel.
- **Login y JWT:** El token JWT se almacena de forma segura usando `AsyncStorage`.
- **Sesión Persistente:** Al iniciar la app, se valida silenciosamente el token usando el endpoint `/api/auth/me`.
- **Interceptores de Axios:** El token se añade automáticamente a cada petición. Si se recibe un `401 Unauthorized`, se elimina el token y se envía al usuario a Login.
- **FlatList:** Listado de héroes y misiones optimizado obligatoriamente mediante `<FlatList>`.
- **Favoritos (Offline/Storage):** Permite guardar los héroes favoritos localmente vía `AsyncStorage`, persistiendo aunque se cierre la app.

---
*© 2026 Stark Industries. Todo acceso no autorizado será rastreado e interceptado.*
