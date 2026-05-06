import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../BlogData';
import { ChevronRight } from 'lucide-react';
import AdsPlacement from '../components/AdsPlacement';
import useSEO from '../hooks/useSEO';

const Blog = () => {
    useSEO({
        title: 'PDF Tips, Tricks & Tutorials | PDFbazaar.com Blog',
        description: 'Read the latest guides and tutorials about PDF merging, compression, password unlocking, and formatting strictly tailored for India.',
        keywords: 'pdf tutorials, how to compress pdf, pdf unlocking guide, pdfbazaar blog'
    });

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Tips, Tricks & Tutorials</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                    Learn how to master your PDFs with our easy guides.
                </p>
            </div>

            <AdsPlacement slot="9711322411" format="auto" style={{ marginBottom: '40px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                {BLOG_POSTS.map(post => (
                    <Link to={`/blog/${post.slug}`} key={post.id} style={{
                        background: 'var(--panel-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s, box-shadow 0.3s'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                        <div style={{ height: '200px', background: post.id.length % 2 === 0 ? 'linear-gradient(135deg, #FFEFBA 0%, #FFFFFF 100%)' : 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--primary)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                                {post.category}
                            </div>
                            <h3 style={{ fontSize: '24px', color: '#333', textAlign: 'center', padding: '0 20px', fontWeight: '900', opacity: 0.8 }}>
                                {post.category}
                            </h3>
                        </div>
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{post.date} • By {post.author}</div>
                            <h2 style={{ fontSize: '20px', marginBottom: '12px', lineHeight: '1.4' }}>{post.title}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', flex: 1 }}>{post.excerpt}</p>
                            <div style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '20px' }}>
                                Read more <ChevronRight size={16} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Blog;
