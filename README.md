# MARVEL MISSION CONTROL - WEB APPLICATION

**Clasificación:** TOP SECRET - Nivel 8 Acreditación
**Desarrollado por:** Stark Industries AI Division

## Resumen del Proyecto

Marvel Mission Control es el sistema centralizado de gestión operativa de superhéroes y misiones. Esta aplicación web permite la coordinación global de amenazas, seguimiento de activos en tiempo real (héroes), y administración de protocolos de emergencia. 

La arquitectura actual consta de:
- **Backend:** Laravel 11, SQLite, JWT Auth.
- **Frontend Web (Este repositorio):** React 18, TypeScript, Vite, CSS Modules.
- **Diseño Visual:** Google Stitch (Conectado vía MCP).

## Requisitos de Sistema

- Node.js (v18+)
- npm o yarn
- Backend Laravel ejecutándose en `http://marvel-api.test`

## Inicio Rápido (Quickstart)

### 1. Clonación e Instalación
```bash
git clone <repository_url> marvel-web
cd marvel-web
npm install
```

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el entorno de desarrollo:
```env
VITE_API_URL=http://marvel-api.test/api
```

### 3. Servidor de Desarrollo
```bash
npm run dev
```

El servidor Vite arrancará en `http://localhost:5173`.

## Arquitectura y Módulos

La aplicación sigue un enfoque modular basado en funcionalidades (Feature-based structure):

```text
src/
├── components/
│   ├── layout/       # Estructura principal (Sidebar, Header, Layout responsivo)
│   ├── ui/           # Componentes base (Botones, Inputs, LoadingStates)
├── context/          # Contextos globales (AuthContext para JWT)
├── pages/            # Vistas de página principales
│   ├── Login         # Puerta de entrada (JWT)
│   ├── Dashboard     # Resumen operativo
│   ├── HeroNetwork   # Directorio de Superhéroes
│   ├── HeroDetail    # Ficha técnica individual
│   ├── HeroForm      # Registro/Actualización (Admin)
│   ├── MissionList   # Directorio de Misiones
│   ├── MissionForm   # Protocolo de Misiones (Admin)
├── routes/           # ProtectedRoutes y AppRoutes
├── services/         # Integración Axios con API REST Laravel
├── theme/            # Sistema de Diseño CSS (Stark Industries Theme)
```

## Sistema de Diseño (Stark Theme)

El Frontend utiliza Vanilla CSS enriquecido con variables dinámicas definidas por **Google Stitch**.
No se utilizan librerías de UI (como MUI o Bootstrap) para garantizar rendimiento extremo y fidelidad pixel-perfect al diseño "Sci-Fi HUD".

### Paleta de Colores
- **Fondo:** `#0a0a0c`
- **Superficie:** `#141415`
- **Acento Primario (Stark Blue):** `#3b82f6`
- **Acento Secundario (Warning Red):** `#ef4444`

### Responsividad
El sistema fue optimizado para adaptarse a terminales móviles en campo. El layout colapsa su barra lateral (Sidebar) en pantallas `< 768px` y revela controles táctiles accesibles.

## Autenticación y Autorización (JWT)

El sistema soporta dos niveles de autorización que modifican la UI dinámicamente:
- **`ADMIN`:** Director Fury y agentes Nivel 8. Pueden registrar, actualizar y eliminar Héroes y Misiones.
- **`CONSULTA`:** Agentes de campo. Acceso de solo lectura a la red y misiones.

La interceptación Axios añade automáticamente el token `Bearer` a todas las peticiones seguras hacia `marvel-api.test`.

---
*© 2026 Stark Industries. Todo acceso no autorizado será rastreado e interceptado por J.A.R.V.I.S.*
