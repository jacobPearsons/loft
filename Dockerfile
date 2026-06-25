# TODO: This Dockerfile uses `npm ci` but the project has a `bun.lockb` file and uses bun as the package manager. These commands need to be updated to use bun properly (e.g., `bun install --frozen-lockfile` instead of `npm ci`, `bun run build` instead of `npm run build`).
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json bun.lockb ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV GEODATADIR=/app/node_modules/geoip-lite/data

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/geoip-lite ./node_modules/geoip-lite

RUN npx prisma generate

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
