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
      <AdsPlacement type="leaderboard" />
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
      <Footer />
    </Router>
  );
}

export default App;
