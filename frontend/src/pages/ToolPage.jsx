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

  const handleProcess = async () => {
    setProcessing(true);
    setErrorMsg(null);

    try {
      // Opt 2: Backend Server Processing
      const formData = new FormData();

      if (toolId === 'html-to-pdf') {
        if (!htmlUrl) {
          setErrorMsg('Please enter a valid URL');
          setProcessing(false);
          return;
        }
        formData.append('url', htmlUrl);
      } else {
        if (files.length === 0) return;
        files.forEach((file) => {
          formData.append('files', file);
        });
      }

      // Pass configuration options if needed (e.g. compress level)
      formData.append('toolId', toolId);
      formData.append('compressLevel', compressLevel);
      formData.append('pageRange', pageRange);
      formData.append('rotateAngle', rotateAngle);
      formData.append('watermarkText', watermarkText);
      formData.append('password', password);

      const response = await fetch(`${BACKEND_URL}/api/process/${toolId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Server error ${response.status}: ${errorText}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error) {
            errorMessage = errorJson.details ? `${errorJson.error} (Details: ${errorJson.details})` : errorJson.error;
          }
        } catch (e) { /* ignore parse error */ }
        throw new Error(errorMessage);
      }

      let filename = `pdfbazaar-${toolId}-result.pdf`;
      const contentDisp = response.headers.get('content-disposition');
      if (contentDisp && contentDisp.includes('filename=')) {
        const match = contentDisp.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      } else if (response.headers.get('content-type') === 'application/zip') {
        filename = `pdfbazaar-${toolId}-result.zip`;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultName(filename);

      // Programmatically trigger download immediately like iLovePDF
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setResultUrl(null);
    setResultName(null);
    setErrorMsg(null);
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
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Success!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Your document has been processed successfully.
          </p>
          <button
            className="btn-download"
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
            Download {resultName || `${tool.name} Result`}
          </button>
          <div className="action-links">
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
