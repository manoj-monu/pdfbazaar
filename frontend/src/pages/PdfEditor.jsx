import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { UploadCloud, FileText, ArrowRight, Loader2, Type, Image as ImageIcon, Download, Trash2, Edit3, X, CheckCircle, RotateCw, Settings, Shield } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PdfEditor = () => {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [resultBlob, setResultBlob] = useState(null);
    const [texts, setTexts] = useState({}); // { pageNum: [ { id, text, x, y, size } ] }
    const [edits, setEdits] = useState({}); // { pageNum: [{ id, text, x, y, width, height, size, spanElement }] }
    const [mode, setMode] = useState('view'); // view, text, edit-text, draw, highlight
    const [activeTextId, setActiveTextId] = useState(null);
    const [drawings, setDrawings] = useState({}); // { pageNum: [ { type: 'draw' | 'highlight', points: [{x,y}] } ] }
    const [currentPath, setCurrentPath] = useState(null);
    const [dragStart, setDragStart] = useState(null);
    const [dragCurrent, setDragCurrent] = useState(null);
    const [deletedPages, setDeletedPages] = useState(new Set());
    const [rotatedPages, setRotatedPages] = useState({}); // { pageNum: angle }
    const [password, setPassword] = useState('');

    const containerRef = useRef();
    const pageRef = useRef(); // ref to the pdf-page-container for accurate coordinate calc

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            if (acceptedFiles[0].size > 25 * 1024 * 1024) {
                alert("File size exceeds 25MB limit.");
                return;
            }
            setFile(acceptedFiles[0]);
            setDeletedPages(new Set());
            setRotatedPages({});
            setTexts({});
            setEdits({});
            setResultBlob(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false,
        maxSize: 25 * 1024 * 1024
    });

    const handlePointerDown = (e, pageIndex) => {
        // Always use pageRef for accurate coordinates relative to the page container
        if (!pageRef.current) return;
        const rect = pageRef.current.getBoundingClientRect();

        if (mode === 'text') {
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
            setMode('view');
            setActiveTextId(newText.id);
        } else if (mode === 'edit-text') {
            // Find span - target itself or nearest span ancestor
            const span = (e.target.tagName.toLowerCase() === 'span')
                ? e.target
                : e.target.closest('span');

            if (span && span.closest('.textLayer, .react-pdf__Page__textContent')) {
                e.preventDefault(); // prevent default browser selection behavior
                const compStyle = window.getComputedStyle(span);
                const spanRect = span.getBoundingClientRect();
                const pageRect = pageRef.current.getBoundingClientRect();
                const size = parseFloat(compStyle.fontSize) || 12;
                const editId = Date.now().toString();

                // ✅ FIX: Copy span's INLINE left/top styles directly
                // PDF.js v4 uses left/top properties for position, not transform translation
                const input = document.createElement('input');
                input.type = 'text';
                input.value = span.textContent.trim();

                const spanLeft = span.style.left || '0px';
                const spanTop = span.style.top || '0px';
                const spanTransform = span.style.transform || ''; // scaleX only, not position
                const spanTransformOrigin = span.style.transformOrigin || '0% 0%';

                Object.assign(input.style, {
                    position: 'absolute',
                    left: spanLeft,
                    top: spanTop,
                    transform: spanTransform,
                    transformOrigin: spanTransformOrigin,
                    width: Math.max(span.offsetWidth || spanRect.width, 80) + 'px',
                    height: Math.max(span.offsetHeight || spanRect.height, size * 1.4) + 'px',
                    fontSize: compStyle.fontSize,
                    fontFamily: compStyle.fontFamily,
                    border: '1.5px dashed #E5322D',
                    background: 'rgba(255,255,255,0.98)',
                    outline: 'none',
                    zIndex: '200',
                    padding: '0',
                    margin: '0',
                    boxSizing: 'border-box',
                    color: '#000',
                    whiteSpace: 'pre',
                    minWidth: '60px',
                });

                span.style.visibility = 'hidden';
                span.parentNode.appendChild(input);

                // Use setTimeout to ensure DOM is ready before focusing
                setTimeout(() => { input.focus(); input.select(); }, 10);

                const editData = {
                    id: editId,
                    text: span.textContent.trim(),
                    x: spanRect.left - pageRect.left,
                    y: spanRect.top - pageRect.top,
                    width: spanRect.width,
                    height: spanRect.height,
                    size
                };

                setEdits(prev => ({ ...prev, [pageIndex]: [...(prev[pageIndex] || []), editData] }));
                setActiveTextId(editId);

                input.addEventListener('input', (evt) => {
                    setEdits(prev => ({
                        ...prev,
                        [pageIndex]: (prev[pageIndex] || []).map(ed =>
                            ed.id === editId ? { ...ed, text: evt.target.value } : ed
                        )
                    }));
                });

                input.addEventListener('blur', () => {
                    span.textContent = input.value;
                    span.style.visibility = 'visible';
                    input.remove();
                    setActiveTextId(null);
                });

                return;
            } else {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setDragStart({ x, y });
                setDragCurrent({ x, y });
            }
        } else if (mode === 'draw' || mode === 'highlight') {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setCurrentPath({ type: mode, points: [{ x, y }] });
        }
    };

    const handlePointerMove = (e) => {
        if (!pageRef.current) return;
        const rect = pageRef.current.getBoundingClientRect();
        if (dragStart && mode === 'edit-text') {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setDragCurrent({ x, y });
            return;
        }

        if (!currentPath) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentPath(prev => ({ ...prev, points: [...prev.points, { x, y }] }));
    };

    const handlePointerUp = (pageIndex) => {
        if (dragStart && mode === 'edit-text') {
            if (dragCurrent) {
                const width = Math.abs(dragCurrent.x - dragStart.x);
                const height = Math.abs(dragCurrent.y - dragStart.y);
                const x = Math.min(dragStart.x, dragCurrent.x);
                const y = Math.min(dragStart.y, dragCurrent.y);

                if (width > 5 && height > 5) {
                    const newEdit = {
                        id: Date.now().toString(),
                        text: '',
                        x,
                        y,
                        width,
                        height,
                        size: Math.max(10, height * 0.7) // approximate font size
                    };

                    setEdits(prev => ({
                        ...prev,
                        [pageIndex]: [...(prev[pageIndex] || []), newEdit]
                    }));
                    setActiveTextId(newEdit.id);
                }
            }
            setDragStart(null);
            setDragCurrent(null);
            return;
        }

        if (!currentPath) return;
        setDrawings(prev => ({
            ...prev,
            [pageIndex]: [...(prev[pageIndex] || []), currentPath]
        }));
        setCurrentPath(null);
    };

    const processWithBackend = async (action, additionalData) => {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('toolId', 'pdf-editor');
        formData.append('action', action);
        if (additionalData) {
            formData.append('options', JSON.stringify(additionalData));
        }

        const res = await fetch(`${BACKEND_URL}/api/process/pdf-editor`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error('Backend processing failed');
        return await res.json(); // { token, filename, size }
    };

    const downloadPdf = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            let pagesToRemove = Array.from(deletedPages).sort((a, b) => b - a);
            pagesToRemove.forEach(index => {
                if (pdfDoc.getPageCount() > 1 && index >= 0 && index < pdfDoc.getPageCount()) {
                    pdfDoc.removePage(index);
                }
            });

            // apply rotation
            Object.entries(rotatedPages).forEach(([pageIndex, angle]) => {
                const i = parseInt(pageIndex) - 1;
                if (!deletedPages.has(i) && pages[i]) {
                    pages[i].setRotation(degrees(angle));
                }
            });

            // draw texts & drawings
            for (let i = 0; i < pages.length; i++) {
                const pageTexts = texts[i + 1] || [];
                const pageEdits = edits[i + 1] || [];
                const pageDrawings = drawings[i + 1] || [];
                const page = pages[i];
                if (page && !deletedPages.has(i)) {
                    const { width, height } = page.getSize();

                    pageEdits.forEach(e => {
                        // draw whiteout rectangle
                        page.drawRectangle({
                            x: e.x,
                            y: height - e.y - e.height,
                            width: e.width,
                            height: e.height,
                            color: rgb(1, 1, 1),
                        });
                        // draw new text
                        page.drawText(e.text, {
                            x: e.x,
                            y: height - e.y - e.size,
                            size: e.size,
                            color: rgb(0, 0, 0)
                        });
                    });

                    pageTexts.forEach(t => {
                        page.drawText(t.text, {
                            x: t.x,
                            y: height - t.y - t.size,
                            size: t.size,
                            color: rgb(0, 0, 0)
                        });
                    });

                    pageDrawings.forEach(d => {
                        if (d.points.length < 2) return;
                        const isHighlight = d.type === 'highlight';
                        const color = isHighlight ? rgb(1, 1, 0) : rgb(0.898, 0.196, 0.176); // Yellow or Red
                        const opacity = isHighlight ? 0.3 : 1;
                        const thickness = isHighlight ? 16 : 3;

                        // Create svg path
                        const start = d.points[0];
                        let svgPath = `M ${start.x} ${height - start.y}`;
                        for (let j = 1; j < d.points.length; j++) {
                            svgPath += ` L ${d.points[j].x} ${height - d.points[j].y}`;
                        }

                        page.drawSvgPath(svgPath, {
                            borderColor: color,
                            borderWidth: thickness,
                            borderOpacity: opacity
                        });
                    });
                }
            }

            if (password) {
                pdfDoc.encrypt({
                    userPassword: password,
                    ownerPassword: password,
                    permissions: {
                        printing: 'highResolution',
                        modifying: false,
                        copying: false,
                    }
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            setResultBlob(blob);
        } catch (error) {
            console.error('Failed to edit PDF frontend', error);
            alert('Failed to edit PDF locally: ' + error.message);
        }
        setLoading(false);
    };

    const performOcr = async () => {
        setLoading(true);
        try {
            const result = await processWithBackend('ocr', { lang: 'eng' });
            if (result && result.token) {
                const downloadUrl = `${BACKEND_URL}/api/download/${result.token}?name=${encodeURIComponent(result.filename)}`;
                const res = await fetch(downloadUrl);
                const blob = await res.blob();
                // load the OCR'd PDF as the new file
                setFile(new File([blob], file.name, { type: 'application/pdf' }));
                alert("OCR completed successfully!");
            }
        } catch (err) {
            console.error(err);
            alert("OCR Failed");
        }
        setLoading(false);
    };

    const handleTextChange = (pageIndex, textId, newText, isEdit = false) => {
        if (isEdit) {
            setEdits(prev => ({
                ...prev,
                [pageIndex]: prev[pageIndex].map(e => e.id === textId ? { ...e, text: newText } : e)
            }));
        } else {
            setTexts(prev => ({
                ...prev,
                [pageIndex]: prev[pageIndex].map(t => t.id === textId ? { ...t, text: newText } : t)
            }));
        }
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

    const rotateCurrentPage = () => {
        setRotatedPages(prev => {
            const angle = prev[currentPage] || 0;
            return { ...prev, [currentPage]: (angle + 90) % 360 };
        });
    };

    const deleteCurrentPage = () => {
        if (numPages - deletedPages.size <= 1) {
            alert("Cannot delete the last page.");
            return;
        }
        setDeletedPages(prev => new Set([...prev, currentPage - 1]));
        setCurrentPage(prev => Math.max(1, prev > 1 ? prev - 1 : prev));
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
            </div>
        );
    }

    if (!file) {
        return (
            <div className="container" style={{ padding: '40px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1>Pro PDF Editor</h1>
                    <p>Adobe Acrobat style UI, Add text, Annotate, Delete/Rotate Pages, OCR Searchable PDF.</p>
                </div>
                <div {...getRootProps()} className={`upload-area ${isDragActive ? 'active' : ''}`} style={{ maxWidth: '600px', margin: '0 auto', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <input {...getInputProps()} />
                    <UploadCloud size={64} color="var(--primary-color)" style={{ marginBottom: '20px' }} />
                    <h3>Select PDF file (Max 25MB)</h3>
                    <p>or drop PDF here</p>
                    <button className="btn btn-primary" style={{ marginTop: '20px' }}>Select File</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f5f5' }}>
            {/* Top Toolbar */}
            <div style={{ height: '60px', background: '#333', color: 'white', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <strong style={{ fontSize: '18px' }}>Pro PDF Editor</strong>
                    <span style={{ color: '#aaa', fontSize: '12px' }}>{file.name}</span>
                </div>

                {/* Editor Tools */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setMode('view')} style={{ padding: '8px', background: mode === 'view' ? '#555' : 'transparent', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit3 size={16} /> Select
                    </button>
                    <button onClick={() => setMode('text')} style={{ padding: '8px', background: mode === 'text' ? '#555' : 'transparent', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Type size={16} /> Add Text
                    </button>
                    <button onClick={() => setMode('edit-text')} style={{ padding: '8px', background: mode === 'edit-text' ? '#e5322d' : 'transparent', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Type size={16} /> Edit Text
                    </button>
                    <button onClick={() => setMode('draw')} style={{ padding: '8px', background: mode === 'draw' ? '#555' : 'transparent', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit3 size={16} /> Draw
                    </button>
                    <button onClick={() => setMode('highlight')} style={{ padding: '8px', background: mode === 'highlight' ? '#555' : 'transparent', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Edit3 size={16} /> Highlight
                    </button>
                    <div style={{ width: '1px', background: '#666', margin: '0 10px' }} />
                    <button onClick={rotateCurrentPage} style={{ padding: '8px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RotateCw size={16} /> Rotate Page
                    </button>
                    <button onClick={deleteCurrentPage} style={{ padding: '8px', background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trash2 size={16} /> Delete Page
                    </button>
                    <button onClick={performOcr} style={{ padding: '8px', background: 'transparent', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Settings size={16} />} OCR (Scanner to Text)
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="password" placeholder="Add Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', fontSize: '12px' }} />
                    <button className="btn btn-primary" onClick={downloadPdf} disabled={loading} style={{ background: '#E5322D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        Save PDF
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left Sidebar (Thumbnails) */}
                <div style={{ width: '240px', background: '#efefef', borderRight: '1px solid #ddd', overflowY: 'auto', padding: '10px' }}>
                    <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                        {Array.from(new Array(numPages || 0), (el, index) => {
                            const isDeleted = deletedPages.has(index);
                            const angle = rotatedPages[index + 1] || 0;
                            return (
                                <div
                                    key={index}
                                    onClick={() => !isDeleted && setCurrentPage(index + 1)}
                                    style={{
                                        marginBottom: '10px',
                                        cursor: isDeleted ? 'not-allowed' : 'pointer',
                                        border: currentPage === index + 1 && !isDeleted ? '2px solid #E5322D' : '1px solid #ccc',
                                        padding: '4px',
                                        background: '#fff',
                                        opacity: isDeleted ? 0.3 : 1
                                    }}
                                >
                                    <div style={{ transform: `rotate(${angle}deg)`, transition: 'transform 0.2s', display: 'flex', justifyContent: 'center' }}>
                                        <Page pageNumber={index + 1} width={180} renderTextLayer={false} renderAnnotationLayer={false} />
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px', color: '#555', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        Page {index + 1} {isDeleted && '(Deleted)'}
                                    </div>
                                </div>
                            );
                        })}
                    </Document>
                </div>

                {/* Center Canvas */}
                <div ref={containerRef} style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '40px', background: '#dcdcdc' }}>
                    <div style={{ position: 'relative', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        {!deletedPages.has(currentPage - 1) ? (
                            <Document file={file}>
                                <div
                                    ref={pageRef}
                                    onPointerDown={(e) => handlePointerDown(e, currentPage)}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={() => handlePointerUp(currentPage)}
                                    // prevent default touch actions like scrolling while drawing
                                    style={{
                                        cursor: mode === 'text' ? 'text' : (mode === 'draw' || mode === 'highlight' ? 'crosshair' : 'default'),
                                        position: 'relative',
                                        transform: `rotate(${rotatedPages[currentPage] || 0}deg)`,
                                        transition: 'transform 0.2s ease',
                                        touchAction: (mode === 'draw' || mode === 'highlight') ? 'none' : 'auto',
                                        userSelect: (mode === 'draw' || mode === 'highlight' || mode === 'text') ? 'none' : 'auto'
                                    }}
                                    className={`pdf-page-container ${mode}`}
                                >
                                    <style>
                                        {`
                                            /* react-pdf v10+ uses 'textLayer', older uses 'react-pdf__Page__textContent' */
                                            .pdf-page-container.edit-text .textLayer span,
                                            .pdf-page-container.edit-text .react-pdf__Page__textContent span {
                                                cursor: text !important;
                                                pointer-events: auto !important;
                                            }
                                            .pdf-page-container.edit-text .textLayer span:hover,
                                            .pdf-page-container.edit-text .react-pdf__Page__textContent span:hover {
                                                outline: 1px dashed red;
                                                background-color: rgba(229, 50, 45, 0.1);
                                            }
                                        `}
                                    </style>
                                    <Page pageNumber={currentPage}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true} />

                                    {/* Overlay for texts on this page */}
                                    {(texts[currentPage] || []).map(t => (
                                        <div key={t.id} style={{
                                            position: 'absolute',
                                            left: t.x,
                                            top: t.y,
                                            border: activeTextId === t.id ? '1px dashed #E5322D' : '1px solid transparent',
                                            padding: '2px',
                                            zIndex: 20
                                        }}
                                            onClick={(e) => { e.stopPropagation(); setActiveTextId(t.id); }}
                                        >
                                            <input
                                                type="text"
                                                value={t.text}
                                                onChange={(e) => handleTextChange(currentPage, t.id, e.target.value, false)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    outline: 'none',
                                                    fontSize: `${t.size}px`,
                                                    fontFamily: 'Helvetica',
                                                    color: 'black',
                                                    minWidth: '100px',
                                                    cursor: mode === 'view' ? 'text' : 'default'
                                                }}
                                                autoFocus={activeTextId === t.id}
                                            />
                                            {activeTextId === t.id && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setTexts(prev => ({ ...prev, [currentPage]: prev[currentPage].filter(i => i.id !== t.id) })); }}
                                                    style={{ position: 'absolute', right: '-20px', top: '-10px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {/* Edit overlays handled via direct DOM in span.parentNode for exact positioning */}

                                    {/* Realtime Canvas Overlay for Drawings */}
                                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                                        {/* Render finalized drawings */}
                                        {(drawings[currentPage] || []).map((d, i) => {
                                            if (d.points.length < 2) return null;
                                            const pts = d.points.map(p => `${p.x},${p.y}`).join(' ');
                                            const color = d.type === 'highlight' ? 'rgba(255, 255, 0, 0.4)' : '#e5322d';
                                            const width = d.type === 'highlight' ? 16 : 3;
                                            return <polyline key={i} points={pts} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
                                        })}
                                        {/* Render current path */}
                                        {currentPath && currentPath.points.length > 1 && (
                                            <polyline
                                                points={currentPath.points.map(p => `${p.x},${p.y}`).join(' ')}
                                                fill="none"
                                                stroke={currentPath.type === 'highlight' ? 'rgba(255, 255, 0, 0.4)' : '#e5322d'}
                                                strokeWidth={currentPath.type === 'highlight' ? 16 : 3}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        )}
                                        {/* Render current drag rectangle for edit-text */}
                                        {dragStart && dragCurrent && mode === 'edit-text' && (
                                            <rect
                                                x={Math.min(dragStart.x, dragCurrent.x)}
                                                y={Math.min(dragStart.y, dragCurrent.y)}
                                                width={Math.abs(dragCurrent.x - dragStart.x)}
                                                height={Math.abs(dragCurrent.y - dragStart.y)}
                                                fill="rgba(255,255,255,0.8)"
                                                stroke="#E5322D"
                                                strokeWidth="1"
                                                strokeDasharray="4 4"
                                            />
                                        )}
                                    </svg>
                                </div>
                            </Document>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minWidth: '400px' }}>
                                <h2>Page Deleted</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfEditor;
