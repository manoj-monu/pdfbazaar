import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../BlogData';
import { DEEP_SEO_CONTENT } from '../DeepSEOData';
import { ChevronRight, Zap, Shield, Globe } from 'lucide-react';

const getToolSpecificKeywords = (toolId, toolName) => {
    const variations = {
        'compress-pdf': [
            'compress pdf below 100kb free', 'compress pdf below 200kb online', 'compress pdf below 500kb free', 'compress pdf below 1mb free', 'compress pdf below 2mb online', 'compress pdf file size online free', 'compress pdf without losing quality', 'compress pdf without watermark', 'compress pdf for email free', 'compress pdf for whatsapp', 'compress pdf online no sign up', 'compress pdf online no limit', 'compress large pdf file free', 'reduce pdf size online free', 'reduce pdf file size without losing quality', 'reduce pdf size below 1mb', 'reduce pdf size for email', 'reduce pdf mb online', 'make pdf file smaller online free', 'shrink pdf file size free', 'pdf size kam kaise kare', 'pdf compress kaise kare free mein', 'pdf ka size kaise kam kare', 'pdf compress karna hai', 'pdf size reduce karna hai free', 'compress pdf 10mb to 1mb free', 'compress pdf 5mb to 500kb', 'best free pdf compressor online', 'pdf compressor without upload', 'compress pdf in browser', 'pdf compress kaise kare', 'whatsapp ke liye pdf compress kaise kare', 'email ke liye pdf size kam kaise kare', 'pdf compress karna hai without watermark', 'pdf 1mb se kam karna hai', 'pdf compress tool india free'
        ],
        'merge-pdf': [
            'merge pdf files online free', 'merge pdf without watermark', 'merge pdf online no sign up', 'merge pdf files into one free', 'combine pdf files online free', 'combine two pdf files free', 'combine multiple pdf into one', 'join pdf files online free', 'join two pdf online free', 'merge pdf india free', 'pdf merge karna hai free mein', '2 pdf ko ek mein kaise jode', 'pdf files ko merge kaise kare', 'pdf jodna hai free mein', 'pdf combine kaise kare', 'merge pdf no limit free', 'merge pdf without login', 'merge pdf files free download', 'best free pdf merger online', 'pdf merger online unlimited', 'merge scanned pdf files free', 'merge pdf and images online free', 'combine pdf pages online', 'merge pdf files in order free', 'online pdf combiner no watermark', 'pdf combine karna hai', 'free pdf joiner online', 'merge pdf files fast free', 'pdf merger without size limit', 'pdf merge kaise kare', 'pdf kaise combine kare', 'add pages to pdf online free', 'pdf merge tool india free'
        ],
        'split-pdf': [
            'split pdf online free', 'split pdf into pages free', 'split pdf without watermark', 'split pdf online no sign up', 'extract pages from pdf free', 'extract one page from pdf free', 'remove pages from pdf free', 'delete pages from pdf online free', 'pdf page nikalna hai free mein', 'pdf split kaise kare free', 'pdf ke page alag kaise kare', 'pdf se ek page kaise nikale', 'separate pdf pages online free', 'cut pdf pages online free', 'pdf cutter online free', 'split large pdf into smaller files', 'split pdf by page range free', 'pdf splitter online no watermark', 'split pdf into multiple files free', 'online pdf splitter without login', 'extract specific pages from pdf', 'pdf page extractor free online', 'free pdf splitter no limit', 'pdf alag karna hai free', 'split pdf pages individually', 'pdf ko alag alag kaise kare', 'pdf half karna hai', 'split pdf without software', 'pdf splitter free download', 'online tool to split pdf', 'pdf split kaise kare'
        ],
        'pdf-to-word': [
            'pdf to word converter free online', 'pdf to word without watermark', 'pdf to word free no sign up', 'convert pdf to word editable free', 'pdf ko word mein kaise badle free', 'pdf to word convert karna hai', 'pdf word mein convert kaise kare', 'convert scanned pdf to word free', 'online pdf to word no sign up', 'pdf ko word mein kaise convert kare'
        ],
        'jpg-to-pdf': [
            'jpg to pdf converter free online', 'image to pdf converter free', 'convert multiple images to pdf free', 'photos to pdf online free', 'image ko pdf mein kaise badle', 'jpg ko pdf mein kaise kare', 'photo to pdf karna hai free', 'free mein pdf kaise banaye', 'pdf tools online free india'
        ],
        'pdf-to-jpg': [
            'pdf to jpg converter free online', 'pdf to png converter free', 'convert pdf to jpeg free online', 'pdf ko image mein kaise badle', 'pdf se photo kaise nikale'
        ],
        'word-to-pdf': [
            'word to pdf converter free online', 'smallpdf alternative free', 'ilovepdf alternative free', 'all in one pdf tools free'
        ],
        'excel-to-pdf': [
            'excel to pdf converter free', 'pdf tools without daily limit', 'pdf tools no watermark free'
        ],
        'ppt-to-pdf': [
            'ppt to pdf converter free online', 'pdf to powerpoint free online'
        ],
        'protect-pdf': [
            'pdf me password kaise lagaye free', 'lock pdf with password free', 'pdf me password lagana hai free', 'secure pdf tools online'
        ],
        'unlock-pdf': [
            'pdf password hatana hai free', 'pdf password remove online free', 'remove pdf password without software', 'unlock pdf online free', 'pdf unlock karna hai free'
        ],
        'add-watermark': [
            'pdf me watermark kaise hataye', 'pdf watermark remove online free'
        ],
        'ocr-pdf': [
            'pdf to text converter free', 'pdf se text copy kaise kare'
        ],
        'delete-pdf-pages': [
            'remove pages from pdf file', 'delete pdf pages online'
        ]
    };
    
    // Default general keywords for any other tool not explicitly matched
    const generalKeywords = [
        'pdf tools hindi mein', 'best pdf tools india', 'free pdf tools india', 'pdf tools online free india', 'pdf tools online free no limit', 'best free pdf tools online 2024', 'pdf tools without login', 'free pdf tools unlimited use', 'pdf toolkit free online', 'pdf tools like smallpdf free', 'pdf tools offline browser', 'pdf tools mobile friendly', 'pdf tools for students free'
    ];
    
    return variations[toolId] || generalKeywords;
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

            {/* Popular Related Searches (SEO Keyword Injection) */}
            {kws && kws.length > 0 && (
                <section style={{ marginBottom: '60px', padding: '30px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '20px', color: '#1e293b', marginBottom: '20px', fontWeight: '800' }}>
                        Related Searches & Queries
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {kws.map((kw, idx) => (
                            <span key={idx} style={{ 
                                padding: '6px 14px', 
                                background: '#ffffff', 
                                color: '#475569', 
                                fontSize: '13px', 
                                fontWeight: '600',
                                borderRadius: '20px', 
                                border: '1px solid #cbd5e1',
                                transition: 'all 0.2s',
                                cursor: 'default'
                            }}>
                                {kw}
                            </span>
                        ))}
                    </div>
                </section>
            )}

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

