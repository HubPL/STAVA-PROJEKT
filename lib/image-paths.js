/**
 * Konfiguracja ścieżek obrazów w Firebase Storage
 * Centralne miejsce zarządzania wszystkimi obrazami na stronie
 */

// Bazowy URL Firebase Storage
export const FIREBASE_STORAGE_BASE = 'https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o';

/**
 * Generuje pełny URL do obrazu w Firebase Storage
 * @param {string} path - Ścieżka do pliku (np. 'hero/hero.jpg')
 * @returns {string} Pełny URL
 */
export const getImageUrl = (path) => {
  const encodedPath = encodeURIComponent(path);
  return `${FIREBASE_STORAGE_BASE}/${encodedPath}?alt=media`;
};

/**
 * Ścieżki do obrazów hero
 */
export const HERO_IMAGES = {
  main: 'hero/hero.jpg',               // Główny hero strony głównej
  hero2: 'hero/hero2.jpg',             // Drugi hero dla formularza kontaktowego
  about1: 'hero/hero-onas1.jpg',       // Hero strony O Nas #1
  about2: 'hero/hero-onas2.jpg',       // Hero strony O Nas #2
  gallery: 'hero/hero-gallery.jpg',    // Do dodania - dla galerii
  rooms: 'hero/hero-rooms.jpg',        // Do dodania - dla domków
};

/**
 * Ścieżki do globalnych elementów graficznych
 */
export const GLOBAL_IMAGES = {
  logo: 'global/logo.webp',
  logoBlack: 'global/Logo_black.webp',
  placeholder: 'global/domek-placeholder.jpg',
  favicon: 'global/favicon.ico',
};

/**
 * Ścieżki do zdjęć domków (exterior + interior)
 */
export const DOMEK_IMAGES = {
  // Exterior (zewnętrzne)
  exterior1: 'domek/ext-1.jpg',
  exterior2: 'domek/ext-2.jpg',
  exterior3: 'domek/ext-3.jpg',
  
  // Interior (wnętrza)
  interior1: 'domek/int-1.jpg',
  interior2: 'domek/int-2.jpg',
  interior3: 'domek/int-3.jpg',
  interior4: 'domek/int-4.jpg',
  interior5: 'domek/int-5.jpg',
  interior6: 'domek/int-6.jpg',
  interior7: 'domek/int-7.jpg',
  interior8: 'domek/int-8.jpg',
  interior9: 'domek/int-9.jpg',
  interior10: 'domek/int-10.jpg',
  interior11: 'domek/int-11.jpg',
};

/**
 * Ścieżki do galerii (wszystkie zdjęcia galerii)
 */
export const GALLERY_IMAGES = {
  gallery1: 'galeria/galeria-1.jpg',
  gallery2: 'galeria/galeria-2.jpg',
  gallery3: 'galeria/galeria-3.jpg',
  gallery4: 'galeria/galeria-4.jpg',
  gallery5: 'galeria/galeria-5.jpg',
  gallery6: 'galeria/galeria-6.jpg',
  gallery7: 'galeria/galeria-7.jpg',
  gallery8: 'galeria/galeria-8.jpg',
  gallery9: 'galeria/galeria-9.jpg',
  gallery10: 'galeria/galeria-10.jpg',
  gallery11: 'galeria/galeria-11.jpg',
  gallery12: 'galeria/galeria-12.jpg',
  gallery13: 'galeria/galeria-13.jpg',
  gallery14: 'galeria/galeria-14.jpg',
  gallery15: 'galeria/galeria-15.jpg',
  gallery16: 'galeria/galeria-16.jpg',
  gallery17: 'galeria/galeria-17.jpg',
  gallery18: 'galeria/galeria-18.jpg',
  gallery19: 'galeria/galeria-19.jpg',
  gallery20: 'galeria/galeria-20.jpg',
  gallery21: 'galeria/galeria-21.jpg',
};

