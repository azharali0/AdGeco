FROM node:22-alpine
WORKDIR /app
COPY packages/runtime-core packages/runtime-core
COPY apps/reporting-service apps/reporting-service
ENV PORT=3015
ENV SERVICE_NAME=reporting-service
USER node
CMD ["node", "apps/reporting-service/src/server.mjs"]
