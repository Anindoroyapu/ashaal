'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  canonical?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Shop online at Ashaal.com.bd for electronics, fashion, beauty, home appliances & groceries with fast nationwide delivery, Cash on Delivery, bKash & Nagad payments, and 100% authentic AshaalMall brands.',
  keywords = 'Ashaal, online shopping bangladesh, ecommerce bd, flash sale, bKash payment, cash on delivery, electronics, fashion, mobile deals, AshaalMall',
  image = '/icon.png',
  type = 'website',
  canonical,
  noindex = false,
  structuredData
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ashall.com';
  const queryStr = searchParams?.toString();
  const currentUrl = canonical || `${siteUrl}${pathname || ''}${queryStr ? '?' + queryStr : ''}`;
  const fullTitle = title ? `${title} | Ashaal.com.bd` : 'Ashaal.com.bd | Online Shopping in Bangladesh - Best Deals & Fast Delivery';

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard SEO Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // 3. OpenGraph Meta Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'Ashaal Bangladesh');
    if (image) {
      const fullImgUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
      setMetaTag('property', 'og:image', fullImgUrl);
    }

    // 4. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    if (image) {
      const fullImgUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
      setMetaTag('name', 'twitter:image', fullImgUrl);
    }

    // 5. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 6. JSON-LD Structured Data
    const scriptId = 'seo-structured-data';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;

    // Default schemas: Organization & WebSite
    const defaultSchemas: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ashaal Bangladesh',
        url: siteUrl,
        logo: `${siteUrl}/icon.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+8801700000000',
          contactType: 'customer service',
          areaServed: 'BD',
          availableLanguage: ['en', 'bn']
        },
        sameAs: [
          'https://www.facebook.com',
          'https://www.twitter.com',
          'https://www.instagram.com',
          'https://www.youtube.com'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Ashaal',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ];

    let combinedSchemas = defaultSchemas;
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        combinedSchemas = [...defaultSchemas, ...structuredData];
      } else {
        combinedSchemas = [...defaultSchemas, structuredData];
      }
    }

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(combinedSchemas);
  }, [fullTitle, description, keywords, currentUrl, type, image, noindex, structuredData, siteUrl]);

  return null;
};
