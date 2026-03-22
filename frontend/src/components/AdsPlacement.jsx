import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * AdsPlacement — renders a real Google AdSense ad unit.
 * Optimized for React / SPA to ensure impressions are counted on navigation.
 * 
 * Props:
 *  - slot       : AdSense ad-slot ID (required)
 *  - format     : 'auto' | 'rectangle' | 'horizontal' | 'vertical' (default: 'auto')
 *  - responsive : true/false (default: true)
 *  - style      : extra inline styles for the wrapper div
 */
const AdsPlacement = ({
    slot,
    format = 'auto',
    responsive = true,
    style = {},
    className = '',
}) => {
    const adRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        // Short timeout ensures the DOM has fully rendered the 'ins' tag
        // and window.adsbygoogle is ready (especially with our lazy loader)
        const timer = setTimeout(() => {
            try {
                if (window.adsbygoogle && adRef.current) {
                    // Only push if not already initialized
                    if (!adRef.current.getAttribute('data-adsbygoogle-status')) {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                    }
                }
            } catch (e) {
                console.error('AdSense Error:', e);
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [location.pathname, slot]); // Re-initialize when navigating or slot changes

    return (
        <div
            className={`adsense-wrapper ${className}`}
            style={{
                textAlign: 'center',
                overflow: 'hidden',
                minWidth: '250px',
                minHeight: format === 'rectangle' ? '250px' : '90px',
                margin: '16px auto',
                ...style
            }}
        >
            <ins
                key={`${location.pathname}-${slot}`} // Force a new element on navigation
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-2020479148810052"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
};

export default AdsPlacement;

