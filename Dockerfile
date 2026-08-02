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
        g++ \
        make \
        python3 \
    && npm install --no-audit --no-fund \
    && npm rebuild sqlite3 --build-from-source \
    && rm -rf /var/lib/apt/lists/*

CMD ["node", "index.js"]
