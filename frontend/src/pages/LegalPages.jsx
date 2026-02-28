import useSEO from '../hooks/useSEO';
import AdsPlacement from '../components/AdsPlacement';

export const AboutUs = () => {
    useSEO({
        title: 'About Us | PDFbazaar.com',
        description: 'Learn about PDFbazaar.com, your trusted source for free online PDF tools in India.',
        keywords: 'about pdfbazaar, pdfbazaar team, free pdf tools india'
    });
    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '24px' }}>About Us</h1>
            <div className="blog-content" style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                <p>Welcome to <strong>PDFbazaar.com</strong>, your ultimate destination for everything related to PDF documents. Our mission is to provide fast, reliable, and 100% free PDF management tools tailored to Indian users and beyond.</p>
                <p>Whether you need to compress an Aadhar card for a government form, merge study notes, or safely unlock pan card PDFs, our robust backend handles it all while respecting your privacy.</p>
                <p>We believe that simple tasks shouldn't require expensive software subscriptions. That is why PDFbazaar.com is completely free, easy to use, and does not put watermarks on your personal documents.</p>
            </div>
            <AdsPlacement type="rectangle" style={{ marginTop: '40px' }} />
        </div>
    );
};

export const ContactUs = () => {
    useSEO({
        title: 'Contact Us | PDFbazaar.com',
        description: 'Get in touch with the PDFbazaar.com team for support, business inquiries, or feedback.',
        keywords: 'contact pdfbazaar, pdf tool support'
    });
    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '24px' }}>Contact Us</h1>
            <div className="blog-content" style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                <p>Have questions, feedback, or need help with a tool? We'd love to hear from you.</p>
                <p>Email: <strong>support@pdfbazaar.in</strong></p>
                <p>Our team aims to respond to all inquiries within 24-48 hours. Please include your original document if you experienced an error, ensuring you remove sensitive information first.</p>
            </div>
            <AdsPlacement type="rectangle" style={{ marginTop: '40px' }} />
        </div>
    );
};

export const PrivacyPolicy = () => {
    useSEO({
        title: 'Privacy Policy | PDFbazaar.com',
        description: 'Learn how PDFbazaar.com protects your documents and personal information.',
        keywords: 'privacy policy pdfbazaar, data security pdf tool'
    });
    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '24px' }}>Privacy Policy</h1>
            <div className="blog-content" style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                <p>Your privacy is our highest priority at PDFbazaar.com. Please read our policy carefully.</p>
                <h3>1. Document Security</h3>
                <p>All documents uploaded to our servers are strictly processed using automated scripts. They are automatically deleted from our cloud servers within 1 hour of processing. We do not read, copy, or share your documents with any third-party entities.</p>
                <h3>2. Data Collection</h3>
                <p>We may collect standard analytics data such as IP address, browser type, and timestamps to improve our website's performance and fix technical bugs. No personally identifiable information is stored without your full consent.</p>
                <h3>3. Cookies</h3>
                <p>We use cookies to improve user experience and deliver relevant advertisements via Google AdSense. Users can modify their cookie tracking preferences directly through their browser settings.</p>
            </div>
        </div>
    );
};

export const TermsConditions = () => {
    useSEO({
        title: 'Terms and Conditions | PDFbazaar.com',
        description: 'Read the terms of use for the PDFbazaar.com platform.',
        keywords: 'terms and conditions pdfbazaar, rules of use'
    });
    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '24px' }}>Terms & Conditions</h1>
            <div className="blog-content" style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                <p>By using the PDFbazaar.com website, you agree to these Terms and Conditions.</p>
                <h3>1. Acceptable Use</h3>
                <p>You agree to use PDFbazaar.com tools only for lawful purposes. You must not use our service to process documents related to illegal activities, extreme violence, or unauthorized copyrighted materials.</p>
                <h3>2. Service Availability</h3>
                <p>We try to keep PDFbazaar.com up 24/7. However, our services are provided "as is" and we take no responsibility for temporary server downtime or failed file conversions.</p>
                <h3>3. Liability</h3>
                <p>PDFbazaar.com is not responsible for any damage, data loss, or business interruption that may result from using our free tools. Please always keep an original backup of your files.</p>
            </div>
        </div>
    );
};

export const Disclaimer = () => {
    useSEO({
        title: 'Disclaimer | PDFbazaar.com',
        description: 'Read the disclaimer for the PDFbazaar.com platform.',
        keywords: 'disclaimer pdfbazaar'
    });
    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '24px' }}>Disclaimer</h1>
            <div className="blog-content" style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                <p>The information and tools provided by PDFbazaar.com are for general informational and utility purposes only.</p>
                <h3>1. No Guarantee of Accuracy</h3>
                <p>While we strive to provide the best PDF conversion algorithms, we make no representations or warranties of any kind regarding the completeness, accuracy, reliability, or suitability of our tools for professional or critical documentation.</p>
                <h3>2. Third-Party Links</h3>
                <p>Through this website, you are able to link to other websites which are not under the control of PDFbazaar.com. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>
                <h3>3. Independence</h3>
                <p>PDFbazaar.com is an independent platform and is NOT affiliated with, endorsed by, or sponsored by iLovePDF, Adobe, or any other trademark owners. All brand names used exist solely for comparative or descriptive purposes.</p>
            </div>
        </div>
    );
};
