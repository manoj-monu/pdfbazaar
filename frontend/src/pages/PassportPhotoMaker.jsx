import React, { useEffect } from 'react';

const PassportPhotoMaker = () => {
  useEffect(() => {
    document.title = "Passport Photo Maker - PDFbazaar";
  }, []);

  return (
    <div className="container mx-auto" style={{ minHeight: '80vh', padding: 0 }}>
      {/* We embed the standalone wizard.html here. It contains all the new AI functionality. */}
      <iframe 
        src="/wizard-tool.html" 
        style={{ width: '100%', height: '850px', border: 'none', overflow: 'hidden' }}
        title="AI Passport Photo Maker"
        scrolling="yes"
      />
    </div>
  );
};

export default PassportPhotoMaker;
