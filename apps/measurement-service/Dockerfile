FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages
COPY apps/measurement-service ./apps/measurement-service
RUN corepack enable && pnpm install --no-frozen-lockfile && pnpm --filter @adgeco/measurement-service build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/measurement-service/dist ./apps/measurement-service/dist
USER node
CMD ["node","apps/measurement-service/dist/server.js"]
