import React, { useEffect } from 'react';

const PassportPhotoMaker = () => {
  useEffect(() => {
    document.title = "Passport & Full Studio Photo Maker with 100+ Frames - PDFbazaar";
  }, []);

  return (
    <div className="w-full" style={{ padding: 0, margin: 0, background: '#f3f4f6' }}>
      <iframe 
        src="/wizard-tool.html?v=4" 
        style={{ width: '100%', height: 'calc(100vh - 72px)', border: 'none', display: 'block' }}
        title="AI Passport and Full Studio Photo Maker with 100+ Frames"
        scrolling="yes"
      />
    </div>
  );
};

export default PassportPhotoMaker;
