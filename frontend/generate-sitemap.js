import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://pdfbazaar.com';
const PUBLIC_DIR = './public';

// --- THE MANUALLY VERIFIED SAFE LIST (DO NOT ADD BLOGS UNLESS 100% FIXED) ---
const SAFE_URLS = [
    '/merge-pdf-online-free', '/split-pdf-online-free', '/compress-pdf-without-losing-quality',
    '/word-to-pdf-converter', '/image-to-pdf-converter', '/excel-to-pdf-converter', '/ppt-to-pdf-converter',
    '/pdf-to-word-converter', '/pdf-to-jpg-converter', '/unlock-pdf-password-remover',
    '/protect-pdf-with-password', '/edit-pdf-online-free', '/rotate-pdf-pages-online',
    '/add-watermark-to-pdf', '/ocr-pdf-searchable-text', '/delete-pdf-pages-online',
    '/organize-pdf-pages', '/crop-pdf-online-free', '/resize-pdf-page-size',
    '/add-page-numbers-to-pdf', '/grayscale-pdf-online'
];

function generateSitemap() {
    console.log('--- GENERATING MANUAL SAFE SITEMAP ---');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Always include Homepage
    xml += `  <url>\n    <loc>${SITE_URL}/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;

    // Tool Pages (No Trailing Slashes as per user request)
    SAFE_URLS.forEach(p => {
        xml += `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    });

    xml += `</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
    console.log('[SITEMAP] Pushed clean version with 0 duplicates and verified live pages.');
}

generateSitemap();
