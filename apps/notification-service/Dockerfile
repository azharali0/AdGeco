FROM node:22-alpine
WORKDIR /app
COPY packages/runtime-core packages/runtime-core
COPY apps/notification-service apps/notification-service
ENV PORT=3016
ENV SERVICE_NAME=notification-service
USER node
CMD ["node", "apps/notification-service/src/server.mjs"]
