import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://pdfbazaar.com';
const PUBLIC_DIR = './public';

// --- THE FINAL SAFE LIST (NO 404s ALLOWED) ---
const SAFE_URLS = [
    '/merge-pdf-online-free', '/split-pdf-online-free', '/compress-pdf-without-losing-quality',
    '/word-to-pdf-converter', '/image-to-pdf-converter', '/excel-to-pdf-converter', '/ppt-to-pdf-converter',
    '/pdf-to-word-converter', '/pdf-to-jpg-converter', '/add-watermark-to-pdf', '/ocr-pdf-searchable-text', 
    '/delete-pdf-pages-online', '/organize-pdf-pages', '/crop-pdf-online-free', '/resize-pdf-page-size',
    '/add-page-numbers-to-pdf', '/grayscale-pdf-online', '/protect-pdf-with-password'
];

function generateSitemap() {
    console.log('--- GENERATING FINAL CLEAN SITEMAP ---');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Always include Homepage
    xml += `  <url>\n    <loc>${SITE_URL}/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;

    // Tool Pages (Validated by user as live)
    SAFE_URLS.forEach(p => {
        xml += `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    });

    xml += `</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
    console.log('[SITEMAP] Final clean version pushed.');
}

generateSitemap();
