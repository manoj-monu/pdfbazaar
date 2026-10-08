import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, CheckCircle, RotateCcw, Crop, Image as ImageIcon, Sparkles, SlidersHorizontal, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './PassportPhotoMaker.css';

const PASSPORT_SIZES = [
  { id: 'us-passport', name: 'US Passport (2 x 2 inch)', width: 600, height: 600, aspect: 1 },
  { id: 'india-passport', name: 'India Passport (35 x 45 mm)', width: 413, height: 531, aspect: 35 / 45 },
  { id: 'uk-passport', name: 'UK Passport (35 x 45 mm)', width: 413, height: 531, aspect: 35 / 45 },
  { id: 'europe-visa', name: 'Schengen Visa (35 x 45 mm)', width: 413, height: 531, aspect: 35 / 45 },
  { id: 'canada-passport', name: 'Canada Passport (50 x 70 mm)', width: 591, height: 827, aspect: 50 / 70 }
];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export default function PassportPhotoMaker() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [selectedSize, setSelectedSize] = useState(PASSPORT_SIZES[0]);
  const [activeTab, setActiveTab] = useState('crop');
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, selectedSize.aspect));
  };

  const handleSizeChange = (e) => {
    const newSize = PASSPORT_SIZES.find(s => s.id === e.target.value);
    setSelectedSize(newSize);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newSize.aspect));
    }
  };

  const downloadCroppedImage = async () => {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    if (!image || !canvas || !completedCrop) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;
    
    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = selectedSize.width;
    finalCanvas.height = selectedSize.height;
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx.imageSmoothingQuality = 'high';
    finalCtx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

    const base64Image = finalCanvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.download = `passport-photo-${selectedSize.id}.jpg`;
    link.href = base64Image;
    link.click();
  };

  const resetImage = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  return (
    <div className="id-studio-wrapper">
      <Helmet>
        <title>Global ID Photo Studio - Create Passport Photos Online | PDFBazaar</title>
        <meta name="description" content="Create perfect passport and ID photos in seconds using our Global ID Photo Studio. Select country, upload photo, crop automatically, and download." />
      </Helmet>

      <div className="id-studio-header">
        <h1>Global ID Photo Studio</h1>
        <p>Create Perfect Passport & Document Photos in Seconds</p>
      </div>

      <div className="id-stepper">
        <div className={`id-step ${!imgSrc ? 'active' : ''}`}>
          <div className="id-step-num">1</div>
          Upload Photo
        </div>
        <div className="id-step-divider"></div>
        <div className={`id-step ${imgSrc ? 'active' : ''}`}>
          <div className="id-step-num">2</div>
          Editing (Adjustments)
        </div>
        <div className="id-step-divider"></div>
        <div className="id-step">
          <div className="id-step-num">3</div>
          Download & Print
        </div>
      </div>

      <div className="id-workspace">
        
        {/* Editor Section */}
        {!imgSrc ? (
          <div 
            {...getRootProps()} 
            className={`id-upload-area ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="id-upload-icon-wrapper">
              <Upload size={32} />
            </div>
            <h3 className="id-upload-title">Upload Your Photo</h3>
            <p className="id-upload-subtitle">Drag & drop your image here, or click to browse<br/>Supports JPG, PNG, WEBP (Max 10MB)</p>
            <button className="id-btn-primary" style={{ width: 'auto', padding: '12px 30px' }}>
              Choose File
            </button>
            <div style={{ display: 'flex', gap: '20px', marginTop: '40px', textAlign: 'left' }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '13px', marginBottom: '10px', color: '#333' }}>Good Photo Tips</h4>
                <ul style={{ fontSize: '12px', color: '#666', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li>Use good, even lighting</li>
                  <li>Face the camera directly</li>
                  <li>Avoid shadows on face</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="id-editor-container">
            {/* Dark Toolbar */}
            <div className="id-toolbar">
              <button className={`id-tool-btn ${activeTab === 'crop' ? 'active' : ''}`} onClick={() => setActiveTab('crop')}>
                <Crop size={20} />
                Crop
              </button>
              <button className="id-tool-btn" disabled title="Coming in Phase 2">
                <ImageIcon size={20} />
                Background
              </button>
              <button className="id-tool-btn" disabled title="Coming in Phase 2">
                <Sparkles size={20} />
                Enhance
              </button>
              <button className="id-tool-btn" disabled title="Coming in Phase 2">
                <RotateCcw size={20} />
                Rotate
              </button>
              <button className="id-tool-btn" disabled title="Coming in Phase 2">
                <SlidersHorizontal size={20} />
                Adjust
              </button>
            </div>
            
            {/* Canvas Area */}
            <div className="id-canvas-area">
              <div className="id-canvas-wrapper">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={selectedSize.aspect}
                  style={{ maxHeight: '460px' }}
                >
                  <img
                    ref={imgRef}
                    alt="Crop Preview"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    style={{ maxHeight: '460px', objectFit: 'contain' }}
                  />
                </ReactCrop>
              </div>
              <button 
                onClick={resetImage}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={14} /> Start Over
              </button>
            </div>
          </div>
        )}

        {/* Right Panel */}
        <div className="id-panel">
          
          <div className="id-panel-section">
            <h3 className="id-panel-title">
              <Settings size={18} color="#1877F2" />
              Country & Document
            </h3>
            <label style={{ fontSize: '13px', color: '#555', marginBottom: '8px', display: 'block' }}>Select Configuration</label>
            <select 
              className="id-select"
              value={selectedSize.id}
              onChange={handleSizeChange}
            >
              {PASSPORT_SIZES.map(size => (
                <option key={size.id} value={size.id}>{size.name}</option>
              ))}
            </select>

            <div className="id-info-box">
              <div className="id-info-row">
                <span className="id-info-label">Requirements</span>
                <span className="id-info-value" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> Verified
                </span>
              </div>
              <div className="id-info-row">
                <span className="id-info-label">Width</span>
                <span className="id-info-value">{selectedSize.width} px</span>
              </div>
              <div className="id-info-row">
                <span className="id-info-label">Height</span>
                <span className="id-info-value">{selectedSize.height} px</span>
              </div>
              <div className="id-info-row">
                <span className="id-info-label">Background</span>
                <span className="id-info-value">White / Transparent</span>
              </div>
            </div>
          </div>

          <div className="id-panel-section" style={{ opacity: completedCrop && imgSrc ? 1 : 0.5, pointerEvents: completedCrop && imgSrc ? 'auto' : 'none', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <h3 className="id-panel-title">
              <ImageIcon size={18} color="#1877F2" />
              Final Preview
            </h3>
            
            <div className="id-preview-box">
              <canvas
                ref={previewCanvasRef}
                style={{
                  width: '120px',
                  height: `${120 / selectedSize.aspect}px`,
                  objectFit: 'contain',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={downloadCroppedImage} className="id-btn-primary">
                <Download size={18} /> Download Single Photo
              </button>
              <button className="id-btn-outline" disabled title="Coming in Phase 2">
                Generate Print Sheet (4x6)
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
