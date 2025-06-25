'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { onAuthChange } from '@/lib/auth';
import { useTranslation } from '../../lib/i18n';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Flogo.webp?alt=media&token=5e6f9ec9-d680-4d21-a85f-722c3a8bd2fe";
const LOGO_BLACK_URL = "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2FLogo_black.webp?alt=media&token=7bc56914-443b-47c6-af3e-22486d8ade69";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const isTransparentPage = pathname === '/' || pathname === '/en';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setIsAdmin(!!user);
    });

    return () => unsubscribe();
  }, []);

  const { locale } = useTranslation();
  const basePath = locale === 'en' ? '/en' : '';
  
  const leftNavLinks = [
    { href: `${basePath}/domki`, label: t('nav.cottages') },
    { href: `${basePath}/galeria`, label: t('nav.gallery') },
    { href: `${basePath}/o-nas`, label: t('nav.about') },
  ];

  const rightNavLinks = [
    { href: `${basePath}/rezerwacja`, label: t('nav.reserve'), isCTA: true },
    { href: `${basePath}/#kontakt`, label: t('nav.contact') },
    { href: `${basePath}/regulamin`, label: t('nav.terms') },
  ];

  const shouldShowTransparent = isTransparentPage && !isScrolled;
  const shouldShowWhiteLogo = isTransparentPage && !isScrolled;

  const navLinkClasses = (isTransparent) => 
    `group relative px-3 py-2 rounded-lg font-montserrat font-semibold transition-all duration-300 uppercase tracking-wider ${
      isTransparent
        ? 'text-white hover:text-white/90 hover:bg-white/10 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]'
        : 'text-[#3c3333] hover:text-[#3c3333]/90 hover:bg-[#fdf2d0]/50' 
    }`;

  return (
    <header 
      className={`w-full fixed top-16 sm:top-9 z-50 transition-shadow,transform duration-500 ease-out ${
        shouldShowTransparent
          ? '' 
          : 'shadow-lg'
      }`}
    >
      <div 
        className={`absolute inset-0 bg-[#fdf2d0]/90 backdrop-blur-[2px] border-b border-black/10 transition-opacity duration-500 ease-out ${
          shouldShowTransparent ? 'opacity-0' : 'opacity-100'
        }`}
      ></div>

{/*  */}      <div className="relative container mx-auto grid grid-cols-3 items-center px-6 sm:px-8 lg:px-4 py-0">
        
        <nav className="hidden lg:flex items-center space-x-8 justify-start">
          {leftNavLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={navLinkClasses(shouldShowTransparent)}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex justify-center">
          <Link href={basePath || "/"} className="group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative">
              <Image
                src={shouldShowWhiteLogo ? LOGO_URL : LOGO_BLACK_URL} 
                alt="STAVA Logo" 
                width={180} 
                height={180} 
                priority
                className="h-24 w-auto scale-150 transition-all duration-300 group-hover:scale-[1.375]"
              />
              <div className={`absolute inset-0 bg-[#3c3333]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 ${shouldShowTransparent ? '[filter:drop-shadow(0_2px_5px_rgb(0_0_0_/_0.7))' : ''}`}></div>
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center space-x-8 justify-end">
          {rightNavLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={
                link.isCTA 
                  ? `px-6 py-3 bg-[#3c3333] text-[#fdf2d0] font-montserrat font-bold rounded-lg uppercase tracking-widest transition-all duration-300 hover:bg-[#3c3333]/90 transform hover:scale-105 shadow-lg`
                  : navLinkClasses(shouldShowTransparent)
              }
            >
              <span>{link.label}</span>
            </Link>
          ))}
          
          {isAdmin && (
            <Link 
              href="/panel" 
              className={`group relative px-3 py-2 rounded-lg font-montserrat font-medium transition-all duration-300 uppercase tracking-wider ${
                shouldShowTransparent
                  ? 'text-amber-200 hover:text-amber-100 bg-amber-600/20 hover:bg-amber-600/30'
                  : 'text-[#3c3333] hover:text-[#3c3333] bg-amber-50 hover:bg-amber-100' 
              }`}
              title={t('nav.admin_panel')}
            >
              <span className="text-sm">PANEL</span>
            </Link>
          )}
        </nav>

        <div className="lg:hidden flex justify-end">
          <button 
            className={`p-2 rounded-lg transition-colors duration-300 ${
              shouldShowTransparent
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-[#fdf2d0]/50 text-[#3c3333]' 
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 relative flex flex-col justify-center items-center">
              <div className={`w-6 h-0.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''} ${shouldShowTransparent ? 'bg-white' : 'bg-[#3c3333]'}`}></div>
              <div className={`w-6 h-0.5 rounded-full my-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''} ${shouldShowTransparent ? 'bg-white' : 'bg-[#3c3333]'}`}></div>
              <div className={`w-6 h-0.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''} ${shouldShowTransparent ? 'bg-white' : 'bg-[#3c3333]'}`}></div>
            </div>
          </button>
        </div>
      </div>

      <div 
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#fdf2d0]/95 backdrop-blur-sm border-t border-[#3c3333]/20 shadow-lg">
          <nav className="flex flex-col p-6 space-y-2">
            {rightNavLinks.filter(link => link.isCTA).map((link, index) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="group p-4 rounded-xl bg-[#3c3333] text-[#fdf2d0] hover:bg-[#3c3333]/90 transition-all duration-300 transform hover:scale-105 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <span className="font-montserrat font-bold text-[#fdf2d0] uppercase tracking-wider">
                  {link.label}
                </span>
              </Link>
            ))}
            
            {[...leftNavLinks, ...rightNavLinks.filter(link => !link.isCTA)].map((link, index) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="group p-4 rounded-xl hover:bg-[#fdf2d0]/80 transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{animationDelay: `${(index + 1) * 0.1}s`}}
              >
                <span className="font-montserrat font-medium text-[#3c3333] group-hover:text-[#3c3333]/90 uppercase tracking-wider">
                  {link.label}
                </span>
              </Link>
            ))}
            
            {isAdmin && (
              <Link 
                href="/panel" 
                className="group p-4 rounded-xl hover:bg-amber-100 transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-montserrat font-medium text-[#3c3333] group-hover:text-[#3c3333] uppercase tracking-wider">
                  PANEL
                </span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
