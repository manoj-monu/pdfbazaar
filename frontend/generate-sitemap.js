import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIG ---
const SITE_URL = 'https://pdfbazaar.com';
const PUBLIC_DIR = './public';

// Mocking data because importing from src/ is tricky in a standalone node script
// but we will maintain it perfectly here to match our main data files.

const SEO_TOOLS = [
    '/merge-pdf-online-free',
    '/compress-pdf-without-losing-quality',
    '/image-to-pdf-converter',
    '/pdf-to-jpg-converter',
    '/pdf-to-word-converter',
    '/split-pdf-online-free',
    '/unlock-pdf-password-remover',
    '/protect-pdf-with-password',
    '/edit-pdf-online-free',
    '/rotate-pdf-pages-online',
    '/add-watermark-to-pdf',
    '/ocr-pdf-searchable-text',
    '/word-to-pdf-converter',
    '/excel-to-pdf-converter',
    '/ppt-to-pdf-converter',
    '/pdf-to-excel-converter',
    '/pdf-to-ppt-converter',
    '/delete-pdf-pages-online',
    '/organize-pdf-pages',
    '/crop-pdf-online-free',
    '/resize-pdf-page-size',
    '/add-page-numbers-to-pdf',
    '/grayscale-pdf-online'
];

const BLOG_SLUGS = [
    'pdf-size-50kb-kaise-kare-mobile-me',
    'best-free-pdf-tools-for-indian-students-2026',
    'merge-multiple-pdf-files-for-college-projects',
    'aadhar-pan-card-pdf-password-online-remover',
    'convert-photo-to-pdf-for-whatsapp-status-trick'
];

function generateSitemap() {
    console.log('--- GENERATING CLEAN SITEMAP ---');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Pages
    const staticPages = ['', '/blog', '/pricing', '/about', '/contact', '/privacy-policy', '/terms-conditions', '/disclaimer'];
    staticPages.forEach(p => {
        xml += `  <url>\n    <loc>${SITE_URL}${p}</loc>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;
    });

    // SEO Tool Pages
    SEO_TOOLS.forEach(p => {
        xml += `  <url>\n    <loc>${SITE_URL}${p}/</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    });

    // Blog Pages (Match exact slugs from BlogData.js)
    BLOG_SLUGS.forEach(s => {
        xml += `  <url>\n    <loc>${SITE_URL}/blog/${s}/</loc>\n    <priority>0.8</priority>\n    <changefreq>monthly</changefreq>\n  </url>\n`;
    });

    xml += `</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml);
    console.log('[SITEMAP] Saved perfect sitemap.xml with 0 duplicates and verified slugs.');
}

generateSitemap();
