
import React from 'react';
import { useParams } from 'react-router-dom';
import { PROGRAMMATIC_PAGES } from '../ProgrammaticSEO';
import ToolPage from './ToolPage';
import useSEO from '../hooks/useSEO';
import { Shield, Zap, Globe, ChevronRight } from 'lucide-react';

const ProgrammaticToolPage = () => {
    const { slug } = useParams();
    const pageData = PROGRAMMATIC_PAGES.find(p => p.slug === slug);

    if (!pageData) {
        return <div style={{ padding: '100px 0', textAlign: 'center' }}>Page not found</div>;
    }

    // Custom SEO Hook Call
    useSEO({
        title: pageData.title,
        description: pageData.description,
        path: `/s/${slug}`,
        schema: {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: pageData.faq.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
        }
    });

    return (
        <div>
            {/* Render the Tool itself */}
            <ToolPage id={pageData.toolId} hideSEO={true} />

            {/* Custom SEO Content for this specific long-tail keyword */}
            <div className="container" style={{ maxWidth: '1000px', margin: '60px auto' }}>
                <article style={{
                    padding: '60px 40px',
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.02)',
                    lineHeight: '1.8',
                    color: '#334155',
                    fontFamily: '"Inter", sans-serif'
                }}>
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
                            Quick Solution
                        </div>
                        <h1 style={{ fontSize: '38px', color: '#0f172a', marginBottom: '20px', fontWeight: '900', lineHeight: '1.1' }}>
                            {pageData.h1}
                        </h1>
                        <div style={{ width: '100px', height: '4px', background: 'linear-gradient(90deg, #E5322D, #FF6B6B)', margin: '0 auto', borderRadius: '2px' }}></div>
                    </header>

                    <div style={{ fontSize: '18px', marginBottom: '40px', color: '#475569' }} dangerouslySetInnerHTML={{ __html: pageData.content }} />

                    {/* Feature Highlights */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                        <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ color: '#3b82f6', marginBottom: '16px' }}><Zap size={24} /></div>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Optimized Output</h4>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Our engine produces high-quality files that meet all official guidelines for online uploads.</p>
                        </div>
                        <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ color: '#10b981', marginBottom: '16px' }}><Shield size={24} /></div>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Safe & Secure</h4>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>We never store your files. All processing is done under high security with auto-deletion.</p>
                        </div>
                        <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <div style={{ color: '#8b5cf6', marginBottom: '16px' }}><Globe size={24} /></div>
                            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Universal Access</h4>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Works on all devices including mobile phones, tablets, and desktop computers.</p>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <section style={{ marginBottom: '60px' }}>
                        <h3 style={{ fontSize: '30px', color: '#0f172a', marginBottom: '32px', fontWeight: '900', textAlign: 'center' }}>
                            Frequently Asked Questions
                        </h3>
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {pageData.faq.map((faq, idx) => (
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

                    {/* Internal Linking - Link to other related programmatic pages */}
                    <section style={{ borderTop: '2px solid #f1f5f9', paddingTop: '60px' }}>
                        <h3 style={{ fontSize: '26px', color: '#0f172a', marginBottom: '32px', fontWeight: '900' }}>
                            Explore Other PDF Solutions
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {PROGRAMMATIC_PAGES.filter(p => p.slug !== slug).slice(0, 6).map(p => (
                                <a href={`/s/${p.slug}`} key={p.slug} style={{
                                    display: 'block',
                                    padding: '20px',
                                    background: '#f8fafc',
                                    borderRadius: '16px',
                                    border: '1px solid #f1f5f9',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s'
                                }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{p.h1}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#E5322D' }}>
                                        Open Tool <ChevronRight size={14} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                </article>
            </div>
        </div>
    );
};

export default ProgrammaticToolPage;
