import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Pricing from './pages/Pricing';
import { AboutUs, ContactUs, PrivacyPolicy, TermsConditions, Disclaimer } from './pages/LegalPages';
import ScrollToTop from './components/ScrollToTop';
import AdsPlacement from './components/AdsPlacement';

function App() {
  useEffect(() => {
    document.body.classList.remove('dark');
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      {/* Header Ad - Only shown on non-tool pages to avoid nav proximity policy issues */}
      <AdsPlacement slot="2004166750" format="auto" style={{ margin: '0 0 8px 0' }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tool/:toolId" element={<ToolPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:blogId" element={<BlogPost />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
      {/* Footer Ad - Policy compliant: clear separation from content and footer */}
      <AdsPlacement slot="2965247838" format="auto" style={{ margin: '32px 0 0 0' }} />
      <Footer />
    </Router>
  );
}

export default App;
