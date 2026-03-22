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
                <p><strong>PDFbazaar is a processing utility, not a file storage provider.</strong> We believe that simple tasks shouldn't require expensive software subscriptions or compromise your data. That is why PDFbazaar.com is completely free, easy to use, does not put watermarks on your personal documents, and automatically deletes all files within 1 hour to ensure complete safety and privacy.</p>
            </div>
            <AdsPlacement slot="2965247838" format="horizontal" style={{ marginTop: '40px' }} />
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
                <p>General inquiries & Support: <strong>support@pdfbazaar.in</strong></p>
                <p>Legal & DMCA/Copyright Claims: <strong>support@pdfbazaar.in</strong></p>
                <p>Our team aims to respond to all inquiries within 24-48 hours. Please include your original document if you experienced an error, ensuring you remove sensitive information first.</p>
            </div>
            <AdsPlacement slot="2965247838" format="horizontal" style={{ marginTop: '40px' }} />
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
                <h3>1. Document Security & Auto-Deletion</h3>
                <p>All documents uploaded to our servers are strictly processed using automated scripts. <strong>They are automatically and permanently deleted from our cloud servers within 1 hour of processing.</strong> We do not read, copy, host, index, or share your documents with any third-party entities.</p>
                <h3>2. Data Collection</h3>
                <p>We may collect standard analytics data such as IP address, browser type, and timestamps to improve our website's performance and fix technical bugs. No personally identifiable information is stored without your full consent.</p>
                <h3>3. Cookies</h3>
                <p>We use cookies to improve user experience and deliver relevant advertisements via Google AdSense. Users can modify their cookie tracking preferences directly through their browser settings.</p>
            </div>
            <AdsPlacement slot="2965247838" format="horizontal" style={{ marginTop: '40px' }} />
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
                <p>You agree to use PDFbazaar.com tools only for lawful purposes. You must not use our service to process documents related to illegal activities, extreme violence, or unauthorized copyrighted materials. Users are solely responsible for the content they upload.</p>
                <h3>2. Service Availability</h3>
                <p>We try to keep PDFbazaar.com up 24/7. However, our services are provided "as is" and we take no responsibility for temporary server downtime or failed file conversions.</p>
                <h3>3. Liability</h3>
                <p>PDFbazaar.com is not responsible for any damage, data loss, or business interruption that may result from using our free tools. Please always keep an original backup of your files.</p>
                <h3>4. DMCA & Copyright Policy</h3>
                <p>PDFbazaar respects the intellectual property rights of others. We operate solely as a processing tool and do not permanently host, share, or index any user-uploaded files. All files are automatically deleted from our servers within 1 hour of processing. If you believe your copyrighted work has been improperly processed through our tools, please report it along with proof to <strong>support@pdfbazaar.in</strong>, and we will ensure compliance.</p>
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
                <h3>1. User Content Responsibility</h3>
                <p>PDFbazaar acts solely as a transient processing service. We do not monitor, endorse, or assume any liability for the content uploaded by users. Users bear full responsibility for ensuring they hold the necessary rights or permissions to process documents using our tools. We claim protection under DMCA Safe Harbor and similar global regulations, as all data is automatically purged shortly after processing.</p>
                <h3>2. No Guarantee of Accuracy</h3>
                <p>While we strive to provide the best PDF conversion algorithms, we make no representations or warranties of any kind regarding the completeness, accuracy, reliability, or suitability of our tools for professional or critical documentation. Use our services at your own risk.</p>
                <h3>3. Third-Party Links</h3>
                <p>Through this website, you are able to link to other websites directly or via advertisements. We have no control over the nature, content, and availability of those external sites. The inclusion of any links does not imply a recommendation or endorse the views expressed within them.</p>
                <h3>4. Independence</h3>
                <p>PDFbazaar.com is a fully independent platform developed from the ground up, and is NOT affiliated with, endorsed by, or sponsored by iLovePDF, Adobe, or any other trademark owners. All brand names or trademarks mentioned exist solely for comparative or descriptive purposes and belong to their respective owners.</p>
            </div>
            <AdsPlacement slot="2965247838" format="horizontal" style={{ marginTop: '40px' }} />
        </div>
    );
};
