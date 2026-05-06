
const SIZES_KB = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900];
const SIZES_MB = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 100];

const EXAMS = [
    { id: 'ssc-cgl', name: 'SSC CGL', hindi: 'SSC CGL' },
    { id: 'ssc-chsl', name: 'SSC CHSL', hindi: 'SSC CHSL' },
    { id: 'ssc-gd', name: 'SSC GD Constable', hindi: 'SSC GD' },
    { id: 'upsc-ias', name: 'UPSC IAS/CSE', hindi: 'UPSC' },
    { id: 'upsc-nda', name: 'UPSC NDA', hindi: 'NDA' },
    { id: 'upsc-cds', name: 'UPSC CDS', hindi: 'CDS' },
    { id: 'rrb-ntpc', name: 'RRB NTPC', hindi: 'Railway NTPC' },
    { id: 'rrb-group-d', name: 'RRB Group D', hindi: 'Railway Group D' },
    { id: 'ibps-po', name: 'IBPS PO', hindi: 'Banking PO' },
    { id: 'ibps-clerk', name: 'IBPS Clerk', hindi: 'Banking Clerk' },
    { id: 'sbi-po', name: 'SBI PO', hindi: 'SBI PO' },
    { id: 'sbi-clerk', name: 'SBI Clerk', hindi: 'SBI Clerk' },
    { id: 'neet-ug', name: 'NEET UG', hindi: 'NEET' },
    { id: 'jee-main', name: 'JEE Main', hindi: 'JEE' },
    { id: 'jee-adv', name: 'JEE Advanced', hindi: 'JEE Advanced' },
    { id: 'gate', name: 'GATE Exam', hindi: 'GATE' },
    { id: 'cat', name: 'CAT Exam', hindi: 'CAT' },
    { id: 'up-police', name: 'UP Police Bharti', hindi: 'UP Police' },
    { id: 'bihar-police', name: 'Bihar Police', hindi: 'Bihar Police' },
    { id: 'rajasthan-police', name: 'Rajasthan Police', hindi: 'Rajasthan Police' },
    { id: 'delhi-police', name: 'Delhi Police', hindi: 'Delhi Police' },
    { id: 'passport-india', name: 'Indian Passport Application', hindi: 'Passport' },
    { id: 'visa-application', name: 'Visa Application', hindi: 'Visa' }
];

const TOOLS = [
    { id: 'compress-pdf', name: 'Compress PDF', path: '/compress-pdf-without-losing-quality' },
    { id: 'merge-pdf', name: 'Merge PDF', path: '/merge-pdf-online-free' },
    { id: 'jpg-to-pdf', name: 'JPG to PDF', path: '/image-to-pdf-converter' },
    { id: 'pdf-to-jpg', name: 'PDF to JPG', path: '/pdf-to-jpg-converter' },
    { id: 'resize-pdf', name: 'Resize PDF', path: '/resize-pdf-page-size' }
];

