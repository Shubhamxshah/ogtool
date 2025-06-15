FROM node:20-slim

# Puppeteer (Chromium) dependencies
RUN apt-get update && apt-get install -y \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libxkbcommon0 \
    xdg-utils \
    fonts-liberation \
    libu2f-udev \
    libvulkan1 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy app code
COPY . .

# Install Node dependencies
RUN npm install

# Download Chromium (if using puppeteer-core, this ensures Chrome is present)
RUN npx puppeteer browsers install chrome

# Expose port (adjust if your app uses a different one)
EXPOSE 3001

CMD ["node", "dist/index.js"]

