import React from 'react';

const getToolSpecificKeywords = (toolId, toolName) => {
    const defaultKw = `${toolName.toLowerCase()} online`;
    const variations = {
        'compress-pdf': ['reduce PDF size', 'compress PDF to 100kb', 'shrink PDF online', 'make PDF smaller without losing quality', 'compress PDF free'],
        'merge-pdf': ['combine PDF files', 'join PDF pages', 'bind PDFs together', 'merge multiple PDF documents', 'PDF merger free'],
        'split-pdf': ['extract pages from PDF', 'separate PDF pages', 'cut PDF online', 'divide PDF into multiple files', 'split PDF free'],
        'word-to-pdf': ['convert DOCX to PDF', 'Word document to PDF format', 'change Word to PDF', 'save Word as PDF', 'DOC to PDF converter'],
        'pdf-to-word': ['convert PDF to Word editable', 'extract text from PDF to Word', 'PDF to DOCX free', 'turn PDF into Word document', 'editable PDF converter'],
        'jpg-to-pdf': ['convert image to PDF', 'pictures to PDF', 'JPG to PDF converter', 'merge photos into PDF', 'save picture as PDF'],
        'protect-pdf': ['password protect PDF', 'encrypt PDF file', 'secure PDF with password', 'add password to PDF document', 'lock PDF online'],
        'unlock-pdf': ['remove PDF password', 'decrypt PDF file', 'unlock secured PDF', 'bypass PDF restriction', 'remove PDF encryption'],
        'add-watermark': ['stamp PDF', 'add logo to PDF', 'insert watermark in PDF', 'text watermark on PDF', 'brand PDF document'],
        'pdf-to-jpg': ['extract images from PDF', 'convert PDF to pictures', 'turn PDF into JPG format', 'save PDF as image file'],
        'rotate-pdf': ['change PDF orientation', 'flip PDF pages', 'turn PDF upside down', 'rotate PDF portrait to landscape'],
        'edit-pdf': ['write on PDF', 'add text to PDF', 'draw on PDF', 'online PDF editor free', 'annotate PDF document'],
        'ocr-pdf': ['convert scanned PDF to text', 'make PDF searchable', 'optical character recognition PDF', 'extract text from image PDF']
    };
    return variations[toolId] || [`${toolName.toLowerCase()} online`, `free ${toolName.toLowerCase()}`, `best ${toolName.toLowerCase()} tool`, `how to ${toolName.toLowerCase()}`, `fast ${toolName.toLowerCase()}`];
};

