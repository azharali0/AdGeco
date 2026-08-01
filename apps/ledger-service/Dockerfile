FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/ledger-service ./apps/ledger-service
RUN corepack enable && pnpm install --no-frozen-lockfile && pnpm --filter @adgeco/ledger-service build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/ledger-service/dist ./apps/ledger-service/dist
USER node
CMD ["node","apps/ledger-service/dist/server.js"]
