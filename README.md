# 🛡️ MARVEL MISSION CONTROL — Aplicación Móvil (React Native + Expo)

**Proyecto Académico:** Desarrollo Full Stack con API REST, React y React Native  
**Componente:** Aplicación Móvil de Consulta  
**Clasificación:** TOP SECRET — Nivel 8 Acreditación S.H.I.E.L.D.

---

## 📋 Descripción del Proyecto

Marvel Mission Control Mobile es la aplicación móvil del ecosistema **Universo Marvel**, diseñada para consultar superhéroes y misiones tácticas desde dispositivos iOS y Android. La app consume la **misma API REST** (Laravel 11 + SQLite + JWT) que utiliza la aplicación web React.

**Arquitectura del sistema completo:**
```
                    LARAVEL 11 (SQLite + JWT)
                           │
                      REST API + JWT
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
            REACT WEB          REACT NATIVE (esta app)
            ADMIN/CONSULTA       CONSULTA
                                     │
                                     ▼
                             AsyncStorage
                             └─ Favoritos
```

> **NO se duplica el backend.** NO existe API Mobile separada, base de datos local, ni autenticación paralela. Todo proviene de Laravel.

---

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|:---|:---|:---|
| React Native | 0.79.x | Framework móvil |
| Expo SDK | ~53 | Entorno de desarrollo y Expo Go |
| TypeScript | 5.x | Tipado estático |
| React Navigation | 7.x | Navegación (Stack + Bottom Tabs) |
| Axios | 1.x | Cliente HTTP centralizado |
| AsyncStorage | 2.x | Persistencia local (JWT + Favoritos) |
| Ionicons | via @expo/vector-icons | Iconografía |

---

## 📦 Requisitos Previos

- **Node.js** v18+ y **npm**
- **Expo Go** instalado en dispositivo físico (iOS App Store / Google Play)
- **Backend Laravel** ejecutándose y accesible por red local
- **Red Local:** Dispositivo y computadora en la **misma red WiFi**

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
cd marvel-mobile
npm install
```

### 2. Configurar API_BASE_URL (¡IMPORTANTE!)

**Problema:** Cuando Laravel corre en tu Mac y React Native corre en Expo Go en un dispositivo físico, `localhost` NO apunta a tu Mac sino al propio dispositivo.

**Solución:** La app incluye **dos mecanismos** para configurar la URL del servidor:

#### Opción A: Archivo de configuración (recomendado para desarrollo)
Edita [`src/config/env.ts`](src/config/env.ts) y cambia la IP:
```typescript
const DEFAULT_API_BASE_URL = 'http://192.168.X.X:8000/api';
//                            ^^^^^^^^^^^^^^^^
//                            Tu IP local real
```

Para encontrar tu IP local:
```bash
# macOS
ipconfig getifaddr en0

# Windows
ipconfig | findstr "IPv4"

