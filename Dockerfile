# Stage 1: Build the React frontend
FROM node:18-slim AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Build the frontend (this includes sitemap and prerendering tasks)
RUN npm run build

# Stage 2: Serve with Node.js backend + All PDF tools
FROM node:18-slim

# Install system dependencies for PDF processing and Puppeteer
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
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install pypdf for backend security features
RUN pip3 install pypdf --break-system-packages || pip3 install pypdf

WORKDIR /usr/src/app

# Copy backend dependencies and install
COPY node-backend/package*.json ./
RUN npm install --omit=dev

# Copy backend source code
COPY node-backend/ ./

# Copy built frontend from Stage 1 to the backend's dist directory
COPY --from=builder /app/dist ./dist

# Create necessary directories for runtime
RUN mkdir -p uploads fonts && chmod 777 uploads fonts

# Use 100% of Hugging Face Space port (7860 is default)
ENV PORT=7860
EXPOSE 7860

# Serve the application
# Increased memory allowance for PDF processing heavy tasks
CMD ["node", "--max-old-space-size=400", "server.js"]
