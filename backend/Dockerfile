FROM node:20-slim

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libasound2 \
    libatspi2.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    xdg-utils \
    fonts-liberation \
    libu2f-udev \
    libvulkan1 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN npm install

# 👇 Install Chromium explicitly
RUN npx puppeteer browsers install chrome

CMD ["node", "dist/index.js"]

