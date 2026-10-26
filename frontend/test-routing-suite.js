import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const VERCEL_JSON_PATH = path.join(__dirname, 'vercel.json');

const vercelConfig = JSON.parse(fs.readFileSync(VERCEL_JSON_PATH, 'utf-8'));

const CORE_TOOLS = [
  'passport-photo-maker',
  'compress-pdf-without-losing-quality',
  'merge-pdf-online-free',
  'split-pdf-online-free',
  'image-to-pdf-converter',
  'word-to-pdf-converter',
  'excel-to-pdf-converter',
  'ppt-to-pdf-converter',
  'pdf-to-word-converter',
  'pdf-to-jpg-converter',
  'pdf-editor',
  'ocr-pdf-searchable-text',
  'protect-pdf-with-password',
  'unlock-pdf-password-remover',
  'rotate-pdf-pages-online',
  'add-watermark-to-pdf',
  'delete-pdf-pages-online',
  'organize-pdf-pages',
  'crop-pdf-online-free',
  'resize-pdf-page-size',
  'add-page-numbers-to-pdf',
  'grayscale-pdf-online'
];

const BLOG_SAMPLE = [
  'blog/pdf-size-kam-kaise-kare',
  'blog/pdf-size-100kb-ssc-upsc-form',
  'blog/best-free-pdf-tools-2026',
  'blog/merge-pdf-files-online-without-login'
];

const PROGRAMMATIC_SAMPLE = [
  's/compress-pdf-to-100kb',
  's/compress-pdf-to-50kb',
  's/compress-pdf-to-200kb',
  's/ssc-cgl-application-pdf-tool',
  's/upsc-civil-services-form-pdf-tool',
  's/pan-card-application-pdf-tool',
  's/compress-pdf-for-ssc-cgl-form',
  's/jpg-to-pdf-for-upsc-ias-form'
];

const INVALID_PATHS = [
  'invalid-nonexistent-path-999',
  'tools/fake-tool',
  'compress-pdf-fake',
  'wp-login.php',
  's/fake-keyword-never-existed',
  'blog/non-existent-blog-slug-404'
];

const LEGACY_REDIRECTS = [
  { source: '/tool/compress-pdf', expected: '/compress-pdf-without-losing-quality' },
  { source: '/tool/merge-pdf', expected: '/merge-pdf-online-free' },
  { source: '/tool/jpg-to-pdf', expected: '/image-to-pdf-converter' },
  { source: '/tool/passport-photo', expected: '/passport-photo-maker' },
  { source: '/tool/ocr-pdf', expected: '/ocr-pdf-searchable-text' },
  { source: '/tool/edit-pdf', expected: '/pdf-editor' },
  { source: '/tool/split-pdf', expected: '/split-pdf-online-free' },
  { source: '/tool/unlock-pdf', expected: '/unlock-pdf-password-remover' }
];

console.log('========================================================');
console.log('PDFBAZAAR PRODUCTION ROUTING & SEO VALIDATION SUITE');
console.log('========================================================\n');

let passCount = 0;
let failCount = 0;

