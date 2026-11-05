import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/zona-editorial-privada-ci'],
    },
    sitemap: 'https://carmenibanez.cl/sitemap.xml',
  };
}

