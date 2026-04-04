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
        desc: 'Reduce PDF size instantly without losing quality. Ideal for SSC/UPSC forms. No login, 100% free tool.',
        h1: 'Compress PDF Under 100KB (Free & No Login)'
    },
    { 
        path: 'merge-pdf-online-free', 
        title: 'Merge PDF Online Free (No Login) – Combine Unlimited Files',
        desc: 'Merge multiple PDF files into one in seconds. 100% safe, free, and works on mobile/desktop.',
        h1: 'Merge PDF Online (Unlimited, Safe, Free)'
    },
    { 
        path: 'image-to-pdf-converter', 
        title: 'Image to PDF Converter: Photos to High Quality PDF Online',
        desc: 'Convert JPG, PNG, and photos to high-quality PDF files instantly. Best for students and jobs.',
        h1: 'Convert Photo to PDF Online (High Quality)'
    },
    { 
        path: 'pdf-to-word-converter', 
        title: 'PDF to Word Converter: Editable DOCX from PDF (Free)',
        desc: 'Convert any PDF to editable Word document in one click. Our AI preserves layout and formatting.',
        h1: 'PDF to Word Converter (Editable & Accurate)'
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
    <style>body { font-family: sans-serif; }</style>
</head>
<body>
    <div id="root">
        <article style="max-width: 800px; margin: 40px auto; padding: 20px;">
            <h1>{{H1}}</h1>
            <p>Welcome to <strong>PDFBazaar.com</strong> - India's most trusted tool for document productivity. All our tools are free, private, and require no account.</p>
            <p>Processing your request... (React App Loading)</p>
            <hr/>
            <section>
                <h2>Features:</h2>
                <ul>
                    <li><strong>100% Free:</strong> No hidden costs or subscriptions.</li>
                    <li><strong>No Login Required:</strong> Use all tools without sharing emails.</li>
                    <li><strong>Mobile Optimized:</strong> Works perfectly on Chrome, Safari, and Samsung Internet.</li>
                    <li><strong>Privacy First:</strong> Your files are processed securely and never stored.</li>
                </ul>
            </section>
        </article>
    </div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;

function prerender() {
    console.log('--- STARTING PRERENDER GENERATOR ---');
    
    SEO_ROUTES.forEach(route => {
        const dir = path.join(PUBLIC_DIR, route.path);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const html = TEMPLATE
            .replace(/{{TITLE}}/g, route.title)
            .replace(/{{DESC}}/g, route.desc)
            .replace(/{{H1}}/g, route.h1)
            .replace(/{{PATH}}/g, route.path);
            
        fs.writeFileSync(path.join(dir, 'index.html'), html);
        console.log(`[PRERENDER] Saved: /${route.path}/index.html`);
    });
    
    console.log('--- PRERENDER COMPLETE! ---');
}

prerender();
