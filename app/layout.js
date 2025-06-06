import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './globals.css';

export const metadata = {
  title: "STAVA - Domki letniskowe w Kiszewie",
  description: "Ośrodek domków letniskowych STAVA w Starej Kiszewie. Komfortowe domki otoczone naturą. Zapraszamy na niezapomniany wypoczynek!",
  keywords: "domki letniskowe, Stara Kiszewa, wypoczynek, Kaszuby, nocleg, STAVA",
  authors: [{ name: "STAVA" }],
  openGraph: {
    title: "STAVA - Domki letniskowe w Kiszewie",
    description: "Ośrodek domków letniskowych STAVA w Starej Kiszewie. Komfortowe domki otoczone naturą.",
    type: "website",
    locale: "pl_PL",
  },
  // Firebase Storage: Favicon will be loaded from global/favicon.ico
  // Note: This is a placeholder, actual favicon should be configured via Firebase Storage URL
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="scroll-smooth overflow-x-hidden">
      <head>
        {/* Firebase Storage: Favicon from global/favicon.ico */}
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Ffavicon.ico?alt=media" type="image/x-icon" />
      </head>
      <body className="font-body bg-gradient-to-br from-stone-50 to-stone-100">
        <Header />
        <main className="w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
