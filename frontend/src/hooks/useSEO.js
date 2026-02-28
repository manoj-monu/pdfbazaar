import { useEffect } from 'react';

const useSEO = ({ title, description, keywords }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                metaDescription.content = description;
                document.head.appendChild(metaDescription);
            }
        }

        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            } else {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                metaKeywords.content = keywords;
                document.head.appendChild(metaKeywords);
            }
        }
    }, [title, description, keywords]);
};

export default useSEO;
