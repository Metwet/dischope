# stage 1: builder
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma

RUN pnpm config set dangerouslyAllowAllBuilds true
RUN pnpm install --frozen-lockfile

COPY . .

ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/dischope?schema=public"

RUN pnpm prisma generate
RUN pnpm build

# stage 2: runner
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN pnpm config set dangerouslyAllowAllBuilds true
RUN pnpm install --frozen-lockfile

RUN DATABASE_URL="postgresql://postgres:password@localhost:5432/dischope?schema=public" pnpm prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && pnpm start:prod"]