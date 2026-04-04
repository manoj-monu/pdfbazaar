import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../BlogData';
import { ArrowLeft } from 'lucide-react';
import AdsPlacement from '../components/AdsPlacement';
import useSEO from '../hooks/useSEO';

import { TOOLS_CATEGORIES } from '../ToolsData';

const BlogPost = () => {
    const { blogId } = useParams();
    const post = BLOG_POSTS.find(p => p.slug === blogId);

    // Find related tools based on category or content keywords
    const getRelatedTools = () => {
        const allTools = TOOLS_CATEGORIES.flatMap(cat => cat.tools);
        // Match by category first
        let related = allTools.filter(t => 
            t.name.toLowerCase().includes(post?.category?.toLowerCase() || '') ||
            post?.category?.toLowerCase().includes(t.name.toLowerCase())
        );
        // If not enough, match by title keywords
        if (related.length < 3) {
            const keywords = post?.title.toLowerCase().split(' ') || [];
            const additional = allTools.filter(t => 
                !related.find(r => r.id === t.id) &&
                keywords.some(kw => kw.length > 3 && t.name.toLowerCase().includes(kw))
            );
            related = [...related, ...additional];
        }
        return related.slice(0, 3);
    };

    const relatedTools = post ? getRelatedTools() : [];

    // Custom SEO per article
    useSEO({
        title: post ? `${post.title} | PDFbazaar.com` : 'Article Not Found',
        description: post ? post.excerpt : 'Failed to load article.',
        keywords: post ? `${post.category}, ${post.title.split(' ').slice(0, 3).join(', ')}, pdf india` : '',
        path: post ? `/blog/${post.slug}` : '/blog'
    });

    if (!post) {
        return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Article not found</div>;
    }

    return (
        <div className="container" style={{ maxWidth: '850px', padding: '60px 0', minHeight: '80vh', fontFamily: '"Inter", sans-serif' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '32px', fontWeight: '600', fontSize: '15px' }}>
                <ArrowLeft size={16} /> Back to Blog
            </Link>

            <div style={{ background: 'rgba(229, 50, 45, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: '700', display: 'inline-block', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {post.category}
            </div>

            <h1 style={{ fontSize: '44px', marginBottom: '24px', lineHeight: '1.1', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>{post.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#64748b' }}>
                    {post.author.charAt(0)}
                </div>
                <div>
                    <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>{post.author}</div>
                    <div style={{ fontSize: '14px' }}>Expert Contributor &bull; {post.date}</div>
                </div>
            </div>

            <AdsPlacement slot="9711322411" format="auto" style={{ marginBottom: '40px' }} />

            <div
                className="blog-content"
                style={{ fontSize: '19px', lineHeight: '1.8', color: '#334155' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <AdsPlacement slot="2965247838" format="auto" style={{ marginTop: '60px' }} />

            {/* Related Tools Section */}
            {relatedTools.length > 0 && (
                <div style={{ marginTop: '80px', padding: '48px', background: '#f8fafc', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>Try These Related PDF Tools</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        {relatedTools.map(tool => (
                            <Link to={`/tool/${tool.id}`} key={tool.id} style={{ 
                                background: 'white', 
                                padding: '24px', 
                                borderRadius: '20px', 
                                border: '1px solid #f1f5f9', 
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                transition: 'all 0.3s'
                            }} className="related-tool-card">
                                <div style={{ color: tool.color, marginBottom: '16px' }}>
                                    {<tool.icon size={32} strokeWidth={1.5} />}
                                </div>
                                <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{tool.name}</h4>
                                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>{tool.desc.slice(0, 60)}...</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPost;