const getDynamicContent = (toolId, toolName) => {
    if (toolId === 'compress-pdf') {
        return {
            intro: `Are you struggling to send large PDF files via email or upload them to a portal because of size limits? You are not alone. High-resolution images and extensive formatting can quickly inflate a document's file size. That's where a reliable tool to **reduce PDF size** becomes your best friend. Our advanced, highly optimized **${toolName}** tool allows you to instantly shrink your documents without compromising the visual layout or font clarity.`,
            benefits: `Unlike basic tools that blur images or ruin text rendering, our intelligent compression engine offers a balanced approach. Whether you need to **compress PDF to 100kb** for a strict job application portal, or simply want to save gigabytes of cloud storage, our platform provides pixel-perfect optimization. You get to maintain peak readability while drastically cutting down the MBs.`,
            faqs: [
                { q: `Will ${toolName} reduce the quality of my document?`, a: `Our recommended compression mode carefully balances size and quality, ensuring text remains sharp and images are clear enough for standard viewing and printing.` },
                { q: `How do I compress a PDF to exactly 100kb or a specific size?`, a: `We provide a 'Target Size' utility where you can input exactly how many KBs you want the final file to be, and our engine will push the compression to meet your goal.` },
                { q: `Can I compress a PDF on my iPhone or Android?`, a: `Yes! Our tool is entirely web-based, meaning it works flawlessly on Safari, Chrome, and any mobile browser without needing an app installation.` }
            ]
        };
    }

    if (toolId === 'merge-pdf') {
        return {
            intro: `Managing dozens of separate files for a single project can be deeply frustrating and unprofessional. If you are submitting reports, sending invoices, or compiling portfolios, you need a way to **combine PDF files** cleanly. Our seamlessly designed **${toolName}** utility empowers you to join multiple files into one comprehensive document. It organizes your digital life instantly.`,
            benefits: `Merging offline often requires expensive premium software that hogs system resources. Here, you simply drag, drop, reorder, and merge. You can easily **bind PDFs together** in the exact sequence you desire. No technical skills required, no heavy software, just an incredibly fast and 100% free solution.`,
            faqs: [
                { q: `Is there a limit to how many files I can merge at once?`, a: `You can comfortably merge dozens of files at the same time, provided the total combined file size remains within our generous upload limits.` },
                { q: `Can I change the order of the files before merging?`, a: `Absolutely. Once you upload your PDFs, you can drag and rearrange the document cards to set the perfect page sequence prior to merging.` },
                { q: `Does merging PDFs change their original formatting?`, a: `No. Our merger strictly joins the pages exactly as they are without altering any text, images, or native formatting margins.` }
            ]
        };
    }

    if (toolId === 'split-pdf') {
        return {
            intro: `Sometimes a lengthy, 500-page document is just too much to handle, especially if you only need one or two specific sections. Sending an enormous file when only a fraction is relevant is inefficient. Our **${toolName}** tool solves this by allowing you to flawlessly **extract pages from PDF** files or divide a massive document into bite-sized, manageable chunks.`,
            benefits: `Whether you want to separate chapters of an eBook, isolate a specific invoice page, or simply **cut PDF online**, our tool provides granular control. You can specify exact page ranges or extract all pages as individual files instantly. It's built for ultimate precision and speed.`,
            faqs: [
                { q: `How do I extract just one specific page?`, a: `Simply enter the page number you need in the 'Extract Pages' range input, and our tool will isolate that single page into a new pristine PDF document.` },
                { q: `Will the extracted pages lose their quality?`, a: `Not at all. The extraction process does not re-render or compress the pages; it simply isolates the existing high-quality data into a standalone file.` },
                { q: `Can I split a document into multiple separate files?`, a: `Yes, if you choose to extract multiple disparate pages without specifying a range, we will bundle the individual PDF pages into a convenient ZIP archive for you.` }
            ]
        };
    }

    if (toolId === 'word-to-pdf') {
        return {
            intro: `Microsoft Word is phenomenal for drafting documents, but sharing DOCX files can lead to massive formatting errors if the receiver uses a different version or device. To lock in your fonts, layout, and images, it is an industry standard to **convert DOCX to PDF**. Our lightning-fast **${toolName}** converter ensures that what you see in Word is exactly what others see in the PDF.`,
            benefits: `Stop worrying about missing fonts or shifting margins. When you **change Word to PDF** using our platform, the architectural integrity of your document is completely preserved. Whether it's a critical legal contract or an elaborate academic thesis, the output is a secure, universally readable, and highly professional PDF document.`,
            faqs: [
                { q: `Will the layout of my Word document change during conversion?`, a: `No, our converter is engineered to lock in your exact margins, fonts, layouts, and image placements just as they appear in the original DOCX.` },
                { q: `Are hyperlinks preserved in the converted PDF?`, a: `Yes, any active hyperlinks present in your original Word document will remain fully clickable in the resulting PDF file.` },
                { q: `Can I convert older .doc files as well?`, a: `Yes! Our system universally supports both modern .docx formats and the legacy .doc formats natively.` }
            ]
        };
    }

    if (toolId === 'edit-pdf') {
        return {
            intro: `Have you ever received a form that needs filling, or a contract that requires an annotation, but you don't own expensive PDF software? Having the ability to freely **write on PDF** documents is essential in today's digital workflow. Our feature-rich, interactive **${toolName}** equips you with professional Adobe-style editing capabilities directly in your browser.`,
            benefits: `You don't need to print, manually write, and rescan documents anymore. Our **online PDF editor free** environment allows you to precisely type text, highlight critical paragraphs, draw freehand shapes with a pencil tool, and easily whiteout existing text. You can seamlessly annotate your document and download the finalized version in seconds.`,
            faqs: [
                { q: `Can I change the existing text inside my PDF?`, a: `Yes! You can use our 'Edit Text' tool. It intelligently overlays the existing text and lets you type over it effortlessly with exact PDF coordinates.` },
                { q: `Can I draw or highlight sections natively?`, a: `Absolutely. You can select the Highlight or Pencil tools to overlay colored paths, mark up paragraphs, or even erase parts of the document visually.` },
                { q: `Are my edited files completely private?`, a: `Always. Your files are processed securely over encrypted connections and automatically, permanently deleted from our system shortly after you download them.` }
            ]
        };
    }

    // Default fallback content
    return {
        intro: `In today’s fast-paced digital environment, managing electronic documents efficiently is more important than ever. Whether you are a student, a business professional, or simply organizing personal files, you frequently encounter scenarios requiring quick modifications. That is exactly where our reliable **${toolName}** utility becomes indispensable. Designed for absolute precision, it solves document formatting headaches rapidly.`,
        benefits: `Very often, sharing and archiving files present compatibility and layout challenges. By utilizing our online web platform, you can seamlessly process, manage, and transform your files without worrying about losing important data or native quality. When you need to quickly **${toolName.toLowerCase()} online**, you want something secure, user-friendly, and blazing fast. That is precisely the premium experience we deliver straight to your browser.`,
        faqs: [
            { q: `Is it really free to use ${toolName}?`, a: `Yes! Our tool is 100% free with no hidden charges, paywalls, or forced account registrations required to perform your tasks.` },
            { q: `Do I need to install any software to use this?`, a: `No installation is required. Our utilities are fully clouded-based and run perfectly on any modern web browser like Chrome, Safari, or Edge.` },
            { q: `Is my data safe and secure?`, a: `Privacy is our top priority. Files uploaded to our server are fully encrypted and automatically deleted within one hour of processing.` }
        ]
    };
};

