# syntax=docker/dockerfile:1
# Imagen de PRODUCCIÓN del backend (la de desarrollo es Dockerfile.dev).

# ---------------------------------------------------------------------------
# Etapa 1: compilación. TypeScript, cliente de Prisma y base de datos de la demo.
# ---------------------------------------------------------------------------
FROM node:24-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@10.32.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=nodepop-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

COPY . .
RUN pnpm exec prisma generate && pnpm exec tsc -p tsconfig.build.json

# Base de datos de la demo: se crea aquí para que la imagen final no necesite
# el CLI de Prisma. initDB exige secretos JWT al cargar la configuración: se usan
# unos de usar y tirar que no salen de este paso.
ENV DATABASE_URL=file:/app/seed/nodepop.sqlite
RUN mkdir -p seed \
    && pnpm exec prisma migrate deploy \
    && JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")" \
       JWT_REFRESH_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")" \
       pnpm exec tsx initDB.ts

# ---------------------------------------------------------------------------
# Etapa 2: solo dependencias de producción.
# ---------------------------------------------------------------------------
FROM node:24-bookworm-slim AS prod-deps

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@10.32.1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# @prisma/client declara el CLI de Prisma (y TypeScript) como peer opcional; con el
# lockfile completo pnpm los instalaría aunque se pida --prod (más de 200 MB que el
# servidor no usa). Sin devDependencies en package.json, pnpm no los resuelve, y el
# resto de paquetes sigue tomando las versiones del lockfile.
RUN node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json'));delete p.devDependencies;fs.writeFileSync('package.json',JSON.stringify(p,null,2))"
RUN --mount=type=cache,id=nodepop-pnpm-store,target=/pnpm/store \
    pnpm install --prod --no-frozen-lockfile --config.auto-install-peers=false --store-dir /pnpm/store

# ---------------------------------------------------------------------------
# Etapa 3: imagen final. Node, dependencias de producción, código compilado y la demo.
# ---------------------------------------------------------------------------
FROM node:24-bookworm-slim AS runtime

# Asocia la imagen al repositorio en GitHub Container Registry: así el token del
# workflow tiene permiso para descargarla en el servidor.
LABEL org.opencontainers.image.source="https://github.com/jairom94/nodepop-clean-arquitecture"
LABEL org.opencontainers.image.description="Backend de Nodepop (demo de solo lectura)"

ENV NODE_ENV=production
WORKDIR /app

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/seed ./seed
COPY --chown=node:node package.json ./
COPY --chown=node:node docker/start.sh ./start.sh

# El servidor no necesita gestor de paquetes: fuera npm y corepack (menos peso y superficie de ataque).
# Volúmenes de datos: base de datos e imágenes subidas.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
        /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    && mkdir -p data uploads/products && chown -R node:node data uploads

USER node

EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3005) + '/health').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"

CMD ["sh", "./start.sh"]
