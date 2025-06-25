'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, locale } = useTranslation();
  const basePath = locale === 'en' ? '/en' : '';

  return (
    <footer className="bg-[#fdf2d0] border-t border-black/10 font-serif text-[#3c3333]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm tracking-wider">
            <Link href={`${basePath}/domki`} className="hover:text-black transition-colors">{t('nav.cottages')}</Link>
            <Link href={`${basePath}/galeria`} className="hover:text-black transition-colors">{t('nav.gallery')}</Link>
            <Link href={`${basePath}/o-nas`} className="hover:text-black transition-colors">{t('nav.about')}</Link>
            <Link href={`${basePath}/#kontakt`} className="hover:text-black transition-colors">{t('nav.contact')}</Link>
            <Link href={`${basePath}/regulamin`} className="hover:text-black transition-colors">{t('nav.terms')}</Link>
            <Link href={`${basePath}/polityka-prywatnosci`} className="hover:text-black transition-colors">{t('nav.privacy')}</Link>
          </nav>
          
          <p className="text-sm tracking-wider text-center md:text-right">
            © {currentYear} STAVA Stara Kiszewa. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
