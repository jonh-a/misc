FROM oven/bun:1 AS base
WORKDIR /usr/src/app
COPY . .
RUN bun install --frozen-lockfile --production

ENV NODE_ENV=production
USER bun
EXPOSE 3000
ENTRYPOINT [ "bun", "run", "server.ts" ]