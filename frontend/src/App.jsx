import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AdsPlacement from './components/AdsPlacement';

const Home = lazy(() => import('./pages/Home'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const PdfEditor = lazy(() => import('./pages/PdfEditor'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Pricing = lazy(() => import('./pages/Pricing'));
const LegalPages = lazy(() => import('./pages/LegalPages'));

const { AboutUs, ContactUs, PrivacyPolicy, TermsConditions, Disclaimer } = LegalPages;

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
      <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="animate-spin" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #E5322D', borderRadius: '50%', width: '40px', height: '40px' }}></div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pdf-editor" element={<PdfEditor />} />
          <Route path="/tool/edit-pdf" element={<PdfEditor />} />
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
      </Suspense>
      {/* Footer Ad - Policy compliant: clear separation from content and footer */}
      <AdsPlacement slot="2965247838" format="auto" style={{ margin: '32px 0 0 0' }} />
      <Footer />
    </Router>
  );
}

export default App;
