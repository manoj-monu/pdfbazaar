import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG ---
const PUBLIC_DIR = path.join(__dirname, 'public');
const SEO_ROUTES = [
    { 
        path: 'compress-pdf-without-losing-quality', 
        title: 'Compress PDF Under 100KB (Free, No Login) – PDFBazaar',
        desc: 'Reduce PDF size instantly without losing quality. Exact 100KB compression for SSC/UPSC forms. No login, 100% free tool.',
        h1: 'Compress PDF Under 100KB (Free & No Login)',
        faq: [
            { q: 'How to reduce PDF size below 100KB?', a: 'Upload your file and set the Target Size to 100KB. Our engine will compress it precisely for government form uploads.' },
            { q: 'Is it safe to use PDFBazaar?', a: 'Yes. We use advanced browser-side compression, meaning your data stays private and is deleted instantly after processing.' }
        ]
    },
    { 
        path: 'merge-pdf-online-free', 
        title: 'Merge PDF Online Free (No Login) – Combine Unlimited Files',
        desc: 'Merge multiple PDF files into one in seconds. 100% safe, free, and works on mobile/desktop. No registration required.',
        h1: 'Merge PDF Online (Unlimited, Safe, Free)',
        faq: [
            { q: 'How to merge multiple PDFs into one?', a: 'Simply drag and drop your files into our merger tool, reorder them as needed, and click Merge. You can then download the single combined file.' },
            { q: 'Can I merge scanned documents?', a: 'Yes! Our tool supports all PDF types, including scanned documents from your mobile or scanner.' }
        ]
    },
    { 
        path: 'image-to-pdf-converter', 
        title: 'Image to PDF Converter: Photos to High Quality PDF Online',
        desc: 'Convert JPG, PNG, and photos to high-quality PDF files instantly. Best for students, job applications, and document proofs.',
        h1: 'Convert Photo to PDF Online (High Quality)',
        faq: [
            { q: 'How to convert gallery photos to PDF?', a: 'Select your images from your phone, click convert, and our engine will create a clean, professional PDF from your photos.' },
            { q: 'Is there a limit on the number of photos?', a: 'No, you can batch convert as many photos as you need into a single PDF document.' }
        ]
    },
    { 
        path: 'pdf-to-word-converter', 
        title: 'PDF to Word Converter: Editable DOCX from PDF (Free)',
        desc: 'Convert any PDF into an editable Microsoft Word document. Our AI preserves your layout, fonts, and images perfectly.',
        h1: 'PDF to Word Converter (Editable & Accurate)',
        faq: [
            { q: 'Can I edit the converted Word file?', a: 'Yes! The output is a standard .docx file that you can open and edit in Microsoft Word, Google Docs, or Kingsoft Office.' }
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
    <link rel="canonical" href="https://pdfbazaar.com/{{PATH}}/" />
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #1321d4; border-bottom: 2px solid #eee; padding-bottom: 15px; }
        .faq-item { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
        .faq-q { font-weight: bold; color: #e5322d; margin-bottom: 5px; }
    </style>
</head>
<body>
    <div id="root">
        <header>
            <h1>{{H1}}</h1>
        </header>
        <section>
            <p>Welcome to <strong>PDFBazaar.com</strong> - India's most trusted tool for document productivity. All our tools are 100% free, private, and require no registration.</p>
            <p>Our processing engine is currently loading... (React Hybrid Mode)</p>
            <hr/>
        </section>
        <section>
            <h2>Frequently Asked Questions (FAQ)</h2>
            {{FAQ}}
        </section>
        <section>
            <p><a href="https://pdfbazaar.com/">View All PDF Tools</a> | <a href="https://pdfbazaar.com/blog">Read Our Tutorials</a></p>
        </section>
    </div>
    <script type="module" src="/src/main.jsx" defer></script>
</body>
</html>`;

function prerender() {
    console.log('--- STARTING ENHANCED PRERENDER GENERATOR ---');
    
    SEO_ROUTES.forEach(route => {
        const dir = path.join(PUBLIC_DIR, route.path);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const faqHtml = (route.faq || []).map(f => `
            <div class="faq-item">
                <div class="faq-q">Question: ${f.q}</div>
                <div class="faq-a">${f.a}</div>
            </div>
        `).join('');

        const html = TEMPLATE
            .replace(/{{TITLE}}/g, route.title)
            .replace(/{{DESC}}/g, route.desc)
            .replace(/{{H1}}/g, route.h1)
            .replace(/{{FAQ}}/g, faqHtml)
            .replace(/{{PATH}}/g, route.path);
            
        fs.writeFileSync(path.join(dir, 'index.html'), html);
        console.log(`[PRERENDER] Generated: /${route.path}/index.html`);
    });
    
    console.log('--- ENHANCED PRERENDER COMPLETE! ---');
}

prerender();
