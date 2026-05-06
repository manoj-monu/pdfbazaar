# Stage 1: Build the React frontend
FROM node:20-slim AS builder
WORKDIR /app

# Ensure we have clean permissions
RUN mkdir -p node_modules && chmod 777 node_modules

# Copy dependency files first
COPY frontend/package*.json ./

# Install dependencies
RUN npm install --include=dev

# Copy the rest of the frontend source
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Serve with Node.js backend + All PDF tools
FROM node:20-slim

# Set Puppeteer environment variables to skip download and use system chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Install system dependencies for PDF processing and Chromium
RUN apt-get update && apt-get install -y \
    ghostscript \
    libreoffice \
    libreoffice-writer \
    mupdf-tools \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-hin \
    fonts-liberation \
    fonts-noto \
    fonts-noto-cjk \
    wget \
    ca-certificates \
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
    python3 \
    python3-pip \
    gnupg \
    --no-install-recommends

# Install Google Chrome stable for Puppeteer
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install pypdf for backend security features
RUN pip3 install pypdf --break-system-packages || pip3 install pypdf

WORKDIR /usr/src/app

# Copy backend dependencies and install
COPY node-backend/package*.json ./
# Skip postinstall during npm install to avoid issues, we already installed pypdf
RUN npm install --omit=dev --ignore-scripts

# Copy backend source code
COPY node-backend/ ./

# Copy built frontend from Stage 1 to the backend's dist directory
COPY --from=builder /app/dist ./dist

# Create necessary directories for runtime
RUN mkdir -p uploads fonts && chmod -R 777 uploads fonts

# Use 100% of Hugging Face Space port (7860 is default)
ENV PORT=7860
EXPOSE 7860

# Serve the application
CMD ["node", "--max-old-space-size=400", "server.js"]
