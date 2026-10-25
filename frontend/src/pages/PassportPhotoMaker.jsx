import React from 'react';
import useSEO from '../hooks/useSEO';

const PassportPhotoMaker = () => {
  useSEO({
    title: 'Free Passport Photo Maker Online - India Sarkari Exam & Visa Photo Resizer | PDFbazaar',
    description: 'Create perfect 3.5x4.5cm passport photos and Sarkari exam photos (SSC, UPSC, Railway, Police) for free with 100+ frames. Auto crop, white background, 20KB-50KB size compression with name and date.',
    keywords: 'passport photo maker, online passport photo maker free, ssc photo resizer 20kb to 50kb, upsc photo resizer, passport size photo maker online india, 3.5 x 4.5 cm photo maker',
    path: '/passport-photo-maker',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'PDFBazaar Passport Photo & Sarkari Photo Maker',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR'
      },
      description: 'Free online tool to make passport photos and Sarkari exam photos with exact dimensions and file size (20KB - 50KB).'
    }
  });

  return (
    <div className="w-full" style={{ padding: 0, margin: 0, background: '#f3f4f6' }}>
      <iframe 
        src="/wizard-tool.html?v=5" 
        style={{ width: '100%', height: 'calc(100vh - 72px)', border: 'none', display: 'block' }}
        title="AI Passport and Full Studio Photo Maker with 100+ Frames"
        scrolling="yes"
      />
    </div>
  );
};

export default PassportPhotoMaker;
