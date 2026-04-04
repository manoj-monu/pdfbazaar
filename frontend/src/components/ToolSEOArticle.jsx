import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../BlogData';
import { DEEP_SEO_CONTENT } from '../DeepSEOData';
import { ChevronRight, Zap, Shield, Globe } from 'lucide-react';

const getToolSpecificKeywords = (toolId, toolName) => {
    const variations = {
        'compress-pdf': ['reduce PDF size', 'compress PDF to 100kb', 'shrink PDF online', 'make PDF smaller without losing quality', 'compress PDF free'],
        'merge-pdf': ['combine PDF files', 'join PDF pages', 'bind PDFs together', 'merge multiple PDF documents', 'PDF merger free'],
        'split-pdf': ['extract pages from PDF', 'separate PDF pages', 'cut PDF online', 'divide PDF into multiple files', 'split PDF free'],
        'word-to-pdf': ['convert DOCX to PDF', 'Word document to PDF format', 'change Word to PDF', 'save Word as PDF', 'DOC to PDF converter'],
        'pdf-to-word': ['convert PDF to Word editable', 'extract text from PDF to Word', 'PDF to DOCX free', 'turn PDF into Word document', 'editable PDF converter'],
        'jpg-to-pdf': ['convert image to PDF', 'pictures to PDF', 'JPG to PDF converter', 'merge photos into PDF', 'save picture as PDF'],
        'protect-pdf': ['password protect PDF', 'encrypt PDF file', 'secure PDF with password', 'lock PDF online'],
        'unlock-pdf': ['remove PDF password', 'decrypt PDF file', 'unlock secured PDF', 'bypass PDF restriction'],
        'add-watermark': ['stamp PDF', 'add logo to PDF', 'insert watermark in PDF', 'text watermark on PDF'],
        'pdf-to-jpg': ['extract images from PDF', 'convert PDF to pictures', 'turn PDF into JPG format'],
        'rotate-pdf': ['change PDF orientation', 'flip PDF pages', 'turn PDF upside down'],
        'edit-pdf': ['write on PDF', 'add text to PDF', 'online PDF editor free', 'annotate PDF document'],
        'ocr-pdf': ['convert scanned PDF to text', 'make PDF searchable', 'optical character recognition PDF']
    };
    return variations[toolId] || [`${toolName.toLowerCase()} online`, `free ${toolName.toLowerCase()}`, `best ${toolName.toLowerCase()} tool` ];
};

const getDynamicContent = (toolId, toolName) => {
    // Check deep content first
    if (DEEP_SEO_CONTENT[toolId]) {
        const deep = DEEP_SEO_CONTENT[toolId];
        return {
            title: deep.h1,
            intro: deep.intro,
            section1: { title: deep.section1_title, content: deep.section1_content },
            section2: { title: deep.section2_title, content: deep.section2_content },
            faqs: deep.faq
        };
    }

    // Default fallback (abbreviated)
    if (toolId === 'compress-pdf') {
        return {
            title: `Compress PDF Online - Reduce File Size`,
            intro: `Searching for a way to **reduce PDF size** without ruining the quality? Our advanced **${toolName}** tool is optimized for modern web standards. Whether you need to **compress PDF to 100kb** for a job portal or just save storage space, we have you covered.`,
            section1: { title: "Why Compress PDF on PDFbazaar?", content: "Our tool ensures your font clarity and image resolution are balanced perfectly. No more blurry graphics or illegible text." },
            section2: { title: "How to Use?", content: "Simply upload your file, select a compression level, and download the result. It's that simple." },
            faqs: [
                { q: `Will ${toolName} reduce the quality of my document?`, a: `Our recommended compression mode carefully balances size and quality, ensuring text remains sharp and images are clear enough.` },
                { q: `Can I compress a PDF on my iPhone or Android?`, a: `Yes! Our tool is entirely web-based and works on any mobile browser.` }
            ]
        };
    }

    return {
        title: `The Ultimate Guide to ${toolName} Online`,
        intro: `In today’s digital world, managing your documents efficiently is crucial. Our reliable **${toolName}** tool is designed to solve your formatting headaches in seconds. Secure, fast, and 100% free.`,
        section1: { title: `Why Choose PDFbazaar for ${toolName}?`, content: `We prioritize user experience and privacy. Our ${toolName.toLowerCase()} engine runs on high-performance servers to deliver results instantly.` },
        section2: { title: "Step-by-Step Instructions", content: "1. Upload your file. \n2. Configure any options if needed. \n3. Click process and download your new PDF." },
        faqs: [
            { q: `Is it really free?`, a: `Yes! PDFbazaar is 100% free with no registration required.` },
            { q: `Is my data safe?`, a: `Absolutely. Files are encrypted during transfer and auto-deleted within an hour.` }
        ]
    };
};