function checkStaticRoute(routePath, isTool = false) {
  // Check index.html at DIST_DIR / routePath
  const targetFile = path.join(DIST_DIR, routePath, 'index.html');
  const exists = fs.existsSync(targetFile);
  if (!exists) {
    console.error(`FAIL: Missing static HTML for route /${routePath} at ${targetFile}`);
    failCount++;
    return;
  }

  const html = fs.readFileSync(targetFile, 'utf-8');
  const hasTitle = /<title>(.+?)<\/title>/i.test(html);
  const titleMatch = html.match(/<title>(.+?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';

  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const desc = metaDescMatch ? metaDescMatch[1] : '';

  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  const robots = robotsMatch ? robotsMatch[1] : '';

  const hasH1 = /<h1[^>]*>(.+?)<\/h1>/i.test(html);

  const errors = [];
  if (!title) errors.push('Missing <title>');
  if (!canonical) errors.push('Missing canonical tag');
  if (!desc) errors.push('Missing meta description');
  if (!hasH1) errors.push('Missing <h1>');

  // Verify canonical points to canonical URL
  const expectedCanonical = `https://pdfbazaar.com/${routePath}`;
  if (canonical !== expectedCanonical && canonical !== `https://pdfbazaar.com/${routePath}/`) {
    errors.push(`Canonical mismatch: got "${canonical}", expected "${expectedCanonical}"`);
  }

  if (errors.length > 0) {
    console.error(`FAIL [/${routePath}]: ${errors.join(', ')}`);
    failCount++;
  } else {
    console.log(`PASS [/${routePath}]: Title="${title.slice(0, 35)}...", Canonical="${canonical}"`);
    passCount++;
  }
}

console.log('--- 1. Testing Core Tool Routes ---');
CORE_TOOLS.forEach(tool => checkStaticRoute(tool, true));

console.log('\n--- 2. Testing Representative Blog Routes ---');
BLOG_SAMPLE.forEach(b => checkStaticRoute(b));

console.log('\n--- 3. Testing Representative Programmatic Pages ---');
PROGRAMMATIC_SAMPLE.forEach(p => checkStaticRoute(p));

console.log('\n--- 4. Testing 404 Configuration for Non-existent Routes ---');
const dist404 = path.join(DIST_DIR, '404.html');
if (fs.existsSync(dist404)) {
  const html404 = fs.readFileSync(dist404, 'utf-8');
  const hasNoindex = /name=["']robots["']\s+content=["']noindex,\s*nofollow["']/i.test(html404);
  if (hasNoindex) {
    console.log('PASS [404.html]: Exists in dist with meta robots "noindex, nofollow"');
    passCount++;
  } else {
    console.error('FAIL [404.html]: Missing noindex, nofollow robots tag');
    failCount++;
  }
} else {
  console.error('FAIL [404.html]: 404.html not found in dist');
  failCount++;
}

INVALID_PATHS.forEach(p => {
  const exists = fs.existsSync(path.join(DIST_DIR, p, 'index.html')) || fs.existsSync(path.join(DIST_DIR, `${p}.html`));
  if (!exists) {
    console.log(`PASS [/${p}]: Correctly non-existent in static file tree (will trigger Vercel 404.html fallback)`);
    passCount++;
  } else {
    console.error(`FAIL [/${p}]: Unexpectedly exists as static file!`);
    failCount++;
  }
});

console.log('\n--- 5. Testing Legacy Redirects in vercel.json ---');
LEGACY_REDIRECTS.forEach(lr => {
  const match = (vercelConfig.redirects || []).find(r => r.source === lr.source);
  if (match && match.destination === lr.expected && match.permanent === true) {
    console.log(`PASS [${lr.source} -> ${lr.expected}]: Permanent (301) redirect configured correctly`);
    passCount++;
  } else {
    console.error(`FAIL [${lr.source}]: Redirect configuration missing or mismatch!`);
    failCount++;
  }
});

console.log('\n--- 6. Phase 3: Testing Internal Links, Quick Presets & Disclaimers ---');
// 6.1 Check BlogData.js for zero /tool/* legacy links
const blogDataPath = path.join(__dirname, 'src', 'BlogData.js');
const blogDataContent = fs.readFileSync(blogDataPath, 'utf-8');
const legacyToolMatches = blogDataContent.match(/\/tool\/[a-z0-9-]+/g) || [];
if (legacyToolMatches.length === 0) {
  console.log('PASS [Blog Internal Links]: 0 legacy /tool/* links found in BlogData.js (all updated to canonical)');
  passCount++;
} else {
  console.error(`FAIL [Blog Internal Links]: Found ${legacyToolMatches.length} legacy /tool/* links in BlogData.js: ${legacyToolMatches.join(', ')}`);
  failCount++;
}

// 6.2 Check ToolPage.jsx for quick presets and defaultTargetKb
const toolPagePath = path.join(__dirname, 'src', 'pages', 'ToolPage.jsx');
const toolPageContent = fs.readFileSync(toolPagePath, 'utf-8');
const hasPresets = toolPageContent.includes("100 KB") && toolPageContent.includes("200 KB") && toolPageContent.includes("300 KB") && toolPageContent.includes("500 KB");
const hasDefaultTargetKb = toolPageContent.includes("defaultTargetKb");
if (hasPresets && hasDefaultTargetKb) {
  console.log('PASS [ToolPage Quick Presets]: Quick presets (100KB, 200KB, 300KB, 500KB) and defaultTargetKb support verified');
  passCount++;
} else {
  console.error('FAIL [ToolPage Quick Presets]: Missing quick presets or defaultTargetKb in ToolPage.jsx');
  failCount++;
}

// 6.3 Check ProgrammaticToolPage.jsx for slug size auto-population
const progToolPath = path.join(__dirname, 'src', 'pages', 'ProgrammaticToolPage.jsx');
const progToolContent = fs.readFileSync(progToolPath, 'utf-8');
const hasSizeAutoPop = progToolContent.includes("sizeKbMatch") && progToolContent.includes("defaultTargetKb={defaultTargetKb}");
if (hasSizeAutoPop) {
  console.log('PASS [Programmatic Auto-Population]: ProgrammaticToolPage passes defaultTargetKb from slug to ToolPage');
  passCount++;
} else {
  console.error('FAIL [Programmatic Auto-Population]: ProgrammaticToolPage missing size auto-population logic');
  failCount++;
}

// 6.4 Check DeepSEOData.js for verified Sarkari/Aadhaar guidelines & statutory notice
const deepSeoPath = path.join(__dirname, 'src', 'DeepSEOData.js');
const deepSeoContent = fs.readFileSync(deepSeoPath, 'utf-8');
const hasSarkariGuidelines = deepSeoContent.includes("SSC (CGL, CHSL, MTS, GD)") && deepSeoContent.includes("UIDAI myAadhaar Portal") && deepSeoContent.includes("Statutory Disclaimer");
if (hasSarkariGuidelines) {
  console.log('PASS [DeepSEO Accuracy]: Verified Sarkari/Aadhaar guidelines and statutory disclaimer verified in DeepSEOData.js');
  passCount++;
} else {
  console.error('FAIL [DeepSEO Accuracy]: Missing Sarkari guidelines or statutory disclaimer in DeepSEOData.js');
  failCount++;
}

// 6.5 Check ProgrammaticSEO.js for statutory notice
const progSeoPath = path.join(__dirname, 'src', 'ProgrammaticSEO.js');
const progSeoContent = fs.readFileSync(progSeoPath, 'utf-8');
const hasProgDisclaimer = progSeoContent.includes("Statutory Notice");
if (hasProgDisclaimer) {
  console.log('PASS [Programmatic Disclaimer]: Statutory disclaimer verified in ProgrammaticSEO.js');
  passCount++;
} else {
  console.error('FAIL [Programmatic Disclaimer]: Missing statutory disclaimer in ProgrammaticSEO.js');
  failCount++;
}

console.log('\n========================================================');
console.log(`RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
}

