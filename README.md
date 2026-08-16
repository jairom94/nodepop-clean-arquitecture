# Nodepop Fullstack

API REST de Nodepop (backend) construida con **Express 5**, **TypeScript**, **Prisma 7** y **SQLite**. Incluye autenticación JWT (access + refresh), CRUD de usuarios, productos y tags, documentación Swagger automática y un script `initDB` para inicializar la base de datos con datos por defecto.

---

## Tabla de contenidos

1. [Tecnologías](#tecnologías)
2. [Arquitectura](#arquitectura)
3. [Autenticación](#autenticación)
4. [Documentación de la API](#documentación-de-la-api)
5. [Variables de entorno](#variables-de-entorno)
6. [Inicialización](#inicialización)
7. [Script initDB](#script-initdb)
8. [Scripts disponibles](#scripts-disponibles)

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Express 5](https://expressjs.com/) | Framework HTTP del servidor |
| [TypeScript 7](https://www.typescriptlang.org/) | Tipado estático del proyecto |
| [Prisma 7](https://www.prisma.io/) | ORM + migraciones de base de datos |
| SQLite + `@prisma/adapter-better-sqlite3` | Motor de base de datos |
| [Zod 4](https://zod.dev/) | Validación de datos de entrada |
| `jsonwebtoken` + `bcrypt` | Autenticación JWT y hash de contraseñas |
| `swagger-jsdoc` + `swagger-ui-express` | Generación y visualización de la documentación OpenAPI |
| `morgan` | Logs de peticiones HTTP |
| `tsx` | Ejecución y watch de TypeScript |
| `pnpm` | Gestor de paquetes |

---

## Arquitectura

Proyecto organizado por **features** con separación en capas de dominio, aplicación e infraestructura. Cada dominio (`auth`, `users`, `products`, `tags`) contiene:

- `domain/` — entidades del dominio y contratos (interfaces de repositorio).
- `infraestructura/` — implementaciones concretas (repositorios de Prisma y mappers).
- Un directorio por **caso de uso** (`create`, `update`, `delete`, `get`, `list`, `login`, `logout`, `refresh`...) con 5 piezas:

```
src/features/<dominio>/<caso-de-uso>/
  <caso-de-uso>Command.ts     // datos de entrada del caso de uso
  <caso-de-uso>Schema.ts      // validación Zod del body (cuando aplica)
  <caso-de-uso>Handler.ts     // lógica de negocio del caso de uso
  <caso-de-uso>Controller.ts  // adaptador HTTP: parsea req y responde
  <caso-de-uso>Route.ts       // ruta Express + factory createXxxRouter()
```

Cada `Route.ts` expone un factory `createXxxRouter()` que construye e inyecta las dependencias (repositorio, handler, controller), y las rutas se montan en el router central.

### Flujo de una petición

```
Cliente → Route (factory) → Middleware (validateBody / authGuard)
        → Controller → Handler (caso de uso) → Repositorio (interfaz)
        → Implementación Prisma → SQLite
```

### Estructura de directorios

```
nodepop-fullstack/
└── backend/
    ├── src/
    │   ├── index.ts                      # Arranque del servidor (puerto 3005)
    │   ├── app.ts                        # Express, middleware globales, /api-doc, errores
    │   ├── config/environments.ts        # Carga de variables de entorno (.env)
    │   ├── database/                     # Cliente de base de datos (Prisma + SQLite)
    │   ├── shared/errors/                # AppError, ValidationError, códigos de error
    │   ├── infraestructura/
    │   │   ├── http/
    │   │   │   ├── router.ts             # Router central (rutas públicas + authGuard + protegidas)
    │   │   │   ├── middleware/           # AuthGuard, validateBody
    │   │   │   └── swagger.ts            # Configuración Swagger (spec + UI)
    │   │   └── security/                 # JwtTokenService, BcryptPasswordHasher
    │   ├── features/
    │   │   ├── auth/                     # login, logout, refresh
    │   │   ├── users/                    # create, update
    │   │   ├── products/                 # create, get, list, update, delete
    │   │   └── tags/                     # create, list, update, delete
    │   └── types/express/                # Tipado de req.user
    ├── prisma/
    │   ├── schema.prisma                 # Modelos: User, Product, Tag, RevokedToken
    │   └── migrations/                   # Migraciones de la base de datos
    ├── prisma.config.ts                  # Configuración del CLI de Prisma
    ├── initDB.ts                         # Script de inicialización de datos
    └── package.json
```

### Router central (`src/infraestructura/http/router.ts`)

```
Rutas públicas:  POST /auth/login · POST /auth/refresh · POST /users
            ↓
      authGuard(JwtTokenService, PrismaTokenRepository)
            ↓
Rutas protegidas: POST /auth/logout · PATCH /users/:id
                  /products (create, get, list, update, delete)
                  /tags (create, list, update, delete)
```

### Manejo de errores

Todas las rutas pasan los errores al middleware final de `app.ts`, que responde en formato uniforme:

```json
{ "code": "VALIDATION_ERROR", "message": "...", "cause": [...], "stack": "..." }
```

El campo `stack` solo se incluye en modo `development` (ver `MODE`). Códigos de error: `VALIDATION_ERROR`, `USER_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `TAG_NOT_FOUND`, `TAG_ALREADY_EXISTS`, `EMAIL_ALREADY_EXISTS`, `UNAUTHORIZED`, `FORBIDDEN`, `INTERNAL_ERROR`.

---

## Autenticación

- **Login** — `POST /auth/login` devuelve `access token`, `refresh token` y los datos del usuario.
- **Acceso** — las rutas protegidas requieren el header `Authorization: Bearer <access token>`.
- **Refresh** — `POST /auth/refresh` con el refresh token en el body genera un nuevo access token.
- **Logout** — `POST /auth/logout` revoca el token y lo marca en la tabla `RevokedToken`.
- **authGuard** — valida la firma y expiración del token y comprueba que no esté revocado; inyecta el payload en `req.user`.

Duración por defecto (configurable en `.env`): access token `1h`, refresh token `7d`.

---

## Documentación de la API

La API está documentada con **Swagger / OpenAPI 3.0**. Cada `Route.ts` de los casos de uso contiene un bloque JSDoc `@swagger` (con `summary`, `parameters`, `requestBody`, `responses`, `security`) que `swagger-jsdoc` recopila para generar el spec.

- **UI Swagger:** [http://localhost:3005/api-doc](http://localhost:3005/api-doc)

### Endpoints

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Inicia sesión y devuelve tokens | — |
| POST | `/api/v1/auth/refresh` | Renueva el access token | — |
| POST | `/api/v1/auth/logout` | Revoca el token | ✔ |
| POST | `/api/v1/users` | Crea un usuario | — |
| PATCH | `/api/v1/users/:id` | Actualiza el perfil del usuario | ✔ |
| POST | `/api/v1/products` | Crea un producto | ✔ |
| GET | `/api/v1/products` | Lista todos los productos | ✔ |
| GET | `/api/v1/products/mine` | Lista los productos del usuario (paginado) | ✔ |
| GET | `/api/v1/products/:id` | Obtiene un producto | ✔ |
| PATCH | `/api/v1/products/:id` | Actualiza un producto | ✔ |
| DELETE | `/api/v1/products/:id` | Elimina un producto | ✔ |
| POST | `/api/v1/tags` | Crea un tag | ✔ |
| GET | `/api/v1/tags` | Lista todos los tags | ✔ |
| PATCH | `/api/v1/tags/:id` | Actualiza un tag | ✔ |
| DELETE | `/api/v1/tags/:id` | Elimina un tag | ✔ |

Paginado en `/api/v1/products/mine`: `?page=1&pageSize=10` (pageSize máximo 100). Respuesta: `{ items, page, pageSize, total, totalPages }`.

---

## Variables de entorno

Copiar/crear el archivo `.env` en la raíz de `backend/`:

```env
DATABASE_URL="file:./nodepop.sqlite"
JWT_SECRET="dev-secret-change-me"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
MODE="development"
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `DATABASE_URL` | Ruta del archivo SQLite | `file:./nodepop.sqlite` |
| `JWT_SECRET` | Secreto para firmar los JWT | — |
| `JWT_EXPIRES_IN` | Duración del access token | `1h` |
| `JWT_REFRESH_EXPIRES_IN` | Duración del refresh token | `7d` |
| `MODE` | Entorno: `development` o `production` | `development` |

En modo `production` la API no devuelve el `stack` en los errores.

---

## Inicialización

```bash
cd backend

# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno (.env)
#    (ver tabla de variables arriba)

# 3. Aplicar las migraciones (crea la base SQLite)
pnpm prisma migrate deploy

# 4. Generar el cliente de Prisma
pnpm prisma generate

# 5. Cargar los datos por defecto
pnpm run initDB

# 6. Arrancar el servidor en modo desarrollo
pnpm run dev
# Servidor escuchando en http://localhost:3005
```

---

## Script initDB

Inicializa la base de datos con datos por defecto. **Siempre vacía todas las tablas** (`Product`, `RevokedToken`, `Tag`, `User`), resetea el autoincremento y recarga:

- **Tags:** `motor`, `work`, `lifestyle`, `mobile`
- **Usuario de prueba:** `test@nodepop.com` / `123456`
- **Productos del usuario:**
  - *Portátil MacBook Pro* — 1299 € (tags: `work`, `mobile`)
  - *Scooter eléctrico* — 2500 € (tags: `motor`, `lifestyle`)

```bash
cd backend
pnpm run initDB
```

Ejemplo de salida:

```
Base de datos vaciada
Tag creado: motor
Tag creado: work
Tag creado: lifestyle
Tag creado: mobile
Usuario creado: test@nodepop.com (id 1)
Producto creado: Portátil MacBook Pro (1299)
Producto creado: Scooter eléctrico (2500)
initDB completado
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm run dev` | Arranca el servidor en modo watch (`tsx watch src/index.ts`) |
| `pnpm run initDB` | Vacía la base de datos y carga los datos por defecto |
| `pnpm test` | (pendiente de implementar) |
