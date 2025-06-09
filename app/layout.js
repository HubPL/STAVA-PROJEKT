import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CookieConsent from '@/app/components/CookieConsent';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata = {
  title: {
    default: "STAVA - Domki letniskowe w Kiszewie | Wypoczynek na Kaszubach",
    template: "%s | STAVA Kiszewa"
  },
  description: "Ośrodek domków letniskowych STAVA w Starej Kiszewie. Komfortowe domki otoczone naturą na Kaszubach. Rezerwuj online - wypoczynek w lesie nad jeziorem.",
  keywords: ["domki letniskowe", "Stara Kiszewa", "wypoczynek", "Kaszuby", "nocleg", "STAVA", "domki nad jeziorem", "las", "natura", "odpoczynek"],
  authors: [{ name: "STAVA" }],
  creator: "STAVA",
  publisher: "STAVA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://stavakiszewa.pl"),
  openGraph: {
    title: "STAVA - Domki letniskowe w Kiszewie",
    description: "Ośrodek domków letniskowych STAVA w Starej Kiszewie. Komfortowe domki otoczone naturą na Kaszubach.",
    url: "https://stavakiszewa.pl",
    siteName: "STAVA Kiszewa",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/seo%2Fog-image.jpg?alt=media",
        width: 1200,
        height: 630,
        alt: "STAVA - Domki letniskowe w Kiszewie",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAVA - Domki letniskowe w Kiszewie",
    description: "Komfortowe domki otoczone naturą na Kaszubach. Rezerwuj online!",
    images: ["https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/seo%2Fog-image.jpg?alt=media"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'twój-google-verification-kod', // Dodaj po weryfikacji w Google Search Console
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="scroll-smooth overflow-x-hidden">
      <head>
        {/* Firebase Storage: Favicon from global/favicon.ico */}
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Ffavicon.ico?alt=media" type="image/x-icon" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristAttraction",
              "name": "STAVA - Domki letniskowe",
              "description": "Ośrodek domków letniskowych w Starej Kiszewie. Komfortowe domki otoczone naturą na Kaszubach.",
              "url": "https://stavakiszewa.pl",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Stara Kiszewa",
                "addressRegion": "Kaszuby",
                "addressCountry": "PL"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "54.2181",
                "longitude": "18.1915"
              },
              "telephone": "+48123456789",
              "email": "kontakt@stavakiszewa.pl",
              "priceRange": "$$",
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Domki letniskowe",
                  "value": "Komfortowe domki drewniane"
                },
                {
                  "@type": "LocationFeatureSpecification", 
                  "name": "Lokalizacja",
                  "value": "Las nad jeziorem"
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-body bg-gradient-to-br from-stone-50 to-stone-100">
        <Header />
        <main className="w-full">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
