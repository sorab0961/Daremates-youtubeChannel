import React from 'react';
import { Helmet } from 'react-helmet-async';

export function SEOHead({ title, description, keywords, url, image }) {
  const siteUrl = 'https://daremates-youtube-channel-9dw2-2s88itzwk.vercel.app';
  const currentUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || `${siteUrl}/favicon.svg`; // Fallback image

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
