import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Check, Lock, RotateCw, Type, Trash2, LayoutList, FileText, Download, ArrowRight } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function ToolProcessor({ tools }) {
    const { toolId } = useParams();
    const navigate = useNavigate();
    const tool = tools.find((t) => t.id === toolId);
    const fileInputRef = useRef(null);

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);

    // Tool specific states
    const [password, setPassword] = useState('');
    const [rotation, setRotation] = useState(90);
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
    const [pagesStr, setPagesStr] = useState('1');

    if (!tool) {
        return <div style={{ padding: 40, textAlign: 'center' }}>Tool not found.</div>;
    }

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        if (!selected.length) return;

        if (tool.id === 'merge' || tool.id === 'jpg-to-pdf') {
            setFiles((prev) => [...prev, ...selected]);
        } else {
            setFiles([selected[0]]);
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const processFiles = async () => {
        if (files.length === 0) return;
        setLoading(true);
        setError(null);
        setDownloadUrl(null);

        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        if (tool.id === 'protect' || tool.id === 'unlock') formData.append('password', password);
        if (tool.id === 'rotate') formData.append('rotation', rotation);
        if (tool.id === 'watermark') formData.append('watermark_text', watermarkText);
        if (tool.id === 'delete-pages') formData.append('pages_to_delete', pagesStr);
        if (tool.id === 'extract-pages') formData.append('pages_to_extract', pagesStr);

        try {
            const response = await fetch(`${API_BASE}/api/${tool.id}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Processing failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isMultiple = tool.id === 'merge' || tool.id === 'jpg-to-pdf';
    let acceptedTypes = 'application/pdf';
    if (tool.id === 'jpg-to-pdf') acceptedTypes = 'image/jpeg,image/png';
    if (tool.id === 'word-to-pdf') acceptedTypes = '.docx';

    let extension = 'pdf';
    if (tool.id === 'split' || tool.id === 'pdf-to-jpg') extension = 'zip';
    if (tool.id === 'pdf-to-word') extension = 'docx';
    if (tool.id === 'pdf-to-txt') extension = 'txt';

    const onDragOver = (e) => { e.preventDefault(); };
    const onDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (isMultiple) {
                setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
            } else {
                setFiles([e.dataTransfer.files[0]]);
            }
            e.dataTransfer.clearData();
        }
    };

    return (
        <div className="processing-container animate-fade">
            {/* Before processing and before upload */}
            {!downloadUrl && files.length === 0 && (
                <>
                    <div className="tool-header-area">
                        <h2>{tool.title}</h2>
                        <p>{tool.desc}</p>
                    </div>

                    <div className="workspace">
                        <input
                            type="file"
                            multiple={isMultiple}
                            accept={acceptedTypes}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <div className="uploader-box" onDragOver={onDragOver} onDrop={onDrop}>
                            <button className="uploader-btn" onClick={() => fileInputRef.current.click()}>
                                Select {acceptedTypes === 'application/pdf' ? 'PDF ' : ''}file{isMultiple ? 's' : ''}
                            </button>
                            <p className="drop-text">or drop files here</p>
                        </div>
                    </div>
                </>
            )}

            {/* Before processing and AFTER upload (Active State) */}
            {!downloadUrl && files.length > 0 && (
                <div className="active-workspace" style={{ flex: 1 }}>
                    <div className="files-grid">
                        {files.map((file, idx) => (
                            <div key={idx} className="file-card">
                                <button className="btn-remove-file" onClick={() => removeFile(idx)} title="Remove file">
                                    <X size={14} strokeWidth={2.5} />
                                </button>
                                <FileText size={48} className="file-icon-pdf" />
                                <div className="file-name" title={file.name}>{file.name}</div>
                            </div>
                        ))}

                        {/* Add more button for multiple allowed */}
                        {isMultiple && (
                            <div className="file-card" style={{ border: '2px dashed #ccc', boxShadow: 'none', background: 'transparent', cursor: 'pointer', opacity: 0.6 }} onClick={() => fileInputRef.current.click()}>
                                <Upload size={36} color="var(--text-grey)" style={{ marginBottom: 10 }} />
                                <div className="file-name" style={{ color: 'var(--text-grey)' }}>Add more files</div>
                            </div>
                        )}
                        <input
                            type="file"
                            multiple={isMultiple}
                            accept={acceptedTypes}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Form inputs based on tool ID */}
                    {(tool.id === 'protect' || tool.id === 'unlock') && (
                        <div className="settings-box">
                            <h4><Lock size={18} /> Enter Password:</h4>
                            <input
                                type="text"
                                className="settings-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={tool.id === 'protect' ? "Set new password" : "Enter PDF password"}
                            />
                        </div>
                    )}

                    {tool.id === 'rotate' && (
                        <div className="settings-box">
                            <h4><RotateCw size={18} /> Rotation angle:</h4>
                            <select
                                className="settings-input"
                                value={rotation}
                                onChange={(e) => setRotation(Number(e.target.value))}
                            >
                                <option value={90}>Right (90°)</option>
                                <option value={180}>Upside down (180°)</option>
                                <option value={270}>Left (270°)</option>
                            </select>
                        </div>
                    )}

                    {tool.id === 'watermark' && (
                        <div className="settings-box">
                            <h4><Type size={18} /> Watermark Text:</h4>
                            <input
                                type="text"
                                className="settings-input"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                placeholder={"Enter text to stamp on PDF"}
                            />
                        </div>
                    )}

                    {(tool.id === 'delete-pages' || tool.id === 'extract-pages') && (
                        <div className="settings-box">
                            <h4>{tool.id === 'delete-pages' ? <Trash2 size={18} /> : <LayoutList size={18} />} Pages to {tool.id === 'delete-pages' ? 'remove' : 'extract'}:</h4>
                            <input
                                type="text"
                                className="settings-input"
                                value={pagesStr}
                                onChange={(e) => setPagesStr(e.target.value)}
                                placeholder={"e.g. 1, 3, 5"}
                            />
                            <p style={{ fontSize: 12, color: 'var(--text-grey)', marginTop: '-10px' }}>Comma separated page numbers.</p>
                        </div>
                    )}

                    {error && <div style={{ color: 'var(--ilovepdf-red)', margin: '20px 0', fontWeight: '700', padding: '15px', background: '#fff', borderRadius: 8 }}>Error: {error}</div>}

                    {/* Fixed bottom button */}
                    <div className="process-button-container">
                        <button
                            className="btn-process"
                            onClick={processFiles}
                            disabled={loading || (isMultiple && tool.id === 'merge' && files.length < 2)}
                        >
                            {loading ? <span className="spinner"></span> : <>{tool.title} <ArrowRight size={22} /></>}
                        </button>
                    </div>
                </div>
            )}

            {/* Done State */}
            {downloadUrl && (
                <div className="workspace" style={{ background: '#fff', borderTop: '1px solid var(--border-color)' }}>
                    <div className="success-box">
                        <div className="success-icon">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h3>Your files have been processed successfully!</h3>

                        <a href={downloadUrl} download={`${tool.id}-processed.${extension}`} className="btn-download">
                            <Download size={24} />
                            Download Processed File
                        </a>

                        <br />
                        <button
                            style={{ marginTop: 40, background: 'none', border: 'none', color: 'var(--text-grey)', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}
                            onClick={() => {
                                setFiles([]);
                                setDownloadUrl(null);
                                setPassword('');
                            }}
                        >
                            Start over
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
