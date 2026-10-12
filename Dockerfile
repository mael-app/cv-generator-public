FROM ghcr.io/puppeteer/puppeteer:25.13.0

USER root

# Give pptruser ownership of /app before switching — avoids chown -R after build
RUN mkdir -p /app && chown pptruser:pptruser /app

USER pptruser

WORKDIR /app

COPY --chown=pptruser:pptruser package*.json ./

# --ignore-scripts: no .git dir in Docker (skips husky) and the browser comes
# from the base image / @sparticuz/chromium, so postinstall downloads are unneeded.
RUN npm ci --ignore-scripts

COPY --chown=pptruser:pptruser . .

# Disable Next.js anonymous telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["npm", "start"]
