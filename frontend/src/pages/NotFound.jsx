import React from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

const NotFound = () => {
    useSEO({
        title: '404 - Page Not Found | PDFBazaar',
        description: 'The page you requested could not be found. Explore our 100% free online PDF tools.',
        path: '/404'
    });

    return (
        <div style={{
            minHeight: 'calc(100vh - 160px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: '#f8fafc',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '560px',
                width: '100%',
                background: '#ffffff',
                padding: '48px 32px',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}>
                <div style={{
                    fontSize: '84px',
                    fontWeight: '900',
                    lineHeight: 1,
                    color: 'var(--primary, #1321d4)',
                    marginBottom: '16px'
                }}>
                    404
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                    Page Not Found
                </h1>
                <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px' }}>
                    The page you are looking for does not exist, has been removed, or the link is invalid.
                </p>
                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 28px',
                        background: '#1321d4',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '15px',
                        borderRadius: '10px',
                        textDecoration: 'none'
                    }}
                >
                    Return to All PDF Tools
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
