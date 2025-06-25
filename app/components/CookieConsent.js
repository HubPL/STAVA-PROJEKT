'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // zawsze true - nie można wyłączyć
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('stava-cookie-consent');
    const consentVersion = localStorage.getItem('stava-cookie-consent-version');
    const currentVersion = '1.0';
    
    // Sprawdź czy zgoda istnieje i czy jest aktualna wersja
    if (!consent || consentVersion !== currentVersion) {
      // Pokazuj banner po małym opóźnieniu dla lepszego UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      const saved = JSON.parse(consent);
      setPreferences(saved);
      
      // Inicjalizuj serwisy na podstawie zapisanych preferencji
      if (saved.analytics) {
        initAnalytics();
      }
      if (saved.marketing) {
        initMarketing();
      }
      if (saved.functional) {
        initFunctional();
      }
    }
  }, []);

  const handlePreferenceChange = (category) => {
    if (category === 'necessary') return; // nie można wyłączyć niezbędnych
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    saveConsent(allAccepted);
    initAllServices();
  };

  const acceptSelected = () => {
    saveConsent(preferences);
    initSelectedServices();
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    saveConsent(necessaryOnly);
  };

  const saveConsent = (prefs) => {
    localStorage.setItem('stava-cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('stava-cookie-consent-version', '1.0');
    localStorage.setItem('stava-cookie-consent-date', new Date().toISOString());
    setPreferences(prefs);
    setShowBanner(false);
    setShowDetails(false);
  };

  const initAnalytics = () => {
    // Google Analytics lub Vercel Analytics
    if (typeof window !== 'undefined') {
      // Tutaj inicjalizacja GA lub innych narzędzi analitycznych
    }
  };

  const initMarketing = () => {
    // Facebook Pixel, Google Ads itp.
    if (typeof window !== 'undefined') {
      // Tutaj inicjalizacja marketingowych narzędzi
    }
  };

  const initFunctional = () => {
    // Chabot, mapy, YouTube embeds itp.
    if (typeof window !== 'undefined') {
      // Tutaj inicjalizacja funkcjonalnych cookies
    }
  };

  const initAllServices = () => {
    if (preferences.analytics) initAnalytics();
    if (preferences.marketing) initMarketing();
    if (preferences.functional) initFunctional();
  };

  const initSelectedServices = () => {
    if (preferences.analytics) initAnalytics();
    if (preferences.marketing) initMarketing();
    if (preferences.functional) initFunctional();
  };

  if (!showBanner) return null;

  const cookieCategories = [
    {
      id: 'necessary',
      title: 'Niezbędne',
      description: 'Te pliki cookies są konieczne do działania strony i nie można ich wyłączyć. Obejmują podstawowe funkcje bezpieczeństwa i dostępności.',
      required: true
    },
    {
      id: 'analytics',
      title: 'Analityczne',
      description: 'Pomagają nam zrozumieć, jak odwiedzający korzystają ze strony, dzięki czemu możemy ją ulepszać. Dane są anonimowe.',
      required: false
    },
    {
      id: 'functional',
      title: 'Funkcjonalne',
      description: 'Umożliwiają zaawansowane funkcje strony, takie jak mapy, formularze kontaktowe czy osadzone treści.',
      required: false
    },
    {
      id: 'marketing',
      title: 'Marketingowe',
      description: 'Służą do wyświetlania spersonalizowanych reklam i śledzenia skuteczności kampanii marketingowych.',
      required: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end justify-center">
      <div className="bg-[#fdf2d0] border-t-4 border-[#3c3333] shadow-2xl w-full max-w-6xl mx-4 mb-4 rounded-t-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#3c3333] tracking-wider font-lumios mb-2">
                🍪 Pliki Cookies
              </h2>
              <p className="text-lg text-[#3c3333]/80 tracking-wide">
                Dbamy o Twoją prywatność i transparentność
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-8">
            <p className="text-[#3c3333] text-lg leading-relaxed tracking-wide mb-4">
              Używamy plików cookies, aby zapewnić najlepsze doświadczenia na naszej stronie. 
              Niektóre są niezbędne do działania, inne pomagają nam ulepszać usługi i dostosowywać treści do Twoich potrzeb.
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <Link 
                href="/polityka-prywatnosci" 
                className="text-[#3c3333] underline hover:opacity-70 transition-opacity font-medium"
              >
                📋 Polityka Prywatności
              </Link>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-[#3c3333] underline hover:opacity-70 transition-opacity font-medium"
              >
                {showDetails ? '📋 Ukryj szczegóły' : '⚙️ Zarządzaj preferencjami'}
              </button>
            </div>
          </div>

          {/* Detailed Preferences */}
          {showDetails && (
            <div className="mb-8 p-6 bg-white/60 rounded-xl border border-[#3c3333]/10">
                              <h3 className="text-xl font-semibold text-[#3c3333] mb-6 font-lumios">
                Zarządzanie cookies
              </h3>
              
              <div className="space-y-4">
                {cookieCategories.map((category) => (
                  <div key={category.id} className="flex items-start gap-4 p-4 bg-white/80 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-[#3c3333] font-montserrat">
                          {category.title}
                        </h4>
                        {category.required && (
                          <span className="text-xs bg-[#3c3333] text-[#fdf2d0] px-2 py-1 rounded-full font-montserrat">
                            Wymagane
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#3c3333]/70 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[category.id]}
                          onChange={() => handlePreferenceChange(category.id)}
                          disabled={category.required}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3c3333] disabled:opacity-50 disabled:cursor-not-allowed"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <button
                onClick={acceptNecessary}
                className="px-6 py-3 border-2 border-[#3c3333] text-[#3c3333] rounded-lg hover:bg-[#3c3333] hover:text-[#fdf2d0] transition-all duration-300 font-montserrat font-semibold text-sm uppercase tracking-widest"
              >
                Tylko niezbędne
              </button>
              
              {showDetails && (
                <button
                  onClick={acceptSelected}
                  className="px-6 py-3 bg-[#3c3333]/80 text-[#fdf2d0] rounded-lg hover:bg-[#3c3333] transition-all duration-300 font-montserrat font-semibold text-sm uppercase tracking-widest"
                >
                  Zapisz wybrane
                </button>
              )}
            </div>
            
            <button
              onClick={acceptAll}
              className="px-8 py-3 bg-[#3c3333] text-[#fdf2d0] rounded-lg hover:bg-opacity-90 transition-all duration-300 transform-gpu hover:scale-105 font-montserrat font-semibold text-sm uppercase tracking-widest"
            >
              ✅ Akceptuj wszystkie
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 pt-4 border-t border-[#3c3333]/20">
            <p className="text-xs text-[#3c3333]/60 text-center">
              Możesz zmienić swoje preferencje w każdej chwili poprzez ustawienia przeglądarki. 
              Zgodnie z RODO masz prawo do cofnięcia zgody w dowolnym momencie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
