import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { UploadCloud, FileText, ArrowRight, Loader2, Type, Image as ImageIcon, Download, Trash2, Edit3, X, CheckCircle, RotateCw, Settings, Shield, ZoomIn, ZoomOut, MousePointer2, Undo, Redo, Eraser, Highlighter, Pencil, Circle, PenTool, StickyNote, Link, MoreHorizontal, Layout, Copy, Scissors, Square, Grid } from 'lucide-react';
import ToolSEOArticle from '../components/ToolSEOArticle';
import AdsPlacement from '../components/AdsPlacement';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(

    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PdfEditor = () => {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(false);
    const [resultBlob, setResultBlob] = useState(null);
    const [texts, setTexts] = useState({});
    const [edits, setEdits] = useState({});
    const [mode, setMode] = useState('view');
    const [activeTextId, setActiveTextId] = useState(null);
    const [drawings, setDrawings] = useState({});
    const [currentPath, setCurrentPath] = useState(null);
    const [dragStart, setDragStart] = useState(null);
    const [dragCurrent, setDragCurrent] = useState(null);
    const [deletedPages, setDeletedPages] = useState(new Set());
    const [rotatedPages, setRotatedPages] = useState({});
    const [password, setPassword] = useState('');
    // Adobe-style: inline edits with EXACT PDF coordinates
    const [inlineEdits, setInlineEdits] = useState([]);
    const [applyingSaving, setApplyingSaving] = useState(false);
    // PDF text items extracted via pdfjs getTextContent() - exact PDF coords
    const [pdfTextItems, setPdfTextItems] = useState({}); // { pageNum: [{str, x, y, width, height, fontSize}] }

    const containerRef = useRef();
    const pageRef = useRef();

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
            setInlineEdits([]);
            setPdfTextItems({});
            setResultBlob(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false,
        maxSize: 25 * 1024 * 1024
    });

    // ─── Adobe Method: Extract text items with exact PDF coordinates ───
    const extractTextItems = async (pageNum) => {
        if (pdfTextItems[pageNum]) return; // already extracted
        if (!file) return;
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const viewport = page.getViewport({ scale: 1 });

            const items = textContent.items.map(item => {
                // item.transform = [scaleX, skewX, skewY, scaleY, translateX, translateY]
                const tx = item.transform[4]; // exact PDF X coordinate
                const ty = item.transform[5]; // exact PDF Y coordinate (from bottom)
                const fontSize = Math.abs(item.transform[3]); // scaleY = fontSize
                const textWidth = item.width;
                const textHeight = item.height || fontSize;

                return {
                    str: item.str,
                    pdfX: tx,                    // exact PDF X (from left)
                    pdfY: ty,                    // exact PDF Y (from bottom)
                    pdfWidth: textWidth,         // exact width in PDF points
                    pdfHeight: textHeight,       // exact height in PDF points
                    fontSize: fontSize,
                    pageWidth: viewport.width,   // PDF page width in points
                    pageHeight: viewport.height, // PDF page height in points
                };
            }).filter(item => item.str.trim().length > 0);

            setPdfTextItems(prev => ({ ...prev, [pageNum]: items }));
            console.log(`[extractTextItems] Page ${pageNum}: ${items.length} text items extracted`);
        } catch (err) {
            console.error('[extractTextItems] Error:', err);
        }
    };

    const handlePointerDown = (e, pageIndex) => {
        // Always use pageRef for accurate coordinates relative to the page container
        if (!pageRef.current) return;
        const rect = pageRef.current.getBoundingClientRect();

        if (['text', 'cross', 'check', 'sign'].includes(mode)) {
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;

            let textContent = 'New Text';
            let size = 16;
            let color = 'black';
            if (mode === 'cross') { textContent = '✗'; size = 32; color = '#E5322D'; }
            if (mode === 'check') { textContent = '✓'; size = 32; color = 'green'; }
            if (mode === 'sign') { textContent = 'Signature (Double click to edit)'; size = 24; color = 'blue'; }

            const newText = {
                id: Date.now().toString(),
                text: textContent,
                x,
                y,
                size,
                color
            };

            setTexts(prev => ({
                ...prev,
                [pageIndex]: [...(prev[pageIndex] || []), newText]
            }));

            if (mode === 'text' || mode === 'sign') setActiveTextId(newText.id);
            setMode('view');
        } else if (mode === 'edit-text') {
            const span = (e.target.tagName.toLowerCase() === 'span')
                ? e.target
                : e.target.closest('span');

            if (span && span.closest('.textLayer, .react-pdf__Page__textContent')) {
                e.preventDefault();
                const spanText = span.textContent.trim();
                const spanRect = span.getBoundingClientRect();
                const pageRect = pageRef.current.getBoundingClientRect();

                // ✅ ADOBE METHOD: Find matching textItem with exact PDF coordinates
                const pageItems = pdfTextItems[currentPage] || [];
                let matchedItem = pageItems.find(item => item.str.trim() === spanText);

                // If exact match not found, try partial match
                if (!matchedItem) {
                    matchedItem = pageItems.find(item =>
                        item.str.trim().includes(spanText) || spanText.includes(item.str.trim())
                    );
                }

                const editId = Date.now().toString();
                const fontSize = matchedItem ? matchedItem.fontSize : ((parseFloat(window.getComputedStyle(span).fontSize) || 12) / scale);

                const newEdit = {
                    id: editId,
                    pageIndex: pageIndex - 1,
                    originalText: spanText,
                    newText: spanText,
                    fontSize,
                    // ✅ EXACT PDF coordinates - no conversion needed!
                    pdfX: matchedItem ? matchedItem.pdfX : 0,
                    pdfY: matchedItem ? matchedItem.pdfY : 0,
                    pdfWidth: matchedItem ? matchedItem.pdfWidth : (spanRect.width / scale),
                    pdfHeight: matchedItem ? matchedItem.pdfHeight : fontSize,
                    // Rendered coords for inline overlay display at scale 1
                    displayX: (spanRect.left - pageRect.left) / scale,
                    displayY: (spanRect.top - pageRect.top) / scale,
                    displayWidth: spanRect.width / scale,
                    displayHeight: spanRect.height / scale,
                    hasMatch: !!matchedItem,
                };

                setInlineEdits(prev => [...prev, newEdit]);
                setActiveTextId(editId);
                span.style.color = 'transparent';
                return;
            } else {
                const x = (e.clientX - rect.left) / scale;
                const y = (e.clientY - rect.top) / scale;
                setDragStart({ x, y });
                setDragCurrent({ x, y });
            }
        } else if (['draw', 'highlight', 'eraser'].includes(mode)) {
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;
            setCurrentPath({ type: mode, points: [{ x, y }] });
        }
    };

    const handlePointerMove = (e) => {
        if (!pageRef.current) return;
        const rect = pageRef.current.getBoundingClientRect();
        if (dragStart && mode === 'edit-text') {
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;
            setDragCurrent({ x, y });
            return;
        }

        if (!currentPath) return;
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
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

    // ─── Sejda-style: Apply All Inline Edits via Backend ───────────────
    const applyInlineEdits = async () => {
        if (inlineEdits.length === 0 || !file) return;
        setApplyingSaving(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('replacements', JSON.stringify(inlineEdits.map(ed => ({
                pageIndex: ed.pageIndex,
                x: ed.displayX, // Just in case backend uses it as fallback
                y: ed.displayY,
                width: ed.displayWidth,
                height: ed.displayHeight,
                pdfX: ed.pdfX,
                pdfY: ed.pdfY,
                pdfWidth: ed.pdfWidth,
                pdfHeight: ed.pdfHeight,
                hasMatch: ed.hasMatch,
                newText: ed.newText,
                fontSize: ed.fontSize,
                renderedWidth: ed.displayWidth, // not really needed if we have exact coords
                renderedHeight: ed.displayHeight,
            }))));

            const res = await fetch(`${BACKEND_URL}/api/pdf-editor/replace-text`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Backend failed');
            }

            const blob = await res.blob();
            const modifiedFile = new File([blob], file.name, { type: 'application/pdf' });
            setFile(modifiedFile);
            setInlineEdits([]); // clear all edits
            setMode('view');
        } catch (err) {
            alert('Error applying changes: ' + err.message);
        }
        setApplyingSaving(false);
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
                <div style={{ marginTop: '60px', textAlign: 'left' }}>
                    <ToolSEOArticle toolId="edit-pdf" toolName="Edit PDF" toolDesc="Add text, images, shapes or freehand annotations to a PDF document with our professional Adobe-style PDF editor." />
                </div>
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

                {/* Ad Unit: Middle */}
                <div style={{ margin: '40px auto', display: 'flex', justifyContent: 'center' }}>
                    <AdsPlacement slot="2004166750" format="horizontal" />
                </div>

                <div style={{ marginTop: '60px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                    <ToolSEOArticle toolId="edit-pdf" toolName="Edit PDF" toolDesc="Add text, images, shapes or freehand annotations to a PDF document with our professional Adobe-style PDF editor." />
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f5f5' }}>
                {/* Top Navbar */}
                <div style={{ height: '60px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <strong style={{ fontSize: '24px', color: '#E5322D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={28} /> Pdfbazaar.com
                        </strong>
                        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '4px 12px', fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Edit3 size={14} /> {file.name}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', color: '#555' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', gap: '4px' }}><Loader2 size={18} /> Search</button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', gap: '4px' }}><Layout size={18} /> Print</button>
                            <button onClick={downloadPdf} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', gap: '4px', color: '#555' }}>
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                                Download
                            </button>
                        </div>
                        <button onClick={downloadPdf} disabled={loading} style={{ background: '#E5322D', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                            DONE
                        </button>
                    </div>
                </div>

                {/* Tools Toolbar (White) */}
                <div style={{ background: '#fff', borderBottom: '1px solid #ddd', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '15px', overflowX: 'auto', zIndex: 9, minHeight: '65px' }}>
                    <style>
                        {`
                    .toolbar-btn {
                        background: #e3f2fd; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer;
                        display: flex; flexDirection: column; align-items: center; justify-content: center; gap: 4px;
                        color: #1a73e8; font-size: 11px; min-width: 60px; transition: all 0.2s; font-weight: 500;
                    }
                    .toolbar-btn:hover { background: #d0e8fc; }
                    .toolbar-btn.active { color: #fff; background: #1a73e8; }
                    .toolbar-btn.active svg { stroke: #fff; }
                    .toolbar-divider { width: 1px; height: 30px; background: #ddd; margin: 0 5px; }
                    `}
                    </style>

                    <button className="toolbar-btn" onClick={() => { }} /* Toggle Thumbnails */ >
                        <Grid size={20} /> Thumbnails
                    </button>
                    <div className="toolbar-divider" />

                    <button className={`toolbar-btn ${mode === 'view' ? 'active' : ''}`} onClick={() => setMode('view')}>
                        <MousePointer2 size={20} /> Move
                    </button>
                    <button className="toolbar-btn">
                        <Undo size={20} /> Undo
                    </button>
                    <button className="toolbar-btn">
                        <Redo size={20} /> Redo
                    </button>

                    <div className="toolbar-divider" />

                    <button className={`toolbar-btn ${mode === 'text' ? 'active' : ''}`} onClick={() => setMode('text')}>
                        <Type size={20} /> Add Text
                    </button>
                    <button className={`toolbar-btn ${mode === 'edit-text' ? 'active' : ''}`} onClick={() => setMode('edit-text')}>
                        <Edit3 size={20} /> Edit text
                    </button>
                    <button className={`toolbar-btn ${mode === 'eraser' ? 'active' : ''}`} onClick={() => setMode('eraser')}>
                        <Eraser size={20} /> Eraser
                    </button>
                    <button className={`toolbar-btn ${mode === 'highlight' ? 'active' : ''}`} onClick={() => setMode('highlight')}>
                        <Highlighter size={20} /> Highlight
                    </button>
                    <button className={`toolbar-btn ${mode === 'draw' ? 'active' : ''}`} onClick={() => setMode('draw')}>
                        <Pencil size={20} /> Pencil
                    </button>

                    <div className="toolbar-divider" />

                    <button className="toolbar-btn" onClick={() => {
                        const el = document.createElement('input');
                        el.type = 'file';
                        el.accept = 'image/*';
                        el.onchange = (ev) => {
                            const file = ev.target.files[0];
                            if (file) alert("Image uploaded! It will be placed on the canvas (functionality coming soon).");
                        };
                        el.click();
                    }}>
                        <ImageIcon size={20} /> Image
                    </button>
                    <button className={`toolbar-btn ${mode === 'ellipse' ? 'active' : ''}`} onClick={() => alert('Drawing ellipse... (Coming soon)')}>
                        <Circle size={20} /> Ellipse
                    </button>
                    <button className={`toolbar-btn ${mode === 'cross' ? 'active' : ''}`} onClick={() => setMode('cross')}>
                        <X size={20} /> Cross
                    </button>
                    <button className={`toolbar-btn ${mode === 'check' ? 'active' : ''}`} onClick={() => setMode('check')}>
                        <CheckCircle size={20} /> Check
                    </button>
                    <button className={`toolbar-btn ${mode === 'sign' ? 'active' : ''}`} onClick={() => setMode('sign')}>
                        <PenTool size={20} /> Sign
                    </button>

                    <div className="toolbar-divider" />

                    <button className="toolbar-btn" onClick={() => alert('Annotations system starting...')}>
                        <StickyNote size={20} /> Annotations
                    </button>
                    <button className="toolbar-btn" onClick={() => alert('Add area link mode...')}>
                        <Link size={20} /> Links
                    </button>
                    <button className="toolbar-btn">
                        <MoreHorizontal size={20} /> More tools
                    </button>

                    <div className="toolbar-divider" />

                    <button className="toolbar-btn">
                        <Layout size={20} /> Page layout
                    </button>
                    <button className="toolbar-btn">
                        <Copy size={20} /> Manage Pages
                    </button>
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
                    <div ref={containerRef} style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '40px', background: '#dcdcdc', position: 'relative' }}>

                        {/* Zoom Controls */}
                        <div style={{ position: 'fixed', right: '30px', bottom: '100px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1000 }}>
                            <button onClick={() => setScale(s => Math.min(s + 0.25, 3))} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Zoom In">
                                <ZoomIn size={20} color="#333" />
                            </button>
                            <span style={{ background: '#fff', padding: '4px 0', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', width: '40px' }}>{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => Math.max(s - 0.25, 0.5))} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Zoom Out">
                                <ZoomOut size={20} color="#333" />
                            </button>
                        </div>

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
                                            cursor: ['text', 'cross', 'check', 'sign'].includes(mode) ? 'text' : (['draw', 'highlight', 'eraser'].includes(mode) ? 'crosshair' : 'default'),
                                            position: 'relative',
                                            transform: `rotate(${rotatedPages[currentPage] || 0}deg)`,
                                            transition: 'transform 0.2s ease',
                                            touchAction: (['draw', 'highlight', 'eraser'].includes(mode)) ? 'none' : 'auto',
                                            userSelect: (['draw', 'highlight', 'eraser', 'text', 'cross', 'check', 'sign'].includes(mode)) ? 'none' : 'auto'
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
                                            onLoadSuccess={() => extractTextItems(currentPage)}
                                            scale={scale}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true} />

                                        {/* Overlay for texts on this page */}
                                        {(texts[currentPage] || []).map(t => (
                                            <div key={t.id} style={{
                                                position: 'absolute',
                                                left: t.x * scale,
                                                top: t.y * scale,
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
                                                        fontSize: `${t.size * scale}px`,
                                                        fontFamily: 'Helvetica',
                                                        color: t.color || 'black',
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

                                        {/* ─── Sejda-style Inline Edit Overlays ─── */}
                                        {inlineEdits.filter(ed => ed.pageIndex === currentPage - 1).map(ed => (
                                            <div key={ed.id} style={{
                                                position: 'absolute',
                                                left: ed.displayX * scale,
                                                top: ed.displayY * scale,
                                                zIndex: 50,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}>
                                                <input
                                                    type="text"
                                                    value={ed.newText}
                                                    onChange={e => setInlineEdits(prev => prev.map(
                                                        item => item.id === ed.id ? { ...item, newText: e.target.value } : item
                                                    ))}
                                                    autoFocus={activeTextId === ed.id}
                                                    style={{
                                                        fontSize: `${ed.fontSize * scale}px`,
                                                        fontFamily: 'Helvetica, sans-serif',
                                                        border: '2px solid #E5322D',
                                                        borderRadius: '3px',
                                                        background: 'rgba(255,255,255,0.97)',
                                                        outline: 'none',
                                                        padding: '1px 4px',
                                                        minWidth: `${ed.displayWidth * scale}px`,
                                                        color: '#000',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                                <button
                                                    onClick={() => setInlineEdits(prev => prev.filter(item => item.id !== ed.id))}
                                                    style={{ background: '#ccc', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >✕</button>
                                            </div>
                                        ))}

                                        {/* Realtime Canvas Overlay for Drawings */}
                                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                                            {/* Render finalized drawings */}
                                            {(drawings[currentPage] || []).map((d, i) => {
                                                if (d.points.length < 2) return null;
                                                const pts = d.points.map(p => `${p.x * scale},${p.y * scale}`).join(' ');
                                                const color = d.type === 'highlight' ? 'rgba(255, 255, 0, 0.4)' : (d.type === 'eraser' ? '#ffffff' : '#e5322d');
                                                const strokeWidth = (d.type === 'highlight' ? 16 : d.type === 'eraser' ? 24 : 3) * scale;
                                                return <polyline key={i} points={pts} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                                            })}
                                            {/* Render current path */}
                                            {currentPath && currentPath.points.length > 1 && (
                                                <polyline
                                                    points={currentPath.points.map(p => `${p.x * scale},${p.y * scale}`).join(' ')}
                                                    fill="none"
                                                    stroke={currentPath.type === 'highlight' ? 'rgba(255, 255, 0, 0.4)' : (currentPath.type === 'eraser' ? '#ffffff' : '#e5322d')}
                                                    strokeWidth={(currentPath.type === 'highlight' ? 16 : currentPath.type === 'eraser' ? 24 : 3) * scale}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}
                                            {/* Render current drag rectangle for edit-text */}
                                            {dragStart && dragCurrent && mode === 'edit-text' && (
                                                <rect
                                                    x={Math.min(dragStart.x, dragCurrent.x) * scale}
                                                    y={Math.min(dragStart.y, dragCurrent.y) * scale}
                                                    width={Math.abs(dragCurrent.x - dragStart.x) * scale}
                                                    height={Math.abs(dragCurrent.y - dragStart.y) * scale}
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

                {/* ─── Sejda-style Floating "Apply changes" Button ─── */}
                {inlineEdits.length > 0 && (
                    <div style={{
                        position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <button onClick={applyInlineEdits} disabled={applyingSaving}
                            style={{
                                padding: '14px 32px', borderRadius: '8px', border: 'none',
                                background: '#E5322D', color: '#fff', fontSize: '16px',
                                fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(229,50,45,0.4)',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                opacity: applyingSaving ? 0.7 : 1,
                            }}>
                            {applyingSaving ? '⏳ Applying...' : `Apply changes ›`}
                        </button>
                        <span style={{ background: '#fff', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                            {inlineEdits.length} edit{inlineEdits.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
            <div style={{ width: '100%', maxWidth: '900px', margin: '60px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ToolSEOArticle toolId="edit-pdf" toolName="Edit PDF" toolDesc="Add text, images, shapes or freehand annotations to a PDF document with our professional Adobe-style PDF editor." />
                
                {/* Ad Unit: Bottom */}
                <div style={{ width: '100%', marginTop: '40px' }}>
                    <AdsPlacement slot="2965247838" format="auto" />
                </div>
            </div>
        </>
    );
};

export default PdfEditor;
