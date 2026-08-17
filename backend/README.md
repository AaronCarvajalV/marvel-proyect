# 🛡️ Marvel Superheroes & Missions API

[![Laravel 11](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP 8.4](https://img.shields.io/badge/PHP-8.4-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![JWT Auth](https://img.shields.io/badge/JWT-Stateless_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Ponytail Doctrine](https://img.shields.io/badge/Architecture-Ponytail_Doctrine-22c55e?style=for-the-badge)](https://antigravity.google)
[![Tests Passing](https://img.shields.io/badge/Tests-50%20Passed-brightgreen?style=for-the-badge)](https://phpunit.de)

A robust, high-performance RESTful API for managing **Marvel universe superheroes** and their assigned **tactical missions**. Developed with **Laravel 11**, **PHP 8.4**, **SQLite**, and **JWT Authentication** (`php-open-source-saver/jwt-auth`), following the **Ponytail Doctrine** — zero over-engineering, zero ghost abstractions, standard libraries, predictable JSON envelopes, and 100% test-covered genuine logic.

> 🚫 **No Frontend**: This project is strictly a headless JSON REST API. All endpoints produce and consume JSON payloads with uniform envelopes and semantic HTTP status codes.

---

## 📑 Table of Contents

1. [Architectural Overview](#-architectural-overview)
2. [Domain Model & Relational Schema](#-domain-model--relational-schema)
3. [System Requirements & Prerequisites](#-system-requirements--prerequisites)
4. [Quick Start & Installation](#-quick-start--installation)
5. [Seeded Credentials](#-seeded-credentials)
6. [API Reference & Endpoint Contracts](#-api-reference--endpoint-contracts)
   - [Authentication Endpoints](#1-authentication-endpoints)
   - [Superheroes Endpoints](#2-superheroes-endpoints)
   - [Missions Endpoints](#3-missions-endpoints)
7. [Automated Testing & QA](#-automated-testing--qa)
8. [Postman Collection & Environment Guide](#-postman-collection--environment-guide)
9. [Error Handling & Envelope Standards](#-error-handling--envelope-standards)

---

## 🏛️ Architectural Overview

- **Framework**: Laravel 11.x
- **Runtime**: PHP 8.4 (Laravel Herd compatible)
- **Database Engine**: SQLite 3 (`database/database.sqlite`)
- **Authentication**: Stateless JSON Web Tokens (JWT) using `php-open-source-saver/jwt-auth`
- **Role-Based Authorization**:
  - `ADMIN`: Full CRUD capabilities over Superheroes and Missions (`GET`, `POST`, `PUT`, `DELETE`).
  - `CONSULTA`: Read-only access (`GET`). All mutating HTTP verbs (`POST`, `PUT`, `PATCH`, `DELETE`) return `403 Forbidden`.
- **Relational Integrity**: Foreign key constraints with `ON DELETE CASCADE` from `heroes` to `missions`.
- **Search Engine**: Eloquent Local Scope (`Hero::scopeSearch`) filtering across name, real identity, and main power.

---

## 🗄️ Domain Model & Relational Schema

### Entity Relational Diagram

```
+------------------------------------+          +------------------------------------+
|               USERS                |          |               HEROES               |
+------------------------------------+          +------------------------------------+
| id: integer (PK)                   |          | id: integer (PK)                   |
| nombre: varchar(255)               |          | nombre: varchar(255) [UNIQUE]      |
| email: varchar(255) [UNIQUE]       |          | nombre_real: varchar(255)          |
| password: varchar(255) [HASHED]    |          | poder_principal: varchar(255)      |
| rol: enum ('ADMIN', 'CONSULTA')    |          | nivel_poder: unsignedTinyInt(1-100)|
| created_at / updated_at            |          | imagen_url: varchar(500) [NULLABLE]|
+------------------------------------+          | estado: enum ('ACTIVO', 'INACTIVO')|
                                                | created_at / updated_at            |
                                                +-----------------+------------------+
                                                                  | 1
                                                                  |
                                                                  | hasMany
                                                                  | belongsTo
                                                                  |
                                                                  | N (ON DELETE CASCADE)
                                                +-----------------v------------------+
                                                |              MISSIONS              |
                                                +------------------------------------+
                                                | id: integer (PK)                   |
                                                | titulo: varchar(255)               |
                                                | descripcion: text                  |
                                                | ubicacion: varchar(255)            |
                                                | fecha: date (Y-m-d)                |
                                                | nivel_peligro: enum(BAJO,MEDIO,ALTO|
                                                | estado: PENDIENTE/EN_PROGRESO/COMPL|
                                                | superheroe_id: integer (FK)        |
                                                | created_at / updated_at            |
                                                +------------------------------------+
```

---

## ⚙️ System Requirements & Prerequisites

- **PHP**: `>= 8.4` with extensions `sqlite3`, `pdo_sqlite`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`
- **Composer**: `>= 2.2`
- **Laravel Herd** or Local PHP CLI environment
- **Postman** (Desktop or Web for API collection execution)

---

## 🚀 Quick Start & Installation

### Step 1: Navigate to Backend Directory
```bash
cd /Users/aaroncarvajal/Proyectos/skills/ponytail/backend
```

### Step 2: Install Composer Dependencies
```bash
composer install
```

### Step 3: Environment Setup & App Key Generation
```bash
cp .env.example .env
php artisan key:generate
```

Ensure `.env` contains the SQLite connection:
```env
DB_CONNECTION=sqlite
DB_DATABASE=/Users/aaroncarvajal/Proyectos/skills/ponytail/backend/database/database.sqlite
```
*(The SQLite file is automatically touched if absent).*

### Step 4: Generate JWT Secret
```bash
php artisan jwt:secret --force
```

### Step 5: Run Database Migrations & Seed Initial Marvel Data
```bash
php artisan migrate:fresh --seed
```

### Step 6: Start Local HTTP Development Server
```bash
php artisan serve
```
The API is now running at `http://127.0.0.1:8000`.

---

## 🔑 Seeded Credentials

When running `php artisan migrate:fresh --seed`, the database is populated with the following predefined accounts and data:

### 1. User Accounts
| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **ADMIN** | `admin@shield.gov` | `Admin1234!` | Full CRUD (Read & Write on all resources) |
| **CONSULTA** | `consulta@shield.gov` | `Consulta1234!` | Read-Only (`GET` on heroes/missions; `403` on mutations) |

### 2. Seeded Marvel Data
- **8 Superheroes**: Iron Man, Capitán América, Thor, Black Widow, Hulk, Spider-Man, Doctor Strange, Scarlet Witch.
- **6 Tactical Missions**: Defensa de Nueva York, Infiltración en Hydra, Batalla de Wakanda, Anomalía en el Sanctum, Rescate en Brooklyn, Protocolo Contención Hulk.

---

## 📡 API Reference & Endpoint Contracts

All API endpoints are grouped under `/api`.

### Summary Matrix
| Method | Endpoint | Description | Auth Required | Minimum Role | Status Codes |
|--------|----------|-------------|---------------|--------------|--------------|
| `POST` | `/api/auth/register` | Register new user | No | Public | `201`, `422` |
| `POST` | `/api/auth/login` | Authenticate & get JWT | No | Public | `200`, `401`, `422` |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Yes (JWT) | Any | `200`, `401` |
| `POST` | `/api/auth/logout` | Invalidate JWT token | Yes (JWT) | Any | `200`, `401` |
| `GET` | `/api/heroes` | List all heroes / search | Yes (JWT) | `CONSULTA` / `ADMIN` | `200`, `401` |
| `GET` | `/api/heroes/{id}` | Get hero detail + missions | Yes (JWT) | `CONSULTA` / `ADMIN` | `200`, `401`, `404` |
| `POST` | `/api/heroes` | Create new hero | Yes (JWT) | `ADMIN` (`403` for consulta) | `201`, `401`, `403`, `422` |
| `PUT` | `/api/heroes/{id}` | Update existing hero | Yes (JWT) | `ADMIN` (`403` for consulta) | `200`, `401`, `403`, `404`, `422` |
| `DELETE` | `/api/heroes/{id}` | Delete hero (cascades) | Yes (JWT) | `ADMIN` (`403` for consulta) | `200`, `401`, `403`, `404` |
| `GET` | `/api/misiones` | List all missions + hero | Yes (JWT) | `CONSULTA` / `ADMIN` | `200`, `401` |
| `GET` | `/api/misiones/{id}` | Get mission detail + hero | Yes (JWT) | `CONSULTA` / `ADMIN` | `200`, `401`, `404` |
| `POST` | `/api/misiones` | Create new mission | Yes (JWT) | `ADMIN` (`403` for consulta) | `201`, `401`, `403`, `422` |
| `PUT` | `/api/misiones/{id}` | Update mission details | Yes (JWT) | `ADMIN` (`403` for consulta) | `200`, `401`, `403`, `404`, `422` |
| `DELETE` | `/api/misiones/{id}` | Delete mission | Yes (JWT) | `ADMIN` (`403` for consulta) | `200`, `401`, `403`, `404` |

---

### 1. Authentication Endpoints

#### `POST /api/auth/register`
Creates a new user and returns a signed JWT token.
- **Headers**: `Content-Type: application/json`, `Accept: application/json`
- **Request Body**:
```json
{
  "nombre": "Peter Parker",
  "email": "peter.parker@shield.gov",
  "password": "SecretPassword123!",
  "password_confirmation": "SecretPassword123!",
  "rol": "CONSULTA"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente.",
  "data": {
    "user": {
      "id": 3,
      "nombre": "Peter Parker",
      "email": "peter.parker@shield.gov",
      "rol": "CONSULTA",
      "created_at": "2026-08-15T22:30:00.000000Z"
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

#### `POST /api/auth/login`
Authenticates credentials and returns JWT bearer token.
- **Request Body**:
```json
{
  "email": "admin@shield.gov",
  "password": "Admin1234!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Sesión iniciada exitosamente.",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Nick Fury",
      "email": "admin@shield.gov",
      "rol": "ADMIN"
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

#### `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Nick Fury",
    "email": "admin@shield.gov",
    "rol": "ADMIN",
    "created_at": "2026-08-15T22:30:00.000000Z"
  }
}
```

#### `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Sesión cerrada e invalidación de token completada."
}
```

---

### 2. Superheroes Endpoints

#### `GET /api/heroes` & `GET /api/heroes?search={term}`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Query Parameters**: `search` (optional) filters by name, real name, or power.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Iron Man",
      "nombre_real": "Tony Stark",
      "poder_principal": "Armadura de alta tecnología, vuelo e intelecto de genio",
      "nivel_poder": 88,
      "imagen_url": "https://cdn.marvel.com/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg",
      "estado": "ACTIVO",
      "missions_count": 1,
      "created_at": "2026-08-15T22:30:00.000000Z",
      "updated_at": "2026-08-15T22:30:00.000000Z"
    }
  ]
}
```

#### `GET /api/heroes/{id}`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Iron Man",
    "nombre_real": "Tony Stark",
    "poder_principal": "Armadura de alta tecnología, vuelo e intelecto de genio",
    "nivel_poder": 88,
    "imagen_url": "https://cdn.marvel.com/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg",
    "estado": "ACTIVO",
    "missions": [
      {
        "id": 1,
        "titulo": "Defensa de Nueva York",
        "descripcion": "Contención del ataque alienígena en el centro de Manhattan",
        "ubicacion": "Manhattan, Nueva York",
        "fecha": "2026-05-12",
        "nivel_peligro": "ALTO",
        "estado": "COMPLETADA",
        "superheroe_id": 1
      }
    ]
  }
}
```

#### `POST /api/heroes` (Admin Only)
- **Request Body**:
```json
{
  "nombre": "Doctor Strange",
  "nombre_real": "Stephen Strange",
  "poder_principal": "Maestría en artes místicas y manipulación de energía dimensional",
  "nivel_poder": 95,
  "imagen_url": "https://cdn.marvel.com/strange.jpg",
  "estado": "ACTIVO"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Superhéroe creado exitosamente.",
  "data": {
    "id": 9,
    "nombre": "Doctor Strange",
    "nombre_real": "Stephen Strange",
    "poder_principal": "Maestría en artes místicas y manipulación de energía dimensional",
    "nivel_poder": 95,
    "imagen_url": "https://cdn.marvel.com/strange.jpg",
    "estado": "ACTIVO"
  }
}
```

#### `PUT /api/heroes/{id}` (Admin Only)
- **Request Body**: (all fields optional using `sometimes|required`)
```json
{
  "nivel_poder": 98
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Superhéroe actualizado exitosamente.",
  "data": {
    "id": 9,
    "nombre": "Doctor Strange",
    "nivel_poder": 98
  }
}
```

#### `DELETE /api/heroes/{id}` (Admin Only)
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Superhéroe eliminado exitosamente."
}
```

---

### 3. Missions Endpoints

#### `GET /api/misiones`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Defensa de Nueva York",
      "descripcion": "Contención del ataque alienígena en Manhattan",
      "ubicacion": "Manhattan, Nueva York",
      "fecha": "2026-05-12",
      "nivel_peligro": "ALTO",
      "estado": "COMPLETADA",
      "superheroe_id": 1,
      "hero": {
        "id": 1,
        "nombre": "Iron Man",
        "nombre_real": "Tony Stark"
      }
    }
  ]
}
```

#### `POST /api/misiones` (Admin Only)
- **Request Body**:
```json
{
  "titulo": "Infiltración en Base de Hydra",
  "descripcion": "Extracción de planos clasificados y rescate de rehenes",
  "ubicacion": "Montañas de Sokovia",
  "fecha": "2026-09-20",
  "nivel_peligro": "ALTO",
  "estado": "PENDIENTE",
  "superheroe_id": 2
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Misión creada exitosamente.",
  "data": {
    "id": 7,
    "titulo": "Infiltración en Base de Hydra",
    "descripcion": "Extracción de planos clasificados y rescate de rehenes",
    "ubicacion": "Montañas de Sokovia",
    "fecha": "2026-09-20",
    "nivel_peligro": "ALTO",
    "estado": "PENDIENTE",
    "superheroe_id": 2,
    "hero": {
      "id": 2,
      "nombre": "Capitán América"
    }
  }
}
```

---

## 🧪 Automated Testing & QA

The project includes an exhaustive automated feature test suite validating all positive, negative, authorization, validation, search, and relational integrity flows.

### Execute Test Suite
```bash
php artisan test
```
**Results**:
- **50 Automated Feature Tests**
- **205 Assertions**
- **0 Failures (100% Green)**

### Code Style Compliance (Laravel Pint)
```bash
./vendor/bin/pint --test
```
**Results**: `{"tool":"pint","result":"passed"}`.

---

## 📬 Postman Collection & Environment Guide

The Postman artifacts are located in `backend/postman/`:
1. `Marvel_Superheroes_API.postman_collection.json` (Postman Collection v2.1.0 schema)
2. `Marvel_API.postman_environment.json` (Environment with base URL and credentials)

### How to Import & Use in Postman
1. Open **Postman**.
2. Click **Import** (top left).
3. Drag and drop both `Marvel_Superheroes_API.postman_collection.json` and `Marvel_API.postman_environment.json`.
4. Select the environment: **`Marvel Superheroes API - Local`**.
5. Run request **`01 - Authentication -> Login Admin (Sets jwt_token)`**.
   - The test script automatically stores `access_token` into the environment variable `{{jwt_token}}`.
6. All subsequent requests in `02 - Superheroes` and `03 - Missions` automatically inherit and use `{{jwt_token}}`.
7. To test role restrictions, execute **`Login Consulta (Sets jwt_token)`** and attempt mutation requests (`POST`, `PUT`, `DELETE`) to observe `403 Forbidden` responses.

---

## 🛡️ Error Handling & Envelope Standards

All responses strictly follow a uniform JSON structure across all HTTP status codes:

### Success Envelope (200 / 201)
```json
{
  "success": true,
  "message": "Optional descriptive human-readable message",
  "data": { ... }
}
```

### Validation Error (422 Unprocessable Content)
```json
{
  "success": false,
  "message": "Los datos proporcionados no son válidos.",
  "errors": {
    "email": ["El campo email ya ha sido registrado."]
  }
}
```

### Unauthorized (401 Unauthorized)
```json
{
  "success": false,
  "message": "No autenticado. Token ausente, inválido o expirado."
}
```

### Forbidden Role (403 Forbidden)
```json
{
  "success": false,
  "message": "Acceso denegado. El rol CONSULTA solo tiene permisos de lectura."
}
```

### Resource Not Found (404 Not Found)
```json
{
  "success": false,
  "message": "Superhéroe no encontrado con el ID especificado."
}
```

---

## 📜 License
This project is built under the **Ponytail Doctrine** for educational and demonstration purposes. Marvel, Avengers, and related characters are trademarks of Marvel Entertainment, LLC.
