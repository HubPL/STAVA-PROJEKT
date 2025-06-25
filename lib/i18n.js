'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Słowniki tłumaczeń
const translations = {
  pl: {
    // Header/Navigation
    'nav.cottages': 'OFERTA',
    'nav.gallery': 'GALERIA',
    'nav.contact': 'KONTAKT',
    'nav.about': 'O NAS',
    'nav.terms': 'REGULAMIN',
    'nav.privacy': 'POLITYKA PRYWATNOŚCI',
    'nav.admin_panel': 'PANEL',
    'nav.reserve': 'ZAREZERWUJ',
    
    // Home Page
    'home.reserve': 'Zarezerwuj',
    'home.see_more': 'Zobacz więcej',
    'home.what_is_stava': 'CZYM JEST STAVA?',
    'home.stava_description': 'STAVA TO DOMKI O WYSOKIM STANDARDZIE, SCHOWANE W\nCIENIU DRZEW - Z DALA OD MIEJSKIEGO ZGIEŁKU.',
    'home.where_find': 'GDZIE NAS ZNALEŹĆ?',
    'home.location_description': 'OŚRODEK MIEŚCI SIĘ W SERCU LASU, W STAREJ KISZEWIE.',
    'home.what_awaits': 'CO CIĘ U NAS CZEKA?',
    'home.experience_description': 'MOŻESZ CIESZYĆ SIĘ OTACZAJĄCYM LASEM, POBLISKIMI JEZIORAMi LUB\nZANURZYĆ SIĘ W BALII POŚRÓD DRZEW.',
    'home.about_us': 'O NAS',
    'home.gallery_photos': 'GALERIA ZDJĘĆ',
    'home.write_to_us': 'Napisz do nas',
    'home.write_subtitle': 'Masz pytania? Chętnie na nie odpowiemy.',
    'home.our_data': 'Dane kontaktowe',
    'home.thanks_message': 'Dziękujemy za wiadomość!',
    'home.thanks_subtitle': 'Odpowiemy najszybciej jak to możliwe.',
    'home.send_another': 'Wyślij kolejną wiadomość',
    'home.name_placeholder': 'IMIĘ',
    'home.email_placeholder': 'E-MAIL',
    'home.subject_placeholder': 'TEMAT',
    'home.message_placeholder': 'WIADOMOŚĆ',
    'home.send_message': 'Wyślij wiadomość',
    'home.sending': 'Wysyłanie...',
    
    // Cottages Page
    'cottages.title': 'Domki',
    'cottages.subtitle': 'Odkryj nasze komfortowe domki letniskowe w sercu natury',
    'cottages.reserve_now': 'Zarezerwuj teraz',
    'cottages.ask_availability': 'Zapytaj o dostępność',
    'cottages.photos_count': 'zdjęcie|zdjęcia|zdjęć',
    'cottages.layout': 'Układ przestrzenny',
    'cottages.what_awaits': 'Co na Ciebie czeka?',
    'cottages.equipment': 'Wyposażenie domku',
    'cottages.terraces': 'Tarasy i przestrzeń zewnętrzna',
    'cottages.main_terrace': 'Taras główny',
    'cottages.intimate_terrace': 'Taras intymny',
    'cottages.spa_island': 'Leśna wyspa SPA',
    'cottages.seasonal_pricing': 'Cennik sezonowy',
    'cottages.practical_info': 'Informacje praktyczne',
    'cottages.checkin': 'Zameldowanie:',
    'cottages.checkout': 'Wymeldowanie:',
    'cottages.people_count': 'Liczba osób:',
    'cottages.pets': 'Zwierzęta:',
    'cottages.smoking': 'Palenie:',
    'cottages.ac': 'Klimatyzacja:',
    'cottages.heating': 'Ogrzewanie:',
    'cottages.current_price': 'Aktualna cena za dobę od',
    'cottages.price_per_people': 'Cennik według liczby osób:',
    'cottages.person': 'osoba',
    'cottages.people': 'osoby|osób',
    'cottages.up_to_people': 'Do {count} osób',
    'cottages.floors': '{count} piętra',
    'cottages.min_stay': 'Minimalny pobyt: {nights} noce',
    
    // Gallery Page
    'gallery.title': 'Galeria',
    'gallery.loading': 'Ładowanie galerii...',
    'gallery.no_photos': 'Brak zdjęć w galerii.',
    
    // About Page
    'about.title': 'O Nas',
    'about.subtitle': 'Nasza historia to pasja do natury i gościnności w sercu Kaszub.',
    'about.our_history': 'Nasza Historia',
    'about.ready_to_rest': 'Gotowi na odpoczynek?',
    'about.check_availability': 'Sprawdź dostępność i zarezerwuj swój pobyt w STAVA.',
    'about.year_1999': '1999',
    'about.year_1999_2014': '1999–2014',
    'about.year_2014': '2014',
    'about.year_2014_2022': '2014–2022',
    'about.year_2022': '2022',
    'about.year_2025': '2025',
    'about.story_1999': 'Zauroczenie dziko rosnącym lasem i bogactwem grzybów prowadzi do zakupu działki w malowniczym zakątku. Od samego początku miejsce to emanuje spokojem i naturalnym urokiem.',
    'about.story_1999_2014': 'Las stopniowo się zagęszcza, drzewa rosną w siłę, a teren odwiedzany jest jedynie okazjonalnie. Z czasem zostaje ogrodzony, co symbolicznie wyznacza początek troski o przestrzeń.',
    'about.story_2014': 'Na działce odbywa się pierwszy biwak – niewielkie spotkanie w gronie znajomych, które z miejsca zdobywa sympatię uczestników. To właśnie wtedy rodzi się pomysł, by korzystać z tego miejsca częściej.',
    'about.story_2014_2022': 'Biwaki stają się coraz popularniejsze. Z roku na rok do leśnej przestrzeni przyjeżdża coraz więcej osób. Atmosfera miejsca, bliskość natury i potrzeba oderwania się od codzienności sprawiają, że pojawia się myśl o stworzeniu czegoś większego, dostępnego przez cały rok.',
    'about.story_2022': 'Rozpoczyna się budowa całorocznych domków. To pierwszy krok w kierunku przekształcenia leśnej enklawy w przyjazną przestrzeń wypoczynkową.',
    'about.story_2025': 'Następuje oficjalne otwarcie ośrodka STAVA – miejsca stworzonego z miłości do natury, potrzeby odpoczynku i chęci dzielenia się tym, co najcenniejsze: ciszą, przestrzenią i atmosferą swobody.',
    
    // Terms Page
    'terms.title': 'Regulamin',
    'terms.subtitle': 'Prosimy o zapoznanie się z zasadami panującymi w naszym obiekcie.',
    'terms.pleasant_stay': 'Życzymy miłego pobytu!',
    'terms.team': 'Zespół STAVA',
    'terms.in_progress': 'Regulamin w trakcie tworzenia',
    'terms.working_on': 'Pracujemy nad szczegółowym regulaminem dla naszego ośrodka. W międzyczasie zapraszamy do kontaktu w sprawie wszelkich pytań dotyczących pobytu.',
    'terms.have_questions': 'Masz pytania?',
    'terms.contact_us': 'Skontaktuj się z nami telefonicznie lub mailowo. Chętnie odpowiemy na wszystkie pytania dotyczące warunków pobytu, zasad rezerwacji i udogodnień dostępnych w ośrodku.',
    'terms.phone': 'Telefon:',
    'terms.email': 'Email:',
    
    // Privacy Page
    'privacy.title': 'Polityka Prywatności',
    'privacy.subtitle': 'Transparentnie o przetwarzaniu Twoich danych osobowych',
    'privacy.questions_title': 'Masz pytania dotyczące prywatności?',
    'privacy.questions_text': 'Jesteśmy do Twojej dyspozycji. Skontaktuj się z nami w każdej sprawie dotyczącej ochrony danych.',
    'privacy.write_to_us': 'Napisz do nas',
    
    // Common
    'common.loading': 'Ładowanie...',
    'common.error': 'Wystąpił błąd',
    'common.success': 'Sukces',
    'common.close': 'Zamknij',
    'common.save': 'Zapisz',
    'common.cancel': 'Anuluj',
    'common.pln': 'PLN',
    
    // Footer
    'footer.rights': 'Wszelkie prawa zastrzeżone.',
  },
  
  en: {
    // Header/Navigation
    'nav.cottages': 'COTTAGES',
    'nav.gallery': 'GALLERY',
    'nav.contact': 'CONTACT',
    'nav.about': 'ABOUT US',
    'nav.terms': 'TERMS',
    'nav.privacy': 'PRIVACY POLICY',
    'nav.admin_panel': 'PANEL',
    'nav.reserve': 'BOOK NOW',
    
    // Home Page
    'home.reserve': 'Book Now',
    'home.see_more': 'See more',
    'home.what_is_stava': 'WHAT IS STAVA?',
    'home.stava_description': 'STAVA ARE HIGH-STANDARD COTTAGES HIDDEN IN THE\nSHADE OF TREES - AWAY FROM THE URBAN HUSTLE.',
    'home.where_find': 'WHERE TO FIND US?',
    'home.location_description': 'THE RESORT IS LOCATED IN THE HEART OF THE FOREST, IN STARA KISZEWA.',
    'home.what_awaits': 'WHAT AWAITS YOU?',
    'home.experience_description': 'YOU CAN ENJOY THE SURROUNDING FOREST, NEARBY LAKES OR\nIMMERSE YOURSELF IN A TUB AMONG THE TREES.',
    'home.about_us': 'ABOUT US',
    'home.gallery_photos': 'PHOTO GALLERY',
    'home.write_to_us': 'Write to us',
    'home.write_subtitle': 'Have questions? We\'re happy to answer them.',
    'home.our_data': 'Contact Information',
    'home.thanks_message': 'Thank you for your message!',
    'home.thanks_subtitle': 'We will respond as soon as possible.',
    'home.send_another': 'Send another message',
    'home.name_placeholder': 'NAME',
    'home.email_placeholder': 'EMAIL',
    'home.subject_placeholder': 'SUBJECT',
    'home.message_placeholder': 'MESSAGE',
    'home.send_message': 'Send message',
    'home.sending': 'Sending...',
    
    // Cottages Page
    'cottages.title': 'Cottages',
    'cottages.subtitle': 'Discover our comfortable summer cottages in the heart of nature',
    'cottages.reserve_now': 'Book now',
    'cottages.ask_availability': 'Check availability',
    'cottages.photos_count': 'photo|photos|photos',
    'cottages.layout': 'Space Layout',
    'cottages.what_awaits': 'What awaits you?',
    'cottages.equipment': 'Cottage Equipment',
    'cottages.terraces': 'Terraces and outdoor space',
    'cottages.main_terrace': 'Main terrace',
    'cottages.intimate_terrace': 'Intimate terrace',
    'cottages.spa_island': 'Forest SPA island',
    'cottages.seasonal_pricing': 'Seasonal pricing',
    'cottages.practical_info': 'Practical information',
    'cottages.checkin': 'Check-in:',
    'cottages.checkout': 'Check-out:',
    'cottages.people_count': 'Number of people:',
    'cottages.pets': 'Pets:',
    'cottages.smoking': 'Smoking:',
    'cottages.ac': 'Air conditioning:',
    'cottages.heating': 'Heating:',
    'cottages.current_price': 'Current price per night from',
    'cottages.price_per_people': 'Pricing by number of people:',
    'cottages.person': 'person',
    'cottages.people': 'people',
    'cottages.up_to_people': 'Up to {count} people',
    'cottages.floors': '{count} floors',
    'cottages.min_stay': 'Minimum stay: {nights} nights',
    
    // Gallery Page
    'gallery.title': 'Gallery',
    'gallery.loading': 'Loading gallery...',
    'gallery.no_photos': 'No photos in gallery.',
    
    // About Page
    'about.title': 'About Us',
    'about.subtitle': 'Our story is a passion for nature and hospitality in the heart of Kashubia.',
    'about.our_history': 'Our History',
    'about.ready_to_rest': 'Ready to relax?',
    'about.check_availability': 'Check availability and book your stay at STAVA.',
    'about.year_1999': '1999',
    'about.year_1999_2014': '1999–2014',
    'about.year_2014': '2014',
    'about.year_2014_2022': '2014–2022',
    'about.year_2022': '2022',
    'about.year_2025': '2025',
    'about.story_1999': 'Fascination with the wild forest and abundance of mushrooms leads to the purchase of a plot in a picturesque corner. From the very beginning, this place emanates peace and natural charm.',
    'about.story_1999_2014': 'The forest gradually thickens, trees grow stronger, and the area is visited only occasionally. Eventually it gets fenced, symbolically marking the beginning of caring for the space.',
    'about.story_2014': 'The first camp takes place on the plot – a small gathering of friends that immediately wins the sympathy of participants. This is when the idea is born to use this place more often.',
    'about.story_2014_2022': 'The camps become increasingly popular. Year after year, more and more people come to the forest space. The atmosphere of the place, closeness to nature and the need to break away from everyday life give rise to the idea of creating something bigger, available all year round.',
    'about.story_2022': 'Construction of year-round cottages begins. This is the first step towards transforming the forest enclave into a friendly recreational space.',
    'about.story_2025': 'The official opening of STAVA resort takes place – a place created out of love for nature, the need for rest and the desire to share what is most precious: silence, space and atmosphere of freedom.',
    
    // Terms Page
    'terms.title': 'Terms & Conditions',
    'terms.subtitle': 'Please familiarize yourself with the rules of our facility.',
    'terms.pleasant_stay': 'We wish you a pleasant stay!',
    'terms.team': 'STAVA Team',
    'terms.in_progress': 'Terms & Conditions in progress',
    'terms.working_on': 'We are working on detailed terms and conditions for our resort. In the meantime, we invite you to contact us with any questions regarding your stay.',
    'terms.have_questions': 'Have questions?',
    'terms.contact_us': 'Contact us by phone or email. We are happy to answer all questions about accommodation conditions, booking rules and facilities available at the resort.',
    'terms.phone': 'Phone:',
    'terms.email': 'Email:',
    
    // Privacy Page
    'privacy.title': 'Privacy Policy',
    'privacy.subtitle': 'Transparently about processing your personal data',
    'privacy.questions_title': 'Have questions about privacy?',
    'privacy.questions_text': 'We are at your disposal. Contact us for any data protection matters.',
    'privacy.write_to_us': 'Write to us',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.pln': 'PLN',
    
    // Footer
    'footer.rights': 'All rights reserved.',
  }
};

