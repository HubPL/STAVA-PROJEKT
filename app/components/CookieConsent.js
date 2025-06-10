'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const saved = JSON.parse(consent);
      setPreferences(saved);
      
      if (saved.analytics) {
        initAnalytics();
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    saveConsent(allAccepted);
    initAnalytics();
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    saveConsent(necessaryOnly);
  };

  const saveConsent = (prefs) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(prefs);
    setShowBanner(false);
  };

  const initAnalytics = () => {
    console.log('Vercel Analytics active');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">Używamy plików cookies</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ta strona używa plików cookies w celu zapewnienia najlepszej jakości usług. 
              Cookies niezbędne są wymagane do działania strony. Możesz również wyrazić zgodę na cookies analityczne, 
              które pomagają nam ulepszyć stronę.
            </p>
            <a 
              href="/polityka-prywatnosci" 
              className="text-sm text-blue-600 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dowiedz się więcej w Polityce Prywatności
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 min-w-max">
            <button
              onClick={acceptNecessary}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tylko niezbędne
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Akceptuj wszystkie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 