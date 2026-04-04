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
    },
    {
        path: 'split-pdf-online-free',
        title: 'Split PDF Online Free: Extract Pages from PDF (No Login)',
        desc: 'Split large PDF files into smaller parts or extract specific pages for free. Fastest PDF splitter online, no registration required.',
        h1: 'Split PDF Online (Safe, Free & Fast)',
        faq: [
            { q: 'How to split a PDF into separate pages?', a: 'Upload your file, enter the page range you want to extract (e.g., 1-5), and click Split. You can then download your new document.' }
        ]
    },
    {
        path: 'pdf-to-jpg-converter',
        title: 'PDF to JPG Converter: High Quality Images from PDF (Free)',
        desc: 'Convert PDF pages into high-resolution JPG images. Perfect for sharing on social media or using as document proofs.',
        h1: 'Convert PDF to JPG Online (High Quality)',
        faq: [
            { q: 'Can I convert all pages of a PDF to JPG?', a: 'Yes, our tool converts every page into a separate image and provides them in a single ZIP file for easy download.' }
        ]
    },
    {
        path: 'add-watermark-to-pdf',
        title: 'Add Watermark to PDF: Secure Your Documents Online',
        desc: 'Add custom text watermarks to your PDF files to protect your work. 100% free, secure, and works in your browser.',
        h1: 'Add Custom Watermark to PDF (Secure & Free)',
        faq: [
            { q: 'Can I customize the watermark text?', a: 'Yes, you can enter any text like "Confidential" or "Draft" and it will be stamped across every page of your PDF.' }
        ]
    },
    {
        path: 'ocr-pdf-searchable-text',
        title: 'OCR PDF Online: Make Scanned PDF Searchable (Free AI)',
        desc: 'Use AI-powered OCR to convert scanned PDFs into searchable text documents. Copy text and search within your scanned files easily.',
        h1: 'OCR PDF Online (Convert Scanned to Searchable)',
        faq: [
            { q: 'Will it recognize handwritten text?', a: 'Our OCR engine is optimized for printed text. Handwritten recognition may vary depending on the clarity of the scan.' }
        ]
    },
    {
        path: 'word-to-pdf-converter',
        title: 'Word to PDF Converter: DOCX to PDF Online (Professional)',
        desc: 'Convert Word documents to high-quality PDF files. Preserves your original fonts, tables, and layout perfectly for professional sharing.',
        h1: 'Word to PDF Converter (Fast & High Quality)',
        faq: [
            { q: 'Is it free to convert Word to PDF?', a: 'Yes! PDFBazaar allows unlimited Word to PDF conversions without any hidden charges or watermarks.' }
        ]
    },
    {
        path: 'excel-to-pdf-converter',
        title: 'Excel to PDF Converter: XLSX Spreadsheets to PDF Online',
        desc: 'Convert Excel files to polished PDF documents. Maintain your data integrity and formatting for easy reporting and printing.',
        h1: 'Excel to PDF Online (Accurate & Free)',
        faq: [
            { q: 'Will it support multiple sheets?', a: 'Yes, our converter automatically renders all sheets in your Excel workbook into a single PDF document.' }
        ]
    },
    {
        path: 'ppt-to-pdf-converter',
        title: 'PPT to PDF Converter: PowerPoint Slides to PDF Online',
        desc: 'Convert PowerPoint presentations to PDF format for easy viewing on any device. High quality slides with no font issues.',
        h1: 'PowerPoint to PDF Online (Professional Slides)',
        faq: [
            { q: 'Can I open the gallery on any phone?', a: 'Yes, our web-based tool works perfectly on Android, iPhone, and tablets.' }
        ]
    },
    {
        path: 'delete-pdf-pages-online',
        title: 'Delete PDF Pages Online: Remove Blank or Unwanted Pages',
        desc: 'Remove specific pages from your PDF documents instantly. Clean up your files and reduce size for free, no account needed.',
        h1: 'Delete PDF Pages (Instant & Free)',
        faq: [
            { q: 'How to delete specific pages from a PDF?', a: 'Upload your file, enter the page numbers you want to remove, and click Delete. Your cleaned file will be ready in seconds.' }
        ]
    },
    {
        path: 'unlock-pdf-password-remover',
        title: 'Unlock PDF Password Remover: Permanent Decryption (Free)',
        desc: 'Remove passwords from Aadhaar cards, bank statements, and secured PDFs permanently. Secure browser-side decryption.',
        h1: 'Unlock PDF Online (Remove Passwords Safely)',
        faq: [
            { q: 'Is it safe to unlock my bank statement here?', a: 'Yes! We use browser-side processing, so your password and file never leave your computer.' }
        ]
    },
    {
        path: 'protect-pdf-with-password',
        title: 'Protect PDF with Password: 256-bit AES Encryption (Free)',
        desc: 'Secure your PDF files with military-grade encryption. Add passwords to sensitive documents for safe sharing and privacy.',
        h1: 'Protect PDF Online (Secure Encryption)',
        faq: [
            { q: 'What encryption level do you use?', a: 'We use industry-standard 256-bit AES encryption to ensure your documents are practically unhackable.' }
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #1321d4; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: var(--primary); border-bottom: 2px solid #eee; padding-bottom: 15px; }
        .faq-item { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
        .nav-brand { font-weight: 800; font-size: 28px; color: var(--primary); display: flex; align-items: center; gap: 8px; text-decoration: none; }
    </style>
</head>
<body>
    <div id="root">
        <header>
            <a href="/" class="nav-brand">PDFBazaar</a>
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
