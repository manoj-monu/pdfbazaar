import { useEffect, useRef } from 'react';

/**
 * AdsPlacement — renders a real Google AdSense ad unit.
 *
 * Props:
 *  - slot       : AdSense ad-slot ID (required once you create ad units in AdSense dashboard)
 *  - format     : 'auto' | 'rectangle' | 'horizontal' | 'vertical'  (default: 'auto')
 *  - responsive : true/false  (default: true)
 *  - style      : extra inline styles for the wrapper div
 *
 * Usage examples:
 *   <AdsPlacement slot="1234567890" format="horizontal" />
 *   <AdsPlacement slot="0987654321" format="rectangle" />
 */
const AdsPlacement = ({
    slot = 'auto',          // Replace with real slot IDs from your AdSense dashboard
    format = 'auto',
    responsive = true,
    style = {},
    className = '',
}) => {
    const adRef = useRef(null);

    useEffect(() => {
        try {
            if (window.adsbygoogle && adRef.current) {
                // Only push if not already initialized
                if (!adRef.current.getAttribute('data-adsbygoogle-status')) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            }
        } catch (e) {
            // AdSense might be blocked by ad-blocker, silently ignore
        }
    }, []);

    return (
        <div
            className={`adsense-wrapper ${className}`}
            style={{
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: format === 'rectangle' ? '250px' : '90px',
                ...style
            }}
        >
            <ins
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
