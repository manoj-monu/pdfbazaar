import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { TOOLS_CATEGORIES } from './src/ToolsData.js';
import { BLOG_POSTS } from './src/BlogData.js';
import { PROGRAMMATIC_PAGES } from './src/ProgrammaticSEO.js';

const PUBLIC_DIR = path.join(__dirname, 'public');

// --- HANDCRAFTED TOP TOOLS ---
const HANDCRAFTED_TOOLS = [
    {
        path: 'compress-pdf-without-losing-quality',
        title: 'Compress PDF Online Free (No Login) – Reduce File Size | PDFBazaar',
        desc: 'Reduce PDF size instantly without losing text or image clarity. 100% free, private browser compression with no registration required.',
        h1: 'Compress PDF Online (Fast, Safe & Free)',
        faq: [
            { q: 'How to reduce PDF file size?', a: 'Upload your PDF document, select your preferred compression level or target file size, and click Compress. Your optimized PDF is ready for immediate download.' },
            { q: 'Is it safe to compress confidential documents on PDFBazaar?', a: 'Yes. We prioritize privacy with browser-based compression and automatic file deletion from servers within 60 minutes over encrypted SSL connections.' }
        ]
    },
    {
        path: 'merge-pdf-online-free',
        title: 'Merge PDF Online Free – Combine Multiple Files into One | PDFBazaar',
        desc: 'Combine multiple PDF documents into a single file in seconds. Drag and drop to reorder pages. 100% free with no account needed.',
        h1: 'Merge PDF Files Online (Free & Unlimited)',
        faq: [
            { q: 'How do I merge multiple PDF files together?', a: 'Select and upload your files, drag them into your desired order, and click Merge. Download the single combined PDF instantly.' },
            { q: 'Is there a limit on how many files I can combine?', a: 'No, PDFBazaar allows unlimited PDF file merging with zero software installations.' }
        ]
    },
    {
        path: 'image-to-pdf-converter',
        title: 'JPG to PDF Converter – Convert Images & Photos to PDF Online | PDFBazaar',
        desc: 'Convert JPG, PNG, and camera photos into clean, professional PDF files instantly. 100% free online image converter for all devices.',
        h1: 'Convert Images to PDF Online (High Quality)',
        faq: [
            { q: 'How do I convert photos to a single PDF?', a: 'Upload one or multiple images (JPG or PNG), arrange their sequence, and click Convert. You can download the unified PDF document in seconds.' }
        ]
    },
    { 
        path: 'pdf-to-word-converter', 
        title: 'PDF to Word Converter – Convert PDF to Editable DOCX Online | PDFBazaar',
        desc: 'Convert any PDF into an editable Microsoft Word document (.docx). Retains original formatting, tables, and images accurately.',
        h1: 'PDF to Word Converter (Editable & Accurate)',
        faq: [
            { q: 'Can I edit the converted document in Microsoft Word?', a: 'Yes! The downloaded document is a standard .docx file that opens directly in Microsoft Word, Google Docs, and LibreOffice.' }
        ]
    },
    {
        path: 'split-pdf-online-free',
        title: 'Split PDF Online Free – Extract Pages from PDF | PDFBazaar',
        desc: 'Split large PDF documents into separate files or extract specific page ranges for free. Fast, secure, and works on desktop and mobile.',
        h1: 'Split PDF Online (Safe, Free & Fast)',
        faq: [
            { q: 'How do I extract specific pages from a PDF?', a: 'Upload your document, specify the page range (e.g. 1-4, 7), and click Split to download the extracted pages.' }
        ]
    },
    {
        path: 'pdf-to-jpg-converter',
        title: 'PDF to JPG Converter – Extract High Quality Images from PDF | PDFBazaar',
        desc: 'Convert PDF pages into high-resolution JPG images in seconds. Download all pages or individual image extracts free.',
        h1: 'Convert PDF to JPG Online (High Resolution)',
        faq: [
            { q: 'Can I convert all pages of a multi-page PDF into images?', a: 'Yes, our engine renders each page into high-quality JPG images and provides them in a single clean download.' }
        ]
    },
    {
        path: 'add-watermark-to-pdf',
        title: 'Add Watermark to PDF – Protect Documents with Custom Text | PDFBazaar',
        desc: 'Stamp custom text watermarks onto your PDF pages to safeguard confidentiality and intellectual property. 100% free and private.',
        h1: 'Add Custom Watermark to PDF (Secure & Free)',
        faq: [
            { q: 'Can I customize the watermark text?', a: 'Yes, you can specify text such as "Confidential", "Draft", or your company name to stamp across all pages.' }
        ]
    },
    {
        path: 'ocr-pdf-searchable-text',
        title: 'OCR PDF Online – Convert Scanned Documents to Searchable Text | PDFBazaar',
        desc: 'Use AI-powered OCR to extract text from scanned PDFs and make documents fully searchable. Fast, accurate, and completely free.',
        h1: 'OCR PDF Online (Convert Scanned to Searchable)',
        faq: [
            { q: 'Does OCR recognize printed English text?', a: 'Yes, our OCR engine is optimized to accurately parse printed text from scanned pages into selectable text.' }
        ]
    },
    {
        path: 'word-to-pdf-converter',
        title: 'Word to PDF Converter – Convert DOCX to Clean PDF Online | PDFBazaar',
        desc: 'Convert Microsoft Word (.doc, .docx) files into standard PDF documents. Preserves fonts, layouts, and formatting perfectly.',
        h1: 'Word to PDF Converter (Fast & Reliable)',
        faq: [
            { q: 'Will my formatting and fonts remain identical?', a: 'Yes, our conversion engine accurately preserves headings, margins, font styling, and embedded graphics.' }
        ]
    },
    {
        path: 'excel-to-pdf-converter',
        title: 'Excel to PDF Converter – Convert XLS & XLSX Spreadsheets | PDFBazaar',
        desc: 'Convert Excel workbooks into cleanly formatted PDF sheets for reporting and printing. 100% free online converter.',
        h1: 'Excel to PDF Online (Accurate & Free)',
        faq: [
            { q: 'Does it support workbooks with multiple sheets?', a: 'Yes, all sheets in your Excel file are rendered sequentially into a single PDF document.' }
        ]
    },
    {
        path: 'ppt-to-pdf-converter',
        title: 'PPT to PDF Converter – Convert PowerPoint Presentations Online | PDFBazaar',
        desc: 'Convert PowerPoint (.ppt, .pptx) slide decks into universal PDF files for seamless presentation sharing on any device.',
        h1: 'PowerPoint to PDF Online (Professional Slides)',
        faq: [
            { q: 'Can recipients open the converted slides on mobile?', a: 'Yes, PDF documents can be opened natively on any smartphone, tablet, or desktop browser.' }
        ]
    },
    {
        path: 'delete-pdf-pages-online',
        title: 'Delete PDF Pages Online – Remove Unwanted or Blank Pages | PDFBazaar',
        desc: 'Remove unnecessary pages from your PDF documents instantly. Streamline your documents with zero watermarks or limits.',
        h1: 'Delete PDF Pages (Instant & Free)',
        faq: [
            { q: 'How do I delete specific pages from a PDF?', a: 'Upload your file, select or enter the page numbers you wish to remove, and click Delete. Download your cleaned PDF instantly.' }
        ]
    },
    {
        path: 'passport-photo-maker',
        title: 'Passport Photo Maker – Free Online Passport & Visa Photo Resizer | PDFBazaar',
        desc: 'Create standard passport and visa photos online. Auto crop to official 2x2 inch and 3.5x4.5cm dimensions with white background and size presets.',
        h1: 'Free Passport Photo Maker & ID Photo Resizer',
        faq: [
            { q: 'Does this tool create official passport dimensions?', a: 'Yes, you can crop to standard 2x2 inch (US/international) and 3.5x4.5cm (UK, Schengen, Indian) passport dimensions.' }
        ]
    },
    {
        path: 'unlock-pdf-password-remover',
        title: 'Unlock PDF Password Remover – Remove Passwords Online Free | PDFBazaar',
        desc: 'Remove password protection and permissions security from your PDF documents safely using browser-side decryption.',
        h1: 'Unlock PDF Online (Remove Passwords Safely)',
        faq: [
            { q: 'Is my file password safe during decryption?', a: 'Yes, processing is performed client-side or securely in-memory, ensuring your credentials are never stored or logged.' }
        ]
    },
    {
        path: 'protect-pdf-with-password',
        title: 'Protect PDF with Password – Secure PDF Files with Encryption | PDFBazaar',
        desc: 'Encrypt your PDF documents with industry-standard passwords to prevent unauthorized access or modification. 100% free and private.',
        h1: 'Protect PDF Online (Secure Encryption)',
        faq: [
            { q: 'What encryption standard is used to lock the PDF?', a: 'We apply standard PDF security encryption to ensure your sensitive document remains secure against unauthorized viewing.' }
        ]
    },
    {
        path: 'pdf-editor',
        title: 'Free PDF Editor Online – Edit Text, Add Notes & Annotate | PDFBazaar',
        desc: 'Edit PDF documents online for free. Add text, highlights, shapes, drawings, and signatures to your PDF with no installation required.',
        h1: 'Free Online PDF Editor (Annotate, Draw & Sign)',
        faq: [
            { q: 'How do I edit a PDF document online?', a: 'Upload your PDF, use the toolbar to add text, annotations, highlights, or shapes, and click Save to download your edited PDF.' },
            { q: 'Is the PDF editor free to use?', a: 'Yes, PDFBazaar PDF Editor is 100% free with no watermark or page restrictions.' }
        ]
    }
];

const TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{TITLE}}</title>
    <meta name="description" content="{{DESC}}" />
    <link rel="canonical" href="https://pdfbazaar.com/{{PATH}}" />
    <meta property="og:title" content="{{TITLE}}" />
    <meta property="og:description" content="{{DESC}}" />
    <meta property="og:url" content="https://pdfbazaar.com/{{PATH}}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="PDFBazaar" />
    <meta property="og:image" content="https://pdfbazaar.com/og-image.png" />
    <link rel="icon" type="image/png" href="/pdf-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <script type="application/ld+json">
    {{SCHEMA}}
    </script>
    <style>
        :root { --primary: #1321d4; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 40px auto; padding: 20px; }
        h1 { color: var(--primary); border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; font-size: 32px; font-weight: 800; }
        .faq-item { margin-bottom: 20px; padding: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .faq-q { font-weight: 700; color: #0f172a; margin-bottom: 8px; font-size: 16px; }
        .faq-a { color: #475569; font-size: 15px; line-height: 1.6; }
        .nav-brand { font-weight: 800; font-size: 28px; color: var(--primary); display: flex; align-items: center; gap: 8px; text-decoration: none; margin-bottom: 24px; }
        .intro-box { background: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 30px; font-size: 15px; color: #334155; }
    </style>
</head>
<body>
    <div id="root">
        <header>
            <a href="/" class="nav-brand">PDFbazaar.com</a>
            <h1>{{H1}}</h1>
        </header>
        <section class="intro-box">
            <p>Welcome to <strong>PDFBazaar.com</strong> — Free, secure, and private online document productivity tools. All operations run directly in your browser with no registration or hidden fees.</p>
            <p><em>Tool interface loading... (Interactive Workspace)</em></p>
        </section>
        {{EXTRA_CONTENT}}
        <section>
            <h2>Frequently Asked Questions</h2>
            {{FAQ}}
        </section>
        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
            <p><a href="/" style="color: var(--primary); text-decoration: none; font-weight: 600;">View All PDF Tools</a> &bull; <a href="/blog" style="color: var(--primary); text-decoration: none; font-weight: 600;">Guides & Tutorials</a> &bull; <a href="/privacy-policy" style="color: var(--primary); text-decoration: none; font-weight: 600;">Privacy Policy</a></p>
        </footer>
    </div>
    <script type="module" src="/src/main.jsx" defer></script>
</body>
</html>`;

function prerender() {
    console.log('--- STARTING COMPREHENSIVE PRODUCTION PRERENDER ---');
    let generatedCount = 0;

    // Set of routes already handled to prevent duplicate writes
    const handledPaths = new Set();

    // 1. Handcrafted Core Tools
    HANDCRAFTED_TOOLS.forEach(route => {
        handledPaths.add(route.path);
        const dir = path.join(PUBLIC_DIR, route.path);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const faqHtml = (route.faq || []).map(f => `
            <div class="faq-item">
                <div class="faq-q">${f.q}</div>
                <div class="faq-a">${f.a}</div>
            </div>
        `).join('');

        const schemaObj = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebApplication",
                    "name": route.h1,
                    "url": `https://pdfbazaar.com/${route.path}`,
                    "description": route.desc,
                    "operatingSystem": "All",
                    "applicationCategory": "UtilitiesApplication",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": (route.faq || []).map(f => ({
                        "@type": "Question",
                        "name": f.q,
                        "acceptedAnswer": { "@type": "Answer", "text": f.a }
                    }))
                }
            ]
        };

        const html = TEMPLATE
            .replace(/{{TITLE}}/g, route.title)
            .replace(/{{DESC}}/g, route.desc)
            .replace(/{{H1}}/g, route.h1)
            .replace(/{{FAQ}}/g, faqHtml)
            .replace(/{{EXTRA_CONTENT}}/g, '')
            .replace(/{{SCHEMA}}/g, JSON.stringify(schemaObj))
            .replace(/{{PATH}}/g, route.path);

        fs.writeFileSync(path.join(dir, 'index.html'), html);
        generatedCount++;
    });

    // 2. All Remaining Registered Tools
    const allRegisteredTools = TOOLS_CATEGORIES.flatMap(cat => cat.tools);
    allRegisteredTools.forEach(tool => {
        const cleanPath = (tool.seoPath || `/tool/${tool.id}`).replace(/^\//, '');
        if (handledPaths.has(cleanPath)) return;
        handledPaths.add(cleanPath);

        const dir = path.join(PUBLIC_DIR, cleanPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const title = `${tool.name} – Free Online Tool | PDFBazaar`;
        const desc = `Free online ${tool.name}. ${tool.desc} 100% free, secure, and works on desktop and mobile.`;
        const schemaObj = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": tool.name,
            "url": `https://pdfbazaar.com/${cleanPath}`,
            "description": tool.desc,
            "operatingSystem": "All",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        };

        const faqHtml = `
            <div class="faq-item">
                <div class="faq-q">Is ${tool.name} free to use?</div>
                <div class="faq-a">Yes, ${tool.name} on PDFBazaar is 100% free with no registration or limits required.</div>
            </div>
            <div class="faq-item">
                <div class="faq-q">Are my files kept private?</div>
                <div class="faq-a">Yes. Your documents are processed securely and deleted automatically from our servers.</div>
            </div>
        `;

        const html = TEMPLATE
            .replace(/{{TITLE}}/g, title)
            .replace(/{{DESC}}/g, desc)
            .replace(/{{H1}}/g, tool.name)
            .replace(/{{FAQ}}/g, faqHtml)
            .replace(/{{EXTRA_CONTENT}}/g, '')
            .replace(/{{SCHEMA}}/g, JSON.stringify(schemaObj))
            .replace(/{{PATH}}/g, cleanPath);

        fs.writeFileSync(path.join(dir, 'index.html'), html);
        generatedCount++;
    });

    // 3. Informational & Legal Pages
    const STATIC_PAGES = [
        { path: 'pricing', title: 'Free Pricing – 100% Free Tools | PDFBazaar', desc: 'PDFBazaar is completely free with no hidden subscriptions or premium tiers.', h1: '100% Free Document Utilities' },
        { path: 'about', title: 'About Us – PDFBazaar Productivity Platform', desc: 'Learn more about PDFBazaar, our mission to provide free private document tools for everyone.', h1: 'About PDFBazaar' },
        { path: 'contact', title: 'Contact Us | PDFBazaar', desc: 'Get in touch with the PDFBazaar team for support, feature requests, or business inquiries.', h1: 'Contact Us' },
        { path: 'privacy-policy', title: 'Privacy Policy | PDFBazaar', desc: 'Read how PDFBazaar respects and protects user document privacy with strict automatic deletion.', h1: 'Privacy Policy' },
        { path: 'terms-conditions', title: 'Terms & Conditions | PDFBazaar', desc: 'Terms of service and acceptable usage guidelines for PDFBazaar free online utilities.', h1: 'Terms & Conditions' },
        { path: 'disclaimer', title: 'Disclaimer | PDFBazaar', desc: 'Legal disclaimer regarding document processing and services on PDFBazaar.com.', h1: 'Legal Disclaimer' },
        { path: 'blog', title: 'PDF Guides & Document Tutorials | PDFBazaar Blog', desc: 'Helpful tutorials, step-by-step guides, and tips for optimizing, converting, and editing documents.', h1: 'Document Guides & Tutorials' }
    ];

    STATIC_PAGES.forEach(sp => {
        if (handledPaths.has(sp.path)) return;
        handledPaths.add(sp.path);

        const dir = path.join(PUBLIC_DIR, sp.path);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const html = TEMPLATE
            .replace(/{{TITLE}}/g, sp.title)
            .replace(/{{DESC}}/g, sp.desc)
            .replace(/{{H1}}/g, sp.h1)
            .replace(/{{FAQ}}/g, '')
            .replace(/{{EXTRA_CONTENT}}/g, '')
            .replace(/{{SCHEMA}}/g, JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", "name": sp.h1, "url": `https://pdfbazaar.com/${sp.path}` }))
            .replace(/{{PATH}}/g, sp.path);

        fs.writeFileSync(path.join(dir, 'index.html'), html);
        generatedCount++;
    });

    // 4. All Blog Posts
    BLOG_POSTS.forEach(bp => {
        const blogPath = `blog/${bp.slug}`;
        if (handledPaths.has(blogPath)) return;
        handledPaths.add(blogPath);

        const dir = path.join(PUBLIC_DIR, 'blog', bp.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const schemaObj = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": bp.title,
            "description": bp.excerpt,
            "author": { "@type": "Person", "name": bp.author },
            "datePublished": bp.date,
            "mainEntityOfPage": `https://pdfbazaar.com/${blogPath}`
        };

        const html = TEMPLATE
            .replace(/{{TITLE}}/g, `${bp.title} | PDFBazaar`)
            .replace(/{{DESC}}/g, bp.excerpt)
            .replace(/{{H1}}/g, bp.title)
            .replace(/{{FAQ}}/g, '')
            .replace(/{{EXTRA_CONTENT}}/g, `<div style="font-size: 16px; line-height: 1.8; margin-bottom: 40px;">${bp.content || bp.excerpt}</div>`)
            .replace(/{{SCHEMA}}/g, JSON.stringify(schemaObj))
            .replace(/{{PATH}}/g, blogPath);

        fs.writeFileSync(path.join(dir, 'index.html'), html);
        generatedCount++;
    });

    // 5. Programmatic Pages
    PROGRAMMATIC_PAGES.forEach(pg => {
        const progPath = `s/${pg.slug}`;
        if (handledPaths.has(progPath)) return;
        handledPaths.add(progPath);

        const dir = path.join(PUBLIC_DIR, 's', pg.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const faqHtml = (pg.faq || []).map(f => `
            <div class="faq-item">
                <div class="faq-q">${f.q}</div>
                <div class="faq-a">${f.a}</div>
            </div>
        `).join('');

        const schemaObj = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": (pg.faq || []).map(f => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
        };

        const html = TEMPLATE
            .replace(/{{TITLE}}/g, pg.title)
            .replace(/{{DESC}}/g, pg.description)
            .replace(/{{H1}}/g, pg.h1)
            .replace(/{{FAQ}}/g, faqHtml)
            .replace(/{{EXTRA_CONTENT}}/g, pg.content || '')
            .replace(/{{SCHEMA}}/g, JSON.stringify(schemaObj))
            .replace(/{{PATH}}/g, progPath);

        fs.writeFileSync(path.join(dir, 'index.html'), html);
        generatedCount++;
    });

    console.log(`[PRERENDER COMPLETE] Generated ${generatedCount} static HTML pages.`);
}

prerender();
