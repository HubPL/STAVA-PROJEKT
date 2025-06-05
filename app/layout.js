import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './globals.css';

export const metadata = {
  title: "STAVA - Domki letniskowe w Kiszewie",
  description: "Ośrodek domków letniskowych STAVA w Starej Kiszewie. Zapraszamy!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="scroll-smooth overflow-x-hidden">
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