const ToolSEOArticle = ({ toolId, toolName }) => {
    const kws = getToolSpecificKeywords(toolId, toolName);
    const content = getDynamicContent(toolId, toolName);
    const relatedBlogs = BLOG_POSTS.filter(p => 
        p.category?.toLowerCase() === toolName.toLowerCase() || 
        p.content?.toLowerCase().includes(toolId.toLowerCase()) ||
        p.title?.toLowerCase().includes(toolName.toLowerCase())
    ).slice(0, 3);

    const formatText = (text) => {
        if (!text) return '';
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part && part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} style={{ color: '#111827', fontWeight: '800' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <article className="seo-article-container" style={{ 
            marginTop: '80px', 
            padding: '60px 40px', 
            backgroundColor: '#ffffff', 
            borderRadius: '24px', 
            border: '1px solid #f1f5f9', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.02)', 
            lineHeight: '1.8', 
            color: '#334155', 
            fontFamily: '"Inter", sans-serif',
            maxWidth: '1000px',
            marginRight: 'auto',
            marginLeft: 'auto'
        }}>
            {/* Header section with rich aesthetics */}
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ 
                    display: 'inline-flex', 
                    padding: '8px 16px', 
                    background: '#f1f5f9', 
                    borderRadius: '99px', 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: '#64748b', 
                    marginBottom: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    User Guide & Documentation
                </div>
                <h2 style={{ fontSize: '38px', color: '#0f172a', marginBottom: '20px', fontWeight: '900', lineHeight: '1.1' }}>
                    {content.title}
                </h2>
                <div style={{ width: '100px', height: '4px', background: 'linear-gradient(90deg, #E5322D, #FF6B6B)', margin: '0 auto', borderRadius: '2px' }}></div>
            </header>

            <div style={{ fontSize: '18px', marginBottom: '40px', color: '#475569' }}>
                {formatText(content.intro)}
            </div>

            {/* Dynamic sections with icons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', marginBottom: '60px' }}>
                <section>
                    <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>★</div>
                        {content.section1.title}
                    </h3>
                    <div style={{ whiteSpace: 'pre-line' }}>{formatText(content.section1.content)}</div>
                </section>

                <section style={{ padding: '40px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '20px', fontWeight: '800' }}>
                        {content.section2.title}
                    </h3>
                    <div style={{ whiteSpace: 'pre-line' }}>{formatText(content.section2.content)}</div>
                </section>
            </div>

            {/* Feature Highlights with icons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ color: '#3b82f6', marginBottom: '16px' }}><Zap size={24} /></div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Lightning Fast</h4>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>Processed on high-performance infrastructure to ensure the fastest conversion possible.</p>
                </div>
                <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ color: '#10b981', marginBottom: '16px' }}><Shield size={24} /></div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Privacy First</h4>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>Encrypted transfers and automatic permanent deletion of your files after processing.</p>
                </div>
                <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ color: '#8b5cf6', marginBottom: '16px' }}><Globe size={24} /></div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Global Standard</h4>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>Our output follows international PDF standards for maximum compatibility across systems.</p>
                </div>
            </div>

            {/* FAQ Section */}
            <section style={{ marginBottom: '60px' }}>
                <h3 style={{ fontSize: '30px', color: '#0f172a', marginBottom: '32px', fontWeight: '900', textAlign: 'center' }}>
                    Common Questions & Answers
                </h3>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {content.faqs.map((faq, idx) => (
                        <div key={idx} style={{ marginBottom: '16px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                            <div style={{ padding: '20px 24px', fontWeight: '700', color: '#334155', borderBottom: '1px solid #f8fafc' }}>
                                {faq.q}
                            </div>
                            <div style={{ padding: '20px 24px', color: '#64748b', fontSize: '15px' }}>
                                {faq.a}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Blogs - Internal Linking System */}
            {relatedBlogs.length > 0 && (
                <section style={{ borderTop: '2px solid #f1f5f9', paddingTop: '60px' }}>
                    <h3 style={{ fontSize: '26px', color: '#0f172a', marginBottom: '32px', fontWeight: '900' }}>
                        Related Tips & Tutorials
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {relatedBlogs.map(blog => (
                            <Link to={`/blog/${blog.slug}`} key={blog.id} style={{ 
                                display: 'block',
                                padding: '24px', 
                                background: '#f8fafc', 
                                borderRadius: '20px', 
                                border: '1px solid #f1f5f9',
                                transition: 'all 0.3s'
                            }} className="related-blog-card">
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#E5322D', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>{blog.category}</span>
                                <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', lineHeight: '1.4' }}>{blog.title}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600', color: '#E5322D' }}>
                                    Read Guide <ChevronRight size={14} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <footer style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>
                <p style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto' }}>
                    Disclaimer: PDFbazaar is an independent service. We are not affiliated with Adobe or other PDF brands. 
                    All processing is done securely for the user's benefit.
                </p>
            </footer>
        </article>
    );
};

export default ToolSEOArticle;

