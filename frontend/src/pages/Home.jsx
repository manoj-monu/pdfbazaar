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

            <div className="container" style={{ margin: '40px auto' }}>
                <AdsPlacement slot="2965247838" format="auto" />
            </div>
        </main>
    );
};

export default Home;
