import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { getToolById } from '../ToolsData';
import { UploadCloud, File as FileIcon, FileText, X, CheckCircle, ArrowRight, Loader2, RotateCw } from 'lucide-react';
import AdsPlacement from '../components/AdsPlacement';
import { PDFDocument } from 'pdf-lib';
import useSEO from '../hooks/useSEO';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ToolPage = () => {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultName, setResultName] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Set SEO tags dynamically based on the current tool
  useSEO({
    title: tool ? `${tool.name} - Free Online PDF Tool | PDFbazaar.com India` : 'PDFbazaar.com Tool',
    description: tool ? `Free online tool to ${tool.desc.toLowerCase()} Use PDFbazaar.com for fast, secure, and accurate PDF processing in India.` : 'Free online PDF Tool',
    keywords: tool ? `${tool.name}, online ${tool.name}, free ${tool.name}, pdfbazaar ${tool.id}` : 'pdfbazaar tools'
  });

  // Tool specific states
  const [compressLevel, setCompressLevel] = useState('recommended');
  const [pageRange, setPageRange] = useState('');
  const [rotateAngle, setRotateAngle] = useState('90');
  const [watermarkText, setWatermarkText] = useState('Confidential');
  const [password, setPassword] = useState('');
  const [ocrMode, setOcrMode] = useState('no_ocr');
  const [htmlUrl, setHtmlUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [customDpi, setCustomDpi] = useState('auto');
  const [targetSizeMB, setTargetSizeMB] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setErrorMsg(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      ...(toolId.includes('jpg') ? { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] } : {}),
      ...(toolId.includes('word') ? { 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } : {}),
    }
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleProcess = () => {
    setProcessing(true);
    setErrorMsg(null);
    setUploadProgress(0);
    setUploadSpeed(0);
    setUploadedBytes(0);

    const formData = new FormData();

    if (toolId === 'html-to-pdf') {
      if (!htmlUrl) {
        setErrorMsg('Please enter a valid URL');
        setProcessing(false);
        return;
      }
      formData.append('url', htmlUrl);
    } else {
      if (files.length === 0) { setProcessing(false); return; }
      const totalOriginalSize = files.reduce((sum, f) => sum + f.size, 0);
      setOriginalSize(totalOriginalSize);
      files.forEach((file) => formData.append('files', file));
    }

    formData.append('toolId', toolId);
    formData.append('compressLevel', compressLevel);
    formData.append('pageRange', pageRange);
    formData.append('rotateAngle', rotateAngle);
    formData.append('watermarkText', watermarkText);
    formData.append('password', password);
    formData.append('customDpi', customDpi);
    formData.append('targetSizeMB', targetSizeMB);

    const xhr = new XMLHttpRequest();
    let startTime = Date.now();

    xhr.upload.onloadstart = () => {
      setUploading(true);
      startTime = Date.now();
    };

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(pct);
        setUploadedBytes(e.loaded);
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = elapsed > 0 ? e.loaded / elapsed : 0;
        setUploadSpeed(speed);
      }
    };

    xhr.upload.onload = () => {
      setUploadProgress(100);
      setUploading(false);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const contentDisp = xhr.getResponseHeader('Content-Disposition');
        let filename = `pdfbazaar-${toolId}-result.pdf`;
        if (contentDisp && contentDisp.includes('filename=')) {
          const match = contentDisp.match(/filename="?([^"]+)"?/);
          if (match && match[1]) filename = match[1];
        }
        const contentType = xhr.getResponseHeader('Content-Type') || '';
        if (contentType.includes('zip')) filename = `pdfbazaar-${toolId}-result.zip`;

        const blob = xhr.response;
        setResultSize(blob.size);
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        setResultName(filename);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        let msg = `Server error ${xhr.status}`;
        try { const j = JSON.parse(xhr.responseText); msg = j.error || msg; } catch (e) { }
        setErrorMsg(msg);
      }
      setProcessing(false);
      setUploading(false);
    };

    xhr.onerror = () => {
      setErrorMsg('Connection failed. Please check if the server is running.');
      setProcessing(false);
      setUploading(false);
    };

    xhr.open('POST', `${BACKEND_URL}/api/process/${toolId}`);
    xhr.responseType = 'blob';
    xhr.send(formData);
  };

  const resetTool = () => {
    setFiles([]);
    setResultUrl(null);
    setResultName(null);
    setErrorMsg(null);
    setUploadProgress(0);
  };

  if (!tool) {
    return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Tool not found</div>;
  }

  return (
    <div className="container tool-page">
      <div className="tool-header">
        <h1>{tool.name}</h1>
        <p>{tool.desc}</p>
      </div>

      {!resultUrl && (
        <>
          {toolId === 'html-to-pdf' ? (
            <div className="tool-workspace animate-fade-in">
              <div className="upload-container" style={{ padding: '40px', textAlign: 'center' }}>
                <div className="upload-icon">
                  <FileText size={48} strokeWidth={1.5} color="var(--primary-color)" />
                </div>
                <h3 style={{ margin: '20px 0' }}>Enter Webpage URL</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                  Paste the URL of the webpage you want to convert to PDF.
                </p>
                <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px' }}>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://example.com"
                    style={{ flex: 1, padding: '12px 20px', fontSize: '16px' }}
                    value={htmlUrl}
                    onChange={(e) => setHtmlUrl(e.target.value)}
                    id="html-url-input"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleProcess}
                    disabled={processing}
                  >
                    {processing ? <Loader2 size={20} className="animate-spin" /> : 'Convert to PDF'}
                  </button>
                </div>
              </div>
            </div>
          ) : !files.length ? (
            <div
              {...getRootProps()}
              className={`upload-area ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="upload-content">
                <UploadCloud size={64} className="upload-icon" />
                <div className="upload-text">Select files</div>
                <div className="upload-sub">or drop files here</div>
              </div>
              <button className="btn-upload">Select Files</button>
            </div>
          ) : null}
        </>
      )}

      {/* Upload Progress Screen */}
      {processing && uploading && (
        <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>
            Uploading file {files.length > 0 ? `1 of ${files.length}` : ''}
          </h3>
          {files[0] && (
            <p style={{ color: '#666', marginBottom: '24px' }}>
              {files[0].name} ({(files[0].size / 1048576).toFixed(2)} MB)
            </p>
          )}
          {uploadSpeed > 0 && (
            <p style={{ color: '#888', marginBottom: '12px', fontSize: '14px' }}>
              Upload speed {(uploadSpeed / 1024).toFixed(1)} KB/S
            </p>
          )}
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#E5322D', borderRadius: '4px', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#222' }}>{uploadProgress}%</div>
          <div style={{ color: '#888', fontSize: '16px', marginTop: '4px' }}>UPLOADED</div>
        </div>
      )}

      {/* Processing (after upload done) */}
      {processing && !uploading && !resultUrl && (
        <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 size={48} className="animate-spin" style={{ color: '#E5322D', marginBottom: '20px' }} />
          <h3 style={{ fontSize: '22px', color: '#222', marginBottom: '8px' }}>Processing your file...</h3>
          {originalSize > 10 * 1048576 ? (
            <p style={{ color: '#E5322D', fontSize: '14px', marginBottom: '16px' }}>
              ⚠️ Large file ({(originalSize / 1048576).toFixed(1)} MB) — This may take 1-2 minutes. Please wait!
            </p>
          ) : (
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>Almost done, please wait a moment.</p>
          )}
          {/* Animated indeterminate progress bar */}
          <div style={{ width: '100%', height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, transparent, #E5322D, transparent)',
              borderRadius: '3px',
              animation: 'indeterminate 1.5s ease-in-out infinite'
            }} />
          </div>
        </div>
      )}

      {errorMsg && (
        <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '16px', borderRadius: '8px', marginBottom: '16px', maxWidth: '800px', width: '100%', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {!resultUrl && files.length > 0 && (
        <div className="workspace">
          <div className="workspace-main">
            <div className="preview-grid">
              {files.map((file, idx) => (
                <div key={idx} className="file-preview">
                  <div className="file-preview-remove" onClick={() => removeFile(idx)}>
                    <X size={16} />
                  </div>
                  <FileIcon size={64} className="file-preview-icon" />
                  <div className="file-preview-name">{file.name}</div>
                </div>
              ))}
              <div {...getRootProps()} className="file-preview" style={{ border: '2px dashed var(--border-color)', background: 'transparent', cursor: 'pointer', justifyContent: 'center' }}>
                <input {...getInputProps()} />
                <UploadCloud size={24} style={{ color: 'var(--text-secondary)' }} />
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Add more</div>
              </div>
            </div>
          </div>
          <div className="workspace-sidebar">
            <div className="workspace-sidebar-title">{tool.name} Options</div>
            <div style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '14px', paddingTop: '16px' }}>

              {toolId === 'merge-pdf' && (
                <div className="options-group">
                  <p>Drag files to upload or click the 'X' to remove. They will be merged in the order shown.</p>
                </div>
              )}

              {toolId === 'compress-pdf' && (
                <div className="options-group">
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>Compression Level</h4>
                  <label className="radio-label">
                    <input type="radio" value="extreme" checked={compressLevel === 'extreme'} onChange={e => setCompressLevel(e.target.value)} />
                    <div>
                      <strong>Extreme Compression</strong>
                      <div style={{ fontSize: '12px' }}>Less quality, highest compression.</div>
                    </div>
                  </label>
                  <label className="radio-label">
                    <input type="radio" value="recommended" checked={compressLevel === 'recommended'} onChange={e => setCompressLevel(e.target.value)} />
                    <div>
                      <strong>Recommended</strong>
                      <div style={{ fontSize: '12px' }}>Good quality, standard compression.</div>
                    </div>
                  </label>
                  <label className="radio-label">
                    <input type="radio" value="less" checked={compressLevel === 'less'} onChange={e => setCompressLevel(e.target.value)} />
                    <div>
                      <strong>Less Compression</strong>
                      <div style={{ fontSize: '12px' }}>High quality, less compressed.</div>
                    </div>
                  </label>

                  {/* Custom DPI */}
                  <h4 style={{ color: '#333', margin: '16px 0 8px' }}>Image DPI (Resolution)</h4>
                  <select
                    className="input-field"
                    value={customDpi}
                    onChange={e => setCustomDpi(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '14px', marginBottom: '12px' }}
                  >
                    <option value="auto">Auto (Recommended)</option>
                    <option value="72">72 DPI - Smallest Size (Screen only)</option>
                    <option value="96">96 DPI - Very Small</option>
                    <option value="120">120 DPI - Small</option>
                    <option value="150">150 DPI - Balanced</option>
                    <option value="200">200 DPI - Good Quality</option>
                    <option value="300">300 DPI - High Quality (Print)</option>
                  </select>

                  {/* Target Size */}
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>Target File Size</h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="e.g. 2"
                      min="0.1"
                      step="0.1"
                      value={targetSizeMB}
                      onChange={e => setTargetSizeMB(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '14px' }}
                    />
                    <span style={{ color: '#555', fontWeight: '500', whiteSpace: 'nowrap' }}>MB</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Leave blank to auto-compress. Set a target like "1" for ~1 MB.</p>
                </div>
              )}

              {(toolId === 'split-pdf' || toolId === 'delete-pdf-pages' || toolId === 'extract-pages') && (
                <div className="options-group">
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>{toolId === 'delete-pdf-pages' ? 'Pages to Delete' : 'Extract Pages'}</h4>
                  <input type="text" className="input-field" placeholder="e.g. 1-5, 8, 11-13" value={pageRange} onChange={e => setPageRange(e.target.value)} />
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>
                    {toolId === 'delete-pdf-pages' ? 'Specify the pages you want to remove from the document.' : 'Leave blank to extract all pages into a single PDF.'}
                  </p>
                </div>
              )}

              {toolId === 'rotate-pdf' && (
                <div className="options-group">
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>Rotation Direction</h4>
                  <select className="input-field" value={rotateAngle} onChange={e => setRotateAngle(e.target.value)}>
                    <option value="90">Right (90°)</option>
                    <option value="-90">Left (-90°)</option>
                    <option value="180">Upside Down (180°)</option>
                  </select>
                </div>
              )}

              {toolId === 'add-page-numbers' && (
                <div className="options-group">
                  <p>Page numbers will be added to the bottom center of each page in the format "Page X of Y".</p>
                </div>
              )}

              {toolId === 'grayscale-pdf' && (
                <div className="options-group">
                  <p>This will convert all colorful elements in your PDF to black and white (grayscale), which can reduce file size and printing costs.</p>
                </div>
              )}

              {toolId === 'add-watermark' && (
                <div className="options-group">
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>Watermark Text</h4>
                  <input type="text" className="input-field" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} />
                </div>
              )}

              {toolId === 'protect-pdf' && (
                <div className="options-group">
                  <h4 style={{ color: '#333', marginBottom: '8px' }}>Set Password</h4>
                  <input type="password" className="input-field" placeholder="Enter password to encrypt" value={password} onChange={e => setPassword(e.target.value)} />
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>This password will be required to open the PDF.</p>
                </div>
              )}

              {toolId === 'unlock-pdf' && (
                <div className="options-group">
                  <p>Our server will attempt to unlock standard restrictions. If there is a strong password, unlocking might fail without knowing it.</p>
                </div>
              )}

              {toolId === 'pdf-to-word' && (
                <div className="options-group">
                  <label className="radio-label" style={{ borderColor: ocrMode === 'no_ocr' ? 'var(--primary)' : '#e0e0e0', background: ocrMode === 'no_ocr' ? '#fdfdfd' : 'transparent' }}>
                    <div style={{ flex: 1 }} onClick={() => setOcrMode('no_ocr')}>
                      <strong style={{ color: '#E5322D', fontSize: '14px', marginBottom: '4px', display: 'block' }}>NO OCR</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Convert PDFs with selectable text into editable Word files.</div>
                    </div>
                    <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {ocrMode === 'no_ocr' && <CheckCircle size={20} color="#4CAF50" />}
                    </div>
                  </label>

                  <label className="radio-label" style={{ opacity: 0.6, cursor: 'not-allowed', marginTop: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: '#E5322D', fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        OCR
                        <span style={{ background: '#fef1bc', color: '#b6810c', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 19h19v2h-19v-2zm16.84-2H4.66l-2.07-8.28 4.24 2.12L12 3l5.17 7.84 4.24-2.12L19.34 17z" /></svg> Premium
                        </span>
                      </strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Convert scanned PDFs with non-selectable text into editable Word files.</div>
                    </div>
                  </label>
                </div>
              )}

            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', margin: '0', display: 'flex', justifyContent: 'center', gap: '8px', padding: '24px', fontSize: '24px', fontWeight: 'bold', borderRadius: '12px', boxShadow: '0 8px 20px rgba(229, 50, 45, 0.5)' }}
              onClick={handleProcess}
              disabled={processing}
            >
              {processing ? <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : tool.name}
              {!processing && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      )}

      {resultUrl && (
        <div className="result-box">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
          {toolId === 'compress-pdf' && originalSize > 0 && resultSize > 0 ? (
            <>
              <h2 style={{ fontSize: '28px', marginBottom: '8px', color: '#222' }}>PDFs have been compressed!</h2>
              {/* Compression stats circle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', margin: '24px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '5px solid #E5322D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  <span style={{ fontSize: '20px', color: '#E5322D' }}>
                    {Math.round((1 - resultSize / originalSize) * 100)}%
                  </span>
                  <span style={{ fontSize: '10px', color: '#888' }}>SAVED</span>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: '#555', margin: '0 0 4px' }}>Your PDF is now {Math.round((1 - resultSize / originalSize) * 100)}% smaller!</p>
                  <p style={{ color: '#333', fontWeight: 'bold', margin: 0 }}>
                    {(originalSize / 1048576).toFixed(2)} MB → {resultSize < 1048576 ? (resultSize / 1024).toFixed(2) + ' KB' : (resultSize / 1048576).toFixed(2) + ' MB'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Success!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your document has been processed successfully.</p>
            </>
          )}
          <button
            className="btn-download"
            style={{ marginBottom: '24px' }}
            onClick={() => {
              const link = document.createElement('a');
              link.href = resultUrl;
              link.setAttribute('download', resultName || `pdfbazaar-${toolId}-result.pdf`);
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              setTimeout(() => document.body.removeChild(link), 300);
            }}
          >
            Download {toolId === 'compress-pdf' ? 'Compressed PDF' : (resultName || `${tool.name} Result`)}
          </button>
          {/* Continue to section */}
          <div style={{ width: '100%', maxWidth: '600px', borderTop: '1px solid #eee', paddingTop: '24px', marginTop: '8px' }}>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>Continue to...</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
              {['merge-pdf', 'split-pdf', 'rotate-pdf', 'protect-pdf', 'add-watermark', 'add-page-numbers'].filter(id => id !== toolId).slice(0, 6).map(id => {
                const relTool = getToolById(id);
                if (!relTool) return null;
                return (
                  <a key={id} href={`/tool/${id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: '1px solid #eee', textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: '500', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ width: '30px', height: '30px', borderRadius: '6px', background: relTool.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <relTool.icon size={16} color={relTool.color} />
                    </span>
                    {relTool.name}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="action-links" style={{ marginTop: '20px' }}>
            <a href="#" className="action-link" onClick={(e) => { e.preventDefault(); resetTool(); }}>
              <RotateCw size={16} /> Start Over
            </a>
            <Link to="/" className="action-link">
              <ArrowRight size={16} /> Explore All Tools
            </Link>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', padding: '60px 0 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AdsPlacement type="rectangle" style={{ margin: '0 auto' }} />
      </div>

    </div>
  );
};

export default ToolPage;
