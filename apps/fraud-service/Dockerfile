FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/fraud-service ./apps/fraud-service
RUN corepack enable && pnpm install --no-frozen-lockfile && pnpm --filter @adgeco/fraud-service build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/fraud-service/dist ./apps/fraud-service/dist
USER node
CMD ["node","apps/fraud-service/dist/server.js"]
