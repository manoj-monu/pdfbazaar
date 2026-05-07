import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setTimeout(() => setVisible(true), 2000);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            maxWidth: '500px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'slideUp 0.5s ease-out'
        }}>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                    onClick={accept}
                    style={{
                        padding: '8px 20px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    Accept
                </button>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @media (min-width: 768px) {
                    bottom: 30px;
                    left: 30px;
                    right: auto;
                }
            `}</style>
        </div>
    );
};

export default CookieConsent;
