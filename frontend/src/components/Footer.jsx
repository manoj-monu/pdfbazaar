import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col" style={{ gridColumn: 'span 2' }}>
                        <Link to="/" className="nav-brand" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <img src="/pdf-icon.png" alt="PDFbazaar Logo" style={{ height: '50px', width: '50px', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '800', fontSize: '28px', color: '#1321d4', letterSpacing: '-1.2px', lineHeight: 1 }}>
                                PDFbazaar<span style={{ color: '#1321d4' }}>.com</span>
                            </span>
                        </Link>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
                        </p>
                        <div className="social-links" style={{ display: 'flex', gap: '16px' }}>
                            <a href="#" className="btn-icon"><Twitter size={20} /></a>
                            <a href="#" className="btn-icon"><Facebook size={20} /></a>
                            <a href="#" className="btn-icon"><Instagram size={20} /></a>
                            <a href="#" className="btn-icon"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>COMPANY</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/pricing">Pricing</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>LEGAL</h4>
                        <ul className="footer-links">
                            <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/disclaimer">Disclaimer</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>RESOURCES</h4>
                        <ul className="footer-links">
                            <li><Link to="/blog">Blog & Articles</Link></li>
                            <li><Link to="/api">API Reference</Link></li>
                            <li><Link to="/help">Help Center</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} PDFbazaar.com. All rights reserved. Not affiliated with iLovePDF.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
