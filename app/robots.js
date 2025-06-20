export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/potwierdzenie/',
        '/potwierdzenie-goscia/',
        '/api/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://stavakiszewa.pl/sitemap.xml',
  };
} 
