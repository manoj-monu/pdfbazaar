import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <img src="/pdf-icon.png" alt="PDFbazaar Logo" style={{ height: '40px', width: '40px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: '800', fontSize: '28px', color: '#1321d4', letterSpacing: '-1.2px', lineHeight: 1 }}>
                        PDFbazaar<span style={{ color: '#1321d4' }}>.com</span>
                    </span>
                </Link>

                <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <Link to="/tool/merge-pdf" className="nav-link">Merge PDF</Link>
                    <Link to="/tool/split-pdf" className="nav-link">Split PDF</Link>
                    <Link to="/tool/compress-pdf" className="nav-link">Compress PDF</Link>
                    <Link to="/#tools" className="nav-link">Convert PDF</Link>
                    <Link to="/#tools" className="nav-link">All PDF Tools</Link>
                </div>

                <div className="nav-actions">
                    <Link
                        to="/login"
                        className="btn-login"
                        style={{ display: window.innerWidth > 768 ? 'inline-flex' : 'none' }}
                    >
                        Login
                    </Link>
                    <Link to="/signup" className="btn-signup">
                        Sign up
                    </Link>

                    <button
                        className="btn-icon menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ display: window.innerWidth <= 768 ? 'inline-flex' : 'none', background: 'transparent' }}
                    >
                        {menuOpen ? <X size={28} color="#333" /> : <Menu size={28} color="#333" />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
