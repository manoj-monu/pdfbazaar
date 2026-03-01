FROM node:18-slim

# Install Ghostscript, LibreOffice, and Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    ghostscript \
    libreoffice \
    libreoffice-calc \
    libreoffice-writer \
    libreoffice-impress \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    fonts-noto \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set HOME so LibreOffice can write its user profile
ENV HOME=/tmp

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies, skip Chromium download (puppeteer will use bundled)
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
