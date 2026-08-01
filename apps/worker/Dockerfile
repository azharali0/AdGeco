FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/worker apps/worker
COPY packages packages
RUN pnpm install --no-frozen-lockfile
RUN pnpm db:generate && pnpm --filter @adgeco/worker... build
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/worker/dist ./apps/worker/dist
COPY --from=build /workspace/packages ./packages
USER node
CMD ["node","apps/worker/dist/main.js"]
