import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb } from 'pdf-lib';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { UploadCloud, FileText, ArrowRight, Loader2, Type, Image as ImageIcon, Download, Trash2, Edit3, X, CheckCircle } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const EditPdfTool = () => {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [resultBlob, setResultBlob] = useState(null);
    const [texts, setTexts] = useState({}); // { pageNum: [ { id, text, x, y, size } ] }
    const [mode, setMode] = useState('view'); // view, text
    const [activeTextId, setActiveTextId] = useState(null);

    const containerRef = useRef();

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const handlePageClick = (e, pageIndex) => {
        if (mode === 'text') {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newText = {
                id: Date.now().toString(),
                text: 'New Text',
                x,
                y,
                size: 16
            };

            setTexts(prev => ({
                ...prev,
                [pageIndex]: [...(prev[pageIndex] || []), newText]
            }));
            setMode('view'); // reset mode after placing
            setActiveTextId(newText.id);
        }
    };

    const downloadPdf = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            for (let i = 0; i < pages.length; i++) {
                const pageTexts = texts[i + 1] || [];
                const page = pages[i];
                const { width, height } = page.getSize();

                // We'll need a roughly equivalent font
                pageTexts.forEach(t => {
                    // coordinate mapping: pdf-lib uses bottom-left as (0,0)
                    // react-pdf uses top-left as (0,0). So y_pdf = height - y_react_pdf
                    page.drawText(t.text, {
                        x: t.x,
                        y: height - t.y - t.size, // adjust for baseline
                        size: t.size,
                        color: rgb(0, 0, 0)
                    });
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            setResultBlob(blob);
        } catch (error) {
            console.error('Failed to edit PDF', error);
        }
        setLoading(false);
    };

    const handleTextChange = (pageIndex, textId, newText) => {
        setTexts(prev => ({
            ...prev,
            [pageIndex]: prev[pageIndex].map(t => t.id === textId ? { ...t, text: newText } : t)
        }));
    };

    const handleTextDelete = (pageIndex, textId) => {
        setTexts(prev => ({
            ...prev,
            [pageIndex]: prev[pageIndex].filter(t => t.id !== textId)
        }));
    };

    const triggerDownload = () => {
        if (!resultBlob) return;
        const url = URL.createObjectURL(resultBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited_${file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (resultBlob) {
        return (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <CheckCircle size={64} color="#4CAF50" style={{ margin: '0 auto 20px' }} />
                <h1>PDF Edited Successfully!</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Your PDF has been modified and is ready to download.</p>
                <button className="btn btn-primary" onClick={triggerDownload} style={{ padding: '16px 32px', fontSize: '18px' }}>
                    <Download size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Download PDF
                </button>
                <div style={{ marginTop: '20px' }}>
                    <button className="btn" onClick={() => { setResultBlob(null); setTexts({}); setFile(null); }}>
                        Edit Another File
                    </button>
                </div>
            </div>
        );
    }

    if (!file) {
        return (
            <div className="container" style={{ padding: '40px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1>Edit PDF</h1>
                    <p>Add text, annotations, and more to your PDF document instantly in your browser.</p>
                </div>
                <div {...getRootProps()} className={`upload-area ${isDragActive ? 'active' : ''}`} style={{ maxWidth: '600px', margin: '0 auto', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <input {...getInputProps()} />
                    <UploadCloud size={64} color="var(--primary-color)" style={{ marginBottom: '20px' }} />
                    <h3>Select PDF file</h3>
                    <p>or drop PDF here</p>
                    <button className="btn btn-primary" style={{ marginTop: '20px' }}>Select File</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f5f5' }}>
            {/* Top Toolbar */}
            <div style={{ height: '60px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <strong style={{ fontSize: '18px' }}>Edit PDF</strong>
                    <span style={{ color: '#666', fontSize: '14px' }}>{file.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setMode('view')}
                        style={{ padding: '8px 16px', background: mode === 'view' ? '#e0e0e0' : 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Edit3 size={16} /> View/Select
                    </button>
                    <button
                        onClick={() => setMode('text')}
                        style={{ padding: '8px 16px', background: mode === 'text' ? '#e0e0e0' : 'transparent', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Type size={16} /> Add Text
                    </button>
                </div>
                <div>
                    <button className="btn btn-primary" onClick={downloadPdf} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        Save & Download
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left Sidebar (Thumbnails) */}
                <div style={{ width: '200px', background: '#fff', borderRight: '1px solid #ddd', overflowY: 'auto', padding: '10px' }}>
                    <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                        {Array.from(new Array(numPages || 0), (el, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                style={{ marginBottom: '10px', cursor: 'pointer', border: currentPage === index + 1 ? '2px solid #E5322D' : '1px solid #ccc', padding: '2px' }}
                            >
                                <Page pageNumber={index + 1} width={160} renderTextLayer={false} renderAnnotationLayer={false} />
                                <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px', color: '#555' }}>Page {index + 1}</div>
                            </div>
                        ))}
                    </Document>
                </div>

                {/* Center Canvas */}
                <div ref={containerRef} style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '40px', background: '#e0e0e0' }}>
                    <div style={{ position: 'relative', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <Document file={file}>
                            <div
                                onClick={(e) => handlePageClick(e, currentPage)}
                                style={{ cursor: mode === 'text' ? 'text' : 'default', position: 'relative' }}
                            >
                                <Page pageNumber={currentPage}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false} />

                                {/* Overlay for texts on this page */}
                                {(texts[currentPage] || []).map(t => (
                                    <div key={t.id} style={{
                                        position: 'absolute',
                                        left: t.x,
                                        top: t.y,
                                        border: activeTextId === t.id ? '1px dashed #E5322D' : '1px solid transparent',
                                        padding: '2px',
                                        transform: 'translate(-5px, -5px)',
                                        zIndex: 20
                                    }}
                                        onClick={(e) => { e.stopPropagation(); setActiveTextId(t.id); }}
                                    >
                                        <input
                                            type="text"
                                            value={t.text}
                                            onChange={(e) => handleTextChange(currentPage, t.id, e.target.value)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: `${t.size}px`,
                                                fontFamily: 'Helvetica', // Default pdf-lib font
                                                color: 'black',
                                                minWidth: '100px',
                                                cursor: mode === 'view' ? 'text' : 'default'
                                            }}
                                            autoFocus={activeTextId === t.id}
                                        />
                                        {activeTextId === t.id && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleTextDelete(currentPage, t.id); }}
                                                style={{ position: 'absolute', right: '-20px', top: '-10px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Document>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPdfTool;