// Context dla języka
const LanguageContext = createContext();

/**
 * Provider dla systemu tłumaczeń
 */
export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('pl');
  const router = useRouter();
  const pathname = usePathname();

  // Ustaw locale na podstawie URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentLocale = pathname?.startsWith('/en') ? 'en' : 'pl';
      setLocale(currentLocale);
      
      // Zapisz preferencję w localStorage
      localStorage.setItem('preferred-locale', currentLocale);
    }
  }, [pathname]);

  const changeLanguage = (newLocale) => {
    let newPath = pathname || '/';
    
    // Usuń obecny locale z path
    if (newPath.startsWith('/en')) {
      newPath = newPath.replace('/en', '') || '/';
    }
    
    // Dodaj nowy locale jeśli to angielski
    if (newLocale === 'en') {
      newPath = `/en${newPath}`;
    }
    
    // Zapisz preferencję w localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
    
    // Przekieruj
    router.push(newPath);
  };

  const value = {
    locale,
    changeLanguage,
    isPolish: locale === 'pl',
    isEnglish: locale === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook do tłumaczeń dla App Router
 */
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    // Fallback gdy provider nie jest dostępny
    return {
      t: (key, fallback = key) => fallback,
      locale: 'pl',
      changeLanguage: () => {},
      isPolish: true,
      isEnglish: false
    };
  }

  const { locale } = context;
  
  const t = (key, fallback = key, params = {}) => {
    let translation = translations[locale]?.[key] || fallback;
    
    // Interpolacja parametrów
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  };

  return {
    ...context,
    t
  };
};

/**
 * Server-side funkcja do tłumaczeń
 */
export const getTranslation = (locale = 'pl') => {
  const t = (key, fallback = key, params = {}) => {
    let translation = translations[locale]?.[key] || fallback;
    
    // Interpolacja parametrów
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  };
  
  return { t, locale };
};

/**
 * Helper do formatowania dat według lokalizacji
 */
export const formatDate = (date, locale = 'pl') => {
  const localeMap = {
    'pl': 'pl-PL',
    'en': 'en-US'
  };
  
  return new Date(date).toLocaleDateString(localeMap[locale]);
};

/**
 * Helper do formatowania cen
 */
export const formatPrice = (price, locale = 'pl') => {
  const currency = 'PLN'; // Zawsze PLN
  return `${price} ${currency}`;
}; 