const ToolSEOArticle = ({ toolId, toolName, toolDesc }) => {
    const kws = getToolSpecificKeywords(toolId, toolName);
    const kw1 = kws[0];
    const kw2 = kws[1];
    const kw3 = kws[2];

    const content = getDynamicContent(toolId, toolName);

    // Format bold text dynamically
    const formatText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} style={{ color: '#222' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <article className="seo-article-container" style={{ marginTop: '80px', padding: '50px 40px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', lineHeight: '1.8', color: '#4b5563', fontFamily: '"Inter", "Roboto", sans-serif' }}>

            <header style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '24px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '32px', color: '#111827', marginBottom: '12px', fontWeight: '800', lineHeight: '1.2' }}>
                    The Ultimate Guide on How to {toolName} Online
                </h2>
                <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
                    Fast, secure, and completely free. The professional standard way to {kw1} without any software installations.
                </p>
            </header>

            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '16px', fontWeight: '700' }}>
                    Why Do You Need the Best {toolName} Tool?
                </h3>
                <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                    {formatText(content.intro)}
                </p>
                <p style={{ marginBottom: '16px', fontSize: '16px' }}>
                    {formatText(content.benefits)} We understand that dealing with complex file formats can be overly complicated. Our mission is to take the hassle out of document management by offering you a premium-grade utility that executes tasks perfectly in seconds.
                </p>
            </section>

            <section style={{ marginBottom: '40px', background: '#f8fafc', padding: '30px', borderRadius: '12px', borderLeft: '4px solid #E5322D' }}>
                <h3 style={{ fontSize: '22px', color: '#1f2937', marginBottom: '20px', fontWeight: '700' }}>
                    Step-by-Step: How to {toolName} Easily
                </h3>
                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', margin: 0, fontSize: '16px', color: '#374151' }}>
                    <li style={{ marginBottom: '12px', paddingLeft: '8px' }}><strong>Upload your document:</strong> Click the large "Select File" button or simply drag and drop your document directly into the upload area above.</li>
                    <li style={{ marginBottom: '12px', paddingLeft: '8px' }}><strong>Configure settings (if applicable):</strong> Depending on the tool, adjust any sliders, text inputs, or extraction ranges provided in the options panel.</li>
                    <li style={{ marginBottom: '12px', paddingLeft: '8px' }}><strong>Click to Process:</strong> Hit the main action button to initiate the powerful cloud-processing engine. It takes only a few seconds.</li>
                    <li style={{ paddingLeft: '8px' }}><strong>Download Instantly:</strong> Once complete, securely download your perfectly modified document. No watermarks, no limits.</li>
                </ol>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '20px', fontWeight: '700' }}>
                    Key Advantages of Using Our {kw2}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff' }}>
                        <h4 style={{ fontSize: '18px', color: '#111827', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#10b981' }}>✓</span> 100% Free & Unlimited
                        </h4>
                        <p style={{ fontSize: '14px', margin: 0 }}>No expensive subscriptions, hidden fees, or frustrating paywalls. Experience premium capabilities for free.</p>
                    </div>
                    <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff' }}>
                        <h4 style={{ fontSize: '18px', color: '#111827', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#3b82f6' }}>✓</span> Secure & Private
                        </h4>
                        <p style={{ fontSize: '14px', margin: 0 }}>We value your privacy. Files are transferred exclusively over secure HTTPS and are auto-deleted entirely after one hour.</p>
                    </div>
                    <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#fff' }}>
                        <h4 style={{ fontSize: '18px', color: '#111827', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#8b5cf6' }}>✓</span> Universal Support
                        </h4>
                        <p style={{ fontSize: '14px', margin: 0 }}>Whether you are utilizing Windows, macOS, Android, or iOS, our robust cloud service runs perfectly on all of them.</p>
                    </div>
                </div>
            </section>

            <section style={{ marginTop: '40px', borderTop: '2px solid #f3f4f6', paddingTop: '40px' }}>
                <h3 style={{ fontSize: '26px', color: '#111827', marginBottom: '24px', fontWeight: '800', textAlign: 'center' }}>
                    Frequently Asked Questions (FAQ)
                </h3>
                <div className="faq-schema-visual" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {content.faqs.map((faq, idx) => (
                        <div key={idx} style={{ marginBottom: '16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', background: '#f8fafc', borderBottom: '1px solid #eaeaea' }}>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>{faq.q}</h4>
                            </div>
                            <div style={{ padding: '20px 24px' }}>
                                <p style={{ margin: 0, fontSize: '15px', color: '#4b5563' }}>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer style={{ marginTop: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px', fontStyle: 'italic' }}>
                By continuously utilizing the most advanced compression and conversion algorithms, PdfBazaar ensuring you can effortlessly {kw3}. Bookmark this page to heavily speed up your daily workflow.
            </footer>
        </article>
    );
};

export default ToolSEOArticle;
