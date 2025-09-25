import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { SuspensedCookieConsent } from '@/app/components/LazyComponents';
import { LanguageProvider } from '@/lib/i18n';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import 'flag-icons/css/flag-icons.min.css';
import './globals.css';

export const metadata = {
  title: {
    default: "STAVA Kiszewa – Domek w lesie na Kaszubach | Rezerwacja online",
    template: "%s | STAVA Kiszewa"
  },
  description: "Komfortowy domek 67 m² w Starej Kiszewie: 2 sypialnie, kominek, klimatyzacja, 3 tarasy. Sprawdź dostępność i zarezerwuj pobyt w naturze.",
  keywords: ["domek wypoczynkowy", "Stara Kiszewa", "wypoczynek", "Kaszuby", "nocleg", "STAVA", "domek w lesie", "las", "natura", "odpoczynek", "jezior"],
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
    title: "STAVA Kiszewa – Domek w lesie na Kaszubach | Rezerwacja online",
    description: "Komfortowy domek 67 m² w Starej Kiszewie: 2 sypialnie, kominek, klimatyzacja, 3 tarasy.",
    url: "https://stavakiszewa.pl",
    siteName: "STAVA Kiszewa",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/seo%2Fog-image.jpg?alt=media",
        width: 1200,
        height: 630,
        alt: "STAVA - Domek wypoczynkowy w Kiszewie",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAVA Kiszewa – Domek w lesie na Kaszubach",
    description: "Komfortowy domek 67 m², 2 sypialnie, kominek, klimatyzacja. Rezerwuj online!",
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
            // Miejsce na kody weryfikacji
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="scroll-smooth overflow-x-hidden">
      <head>
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Ffavicon.ico?alt=media" type="image/x-icon" />
        
        {/* Preconnect dla szybszego ładowania */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google.com" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://stavakiszewa.pl" />
        
        {/* Hreflang dla wielojęzyczności */}
        <link rel="alternate" href="https://stavakiszewa.pl" hrefLang="pl" />
        <link rel="alternate" href="https://stavakiszewa.pl/en" hrefLang="en" />
        <link rel="alternate" href="https://stavakiszewa.pl" hrefLang="x-default" />
        
        {/* Dane strukturalne */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LodgingBusiness", "LocalBusiness"],
              "name": "STAVA - Domek wypoczynkowy w Kiszewie",
              "description": "Komfortowy domek wypoczynkowy w sercu lasu kaszubskiego. Idealne miejsce na wypoczynek z dala od miejskiego zgiełku.",
              "url": "https://stavakiszewa.pl",
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
              "areaServed": [
                "Stara Kiszewa",
                "Kaszuby", 
                "Pomorskie",
                "Gdańsk",
                "Słupsk"
              ],
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
                {"@type": "LocationFeatureSpecification", "name": "Parking"},
                {"@type": "LocationFeatureSpecification", "name": "WiFi"},
                {"@type": "LocationFeatureSpecification", "name": "Ogród"},
                {"@type": "LocationFeatureSpecification", "name": "Grill"},
                {"@type": "LocationFeatureSpecification", "name": "Klimatyzacja"},
                {"@type": "LocationFeatureSpecification", "name": "Kominek"}
              ],
              "priceRange": "$$",
              "paymentAccepted": ["Cash", "Bank Transfer"],
              "starRating": {
                "@type": "Rating",
                "ratingValue": "4.8",
                "bestRating": "5"
              },
              "numberOfRooms": 3,
              "petsAllowed": true,
              "checkinTime": "15:00",
              "checkoutTime": "11:00"
            })
          }}
        />
      </head>
      <body className="font-inter bg-white">
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <SuspensedCookieConsent />
          <Analytics />
          <SpeedInsights />
        </LanguageProvider>
      </body>
    </html>
  );
}
