import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS_CATEGORIES } from '../ToolsData';
import { BLOG_POSTS } from '../BlogData';
import useSEO from '../hooks/useSEO';
import AdsPlacement from '../components/AdsPlacement';

const Home = () => {
    useSEO({
        title: 'PDFbazaar.com - All-in-One Free PDF Tools in India',
        description: 'Compress, Merge, Split, Convert PDF to Word, and extract pages online completely free. Best iLovePDF alternative for super fast PDF tasks.',
        keywords: 'pdf merge, compress pdf online, pdf to word, jpg to pdf, edit pdf free india, unlock aadhar pdf'
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
                        <h1>Compress PDF Under 100KB, Merge & Edit (Free & No Login)</h1>
                        <p>
                            Professional PDF tools for Indian users. Reduce file size instantly, combine documents, 
                            and convert images to PDF in seconds. No registration, no credit card—just fast results.
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
                                <Link to={tool.id === 'edit-pdf' ? '/pdf-editor' : (tool.seoPath || `/tool/${tool.id}`)} className="tool-card" key={tool.id}>
                                    <div className="tool-icon" style={{ backgroundColor: tool.color, color: '#ffffff', position: 'relative' }}>
                                        <Icon size={28} strokeWidth={1.5} />
                                        <div className="icon-arrow-badge" style={{ color: tool.color }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <h3>{tool.name}</h3>
                                    <p>{tool.desc}</p>
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
                            India's Best Free PDF Tools Online (2024)
                        </h2>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '24px' }}>
                            Whether you need to know <strong>"pdf size kam kaise kare"</strong> for a government SSC form, or you are searching for <strong>"pdf compress karna hai free mein"</strong>, PDFBazaar is your ultimate solution. We designed this platform specifically for users who need <strong>free pdf tools without watermark</strong>. You can effortlessly combine files (<strong>pdf kaise combine kare</strong>) or convert photos to documents (<strong>mobile mein pdf kaise banaye</strong>) without any daily limits or login screens. 
                        </p>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '32px' }}>
                            If you've ever wondered <strong>"free mein pdf kaise banaye"</strong> or searched for <strong>"pdf tools hindi mein"</strong> to understand document editing, our site offers the most intuitive, mobile-friendly interface for everything. Say goodbye to heavy apps and try the <strong>best free pdf tools online</strong> directly from your Chrome or mobile browser.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ fontWeight: '800', marginBottom: '10px', color: '#1e293b' }}>No Registration Required</h4>
                                <p style={{ fontSize: '14px', color: '#64748b' }}>Our <strong>pdf tools online free no limit</strong> policy ensures you never have to enter your email. Enjoy truly <strong>all in one pdf tools free</strong>.</p>
                            </div>
                            <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px' }}>
                                <h4 style={{ fontWeight: '800', marginBottom: '10px', color: '#1e293b' }}>Absolute Privacy</h4>
                                <p style={{ fontSize: '14px', color: '#64748b' }}>We auto-delete files immediately. If you need <strong>secure pdf tools online</strong> or to <strong>pdf se text copy kaise kare</strong> securely, you are in the right place.</p>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#334155' }}>Popular Queries Addressed:</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {['pdf merge kaise kare', 'free pdf tools india', 'pdf online kaise edit kare free', 'smallpdf alternative free', 'pdf rotate kaise kare free', 'pdf compress tool india free', 'pdf me password kaise lagaye free'].map(kw => (
                                    <span key={kw} style={{ padding: '4px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '20px', fontSize: '12px', color: '#64748b' }}>
                                        {kw}
                                    </span>
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
