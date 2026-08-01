FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --filter @adgeco/web... --no-frozen-lockfile
COPY apps/web apps/web
RUN pnpm --filter @adgeco/web build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=build /workspace/package.json /workspace/pnpm-workspace.yaml ./
COPY --from=build /workspace/apps/web ./apps/web
COPY --from=build /workspace/node_modules ./node_modules
EXPOSE 3000
USER node
CMD ["pnpm","--filter","@adgeco/web","start"]