const generateHumanLikeContent = (keyword, toolName, specValue) => {
    return `
        <p>In today's digital era, managing document sizes has become a critical task for students, professionals, and job seekers alike. Whether you're applying for a government job, submitting a college assignment, or sharing a professional report, encountering a "File Size Too Large" error can be incredibly frustrating. That's exactly where our specialized <strong>${keyword}</strong> tool comes into play. We've built PDFBazaar to be the fastest, most reliable, and completely free solution for all your PDF needs.</p>
        
        <p>Our tool is specifically optimized for Indian users who frequently interact with portals like <strong>Sarkari Result</strong>, <strong>SSC</strong>, <strong>UPSC</strong>, and various banking recruitment websites. We understand that these portals often have very strict requirements—sometimes demanding a file be exactly under <strong>${specValue}</strong>. Failing to meet these requirements can lead to application rejection, which is why precision is our top priority.</p>

        <h2>Why You Need to ${toolName} for Online Forms?</h2>
        <p>Government recruitment boards and educational institutions use automated systems to process thousands of applications daily. To manage their server storage and ensure fast processing, they set strict limits on document uploads. For example, a scanned marksheet or a colored Aadhar card scan can easily exceed 2MB or 5MB, but the portal might only allow up to <strong>${specValue}</strong>.</p>
        
        <p>Manually trying to reduce the size or change the format using standard software often leads to blurry text or pixelated images. Our <strong>${toolName}</strong> engine uses advanced compression algorithms (like Ghostscript and optimized PDF-lib) to ensure that while the file size shrinks, the text remains 100% sharp and readable. This is crucial because if the verifying officer cannot read your roll number or date of birth, your form might be disqualified.</p>

        <h2>Key Benefits of Using PDFBazaar for ${keyword}</h2>
        <ul>
            <li><strong>Zero Cost, Maximum Value:</strong> Unlike many premium tools that charge a subscription or add annoying watermarks, PDFBazaar is 100% free. No hidden costs, no credit cards, and no "Pro" version locks.</li>
            <li><strong>Privacy & Security:</strong> We process your files directly in your browser whenever possible. For server-side tasks, we use military-grade SSL encryption and automatically delete all files from our secure servers within one hour of processing.</li>
            <li><strong>Mobile-First Design:</strong> Most aspirants in India fill out forms using their smartphones. Our website is designed to be ultra-fast and responsive on 4G and 5G mobile networks. You don't need a laptop or a scanner; just use your phone's camera and our tool.</li>
            <li><strong>No Account Required:</strong> We don't want your email address or personal details. Just land on the page, do your work, and download your file. No registration, no spam.</li>
        </ul>

        <h2>Step-by-Step Guide: How to ${toolName} Online</h2>
        <p>Follow these simple steps to get your documents ready for any online portal:</p>
        <ol>
            <li><strong>Upload Your File:</strong> Click the 'Select Files' button or simply drag and drop your PDF or Image into the designated area.</li>
            <li><strong>Configure Settings:</strong> If you're using our compressor, you can choose between 'Recommended', 'Extreme', or set a <strong>Target Size</strong> (e.g., ${specValue}).</li>
            <li><strong>Hit Process:</strong> Click the red action button (e.g., 'Compress PDF' or 'Merge PDF'). Our engine will start working immediately.</li>
            <li><strong>Download & Upload:</strong> Once processing is complete, a download button will appear. Save the file to your device and it's ready to be uploaded to your target portal.</li>
        </ol>

        <h2>Specific Optimization for Indian Recruitment Portals</h2>
        <p>We've analyzed the technical specifications of major Indian portals including <strong>SSC CGL, CHSL, GD, UPSC CSE, NDA, CDS, IBPS, SBI, and Railway RRB</strong>. Our tool ensures that the output PDF follows the standard PDF/A format, which is accepted universally. Whether you are dealing with a <strong>Domicile Certificate</strong>, <strong>Caste Certificate</strong>, <strong>Income Certificate</strong>, or <strong>ID Proofs like PAN and Aadhar</strong>, our ${toolName} tool handles them all with ease.</p>

        <p>Furthermore, we support various paper sizes like A4 and Legal, which are the standard in Indian offices and courts. If you're a legal professional or a student, you'll find our tools extremely handy for organizing your case files or project reports.</p>

        <h2>Common Challenges and Solutions</h2>
        <p>A common problem users face is merging front and back sides of an ID card into a single page. You can use our <strong>JPG to PDF</strong> tool to select both photos and combine them into one polished document. Another challenge is password-protected Aadhaar files. You can use our <strong>Unlock PDF</strong> tool to remove the permanent password before uploading it to a portal that doesn't accept encrypted files.</p>
        
        <p>In conclusion, PDFBazaar is your all-in-one toolkit for document management. We are committed to helping the Indian student community by providing high-quality tools that were previously only available in paid software. Save your money, save your time, and ensure your career success with PDFBazaar.</p>
    `;
};

export const PROGRAMMATIC_PAGES = [];

// 1. Generate Compress PDF pages for various sizes (20 pages)
SIZES_KB.forEach(size => {
    PROGRAMMATIC_PAGES.push({
        slug: `compress-pdf-to-${size}kb`,
        toolId: 'compress-pdf',
        title: `Compress PDF to ${size}KB Online Free (No Login) – PDFBazaar`,
        description: `Reduce PDF size to exactly ${size}KB online without losing quality. Best tool for government job portals and online forms. No registration required.`,
        h1: `Compress PDF to ${size}KB Online`,
        content: generateHumanLikeContent(`Compress PDF to ${size}KB`, 'Compress PDF', `${size}KB`),
        faq: [
            { q: `Can I compress 1MB PDF to ${size}KB?`, a: `Yes, our tool can compress large files significantly. However, if the file is extremely large, some quality loss might occur in images to reach the ${size}KB target.` },
            { q: "Is it free?", a: "Yes, PDFbazaar is 100% free with no hidden charges or watermarks." },
            { q: `Will the text be readable at ${size}KB?`, a: `We use smart optimization to keep text sharp even when the file size is reduced to ${size}KB.` }
        ]
    });
});