# Linux
hostname -I
```

#### Opción B: Modal de configuración en la pantalla Login
La pantalla de Login incluye un **botón de configuración de red** (⚙️) que permite cambiar la URL de la API sin recompilar la app. El valor se persiste en AsyncStorage.

### 3. Asegurar que Laravel sea accesible
Si usas **Laravel Herd**, necesitas que el servidor escuche en todas las interfaces:
```bash
cd marvel-backend
php artisan serve --host=0.0.0.0 --port=8000
```

### 4. Ejecutar la aplicación
```bash
npx expo start
```
Escanea el código QR con la app **Expo Go** en tu dispositivo.

---

## 🔑 Credenciales de Prueba

Los usuarios provienen del **backend Laravel** (seeders). NO están hardcodeados en la app:

| Rol | Email | Password | Permisos |
|:---|:---|:---|:---|
| **ADMIN** | `admin@shield.gov` | `Admin1234!` | CRUD completo |
| **CONSULTA** | `consulta@shield.gov` | `Consulta1234!` | Solo lectura (GET) |

> La app móvil funciona principalmente como **consulta** — no implementa formularios de creación/edición ya que el requisito académico no lo exige para Mobile.

---

## 📱 Pantallas Obligatorias (6/6 implementadas)

| # | Pantalla | Archivo | Descripción |
|:---:|:---|:---|:---|
| 1 | **Login** | [`LoginScreen.tsx`](src/screens/auth/LoginScreen.tsx) | Email + Password → `POST /api/auth/login` → JWT en AsyncStorage |
| 2 | **Inicio** | [`HomeScreen.tsx`](src/screens/home/HomeScreen.tsx) | "Welcome back, {nombre}" (del backend), dashboard con estadísticas, accesos rápidos |
| 3 | **Superhéroes** | [`HeroesScreen.tsx`](src/screens/heroes/HeroesScreen.tsx) | `GET /api/heroes` con **FlatList**, imagen, nombre, poder, nivel, estado |
| 4 | **Detalle Héroe** | [`HeroDetailScreen.tsx`](src/screens/heroes/HeroDetailScreen.tsx) | `GET /api/heroes/{id}` — imagen, nombre, nombre_real, poder_principal, nivel_poder, estado |
| 5 | **Favoritos** | [`FavoritesScreen.tsx`](src/screens/favorites/FavoritesScreen.tsx) | Héroes marcados, persistidos en AsyncStorage, Empty State, quitar favorito |
| 6 | **Misiones** | [`MissionsScreen.tsx`](src/screens/missions/MissionsScreen.tsx) | `GET /api/misiones` con **FlatList**, titulo, descripcion, ubicacion, fecha, nivel_peligro, estado, héroe asociado |

---

## 🏗️ Estructura de Carpetas

```
marvel-mobile/
├── App.tsx                           # Punto de entrada (AuthProvider + FavoritesProvider + RootNavigator)
├── package.json                      # Dependencias del proyecto
├── tsconfig.json                     # Configuración TypeScript
└── src/
    ├── api/                          # Cliente HTTP centralizado
    │   ├── client.ts                 # Axios instance + interceptores JWT + manejo 401
    │   ├── auth.ts                   # Endpoints de autenticación (login, me, logout, register)
    │   ├── heroes.ts                 # GET /api/heroes, GET /api/heroes/{id}
    │   ├── missions.ts               # GET /api/misiones, GET /api/misiones/{id}
    │   └── index.ts                  # Re-exports
    ├── components/                   # Componentes reutilizables
    │   ├── common/                   # HudCard, HudButton, LoadingOverlay, ErrorMessage, EmptyState, etc.
    │   ├── heroes/                   # HeroCard
    │   └── missions/                 # MissionCard
    ├── config/
    │   └── env.ts                    # API_BASE_URL centralizada (NO repetida en cada pantalla)
    ├── context/
    │   ├── AuthContext.tsx            # Manejo global de sesión, JWT, usuario autenticado
    │   └── FavoritesContext.tsx       # Favoritos vía AsyncStorage (solo IDs)
    ├── navigation/
    │   ├── types.ts                  # Tipos de navegación (RootStack, MainTab, AuthStack)
    │   ├── RootNavigator.tsx         # Stack principal (Auth ↔ MainTabs ↔ HeroDetail)
    │   ├── AuthNavigator.tsx         # Stack de Login
    │   └── MainTabNavigator.tsx      # Bottom Tabs (Inicio, Héroes, Misiones, Favoritos)
    ├── screens/
    │   ├── auth/LoginScreen.tsx
    │   ├── home/HomeScreen.tsx
    │   ├── heroes/HeroesScreen.tsx
    │   ├── heroes/HeroDetailScreen.tsx
    │   ├── favorites/FavoritesScreen.tsx
    │   └── missions/MissionsScreen.tsx
    ├── storage/
    │   └── asyncStorage.ts           # Operaciones de AsyncStorage (getToken, setToken, getFavorites...)
    ├── theme/
    │   ├── colors.ts                 # Paleta Stark/Jarvis (oscura con acentos cian/dorado)
    │   └── typography.ts             # Sistema tipográfico monospace
    ├── types/
    │   └── index.ts                  # Interfaces: User, Hero, Mission, ApiResponse, etc.
    └── utils/
        └── formatting.ts             # Helpers de formato (fecha, ubicación, colores de estado)
