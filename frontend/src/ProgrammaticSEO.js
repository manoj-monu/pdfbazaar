
const SIZES_KB = [20, 50, 100, 150, 200, 300, 400, 500];
const SIZES_MB = [1, 2, 5, 10];
const EXAMS = [
    { id: 'ssc', name: 'SSC CGL/CHSL', hindi: 'SSC' },
    { id: 'upsc', name: 'UPSC Civil Services', hindi: 'UPSC' },
    { id: 'neet', name: 'NEET/NTA', hindi: 'NEET' },
    { id: 'banking', name: 'IBPS/SBI Banking', hindi: 'Banking' },
    { id: 'railway', name: 'Railway RRB', hindi: 'Railway' },
    { id: 'govt-job', name: 'Government Job', hindi: 'Sarkari Job' },
    { id: 'passport', name: 'Passport/Visa', hindi: 'Passport' }
];

const TOOLS = [
    { id: 'compress-pdf', name: 'Compress PDF', path: '/compress-pdf-without-losing-quality' },
    { id: 'merge-pdf', name: 'Merge PDF', path: '/merge-pdf-online-free' },
    { id: 'jpg-to-pdf', name: 'JPG to PDF', path: '/image-to-pdf-converter' },
    { id: 'pdf-to-jpg', name: 'PDF to JPG', path: '/pdf-to-jpg-converter' },
    { id: 'resize-pdf', name: 'Resize PDF', path: '/resize-pdf-page-size' }
];

export const PROGRAMMATIC_PAGES = [];

// 1. Generate Compress PDF pages for various sizes
SIZES_KB.forEach(size => {
    PROGRAMMATIC_PAGES.push({
        slug: `compress-pdf-to-${size}kb`,
        toolId: 'compress-pdf',
        title: `Compress PDF to ${size}KB Online Free (No Login) – PDFBazaar`,
        description: `Reduce PDF size to exactly ${size}KB online without losing quality. Best tool for government job portals and online forms. No registration required.`,
        h1: `Compress PDF to ${size}KB Online`,
        content: `
            <p>Need to upload a document but the portal says the file must be under <strong>${size}KB</strong>? You are in the right place. Our <strong>${size}KB PDF compressor</strong> is specifically designed for Indian students and professionals who need to meet strict file size requirements for portals like SSC, UPSC, and Banking.</p>
            
            <h2>Why use our ${size}KB Compressor?</h2>
            <ul>
                <li><strong>Target Size AI:</strong> Our tool uses advanced algorithms to reach as close to ${size}KB as possible.</li>
                <li><strong>Privacy First:</strong> Your files are processed locally or deleted within 1 hour. We value your data security.</li>
                <li><strong>No Quality Loss:</strong> We optimize images and remove metadata while keeping the text sharp and readable.</li>
            </ul>

            <h2>How to compress PDF under ${size}KB?</h2>
            <ol>
                <li>Go to our <a href="/compress-pdf-without-losing-quality">Compress PDF tool</a>.</li>
                <li>Upload the file you want to shrink.</li>
                <li>Enter "${size}" in the <strong>Target Size</strong> box.</li>
                <li>Select "KB" as the unit.</li>
                <li>Click <strong>Compress</strong> and download your file instantly.</li>
            </ol>

            <h3>Ideal for:</h3>
            <p>This ${size}KB limit is very common for uploading signatures, photos, and identity proofs (Aadhar/PAN) on government websites. Whether you are using a mobile phone or a PC, our tool works smoothly on all browsers.</p>
        `,
        faq: [
            { q: `Can I compress 1MB PDF to ${size}KB?`, a: `Yes, our tool can compress large files significantly. However, if the file is extremely large, some quality loss might occur in images to reach the ${size}KB target.` },
            { q: "Is it free?", a: "Yes, PDFbazaar is 100% free with no hidden charges or watermarks." }
        ]
    });
});

// 2. Generate Tool + Exam combinations
EXAMS.forEach(exam => {
    TOOLS.forEach(tool => {
        PROGRAMMATIC_PAGES.push({
            slug: `${tool.id}-for-${exam.id}-form`,
            toolId: tool.id,
            title: `${tool.name} for ${exam.name} Form Online Free – PDFBazaar`,
            description: `Specially optimized ${tool.name} tool for ${exam.name} online applications. Meet all file requirements for ${exam.name} portal instantly.`,
            h1: `${tool.name} for ${exam.name} Applications`,
            content: `
                <p>Filling out the <strong>${exam.name}</strong> form can be stressful, especially when it comes to document uploads. The ${exam.name} portal often has very specific requirements for PDF files, such as size limits or format types. Our <strong>${tool.name}</strong> tool is here to help you get your documents ready in seconds.</p>
                
                <h2>Optimized for ${exam.name}</h2>
                <p>We have analyzed the ${exam.name} upload guidelines to ensure that our tool produces files that are 100% compatible with their system. No more "File format not supported" or "File size too large" errors.</p>

                <h3>How to use:</h3>
                <ul>
                    <li>Click on the <a href="${tool.path}">${tool.name}</a> tool.</li>
                    <li>Upload your ${exam.name} documents (like Marksheets, Caste Certificate, or ID Proof).</li>
                    <li>Follow the simple on-screen instructions to ${tool.id.replace('-', ' ')}.</li>
                    <li>Download the result and upload it directly to the ${exam.name} portal.</li>
                </ul>

                <p>Don't let technical issues stop you from applying for your dream career. Use PDFbazaar to handle all your PDF needs for <strong>${exam.name}</strong>.</p>
            `,
            faq: [
                { q: `Will ${exam.name} accept files from this tool?`, a: `Yes! Our tool generates standard PDF/A compliant files that are accepted by all major recruitment portals including ${exam.name}.` },
                { q: "Do I need to login?", a: "No login is required. We want to make the process as fast as possible for exam candidates." }
            ]
        });
    });
});

