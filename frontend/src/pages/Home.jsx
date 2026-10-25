import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS_CATEGORIES } from '../ToolsData';
import { BLOG_POSTS } from '../BlogData';
import useSEO from '../hooks/useSEO';
import AdsPlacement from '../components/AdsPlacement';

const Home = () => {
    useSEO({
        title: 'Free Online PDF Tools – Compress, Merge, Convert & Edit | PDFBazaar',
        description: '100% free online PDF tools to compress, merge, split, convert, and edit documents. Private browser processing with no registration, no watermarks, and no file limits.',
        keywords: 'free pdf tools, compress pdf online, merge pdf, pdf to word converter, jpg to pdf, edit pdf online free, split pdf'
    });

    const [activeFilter, setActiveFilter] = useState('All');

    // Flatten all tools into a single list for 'All'
    const allTools = TOOLS_CATEGORIES.reduce((acc, cat) => [...acc, ...cat.tools], []);

    // Tools to show based on filter
    let toolsToShow = [];
    if (activeFilter === 'All') {
        toolsToShow = allTools;
    } else {
        const matchingCategory = TOOLS_CATEGORIES.find(cat => cat.title.includes(activeFilter));
        if (matchingCategory) {
            toolsToShow = matchingCategory.tools;
        } else {
            toolsToShow = allTools.slice(0, 4);
        }
    }

    return (
        <main>
            <div className="hero-wrapper">
                <section className="hero">
                    <div className="container">
                        <h1>Free Online PDF Tools — Compress, Merge, Convert & Edit</h1>
                        <p>
                            Fast, private, and browser-powered document utilities. Compress large files, combine multiple documents, 
                            convert Office formats to PDF, and edit pages with no registration, no watermarks, and zero software installation.
                        </p>
                    </div>
                </section>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="tool-filters">
                        {['All', 'Workflows', 'Organize PDF', 'Optimize PDF', 'Convert to PDF', 'Convert from PDF', 'Security'].map(filter => (
                            <button
                                key={filter}
                                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '20px' }}>
                <AdsPlacement slot="2004166750" format="horizontal" />
            </div>

            <section className="tools-section" id="tools">
                <div className="container">
                    <div className="tools-grid">
                        {toolsToShow.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link to={tool.id === 'edit-pdf' ? '/pdf-editor' : (tool.seoPath || `/tool/${tool.id}`)} className="tool-card" key={tool.id} style={{ position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', borderRadius: '20px' }}>
                                        {tool.id === 'passport-photo' ? (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#f6f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src="/images/passport-grid.jpg" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} alt="Passport Photo Maker" />
                                            </div>
                                        ) : tool.bgImage ? (
                                            <div style={{ width: '100%', height: '100%', backgroundImage: `url(${tool.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }}></div>
                                        ) : null}
                                    </div>
                                    <div style={{ position: 'relative', zIndex: 1, display: tool.id === 'passport-photo' ? 'none' : 'block' }}>
                                        <div className="tool-icon" style={{ backgroundColor: tool.color, color: '#ffffff', position: 'relative' }}>
                                            <Icon size={28} strokeWidth={1.5} />
                                            <div className="icon-arrow-badge" style={{ color: tool.color }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 style={{ textShadow: tool.id === 'passport-photo' ? '0 1px 2px rgba(255,255,255,0.8)' : 'none' }}>{tool.name}</h3>
                                        <p style={{ textShadow: tool.id === 'passport-photo' ? '0 1px 2px rgba(255,255,255,0.8)' : 'none', position: 'relative', zIndex: 2 }}>{tool.desc}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: '800' }}>PDF Tips, Tricks & Tutorials</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            Learn how to optimize your document workflow with our expert guides.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {BLOG_POSTS.slice(0, 3).map(post => (
                            <Link to={`/blog/${post.slug}`} key={post.id} style={{
                                border: '1px solid #f1f5f9',
                                borderRadius: '20px',
                                padding: '30px',
                                background: '#f8fafc',
                                transition: 'all 0.3s'
                            }} className="home-blog-card">
                                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>{post.category}</span>
                                <h3 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: '800', lineHeight: '1.4' }}>{post.title}</h3>
                                <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '20px', lineHeight: '1.6' }}>{post.excerpt.slice(0, 100)}...</p>
                                <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Read Guide <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to="/blog" className="btn-primary">View All Articles</Link>
                    </div>
                </div>
            </section>

            {/* High-Impact SEO Keywords Block for India / General Queries */}
            <section style={{ padding: '80px 0', background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '50px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <h2 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: '900', color: '#0f172a' }}>
                            Fast, Private & Free Online PDF Solutions
                        </h2>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '24px' }}>
                            PDFBazaar is built for professionals, students, and everyday users worldwide who require rapid, reliable document processing without software installations or subscription paywalls. Whether you need to <strong>compress PDF files</strong> for email submission, <strong>merge multiple PDF reports</strong>, or <strong>convert images and Word files</strong> to clean documents, our browser-powered platform delivers instant results.
                        </p>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '32px' }}>
                            Unlike traditional PDF editors that enforce daily quotas or watermark your work, PDFBazaar is 100% free with no account creation required. Enjoy secure, private document utilities directly from Chrome, Safari, Edge, or Firefox on any desktop or mobile device.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontWeight: '800', marginBottom: '10px', color: '#1e293b', fontSize: '16px' }}>No Registration Required</h4>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>Enjoy completely unlimited, free PDF utilities with zero sign-ups, credit card requirements, or hidden tiers.</p>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontWeight: '800', marginBottom: '10px', color: '#1e293b', fontSize: '16px' }}>Strict Document Privacy</h4>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>Files are processed securely in your browser where possible. Server tasks are encrypted via SSL and purged automatically within 60 minutes.</p>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontWeight: '800', marginBottom: '10px', color: '#1e293b', fontSize: '16px' }}>Cross-Platform Compatibility</h4>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>Works seamlessly across Windows, macOS, Linux, iOS, and Android browsers without installing native software.</p>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontWeight: '800', marginBottom: '10px', color: '#1e293b', fontSize: '16px' }}>Photo & ID Utilities</h4>
                                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>Create compliant passport, visa, and exam ID photos with automated cropping and file-size presets in our <Link to="/passport-photo-maker" style={{ color: 'var(--primary)', fontWeight: '600' }}>Passport Photo Maker</Link>.</p>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: '#334155' }}>Popular Solutions:</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {[
                                    { name: 'Compress PDF Online', to: '/compress-pdf-without-losing-quality' },
                                    { name: 'Merge PDF Free', to: '/merge-pdf-online-free' },
                                    { name: 'PDF to Word Converter', to: '/pdf-to-word-converter' },
                                    { name: 'JPG to PDF Converter', to: '/image-to-pdf-converter' },
                                    { name: 'Split PDF Pages', to: '/split-pdf-online-free' },
                                    { name: 'Unlock PDF Password', to: '/unlock-pdf-password-remover' },
                                    { name: 'Passport Photo Maker', to: '/passport-photo-maker' },
                                    { name: 'Add Watermark to PDF', to: '/add-watermark-to-pdf' }
                                ].map(item => (
                                    <Link key={item.name} to={item.to} style={{ padding: '6px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '20px', fontSize: '13px', color: '#475569', textDecoration: 'none', fontWeight: '500' }}>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ margin: '40px auto' }}>
                <AdsPlacement slot="2965247838" format="auto" />
            </div>
        </main>
    );
};

export default Home;