```

---

## 🔐 Autenticación JWT y Gestión de Sesión

### Flujo de Login
1. Usuario ingresa email + password en `LoginScreen`.
2. App consume `POST /api/auth/login` vía Axios.
3. Si la respuesta es exitosa, se guarda el `access_token` en **AsyncStorage** (NO se guarda el password).
4. Se navega al flujo principal (MainTabs).

### Sesión Persistente
1. Al iniciar la app, `AuthContext` busca el JWT en AsyncStorage.
2. Si existe, envía `GET /api/auth/me` para validar con el backend.
3. Si JWT es válido → mantiene sesión (el nombre del usuario procede del backend).
4. Si JWT es inválido o la API retorna `401` → elimina token → redirige a Login.

### Interceptor Centralizado
- **Request:** El interceptor de Axios añade automáticamente `Authorization: Bearer {token}` a cada request.
- **Response 401:** Si cualquier endpoint responde 401, el interceptor elimina el JWT, limpia el contexto de sesión y redirige a Login automáticamente. NO deja al usuario dentro de una sesión inválida.

---

## ⭐ Favoritos (AsyncStorage)

- Los héroes favoritos se guardan como **array de IDs** en AsyncStorage (key: `@marvel_favorite_hero_ids`).
- **NO** se crea una tabla de favoritos en Laravel — el requisito especifica AsyncStorage.
- **NO** se convierte AsyncStorage en una segunda base de datos — solo se guardan IDs. Los datos del héroe (nombre, imagen, poder) siguen procediendo de la API al abrir la pantalla.
- Los favoritos **persisten** al cerrar y reabrir la aplicación.
- La pantalla de Favoritos permite ver y quitar favoritos, e incluye un **Empty State** cuando no hay ninguno marcado.

---

## 📡 Endpoints Consumidos por la App

| Método | Endpoint | Pantalla |
|:---|:---|:---|
| `POST` | `/api/auth/login` | LoginScreen |
| `GET` | `/api/auth/me` | AuthContext (inicio de sesión) |
| `POST` | `/api/auth/logout` | HomeScreen (botón Desconectar) |
| `GET` | `/api/heroes` | HeroesScreen, FavoritesScreen, HomeScreen |
| `GET` | `/api/heroes/{id}` | HeroDetailScreen |
| `GET` | `/api/misiones` | MissionsScreen, HomeScreen |

---

## ✅ Requisitos Técnicos React Native Cumplidos

| Requisito | ✅ | Evidencia |
|:---|:---:|:---|
| Componentes funcionales | ✅ | 100% funcionales, sin clases |
| Props | ✅ | HeroCard, MissionCard, StatusBadge, PowerBar, etc. |
| useState | ✅ | Todos los estados: loading, error, data, filters |
| useEffect | ✅ | Fetch de datos, carga de sesión, carga de favoritos |
| React Navigation | ✅ | NativeStack + Bottom Tabs |
| FlatList | ✅ | HeroesScreen y MissionsScreen |
| Axios | ✅ | Cliente centralizado con interceptores |
| AsyncStorage | ✅ | JWT + Favoritos |
| Loading states | ✅ | LoadingOverlay en todas las pantallas de datos |
| Error states | ✅ | ErrorMessage con botón de retry |
| Empty states | ✅ | EmptyState en FavoritesScreen y MissionsScreen |

---

## 🧪 Pruebas Sugeridas

### Test 1 — Login Mobile
1. Ejecutar `npx expo start` → Escanear QR en Expo Go.
2. Ingresar `admin@shield.gov` / `Admin1234!`.
3. Verificar que se muestra "WELCOME BACK, NICK FURY".

### Test 2 — Sesión Persistente
1. Login exitoso.
2. Cerrar completamente Expo Go.
3. Reabrir la app → la sesión debe mantenerse.

### Test 3 — Superhéroes + FlatList
1. Navegar a la pestaña "HÉROES".
2. Verificar que aparece la lista con imagen, nombre, poder, nivel, estado.
3. Tocar un héroe → Detalle con GET /api/heroes/{id}.

### Test 4 — Favoritos
1. Marcar un héroe con la estrella (☆ → ★).
2. Navegar a pestaña "FAVORITOS" → el héroe aparece.
3. Cerrar y reabrir la app → el favorito persiste.
4. Quitar favorito → desaparece de la lista.

### Test 5 — Misiones + FlatList
1. Navegar a pestaña "MISIONES".
2. Verificar titulo, descripcion, ubicacion, fecha, nivel_peligro, estado, héroe.
3. Usar filtros de peligro y estado.

### Test 6 — Token Inválido
1. Login exitoso.
2. Forzar un token inválido (cambiar el valor en AsyncStorage o invalidar en backend).
3. Intentar navegar → la API retorna 401 → la app limpia sesión y regresa a Login.

### Test 7 — API Offline
1. Detener el servidor Laravel.
2. Abrir la app → debe mostrar un estado de error comprensible, NO pantalla blanca.

---

## 🎨 Diseño Visual

La app implementa la identidad visual **Marvel / Stark / J.A.R.V.I.S. / Mission Control**:
- Paleta oscura con acentos cian (`#00E5FF`) y dorado (`#FFD700`)
- Tipografía monospace tipo terminal militar
- Esquinas HUD en tarjetas
- Badges de estado color-coded (ACTIVO/INACTIVO, BAJO/MEDIO/ALTO, PENDIENTE/EN_PROGRESO/COMPLETADA)
- Power bars visuales para nivel_poder (1-100)

---

*© 2026 Stark Industries AI Division. Todo acceso no autorizado será rastreado e interceptado por S.H.I.E.L.D.*
