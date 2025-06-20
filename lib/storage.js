import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import app from './firebase'; 

const storage = getStorage(app);

/**
 * Pobiera URL pliku z Firebase Storage
 * @param {string} path - Ścieżka do pliku (np. 'global/logo.png')
 * @returns {Promise<string|null>} URL do pliku lub null
 */
export const getStorageUrl = async (path) => {
  if (!path) {
    console.error("Path is undefined or empty in getStorageUrl");
    return null;
  }
  
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error(`Error getting storage URL for path: ${path}`, error);
    
    if (error.code === 'storage/object-not-found') {
      console.warn(`File not found at path: ${path}`);
    }
    return null;
  }
};

/**
 * Pobiera wszystkie obrazy z danego folderu
 * @param {string} folderPath - Ścieżka do folderu (np. 'galeria/wnetrza')
 * @returns {Promise<Array>} Tablica z URL-ami obrazów
 */
export const getImagesFromFolder = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    const urls = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          url,
          name: itemRef.name,
          path: itemRef.fullPath,
          size: itemRef.size || null,
        };
      })
    );
    
    return urls;
  } catch (error) {
    console.error(`Error loading images from ${folderPath}:`, error);
    return [];
  }
};

/**
 * Generuje URL z parametrami optymalizacji dla Firebase Storage
 * @param {string} url - Bazowy URL obrazu
 * @param {Object} options - Opcje optymalizacji
 * @returns {string} Zoptymalizowany URL
 */
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return '';
  
  const {
    width = null,
    height = null,
    quality = 85,
    format = 'webp'
  } = options;
  
  // Dla Firebase Storage możemy dodać parametry URL
  const urlObj = new URL(url);
  
  if (width) urlObj.searchParams.set('w', width.toString());
  if (height) urlObj.searchParams.set('h', height.toString());
  urlObj.searchParams.set('q', quality.toString());
  urlObj.searchParams.set('fm', format);
  
  return urlObj.toString();
};

/**
 * Cache dla URL-i obrazów - zmniejsza liczbę requestów do Firebase
 */
const imageUrlCache = new Map();
const CACHE_DURATION = 1000 * 60 * 10; // 10 minut

export const getCachedImageUrl = async (path) => {
  const now = Date.now();
  const cached = imageUrlCache.get(path);
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.url;
  }
  
  const url = await getStorageUrl(path);
  if (url) {
    imageUrlCache.set(path, { url, timestamp: now });
  }
  
  return url;
};

/**
 * Preload krytycznych obrazów dla lepszej wydajności
 * @param {Array<string>} imagePaths - Ścieżki do obrazów do preloadowania
 */
export const preloadImages = async (imagePaths) => {
  const preloadPromises = imagePaths.map(async (path) => {
    try {
      const url = await getCachedImageUrl(path);
      if (url && typeof window !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      }
    } catch (error) {
      console.warn(`Failed to preload image: ${path}`, error);
    }
  });
  
  await Promise.allSettled(preloadPromises);
};

/**
 * Placeholder dla ładujących się obrazów
 */
export const getImagePlaceholder = (width = 400, height = 300) => {
  // Używamy encodeURIComponent zamiast btoa żeby obsługiwać polskie znaki
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e3e0d8"/>
      <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="16" 
            fill="#3a3a3a" text-anchor="middle" dy=".3em">Loading...</text>
    </svg>
  `;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}; 