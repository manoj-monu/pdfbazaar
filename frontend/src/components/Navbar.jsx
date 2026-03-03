import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
                    <img src="/pdf-icon.png" alt="PDF icon" width="72" height="72" style={{ height: '72px', width: '72px', objectFit: 'contain' }} />
                    <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: '900', fontSize: '36px', color: '#cc1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>
                        Bazaar.com
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
