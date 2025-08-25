FROM oven/bun

WORKDIR /app
COPY package.json package.json
COPY bun.lock bun.lock
RUN bun install
COPY . .
RUN bun --bun run build
EXPOSE 3000
ENTRYPOINT ["bun", "./build"]
