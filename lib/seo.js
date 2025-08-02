// SEO utilities and meta tag generators

export const DEFAULT_METADATA = {
  title: "STAVA - Domek wypoczynkowy w Kiszewie | Wypoczynek na Kaszubach",
  description: "Ośrodek wypoczynkowy STAVA w Starej Kiszewie. Komfortowy domek wypoczynkowy otoczony naturą na Kaszubach. Rezerwuj online - wypoczynek w lesie nad jeziorami.",
  keywords: ["domek wypoczynkowy", "Stara Kiszewa", "wypoczynek", "Kaszuby", "nocleg", "STAVA", "domek w lesie", "las", "natura", "odpoczynek", "jeziora"],
  ogImage: "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/seo%2Fog-image.jpg?alt=media",
  siteUrl: "https://stavakiszewa.pl"
};

export const generatePageMetadata = ({
  title,
  description,
  keywords = [],
  ogImage,
  path = "",
  type = "website",
  locale = "pl_PL"
}) => {
  const fullTitle = title ? `${title} | STAVA Kiszewa` : DEFAULT_METADATA.title;
  const fullUrl = `${DEFAULT_METADATA.siteUrl}${path}`;
  const imageUrl = ogImage || DEFAULT_METADATA.ogImage;
  
  return {
    title: fullTitle,
    description: description || DEFAULT_METADATA.description,
    keywords: [...DEFAULT_METADATA.keywords, ...keywords],
    canonical: fullUrl,
    openGraph: {
      title: fullTitle,
      description: description || DEFAULT_METADATA.description,
      url: fullUrl,
      siteName: "STAVA Kiszewa",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || "STAVA - Domek wypoczynkowy w Kiszewie",
        }
      ],
      locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || DEFAULT_METADATA.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        'pl': fullUrl,
        'en': `${DEFAULT_METADATA.siteUrl}/en${path}`,
      }
    }
  };
};

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${DEFAULT_METADATA.siteUrl}${item.url}`
    }))
  };
};

export const generateBusinessStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "LocalBusiness"],
    "name": "STAVA - Domek wypoczynkowy w Kiszewie",
    "description": "Komfortowy domek wypoczynkowy w sercu lasu kaszubskiego. Idealne miejsce na wypoczynek z dala od miejskiego zgiełku.",
    "url": DEFAULT_METADATA.siteUrl,
    "telephone": "+48886627447",
    "email": "kontakt@stavakiszewa.pl",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ul. Wygonińska 38",
      "addressLocality": "Stara Kiszewa",
      "addressRegion": "Pomorskie",
      "postalCode": "83-430",
      "addressCountry": "PL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 54.00445998012229,
      "longitude": 18.15842831586208
    },
    "image": [
      "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/hero%2Fhero.jpg?alt=media",
      "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/galeria%2Fgaleria-1.jpg?alt=media"
    ],
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Klimatyzacja",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Wi-Fi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Kominek",
        "value": true
      }
    ],
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5"
    },
    "priceRange": "350-600 PLN"
  };
};

export const generateFAQStructuredData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};