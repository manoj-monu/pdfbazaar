import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../BlogData';
import { ArrowLeft } from 'lucide-react';
import AdsPlacement from '../components/AdsPlacement';
import useSEO from '../hooks/useSEO';

const BlogPost = () => {
    const { blogId } = useParams();
    const post = BLOG_POSTS.find(p => p.slug === blogId);

    // Custom SEO per article
    useSEO({
        title: post ? `${post.title} | PDFbazaar.com` : 'Article Not Found',
        description: post ? post.excerpt : 'Failed to load article.',
        keywords: post ? `${post.category}, ${post.title.split(' ').slice(0, 3).join(', ')}, pdf india` : ''
    });

    if (!post) {
        return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Article not found</div>;
    }

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '60px 0', minHeight: '80vh' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '32px', fontWeight: '500' }}>
                <ArrowLeft size={16} /> Back to Blog
            </Link>

            <div style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block', marginBottom: '16px' }}>
                {post.category}
            </div>

            <h1 style={{ fontSize: '40px', marginBottom: '16px', lineHeight: '1.2' }}>{post.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-color)' }}></div>
                <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{post.author}</div>
                    <div style={{ fontSize: '14px' }}>Published on {post.date}</div>
                </div>
            </div>

            <AdsPlacement slot="9711322411" format="auto" style={{ marginBottom: '32px' }} />

            <div
                className="blog-content"
                style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-primary)' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <AdsPlacement slot="2965247838" format="auto" style={{ marginTop: '60px' }} />
        </div>
    );
};

export default BlogPost;
