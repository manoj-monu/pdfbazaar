import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDropzone } from 'react-dropzone';
import { jsPDF } from 'jspdf';
import { Upload, Download, CheckCircle, RotateCcw, Crop, Image as ImageIcon, Sparkles, SlidersHorizontal, Settings, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './PassportPhotoMaker.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PASSPORT_SIZES = [
  { id: 'us-passport', name: 'US Passport', flag: '🇺🇸', spec: '2 x 2 inch', width: 600, height: 600, aspect: 1 },
  { id: 'india-passport', name: 'India Passport', flag: '🇮🇳', spec: '35 x 45 mm', width: 413, height: 531, aspect: 35 / 45 },
  { id: 'uk-passport', name: 'UK Passport', flag: '🇬🇧', spec: '35 x 45 mm', width: 413, height: 531, aspect: 35 / 45 },
  { id: 'europe-visa', name: 'Schengen Visa', flag: '🇪🇺', spec: '35 x 45 mm', width: 413, height: 531, aspect: 35 / 45 },
  { id: 'canada-passport', name: 'Canada Passport', flag: '🇨🇦', spec: '50 x 70 mm', width: 591, height: 827, aspect: 50 / 70 }
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
  const [isScanning, setIsScanning] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [enhanceProgress, setEnhanceProgress] = useState(0);
  const [selectedBg, setSelectedBg] = useState('#1877F2'); // Default blue
  const [bgType, setBgType] = useState('Solid Color');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [finalImageBase64, setFinalImageBase64] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [userCredits, setUserCredits] = useState(0);

  // Phase 2: Initialize Guest User on load to sync with DB
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/auth/guest`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserCredits(data.user.credits);
        }
      })
      .catch(err => console.error("Could not init guest user:", err));
  }, []);

  // Update preview canvas in real-time when crop changes
  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      
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

      ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    }
  }, [completedCrop, selectedSize]);

  const SOLID_COLORS = ['#ffffff', '#1877F2', '#38bdf8', '#ef4444', '#64748b', '#000000', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#f3f4f6', '#3b82f6'];

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Load image locally for immediate UI preview
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setIsScanning(true);
      });
      reader.readAsDataURL(file);

      // Phase 2: Send to Backend Queue
      try {
        console.log("Sending photo to local backend queue...");
        // Convert file to Base64 (or use FormData for actual upload)
        const base64Data = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(file);
        });

        // Simulating the API Call to our Node.js Backend
        const response = await fetch(`${API_BASE_URL}/api/v1/photo/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: base64Data, // In production, send File via FormData
            documentId: selectedSize.id,
            countryId: 'US' // Mock
          })
        });

        const jobData = await response.json();
        
        if (!response.ok) {
           alert(jobData.error || "Failed to create job");
           setIsScanning(false);
           return;
        }
        
        console.log("Backend Job Created:", jobData);
        if (jobData.creditsLeft !== undefined) {
           setUserCredits(jobData.creditsLeft);
        }

        // Start Polling
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`${API_BASE_URL}/api/v1/photo/jobs/${jobData.jobId}/status`);
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              if (statusData.state === 'COMPLETED') {
                clearInterval(pollInterval);
                console.log("Job Completed!", statusData.result);
                
                // If the AI returned a background-removed image, update the UI
                if (statusData.result?.aiData?.backgroundData?.transparentImageUrl) {
                  setImgSrc(statusData.result.aiData.backgroundData.transparentImageUrl);
                }
                
                setIsScanning(false);
                setActiveTab('background'); // Auto switch to background tab to show off the removed BG
              } else if (statusData.state === 'FAILED') {
                clearInterval(pollInterval);
                console.error("Job Failed.");
                setIsScanning(false);
                alert("Processing failed. Please try again.");
              }
            }
          } catch (e) {
            console.error("Polling error", e);
          }
        }, 1500);

      } catch (error) {
        console.error("Backend Connection Error (Make sure Node server is running on 4000):", error);
        // Fallback if backend is down
        setTimeout(() => setIsScanning(false), 3000);
      }
    }
  }, [selectedSize.id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height, selectedSize.aspect);
    setCrop(initialCrop);
    
    // We need to wait a tiny bit for the image to be fully ready before setting completedCrop
    setTimeout(() => {
      setCompletedCrop(initialCrop);
    }, 100);

    if (isScanning) {
      setTimeout(() => setIsScanning(false), 3000);
    }
  };

  const handleSizeChange = (sizeId) => {
    const newSize = PASSPORT_SIZES.find(s => s.id === sizeId);
    setSelectedSize(newSize);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newSize.aspect));
    }
    setShowCountryModal(false);
  };

  const getFinalCroppedBase64 = () => {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    if (!image || !canvas || !completedCrop) return null;

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

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = selectedSize.width;
    finalCanvas.height = selectedSize.height;
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx.imageSmoothingQuality = 'high';
    finalCtx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

    return finalCanvas.toDataURL('image/jpeg', 1.0);
  };

  const downloadCroppedImage = async () => {
    const b64 = getFinalCroppedBase64();
    if (!b64) return;
    const link = document.createElement('a');
    link.download = `passport-photo-${selectedSize.id}.jpg`;
    link.href = b64;
    link.click();
  };

  const handlePrintSheet = () => {
    const b64 = getFinalCroppedBase64();
    if (b64) {
      setFinalImageBase64(b64);
      setShowPrintModal(true);
    }
  };

  const handleDownloadPDF = () => {
    if (!finalImageBase64) return;
    
    // Create a 4x6 inch PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [4, 6]
    });

    const isUS = selectedSize.id === 'us-passport';
    const photoWidth = isUS ? 2 : 1.37; // inches
    const photoHeight = isUS ? 2 : 1.77; // inches
    
    // Grid settings (For 4x6, we can usually fit 2 columns by 2 or 3 rows for US)
    // For smaller sizes like India (35x45mm), we can fit more.
    // To keep it simple, we'll draw a standard 3x4 grid for small or 2x2 for US.
    const cols = isUS ? 2 : 3;
    const rows = isUS ? 2 : 4;
    const spacingX = 0.1;
    const spacingY = 0.1;
    
    // Center the grid on the 4x6 page
    const totalGridWidth = (cols * photoWidth) + ((cols - 1) * spacingX);
    const totalGridHeight = (rows * photoHeight) + ((rows - 1) * spacingY);
    
    const startX = (4 - totalGridWidth) / 2;
    const startY = (6 - totalGridHeight) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + (col * (photoWidth + spacingX));
        const y = startY + (row * (photoHeight + spacingY));
        
        pdf.addImage(finalImageBase64, 'JPEG', x, y, photoWidth, photoHeight);
        
        // Draw cut lines (border)
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.01);
        pdf.rect(x, y, photoWidth, photoHeight);
      }
    }

    pdf.save(`print-sheet-${selectedSize.id}.pdf`);
  };

  const handleEnhanceClick = () => {
    setActiveTab('enhance');
    setEnhanceProgress(0);
    const interval = setInterval(() => {
      setEnhanceProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const resetImage = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setIsScanning(false);
  };

  return (
    <div className="id-studio-wrapper">
      <Helmet>
        <title>Global ID Photo Studio - Create Passport Photos Online | PDFBazaar</title>
        <meta name="description" content="Create perfect passport and ID photos in seconds using our Global ID Photo Studio. Select country, upload photo, crop automatically, and download." />
      </Helmet>

      <div className="id-studio-header" style={{ position: 'relative' }}>
        <h1>Global ID Photo Studio</h1>
        <p>Create Perfect Passport & Document Photos in Seconds</p>
        
        {!isLoggedIn ? (
          <button 
            onClick={() => setShowAuthModal(true)}
            style={{ position: 'absolute', right: '40px', top: '40px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '600' }}
          >
            <User size={18} /> Sign In
          </button>
        ) : (
          <div 
            onClick={() => setShowDashboard(true)}
            style={{ position: 'absolute', right: '40px', top: '40px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Alex Demo</div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>{userCredits} Credits Left</div>
            </div>
            <div className="id-dashboard-avatar" style={{ width: '45px', height: '45px', fontSize: '18px' }}>A</div>
          </div>
        )}
      </div>

      <div className="id-stepper">
        <div className={`id-step ${!imgSrc ? 'active' : ''}`}>
          <div className="id-step-num">1</div>
          Upload Photo
        </div>
        <div className="id-step-divider"></div>
        <div className={`id-step ${imgSrc && isScanning ? 'active' : ''}`}>
          <div className="id-step-num">2</div>
          Face Detection
        </div>
        <div className="id-step-divider"></div>
        <div className={`id-step ${imgSrc && !isScanning ? 'active' : ''}`}>
          <div className="id-step-num">3</div>
          Editing (Adjustments)
        </div>
      </div>

      <div className="id-workspace">
        
        {/* Editor Section */}
        {!imgSrc ? (
          <div {...getRootProps()} className={`id-upload-area ${isDragActive ? 'active' : ''}`}>
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
              <button className={`id-tool-btn ${activeTab === 'background' ? 'active' : ''}`} onClick={() => setActiveTab('background')}>
                <ImageIcon size={20} />
                Background
              </button>
              <button className={`id-tool-btn ${activeTab === 'enhance' ? 'active' : ''}`} onClick={handleEnhanceClick}>
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
            <div className="id-canvas-area" style={{ overflow: 'hidden', padding: (activeTab === 'enhance' || activeTab === 'background') ? '0' : '20px', background: activeTab === 'background' ? '#fff' : '' }}>
              
              {activeTab === 'background' && (
                <div className="id-bg-container">
                  <div className="id-bg-panel">
                    <div className="id-bg-title">Choose Background</div>
                    <div className="id-bg-grid">
                      {SOLID_COLORS.map(color => (
                        <div 
                          key={color} 
                          className={`id-bg-swatch ${selectedBg === color ? 'active' : ''}`} 
                          style={{ background: color, border: color === '#ffffff' ? '1px solid #ddd' : 'none' }}
                          onClick={() => setSelectedBg(color)}
                        />
                      ))}
                    </div>
                    <div className="id-bg-type-tabs">
                      <div className={`id-bg-type-tab ${bgType === 'Solid Color' ? 'active' : ''}`} onClick={() => setBgType('Solid Color')}>Solid Color</div>
                      <div className={`id-bg-type-tab ${bgType === 'Gradient' ? 'active' : ''}`} onClick={() => setBgType('Gradient')}>Gradient</div>
                      <div className={`id-bg-type-tab ${bgType === 'Image' ? 'active' : ''}`} onClick={() => setBgType('Image')}>Image</div>
                    </div>
                  </div>
                  <div className="id-bg-preview-area">
                    <div className="id-bg-preview-img-wrapper" style={{ background: selectedBg }}>
                      <img src={imgSrc} alt="Preview with background" className="id-bg-preview-img" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'enhance' && (
                <div className="id-enhance-container">
                  <div className="id-enhance-slider-area">
                    <img src={imgSrc} alt="Before" className="id-enhance-img" />
                    <img src={imgSrc} alt="After" className="id-enhance-img id-enhance-img-after" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }} />
                    <div className="id-enhance-slider-line" style={{ left: `${sliderPosition}%` }}>
                      <div className="id-enhance-slider-button"><SlidersHorizontal size={16} /></div>
                    </div>
                    <input type="range" min="0" max="100" value={sliderPosition} onChange={(e) => setSliderPosition(e.target.value)} className="id-enhance-slider-input" />
                    <div className="id-enhance-labels">
                      <div className="id-enhance-label">Before</div>
                      <div className="id-enhance-label">After</div>
                    </div>
                  </div>

                  <div className="id-enhance-sidebar">
                    <div className="id-enhance-title">Enhancing Photo Quality</div>
                    <div className="id-enhance-checklist">
                      <div className={`id-enhance-check-item ${enhanceProgress >= 25 ? 'active' : ''}`}><CheckCircle size={16} /> Adjusting brightness</div>
                      <div className={`id-enhance-check-item ${enhanceProgress >= 50 ? 'active' : ''}`}><CheckCircle size={16} /> Correcting contrast</div>
                      <div className={`id-enhance-check-item ${enhanceProgress >= 75 ? 'active' : ''}`}><CheckCircle size={16} /> Enhancing sharpness</div>
                      <div className={`id-enhance-check-item ${enhanceProgress >= 100 ? 'active' : ''}`}><CheckCircle size={16} /> AI skin smoothing</div>
                    </div>
                    <div className="id-enhance-progress">
                      <div className="id-enhance-progress-bar" style={{ width: `${enhanceProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'crop' && (
                <>
                  {isScanning && (
                    <div className="id-scanner-overlay">
                      <div className="id-scanner-box">
                        <div className="id-scanner-corner id-corner-tl"></div>
                        <div className="id-scanner-corner id-corner-tr"></div>
                        <div className="id-scanner-corner id-corner-bl"></div>
                        <div className="id-scanner-corner id-corner-br"></div>
                      </div>
                      <div className="id-scanner-text"><Sparkles size={18} /> Detecting Face & Adjusting Alignment...</div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                    <div className="id-canvas-wrapper" style={{ opacity: isScanning ? 0.5 : 1, transition: 'opacity 0.3s', position: 'relative', marginBottom: '20px' }}>
                      <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={selectedSize.aspect} style={{ maxHeight: '460px', pointerEvents: isScanning ? 'none' : 'auto' }}>
                        <img ref={imgRef} alt="Crop Preview" src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '460px', objectFit: 'contain' }} />
                      </ReactCrop>
                    </div>

                    {!isScanning && imgSrc && (
                      <button 
                        className="id-btn-primary" 
                        style={{ width: 'auto', padding: '12px 40px', borderRadius: '30px' }} 
                        onClick={() => setActiveTab('background')}
                      >
                         <CheckCircle size={18} /> Apply Crop & Continue
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="id-panel">
          <div className="id-panel-section">
            <h3 className="id-panel-title"><Settings size={18} color="#1877F2" /> Country & Document</h3>
            <label style={{ fontSize: '13px', color: '#555', marginBottom: '8px', display: 'block' }}>Select Configuration</label>
            
            <div className="id-select-trigger" onClick={() => setShowCountryModal(true)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{selectedSize.flag}</span>
                <span style={{ fontWeight: '500' }}>{selectedSize.name}</span>
              </div>
              <ChevronDown size={16} color="#888" />
            </div>

            <div className="id-info-box" style={{ marginTop: '20px' }}>
              <div className="id-info-row"><span className="id-info-label">Requirements</span><span className="id-info-value" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Verified</span></div>
              <div className="id-info-row"><span className="id-info-label">Width</span><span className="id-info-value">{selectedSize.width} px</span></div>
              <div className="id-info-row"><span className="id-info-label">Height</span><span className="id-info-value">{selectedSize.height} px</span></div>
              <div className="id-info-row"><span className="id-info-label">Background</span><span className="id-info-value">White / Transparent</span></div>
            </div>
          </div>

          <div className="id-panel-section" style={{ opacity: completedCrop && imgSrc ? 1 : 0.5, pointerEvents: completedCrop && imgSrc ? 'auto' : 'none', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <h3 className="id-panel-title"><ImageIcon size={18} color="#1877F2" /> Final Preview</h3>
            
            <div className="id-preview-box">
              <canvas ref={previewCanvasRef} style={{ width: '120px', height: `${120 / selectedSize.aspect}px`, objectFit: 'contain', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={downloadCroppedImage} className="id-btn-primary">
                <Download size={18} /> Download Single Photo
              </button>
              <button className="id-btn-outline" onClick={handlePrintSheet}>
                Generate Print Sheet (4x6)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen 10: How It Works */}
      <div className="id-landing-section">
        <h2 className="id-section-title">How It Works</h2>
        <div className="id-how-grid">
          <div className="id-how-card">
            <div className="id-how-icon"><Upload size={28} /></div>
            <h3>1. Upload Photo</h3>
            <p>Choose any photo from your phone or computer. Our AI will automatically detect your face and align it correctly.</p>
          </div>
          <div className="id-how-card">
            <div className="id-how-icon"><Sparkles size={28} /></div>
            <h3>2. Edit & Adjust</h3>
            <p>Use our AI tools to remove backgrounds, enhance quality, and select the perfect dimensions for your country's passport.</p>
          </div>
          <div className="id-how-card">
            <div className="id-how-icon"><Download size={28} /></div>
            <h3>3. Download & Print</h3>
            <p>Download a single high-quality photo or generate a 4x6 print sheet ready to be printed at your local pharmacy.</p>
          </div>
        </div>
      </div>

      {/* Screen 11: Pricing */}
      <div className="id-landing-section" style={{ background: '#f8fafc', padding: '60px 20px', borderRadius: '24px' }}>
        <h2 className="id-section-title">Simple & Affordable Pricing</h2>
        <div className="id-pricing-grid">
          <div className="id-pricing-card">
            <h3>Free</h3>
            <p style={{ color: '#666', fontSize: '13px' }}>For new users</p>
            <div className="id-pricing-price">₹0</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', fontSize: '14px', color: '#555', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><CheckCircle size={14} color="#10b981" /> 5 Free Credits</li>
              <li><CheckCircle size={14} color="#10b981" /> Basic Auto Crop</li>
              <li><CheckCircle size={14} color="#10b981" /> Standard Download</li>
            </ul>
            <button className="id-btn-outline">Get Started</button>
          </div>
          <div className="id-pricing-card">
            <h3>Monthly</h3>
            <p style={{ color: '#666', fontSize: '13px' }}>Perfect for individuals</p>
            <div className="id-pricing-price">₹99<span>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', fontSize: '14px', color: '#555', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><CheckCircle size={14} color="#10b981" /> 50 Photos/mo</li>
              <li><CheckCircle size={14} color="#10b981" /> AI Background Removal</li>
              <li><CheckCircle size={14} color="#10b981" /> 4x6 Print Sheets</li>
            </ul>
            <button className="id-btn-primary">Subscribe</button>
          </div>
          <div className="id-pricing-card popular">
            <div className="id-pricing-badge">Best Value</div>
            <h3>6 Months</h3>
            <p style={{ color: '#666', fontSize: '13px' }}>Save 33% today</p>
            <div className="id-pricing-price">₹499</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', fontSize: '14px', color: '#555', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><CheckCircle size={14} color="#10b981" /> 400 Photos</li>
              <li><CheckCircle size={14} color="#10b981" /> Studio Batch Processing</li>
              <li><CheckCircle size={14} color="#10b981" /> Priority Support</li>
            </ul>
            <button className="id-btn-primary">Subscribe</button>
          </div>
          <div className="id-pricing-card">
            <h3>Yearly</h3>
            <p style={{ color: '#666', fontSize: '13px' }}>Save 58% today</p>
            <div className="id-pricing-price">₹999</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', fontSize: '14px', color: '#555', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><CheckCircle size={14} color="#10b981" /> Unlimited Photos</li>
              <li><CheckCircle size={14} color="#10b981" /> API Access</li>
              <li><CheckCircle size={14} color="#10b981" /> White-label Downloads</li>
            </ul>
            <button className="id-btn-primary">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Screen 8: Print Template Modal */}
      {showPrintModal && (
        <div className="id-modal-overlay" onClick={() => setShowPrintModal(false)}>
          <div className="id-modal-content" onClick={e => e.stopPropagation()}>
            <div className="id-modal-header">
              <h2><ImageIcon size={22} color="#1877F2" /> 4 x 6 Print Sheet (12 Photos)</h2>
              <button className="id-modal-close" onClick={() => setShowPrintModal(false)}>&times;</button>
            </div>
            <div className="id-modal-body">
              <div className="id-print-preview">
                <div className="id-print-sheet" style={{ width: '380px', height: '570px' }}>
                  {[...Array(12)].map((_, i) => (
                    <img key={i} src={finalImageBase64} alt={`Print item ${i+1}`} className="id-print-item" />
                  ))}
                </div>
              </div>
              <div className="id-print-settings">
                <div className="id-print-settings-block">
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Photo Size</h3>
                  <p><strong>{selectedSize.name.includes('mm') ? '35 mm x 45 mm' : '2 x 2 inch'}</strong></p>
                  <p>2 mm paper margin</p>
                  <p>2 mm photo gap</p>
                  <p>Black border: <span style={{ color: '#10b981' }}>Enabled</span></p>
                </div>
                <button className="id-btn-primary" style={{ padding: '16px' }} onClick={handleDownloadPDF}>
                  <Download size={20} /> Download PDF
                </button>
                <button className="id-btn-outline" onClick={() => setShowPrintModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 14: FAQ Section */}
      <div className="id-faq-section">
        <h2 className="id-section-title">Frequently Asked Questions</h2>
        
        <div className="id-faq-item">
          <div className="id-faq-question" onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}>
            Is this tool completely free to use?
            {openFaq === 1 ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
          </div>
          <div className={`id-faq-answer ${openFaq === 1 ? 'open' : ''}`}>
            Yes, new users receive 5 free credits which allow you to process and download 5 passport photos without watermarks. After that, you can choose one of our affordable subscription plans.
          </div>
        </div>

        <div className="id-faq-item">
          <div className="id-faq-question" onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}>
            Does the AI automatically remove backgrounds?
            {openFaq === 2 ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
          </div>
          <div className={`id-faq-answer ${openFaq === 2 ? 'open' : ''}`}>
            Yes! Our AI will detect the subject in your photo and precisely remove the background. You can then choose a white, blue, or transparent background depending on your country's passport requirements.
          </div>
        </div>

        <div className="id-faq-item">
          <div className="id-faq-question" onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}>
            Are the generated photos compliant with government standards?
            {openFaq === 3 ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
          </div>
          <div className={`id-faq-answer ${openFaq === 3 ? 'open' : ''}`}>
            We provide preset dimensions (e.g., 2x2 inches for the US, 35x45mm for Europe and India) that match official government requirements. However, you should still ensure your facial expression, lighting, and attire meet standard passport guidelines.
          </div>
        </div>

        <div className="id-faq-item">
          <div className="id-faq-question" onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}>
            Can I print these photos at a local pharmacy?
            {openFaq === 4 ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
          </div>
          <div className={`id-faq-answer ${openFaq === 4 ? 'open' : ''}`}>
            Absolutely. You can use our "Generate Print Sheet" feature to create a standard 4x6 inch photo sheet containing multiple copies of your passport photo. This 4x6 sheet can be printed at any local pharmacy or photo center for just a few cents.
          </div>
        </div>
      </div>

      {/* Screen 15: Footer (Blog / Help / Security) */}
      <footer className="id-footer">
        <div className="id-footer-content">
          <div className="id-footer-col">
            <h4>Global ID Photo Studio</h4>
            <p style={{ fontSize: '13px', lineHeight: '1.6', margin: '0 0 15px 0' }}>The world's smartest AI passport photo maker. Create compliant ID photos for 100+ countries from the comfort of your home.</p>
          </div>
          <div className="id-footer-col">
            <h4>Resources & Help</h4>
            <ul>
              <li><a>Photo Requirements Blog</a></li>
              <li><a>How to Take a Good Photo</a></li>
              <li><a>Help Center</a></li>
              <li><a>Contact Support</a></li>
            </ul>
          </div>
          <div className="id-footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a>Terms of Service</a></li>
              <li><a>Privacy Policy</a></li>
              <li><a>Refund Policy</a></li>
            </ul>
          </div>
          <div className="id-footer-col">
            <h4>Features</h4>
            <ul>
              <li><a>AI Background Removal</a></li>
              <li><a>Automatic Smart Crop</a></li>
              <li><a>4x6 Print Templates</a></li>
              <li><a>Batch Processing API</a></li>
            </ul>
          </div>
        </div>
        <div className="id-footer-bottom">
          <div>© 2026 PDFBazaar. All rights reserved.</div>
          <div className="id-footer-security">
            <Sparkles size={14} /> Screen 18: SSL Secured & Photos Auto-Deleted in 24h
          </div>
        </div>
      </footer>

      {/* Screen 12: Auth Modal */}
      {showAuthModal && (
        <div className="id-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="id-auth-modal" onClick={e => e.stopPropagation()}>
            <button className="id-modal-close" style={{ position: 'absolute', top: '15px', right: '20px' }} onClick={() => setShowAuthModal(false)}>&times;</button>
            <div className="id-auth-header">
              <h2>{authMode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
              <p>{authMode === 'login' ? 'Sign in to access your saved photos and credits.' : 'Join to get 5 free photo generation credits.'}</p>
            </div>
            <div className="id-auth-body">
              <button className="id-auth-social-btn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="18" height="18" />
                Continue with Google
              </button>
              
              <div className="id-auth-divider">OR</div>

              <div className="id-auth-input-group">
                <label className="id-auth-label">Email Address</label>
                <input type="email" className="id-auth-input" placeholder="you@example.com" />
              </div>
              <div className="id-auth-input-group">
                <label className="id-auth-label">Password</label>
                <input type="password" className="id-auth-input" placeholder="••••••••" />
              </div>

              <button 
                className="id-btn-primary" 
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                onClick={() => {
                  setIsLoggedIn(true);
                  setShowAuthModal(false);
                }}
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="id-auth-footer">
                {authMode === 'login' ? (
                  <>Don't have an account? <a onClick={() => setAuthMode('signup')}>Sign Up</a></>
                ) : (
                  <>Already have an account? <a onClick={() => setAuthMode('login')}>Sign In</a></>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 13: Dashboard / User Panel */}
      {showDashboard && (
        <div className="id-modal-overlay" onClick={() => setShowDashboard(false)}>
          <div className="id-dashboard-modal" onClick={e => e.stopPropagation()}>
            <div className="id-dashboard-header">
              <div className="id-dashboard-user-info">
                <div className="id-dashboard-avatar">A</div>
                <div>
                  <h2>Alex Demo</h2>
                  <p>alex.demo@example.com • Pro Member</p>
                </div>
              </div>
              <div className="id-dashboard-stats">
                <div className="id-dashboard-stat-box">
                  <h3>{userCredits}</h3>
                  <p>Credits</p>
                </div>
                <div className="id-dashboard-stat-box">
                  <h3>12</h3>
                  <p>Photos Generated</p>
                </div>
              </div>
              <button className="id-modal-close" style={{ alignSelf: 'flex-start', marginTop: '-10px' }} onClick={() => setShowDashboard(false)}>&times;</button>
            </div>
            
            <div className="id-dashboard-body">
              <h3 className="id-dashboard-section-title">Recent Photos</h3>
              <div className="id-dashboard-history-grid">
                {[1, 2, 3].map(item => (
                  <div key={item} className="id-dashboard-history-card">
                    <img src={imgSrc || "https://placehold.co/200x250/f1f5f9/a0aec0?text=Photo"} alt="History item" className="id-dashboard-history-img" style={{ objectFit: 'cover' }} />
                    <div className="id-dashboard-history-details">
                      <h4>US Passport</h4>
                      <p>Oct {10 - item}, 2026</p>
                    </div>
                    <div className="id-dashboard-history-actions">
                      <button className="id-dashboard-history-btn"><Download size={14} /> JPG</button>
                      <button className="id-dashboard-history-btn"><Download size={14} /> PDF</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', color: '#666' }}>Active Plan: <strong>Monthly Subscription</strong> (Renews Nov 8, 2026)</div>
                <button 
                  onClick={() => {
                    setIsLoggedIn(false);
                    setShowDashboard(false);
                  }}
                  style={{ background: 'transparent', border: '1px solid #ff4d4f', color: '#ff4d4f', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 9: Country Selection Modal */}
      {showCountryModal && (
        <div className="id-modal-overlay" onClick={() => setShowCountryModal(false)}>
          <div className="id-country-modal" onClick={e => e.stopPropagation()}>
            <div className="id-country-header">
              <h2>Select Country & Document Type</h2>
              <button className="id-modal-close" onClick={() => setShowCountryModal(false)}>&times;</button>
            </div>
            <div className="id-country-search-container">
              <input 
                type="text" 
                className="id-country-search" 
                placeholder="Search by country (e.g. USA, India, UK)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="id-country-list">
              {PASSPORT_SIZES.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(size => (
                <div 
                  key={size.id} 
                  className={`id-country-item ${selectedSize.id === size.id ? 'active' : ''}`}
                  onClick={() => handleSizeChange(size.id)}
                >
                  <div className="id-country-details">
                    <span className="id-country-flag">{size.flag}</span>
                    <div>
                      <h4 className="id-country-name">{size.name}</h4>
                      <p className="id-country-spec">{size.spec} • White Background Required</p>
                    </div>
                  </div>
                  <button className="id-country-select-btn">
                    {selectedSize.id === size.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              ))}
              {PASSPORT_SIZES.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                  No countries found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
