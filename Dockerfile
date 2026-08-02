FROM node:20-bookworm-slim

WORKDIR /usr/src/app

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY . .

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        chromium \
        chromium-driver \
        curl \
        ffmpeg \
    && npm install --no-audit --no-fund \
    && rm -rf /var/lib/apt/lists/*

CMD ["node", "index.js"]
