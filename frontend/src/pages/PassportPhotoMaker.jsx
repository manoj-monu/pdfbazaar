import React, { useEffect } from 'react';

const PassportPhotoMaker = () => {
  useEffect(() => {
    document.title = "Passport Photo Maker - PDFbazaar";
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Tool Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-0 md:px-4 py-8">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <iframe 
              src="/wizard-tool.html" 
              style={{ width: '100%', height: '900px', border: 'none' }}
              title="AI Passport Photo Maker"
              scrolling="no"
            />
          </div>
        </div>
      </div>

      {/* Ad Placeholder 1 */}
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block w-full max-w-4xl h-32 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
          <div>
            <p className="font-bold text-lg">Google AdSense Banner</p>
            <p className="text-sm">728x90 or Responsive Ad Unit</p>
          </div>
        </div>
      </div>

      {/* Content Section: Features & Guide */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Create Professional Passport Photos in Seconds</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our AI-powered tool automatically removes backgrounds, enhances facial details, and formats your photo to exact government specifications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">AI Background Removal</h3>
            <p className="text-gray-600">Instantly replace any messy background with a clean, solid color required for official documents.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <i className="fa-solid fa-face-smile"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">HD Face Enhancement</h3>
            <p className="text-gray-600">Advanced AI sharpens facial features, fixes lighting, and ensures your photo looks crystal clear.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              <i className="fa-solid fa-print"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Ready to Print Layouts</h3>
            <p className="text-gray-600">Generate A4 or 4x6 inch print sheets automatically. Save money by printing at your local shop.</p>
          </div>
        </div>

        {/* Ad Placeholder 2 */}
        <div className="w-full text-center my-16">
          <div className="inline-block w-full max-w-3xl h-64 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            <div>
              <p className="font-bold text-lg">Display Ad Unit</p>
              <p className="text-sm">300x250 or Responsive Rectangle</p>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-indigo-50 rounded-3xl p-8 md:p-12 border border-indigo-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Standard Photo Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                <span className="text-gray-700"><strong>White or light blue background</strong> without shadows or patterns.</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                <span className="text-gray-700"><strong>Neutral facial expression</strong> with both eyes open and mouth closed.</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                <span className="text-gray-700"><strong>Directly facing the camera</strong>, showing full face and ears if possible.</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                <span className="text-gray-700"><strong>No glasses</strong> (especially with glare) or tinted contact lenses.</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                <span className="text-gray-700"><strong>Good lighting</strong> on the face, with no shadows on the neck or background.</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                <span className="text-gray-700"><strong>Recent photo</strong> taken within the last 6 months.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PassportPhotoMaker;
