FROM ghcr.io/puppeteer/puppeteer:24.3.0

USER root

WORKDIR /app

COPY package*.json ./

# HUSKY=0 — no .git dir in Docker, skip husky install
RUN HUSKY=0 npm ci

COPY . .

# Disable Next.js anonymous telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["npm", "start"]
