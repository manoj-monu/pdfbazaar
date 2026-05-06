import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Instagram, Linkedin, Zap, Lock, RefreshCw } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer" style={{ borderTop: '2px solid #f1f5f9', paddingTop: '80px', backgroundColor: '#fff' }}>
            <div className="container">
                <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
                    <div className="footer-col" style={{ gridColumn: 'span 2' }}>
                        <Link to="/" className="nav-brand" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <img src="/pdf-icon.png" alt="PDFbazaar Logo" style={{ height: '54px', width: '54px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '900', fontSize: '32px', color: '#1321d4', letterSpacing: '-1.5px', lineHeight: 1 }}>
                                PDFbazaar<span style={{ color: '#1321d4' }}>.com</span>
                            </span>
                        </Link>
                        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px', lineHeight: '1.7', maxWidth: '350px' }}>
                            PDFbazaar is India's most trusted all-in-one PDF platform. 100% Free, Secure, and designed for speed. Managed files are auto-deleted after 1 hour.
                        </p>
                        <div className="social-links" style={{ display: 'flex', gap: '12px' }}>
                            <a href="#" className="social-btn"><Twitter size={18} /></a>
                            <a href="#" className="social-btn"><Facebook size={18} /></a>
                            <a href="#" className="social-btn"><Instagram size={18} /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Popular Tools</h4>
                        <ul className="footer-links">
                            <li><Link to="/merge-pdf-online-free/">Merge PDF</Link></li>
                            <li><Link to="/split-pdf-online-free/">Split PDF</Link></li>
                            <li><Link to="/compress-pdf-without-losing-quality/">Compress PDF</Link></li>
                            <li><Link to="/pdf-to-word-converter/">PDF to Word</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>CONVERSIONS</h4>
                        <ul className="footer-links">
                            <li><Link to="/word-to-pdf-converter/">Word to PDF</Link></li>
                            <li><Link to="/image-to-pdf-converter/">JPG to PDF</Link></li>
                            <li><Link to="/excel-to-pdf-converter/">Excel to PDF</Link></li>
                            <li><Link to="/ppt-to-pdf-converter/">PPT to PDF</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>SECURITY</h4>
                        <ul className="footer-links">
                            <li><Link to="/protect-pdf-with-password/">Protect PDF</Link></li>
                            <li><Link to="/unlock-pdf-password-remover/">Unlock PDF</Link></li>
                            <li><Link to="/add-watermark-to-pdf/">Add Watermark</Link></li>
                            <li><Link to="/blog/">SEO Blog</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', fontSize: '13px', color: '#94a3b8' }}>
                        <Link to="/privacy-policy" style={{ color: 'inherit' }}>Privacy Policy</Link>
                        <Link to="/terms-conditions" style={{ color: 'inherit' }}>Terms of Service</Link>
                        <Link to="/disclaimer" style={{ color: 'inherit' }}>Disclaimer</Link>
                    </div>
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                        &copy; {new Date().getFullYear()} PDFbazaar.com - Proudly made for Digital India.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
