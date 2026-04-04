import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsFile = fs.readFileSync(path.join(__dirname, 'src/ToolsData.js'), 'utf-8');
const blogFile = fs.readFileSync(path.join(__dirname, 'src/BlogData.js'), 'utf-8');

const DOMAIN = 'https://pdfbazaar.com';

const seoRoutes = [
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

const toolsMatch = toolsFile.matchAll(/id:\s*['"]([^'"]+)['"]/g);
const toolsIds = [...new Set(Array.from(toolsMatch).map(m => m[1]))];

const blogsMatch = blogFile.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
const blogSlugs = [...new Set(Array.from(blogsMatch).map(m => m[1]))];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>${DOMAIN}/blog</loc>
    <priority>0.9</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>${DOMAIN}/pricing</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
`;

// Add base tool routes
toolsIds.forEach(id => {
    sitemap += `  <url>
    <loc>${DOMAIN}/tool/${id}</loc>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>\n`;
});

// Add SEO Optimized routes
seoRoutes.forEach(route => {
    sitemap += `  <url>
    <loc>${DOMAIN}${route}</loc>
    <priority>0.9</priority>
    <changefreq>weekly</changefreq>
  </url>\n`;
});

// Add blog routes
blogSlugs.forEach(slug => {
    sitemap += `  <url>
    <loc>${DOMAIN}/blog/${slug}</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>\n`;
});

sitemap += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public/sitemap.xml'), sitemap);
console.log('sitemap.xml successfully generated!');
