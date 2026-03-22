import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS_CATEGORIES } from '../ToolsData';
import useSEO from '../hooks/useSEO';
import AdsPlacement from '../components/AdsPlacement';

const Home = () => {
    useSEO({
        title: 'PDFbazaar.com - All-in-One Free PDF Tools in India',
        description: 'Compress, Merge, Split, Convert PDF to Word, and extract pages online completely free. Best iLovePDF alternative for super fast PDF tasks.',
        keywords: 'pdf merge, compress pdf online, pdf to word, jpg to pdf, edit pdf free india, unlock aadhar pdf'
    });

    const [activeFilter, setActiveFilter] = useState('All');

    // Flatten all tools into a single list for 'All'
    const allTools = TOOLS_CATEGORIES.reduce((acc, cat) => [...acc, ...cat.tools], []);

    // Tools to show based on filter
    let toolsToShow = [];
    if (activeFilter === 'All') {
        toolsToShow = allTools;
    } else {
        const matchingCategory = TOOLS_CATEGORIES.find(cat => cat.title.includes(activeFilter));
        if (matchingCategory) {
            toolsToShow = matchingCategory.tools;
        } else {
            // Mapping Workflows, PDF Intelligence as empty or subsets for demonstration
            toolsToShow = allTools.slice(0, 4);
        }
    }

    return (
        <main>
            <div className="hero-wrapper">
                <section className="hero">
                    <div className="container">
                        <h1>All the PDF tools you'll ever need, powered by PDFbazaar.com</h1>
                        <p>
                            Manage your documents effortlessly with our 100% free, secure, and intuitive platform. Merge,
                            split, compress, edit, and convert PDFs online in seconds—no installation required. Experience the power of PDFbazaar.com today!
                        </p>
                    </div>
                </section>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="tool-filters">
                        {['All', 'Workflows', 'Organize PDF', 'Optimize PDF', 'Convert to PDF', 'Convert from PDF', 'Security'].map(filter => (
                            <button
                                key={filter}
                                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ad Unit: Top Responsive */}
            <div className="container" style={{ marginTop: '20px' }}>
                <AdsPlacement slot="2004166750" format="horizontal" />
            </div>

            <section className="tools-section" id="tools">
                <div className="container">
                    <div className="tools-grid">
                        {toolsToShow.map((tool) => {
                            const Icon = tool.icon;
                            // Add a little arrow to the bottom right of the icon box to make it more like iLovePDF
                            return (
                                <Link to={tool.id === 'edit-pdf' ? '/pdf-editor' : `/tool/${tool.id}`} className="tool-card" key={tool.id}>
                                    <div className="tool-icon" style={{ backgroundColor: tool.color, color: '#ffffff', position: 'relative' }}>
                                        <Icon size={28} strokeWidth={1.5} />
                                        <div className="icon-arrow-badge" style={{ color: tool.color }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <h3>{tool.name}</h3>
                                    <p>{tool.desc}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Ad Unit: Bottom Responsive */}
            <div className="container" style={{ margin: '40px auto' }}>
                <AdsPlacement slot="2965247838" format="auto" />
            </div>
        </main>
    );
};

export default Home;
