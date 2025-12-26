import React, { useEffect } from 'react';

interface MetaProps {
  title?: string;
  description?: string;
  schema?: object;
  canonical?: string;
}

const defaultTitle = 'Sleepy Tracker | Log, Analyze & Improve Your Baby\'s Sleep';
const defaultDescription = 'The ultimate baby sleep tracker app to help you log activities, get personalized schedules, and understand your baby\'s sleep patterns for more peaceful nights.';
const siteUrl = 'https://babysleepytracker.com'; // Example domain for SEO

const Meta: React.FC<MetaProps> = ({ title, description, schema, canonical }) => {
  useEffect(() => {
    const newTitle = title ? `${title} | Sleepy Tracker` : defaultTitle;
    const newDescription = description || defaultDescription;
    
    document.title = newTitle;
    
    // Meta Description
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', newDescription);

    // Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical ? `${siteUrl}${canonical}` : window.location.href);

    // Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', newTitle);

     // Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', newDescription);


    // JSON-LD Schema
    let scriptSchema = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
        if (!scriptSchema) {
            scriptSchema = document.createElement('script');
            scriptSchema.setAttribute('type', 'application/ld+json');
            document.head.appendChild(scriptSchema);
        }
        scriptSchema.textContent = JSON.stringify(schema);
    } else if (scriptSchema) {
        // Remove schema if not present for this page to avoid stale data
        scriptSchema.textContent = '';
    }

    // Clean up on component unmount
    return () => {
        document.title = defaultTitle;
        if(descriptionMeta) descriptionMeta.setAttribute('content', defaultDescription);
    };
  }, [title, description, schema, canonical]);

  return null; 
};

export default Meta;