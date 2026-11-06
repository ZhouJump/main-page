FROM node:24-alpine AS builder

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:24-alpine AS runner

RUN apk add --no-cache openssl && corepack enable
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    UPLOAD_DIR=/app/data/uploads

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/doc ./doc

RUN mkdir -p /app/data/uploads
VOLUME ["/app/data/uploads"]

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
