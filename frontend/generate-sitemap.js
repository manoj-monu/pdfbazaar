import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://pdfbazaar.com';
const PUBLIC_DIR = './public';

// --- THE FINAL SAFE LIST (NO 404s ALLOWED) ---
const SAFE_URLS = [
    '/merge-pdf-online-free/', '/split-pdf-online-free/', '/compress-pdf-without-losing-quality/',
    '/word-to-pdf-converter/', '/image-to-pdf-converter/', '/excel-to-pdf-converter/', '/ppt-to-pdf-converter/',
    '/pdf-to-word-converter/', '/pdf-to-jpg-converter/', '/add-watermark-to-pdf/', '/ocr-pdf-searchable-text/', 
    '/delete-pdf-pages-online/', '/organize-pdf-pages/', '/crop-pdf-online-free/', '/resize-pdf-page-size/',
    '/add-page-numbers-to-pdf/', '/grayscale-pdf-online/', '/protect-pdf-with-password/', '/unlock-pdf-password-remover/',
    '/rotate-pdf-pages-online/',
    // --- BLOGS ---
    '/blog/pdf-size-50kb-kaise-kare-mobile-me/',
    '/blog/best-free-pdf-tools-for-indian-students-2026/',
    '/blog/merge-multiple-pdf-files-for-college-projects/',
    '/blog/aadhar-pan-card-pdf-password-online-remover/',
    '/blog/convert-photo-to-pdf-for-whatsapp-status-trick/',
    '/blog/pdf-to-jpg-high-quality-images-mobile-guide/',
    '/blog/how-to-split-large-pdf-for-email-attachment/',
    '/blog/ocr-pdf-convert-scanned-to-text-free/',
    '/blog/pdf-size-100kb-ssc-upsc-form/',
    '/blog/photo-ka-pdf-kaise-banaye-mobile-tutorial/',
    '/blog/best-free-pdf-tools-for-indian-students/',
    '/blog/best-free-pdf-tools-2026/',
    '/blog/compress-pdf-under-100kb-online-free/',
    '/blog/merge-pdf-files-online-without-login/',
    '/blog/pdf-password-remover-permanent/',
    '/blog/pdfbazaar-vs-adobe-comparison/',
    '/blog/pdf-size-kam-kaise-kare/',
    '/blog/multiple-pdf-ko-ek-sath-kaise-jode/',
    '/blog/photo-ka-pdf-kaise-banaye/',
    '/blog/aadhaar-pan-pdf-password-remove/',
    '/blog/pdf-ko-word-me-kaise-badle/',
    '/blog/pdf-se-page-kaise-alag-kare/',
    '/blog/pdf-me-password-kaise-lagaye/',
    '/blog/pdf-se-page-kaise-delete-kare/',
    '/blog/word-to-pdf-converter-guide/',
    '/blog/pdf-par-signature-kaise-kare/'
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
