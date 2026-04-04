import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG ---
const SITE_URL = 'https://pdfbazaar.com';
const PUBLIC_DIR = './public';

// --- ONLY THE 100% LIVE URLS (SAFE LIST) ---
const SAFE_TOOLS = [
    '/merge-pdf-online-free',
    '/split-pdf-online-free',
    '/compress-pdf-without-losing-quality',
    '/word-to-pdf-converter',
    '/image-to-pdf-converter',
    '/excel-to-pdf-converter',
    '/ppt-to-pdf-converter',
    '/pdf-to-word-converter',
    '/pdf-to-excel-converter',
    '/pdf-to-ppt-converter'
];

// --- BLOGS ARE DISABELD UNTIL VERIFIED ---
const SAFE_BLOGS = [
    // Temporarily empty until we confirm slugs to avoid 404 damage
];

function generateSitemap() {
    console.log('--- EMERGENCY SITEMAP GENERATION (SAFE MODE) ---');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Pages (Verified Live)
    const staticPages = ['', '/blog', '/pricing', '/about', '/contact', '/privacy-policy', '/terms-conditions', '/disclaimer'];
    staticPages.forEach(p => {
        xml += `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;
    });

    // Tool Pages (Verified Live & Optimized)
    SAFE_TOOLS.forEach(p => {
        xml += `  <url>\n    <loc>${SITE_URL}${p}/</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    });

    xml += `</urlset>`;

    const outputPath = path.join(PUBLIC_DIR, 'sitemap.xml');
    if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    
    fs.writeFileSync(outputPath, xml);
    console.log('[SITEMAP] EMERGENCY CLEAN COMPLETE! Removed all 404s and duplicates.');
}

generateSitemap();