// 2. Generate Tool + Exam combinations (23 exams * 5 tools = 115 pages)
EXAMS.forEach(exam => {
    TOOLS.forEach(tool => {
        PROGRAMMATIC_PAGES.push({
            slug: `${tool.id}-for-${exam.id}-form`,
            toolId: tool.id,
            title: `${tool.name} for ${exam.name} Form Online Free – PDFBazaar`,
            description: `Specially optimized ${tool.name} tool for ${exam.name} online applications. Meet all file requirements for ${exam.name} portal instantly.`,
            h1: `${tool.name} for ${exam.name} Applications`,
            content: generateHumanLikeContent(`${tool.name} for ${exam.name}`, tool.name, exam.name),
            faq: [
                { q: `Will ${exam.name} accept files from this tool?`, a: `Yes! Our tool generates standard PDF/A compliant files that are accepted by all major recruitment portals including ${exam.name}.` },
                { q: "Do I need to login?", a: "No login is required. We want to make the process as fast as possible for exam candidates." }
            ]
        });
    });
});

// 3. Generate "Convert to [format] [size]kb" pages (20 variations)
SIZES_KB.forEach(size => {
    const slug = `convert-pdf-to-jpg-${size}kb`;
    PROGRAMMATIC_PAGES.push({
        slug: slug,
        toolId: 'pdf-to-jpg',
        title: `Convert PDF to JPG under ${size}KB Online – PDFBazaar`,
        description: `Easy online converter to turn your PDF into JPG while keeping the size under ${size}KB. Free, fast, and no login.`,
        h1: `Convert PDF to JPG (${size}KB Target)`,
        content: generateHumanLikeContent(`Convert PDF to JPG under ${size}KB`, 'Convert PDF to JPG', `${size}KB`),
        faq: [
            { q: "Is the quality good?", a: "Yes, we use smart resolution scaling to ensure that even at small sizes, your text remains readable." }
        ]
    });
});

// 4. More variations to reach 200+
const ADDITIONAL_KEYWORDS = [
    'merge-pdf-under-1mb', 'merge-pdf-under-2mb', 'merge-pdf-under-5mb', 'merge-pdf-under-10mb', 'merge-pdf-under-20mb', 'merge-pdf-under-50mb',
    'resize-pdf-for-govt-exam', 'resize-pdf-to-a4-size', 'resize-pdf-online-free', 'resize-pdf-for-passport', 'resize-pdf-for-visa', 'resize-pdf-for-cv',
    'compress-scanned-pdf-online', 'compress-pdf-for-email-attachment', 'compress-pdf-for-whatsapp', 'compress-pdf-for-google-drive',
    'split-pdf-by-page-range', 'extract-pages-from-pdf-free', 'split-pdf-by-size', 'split-pdf-per-page',
    'lock-pdf-with-strong-password', 'remove-password-from-aadhar-card', 'unlock-pan-card-pdf', 'secure-pdf-online-free',
    'convert-word-to-pdf-without-formatting-loss', 'make-pdf-searchable-ocr', 'extract-text-from-pdf-online', 'ocr-hindi-pdf-online',
    'rotate-pdf-pages-online', 'organize-pdf-pages-free', 'add-page-numbers-to-pdf-online', 'pdf-to-grayscale-converter'
];

ADDITIONAL_KEYWORDS.forEach(keyword => {
    let toolId = 'compress-pdf';
    if (keyword.includes('merge')) toolId = 'merge-pdf';
    if (keyword.includes('resize')) toolId = 'resize-pdf';
    if (keyword.includes('split') || keyword.includes('extract')) toolId = 'split-pdf';
    if (keyword.includes('lock')) toolId = 'protect-pdf';
    if (keyword.includes('remove-password') || keyword.includes('unlock')) toolId = 'unlock-pdf';
    if (keyword.includes('word')) toolId = 'word-to-pdf';
    if (keyword.includes('ocr') || keyword.includes('text')) toolId = 'ocr-pdf';

    PROGRAMMATIC_PAGES.push({
        slug: keyword,
        toolId: toolId,
        title: `${keyword.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} – PDFBazaar`,
        description: `Professional tool to ${keyword.replace(/-/g, ' ')}. Fast, free, and secure online PDF utility optimized for Indian users.`,
        h1: keyword.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        content: generateHumanLikeContent(keyword.replace(/-/g, ' '), keyword.replace(/-/g, ' '), 'various limits'),
        faq: [
            { q: `How long does it take to ${keyword.replace(/-/g, ' ')}?`, a: "Usually, it takes less than 5 seconds depending on your file size." }
        ]
    });
});
