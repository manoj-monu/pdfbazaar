import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart, FileText } from 'lucide-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: '#1321d4', 
                        borderRadius: '10px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(19, 33, 212, 0.3)'
                    }}>
                        <FileText size={24} color="white" />
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '800', fontSize: '28px', color: '#1321d4', letterSpacing: '-1.2px', lineHeight: 1 }}>
                        PDFbazaar<span style={{ color: '#1321d4' }}>.com</span>
                    </span>
                </Link>

                <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <Link to="/merge-pdf-online-free" className="nav-link">Merge PDF</Link>
                    <Link to="/split-pdf-online-free" className="nav-link">Split PDF</Link>
                    <Link to="/compress-pdf-without-losing-quality" className="nav-link">Compress PDF</Link>
                    <Link to="/#tools" className="nav-link">Convert PDF</Link>
                    <Link to="/#tools" className="nav-link">All PDF Tools</Link>
                </div>

                <div className="nav-actions">
                    <Link
                        to="/login"
                        className="btn-login desktop-only"
                    >
                        Login
                    </Link>
                    <Link to="/signup" className="btn-signup">
                        Sign up
                    </Link>

                    <button
                        className="btn-icon menu-btn mobile-only"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ background: 'transparent' }}
                    >
                        {menuOpen ? <X size={28} color="#333" /> : <Menu size={28} color="#333" />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