// 3. Generate "Convert to [format] [size]kb" pages
[
    { from: 'pdf', to: 'jpg', size: 50 },
    { from: 'pdf', to: 'jpg', size: 100 },
    { from: 'jpg', to: 'pdf', size: 200 },
    { from: 'jpg', to: 'pdf', size: 500 }
].forEach(item => {
    const slug = `convert-${item.from}-to-${item.to}-${item.size}kb`;
    PROGRAMMATIC_PAGES.push({
        slug: slug,
        toolId: item.from === 'pdf' ? 'pdf-to-jpg' : 'jpg-to-pdf',
        title: `Convert ${item.from.toUpperCase()} to ${item.to.toUpperCase()} under ${item.size}KB Online – PDFBazaar`,
        description: `Easy online converter to turn your ${item.from.toUpperCase()} into ${item.to.toUpperCase()} while keeping the size under ${item.size}KB. Free, fast, and no login.`,
        h1: `Convert ${item.from.toUpperCase()} to ${item.to.toUpperCase()} (${item.size}KB Target)`,
        content: `
            <p>Converting files between formats is easy, but controlling the output size is hard. Our <strong>${item.from.toUpperCase()} to ${item.to.toUpperCase()} converter</strong> allows you to target a specific size of <strong>${item.size}KB</strong>, making it perfect for online submissions.</p>
            
            <h2>Key Features:</h2>
            <ul>
                <li><strong>Instant Conversion:</strong> High-speed processing directly in your browser.</li>
                <li><strong>Size Control:</strong> Reach your ${item.size}KB goal without multiple trials.</li>
                <li><strong>Multi-file support:</strong> Convert multiple images or pages at once.</li>
            </ul>

            <p>Simply upload your original ${item.from.toUpperCase()} file, and our engine will generate a optimized ${item.to.toUpperCase()} for you. If the resulting file is still large, you can use our <a href="/compress-pdf-without-losing-quality">compression tool</a> to further fine-tune it.</p>
        `,
        faq: [
            { q: "Is the quality good?", a: "Yes, we use smart resolution scaling to ensure that even at small sizes, your text remains readable." }
        ]
    });
});

// Add more variations to reach 200+
const ADDITIONAL_KEYWORDS = [
    'merge-pdf-under-1mb', 'merge-pdf-under-2mb', 'merge-pdf-under-5mb',
    'resize-pdf-for-govt-exam', 'resize-pdf-to-a4-size', 'resize-pdf-online-free',
    'compress-scanned-pdf-online', 'compress-pdf-for-email-attachment',
    'split-pdf-by-page-range', 'extract-pages-from-pdf-free',
    'lock-pdf-with-strong-password', 'remove-password-from-aadhar-card',
    'convert-word-to-pdf-without-formatting-loss', 'make-pdf-searchable-ocr'
];

ADDITIONAL_KEYWORDS.forEach(keyword => {
    let toolId = 'compress-pdf';
    if (keyword.includes('merge')) toolId = 'merge-pdf';
    if (keyword.includes('resize')) toolId = 'resize-pdf';
    if (keyword.includes('split') || keyword.includes('extract')) toolId = 'split-pdf';
    if (keyword.includes('lock')) toolId = 'protect-pdf';
    if (keyword.includes('remove-password')) toolId = 'unlock-pdf';
    if (keyword.includes('word')) toolId = 'word-to-pdf';
    if (keyword.includes('ocr')) toolId = 'ocr-pdf';

    PROGRAMMATIC_PAGES.push({
        slug: keyword,
        toolId: toolId,
        title: `${keyword.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} – PDFBazaar`,
        description: `Professional tool to ${keyword.replace(/-/g, ' ')}. Fast, free, and secure online PDF utility optimized for Indian users.`,
        h1: keyword.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        content: `
            <p>Looking to <strong>${keyword.replace(/-/g, ' ')}</strong>? PDFBazaar provides the most reliable and fastest way to handle your PDF documents online. Our platform is designed to be lightweight and mobile-friendly.</p>
            
            <h2>Why PDFBazaar for ${keyword.replace(/-/g, ' ')}?</h2>
            <p>We understand the needs of users who deal with government portals, academic submissions, and corporate documentation. Our tools are built using open-source libraries that process data efficiently.</p>
            
            <ul>
                <li><strong>No Registration:</strong> Start using the tool immediately.</li>
                <li><strong>Batch Processing:</strong> Handle multiple files at once.</li>
                <li><strong>High Compatibility:</strong> Works on Chrome, Firefox, Safari, and Edge.</li>
            </ul>

            <p>Try our specialized tool today and see why thousands of users trust PDFBazaar for their daily document tasks.</p>
        `,
        faq: [
            { q: `How long does it take to ${keyword.replace(/-/g, ' ')}?`, a: "Usually, it takes less than 5 seconds depending on your file size." }
        ]
    });
});