/**
 * Ścieżki do obrazów SEO (do dodania opcjonalnie)
 */
export const SEO_IMAGES = {
  ogImage: 'seo/og-image.jpg',        // 1200x630px
  twitterCard: 'seo/twitter-card.jpg', // 1200x675px
  schemaLogo: 'seo/schema-logo.png',   // 512x512px
  sitePreview: 'seo/site-preview.jpg', // 1200x800px
};

/**
 * Mapowanie starych ścieżek na nowe (dla migracji)
 */
export const MIGRATION_MAP = {
  // Stare ścieżki → nowe ścieżki
  'galeria%2Fgaleria-1.jpg': GALLERY_IMAGES.gallery1,
  'galeria%2Fgaleria-2.jpg': GALLERY_IMAGES.gallery2,
  'galeria%2Fgaleria-3.jpg': GALLERY_IMAGES.gallery3,
  'galeria%2Fgaleria-4.jpg': GALLERY_IMAGES.gallery4,
  'galeria%2Fgaleria-5.jpg': GALLERY_IMAGES.gallery5,
  'galeria%2Fgaleria-6.jpg': GALLERY_IMAGES.gallery6,
  'galeria%2Fgaleria-7.jpg': GALLERY_IMAGES.gallery7,
  'galeria%2Fgaleria-8.jpg': GALLERY_IMAGES.gallery8,
  'galeria%2Fgaleria-9.jpg': GALLERY_IMAGES.gallery9,
  'galeria%2Fgaleria-sauna.jpg': GALLERY_IMAGES.gallery10, // Zmapowane na gallery10
};

/**
 * Konfiguracja dla różnych zastosowań obrazów
 */
export const IMAGE_CONFIGS = {
  hero: {
    sizes: '100vw',
    quality: 90,
    priority: true,
  },
  gallery: {
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality: 85,
    priority: false,
  },
  domek: {
    sizes: '(max-width: 768px) 100vw, 50vw',
    quality: 85,
    priority: false,
  },
  logo: {
    sizes: '200px',
    quality: 95,
    priority: true,
  },
  seo: {
    sizes: '1200px',
    quality: 90,
    priority: false,
  },
};

/**
 * Lista krytycznych obrazów do preloadowania
 */
export const CRITICAL_IMAGES = [
  HERO_IMAGES.main,
  GLOBAL_IMAGES.logo,
  GALLERY_IMAGES.gallery1, // Pierwszy w galerii
  DOMEK_IMAGES.exterior1,   // Pierwszy domek exterior
];

/**
 * Helper function - pobiera URL z konfiguracją
 */
export const getImageWithConfig = (imagePath, configType = 'gallery') => {
  return {
    src: getImageUrl(imagePath),
    ...IMAGE_CONFIGS[configType],
  };
};

/**
 * Funkcje pomocnicze do grupowania obrazów
 */
export const getDomekExteriorImages = () => [
  DOMEK_IMAGES.exterior1,
  DOMEK_IMAGES.exterior2,
  DOMEK_IMAGES.exterior3,
];

export const getDomekInteriorImages = () => [
  DOMEK_IMAGES.interior1,
  DOMEK_IMAGES.interior2,
  DOMEK_IMAGES.interior3,
  DOMEK_IMAGES.interior4,
  DOMEK_IMAGES.interior5,
  DOMEK_IMAGES.interior6,
  DOMEK_IMAGES.interior7,
  DOMEK_IMAGES.interior8,
  DOMEK_IMAGES.interior9,
  DOMEK_IMAGES.interior10,
  DOMEK_IMAGES.interior11,
];

export const getAllGalleryImages = () => Object.values(GALLERY_IMAGES);

export const getGalleryImages = () => Object.values(GALLERY_IMAGES);

export const getDomekImages = () => [
  ...getDomekExteriorImages(),
  ...getDomekInteriorImages(),
];

export const getHeroImages = () => Object.values(HERO_IMAGES); 