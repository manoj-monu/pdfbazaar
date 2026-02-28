import { useEffect } from 'react';

const SITE_URL = 'https://pdfbazaar.com';
const SITE_NAME = 'PDFbazaar.com';

const useSEO = ({ title, description, keywords, path = '', schema = null }) => {
    useEffect(() => {
        // ── Title ──
        if (title) document.title = title;

        const setMeta = (selector, attr, value) => {
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('meta');
                const [attrName] = selector.match(/\[([^\]]+)=/) || [];
                if (attrName) {
                    const name = attrName.replace(/[\[\]"=]/g, '').split('=')[0];
                    el.setAttribute(name.includes('property') ? 'property' : 'name',
                        selector.match(/["']([^"']+)["']/)?.[1] || '');
                }
                document.head.appendChild(el);
            }
            el.setAttribute(attr, value);
        };

        // ── Basic Meta ──
        if (description) {
            setMeta('meta[name="description"]', 'content', description);
        }
        if (keywords) {
            setMeta('meta[name="keywords"]', 'content', keywords);
        }

        // ── Canonical URL ──
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = `${SITE_URL}${path || window.location.pathname}`;

        // ── Open Graph (Facebook, WhatsApp, LinkedIn) ──
        const ogTags = {
            'og:title': title || SITE_NAME,
            'og:description': description || '',
            'og:type': 'website',
            'og:url': `${SITE_URL}${path || window.location.pathname}`,
            'og:site_name': SITE_NAME,
            'og:image': `${SITE_URL}/og-image.png`,
            'og:locale': 'en_IN',
        };
        Object.entries(ogTags).forEach(([property, content]) => {
            let el = document.querySelector(`meta[property="${property}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute('property', property);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        });

        // ── Twitter Card ──
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': title || SITE_NAME,
            'twitter:description': description || '',
            'twitter:image': `${SITE_URL}/og-image.png`,
            'twitter:site': '@pdfbazaar',
        };
        Object.entries(twitterTags).forEach(([name, content]) => {
            let el = document.querySelector(`meta[name="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute('name', name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        });

        // ── JSON-LD Schema ──
        // Remove old schema
        document.querySelectorAll('script[data-seo-schema]').forEach(s => s.remove());

        const schemas = [];

        // WebSite schema with SearchAction on every page
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: SITE_URL,
            description: 'Free online PDF tools — merge, split, compress, convert PDF online in India.',
            potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
            },
        });

        // Organization schema
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            sameAs: [
                'https://twitter.com/pdfbazaar',
                'https://facebook.com/pdfbazaar',
            ],
        });

        // Extra schema passed by the page
        if (schema) schemas.push(schema);

        schemas.forEach(s => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo-schema', 'true');
            script.textContent = JSON.stringify(s);
            document.head.appendChild(script);
        });

    }, [title, description, keywords, path, schema]);
};

export default useSEO;
