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
      <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="animate-spin" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #E5322D', borderRadius: '50%', width: '40px', height: '40px' }}></div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pdf-editor" element={<PdfEditor />} />
          <Route path="/tool/edit-pdf" element={<PdfEditor />} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
          
          {/* SEO Optimized Landing Pages */}
          <Route path="/merge-pdf-online-free" element={<ToolPage id="merge-pdf" />} />
          <Route path="/compress-pdf-without-losing-quality" element={<ToolPage id="compress-pdf" />} />
          <Route path="/image-to-pdf-converter" element={<ToolPage id="jpg-to-pdf" />} />
          <Route path="/pdf-to-jpg-converter" element={<ToolPage id="pdf-to-jpg" />} />
          <Route path="/pdf-to-word-converter" element={<ToolPage id="pdf-to-word" />} />
          <Route path="/split-pdf-online-free" element={<ToolPage id="split-pdf" />} />
          <Route path="/unlock-pdf-password-remover" element={<ToolPage id="unlock-pdf" />} />
          <Route path="/protect-pdf-with-password" element={<ToolPage id="protect-pdf" />} />
          <Route path="/edit-pdf-online-free" element={<ToolPage id="edit-pdf" />} />
          <Route path="/rotate-pdf-pages-online" element={<ToolPage id="rotate-pdf" />} />
          <Route path="/add-watermark-to-pdf" element={<ToolPage id="add-watermark" />} />
          <Route path="/ocr-pdf-searchable-text" element={<ToolPage id="ocr-pdf" />} />
          <Route path="/word-to-pdf-converter" element={<ToolPage id="word-to-pdf" />} />
          <Route path="/excel-to-pdf-converter" element={<ToolPage id="excel-to-pdf" />} />
          <Route path="/ppt-to-pdf-converter" element={<ToolPage id="ppt-to-pdf" />} />
          <Route path="/pdf-to-excel-converter" element={<ToolPage id="pdf-to-excel" />} />
          <Route path="/pdf-to-ppt-converter" element={<ToolPage id="pdf-to-ppt" />} />
          <Route path="/delete-pdf-pages-online" element={<ToolPage id="delete-pdf-pages" />} />
          <Route path="/organize-pdf-pages" element={<ToolPage id="organize-pdf" />} />
          <Route path="/crop-pdf-online-free" element={<ToolPage id="crop-pdf" />} />
          <Route path="/resize-pdf-page-size" element={<ToolPage id="resize-pdf" />} />
          <Route path="/add-page-numbers-to-pdf" element={<ToolPage id="add-page-numbers" />} />
          <Route path="/grayscale-pdf-online" element={<ToolPage id="grayscale-pdf" />} />

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
      <Footer />
    </Router>
  );
}

export default App;
