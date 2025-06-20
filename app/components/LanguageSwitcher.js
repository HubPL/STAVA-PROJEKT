'use client';

import { useTranslation } from '../../lib/i18n';

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useTranslation();

  // Pokazuj flagę języka, na który można przełączyć
  const targetLocale = locale === 'pl' ? 'en' : 'pl';
  const flagClass = locale === 'pl' ? 'fi-gb' : 'fi-pl';
  const title = locale === 'pl' ? 'Switch to English' : 'Przełącz na polski';

  return (
    <button
      onClick={() => changeLanguage(targetLocale)}
      className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-110"
      title={title}
    >
      <span className={`fi ${flagClass} text-2xl rounded shadow-sm`}></span>
    </button>
  );
} 
