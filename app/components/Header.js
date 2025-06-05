'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Flogo.png?alt=media&token=23126615-139c-4158-aee7-cf1352c919d5";
const LOGO_TEXT_URL = "https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Flogo-text.png?alt=media&token=e075d0f3-8de5-4c06-842a-a70a72801eb8";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/domki", label: "Domki", icon: "🏡" },
    { href: "/galeria", label: "Galeria", icon: "📸" },
    { href: "/kontakt", label: "Kontakt", icon: "📞" },
    { href: "/regulamin", label: "Regulamin", icon: "📋" },
  ];

  return (
    <header 
      className={`w-full sticky top-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-green-800/40 backdrop-blur-lg shadow-lg' 
          : 'bg-green-800/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative">
              <Image 
                src={LOGO_URL} 
                alt="STAVA Logo" 
                width={80} 
                height={80} 
                priority
                className="h-16 w-auto sm:h-20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              {/* Glow effect za logo */}
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </Link>
        </div>

        {/* Centralized STAVA Text Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
          <Link href="/" className="group" onClick={() => setIsMobileMenuOpen(false)}>
            <Image
              src={LOGO_TEXT_URL}
              alt="STAVA"
              width={140}
              height={90}
              priority
              className="h-auto w-auto max-h-[70px] transition-all duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="group relative px-4 py-2 rounded-xl font-body font-medium text-white hover:text-green-200 transition-all duration-300 hover:bg-green-700/30"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg group-hover:scale-125 transition-transform duration-300">{link.icon}</span>
                {link.label}
              </span>
              {/* Hover underline */}
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-green-300 to-green-100 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 rounded-xl hover:bg-green-700/30 transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-6 h-6 relative flex flex-col justify-center items-center">
            <div
              className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white rounded-full my-1 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            ></div>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div 
          className="bg-green-800/95 backdrop-blur-lg border-t border-green-600/30 shadow-lg"
        >
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map((link, index) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="group p-4 rounded-xl hover:bg-green-700/30 transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <span className="flex items-center gap-3 font-body font-medium text-white group-hover:text-green-200">
                  <span className="text-xl group-hover:scale-125 transition-transform duration-300">{link.icon}</span>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 