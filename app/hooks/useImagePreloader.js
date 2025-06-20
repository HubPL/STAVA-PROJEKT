'use client';

import { useEffect, useState } from 'react';
import { getCachedImageUrl } from '@/lib/storage';

/**
 * Hook do inteligentnego preloadowania obrazów
 * Preloaduje obrazy tylko gdy użytkownik jest na Wi-Fi i ma dobrą prędkość
 */
export function useImagePreloader(imagePaths = [], options = {}) {
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [isPreloading, setIsPreloading] = useState(false);
  
  const {
    preloadOnlyOnWifi = true,
    preloadOnlyOnFastConnection = true,
    delay = 1000, // Opóźnienie przed preloadowaniem
  } = options;

  useEffect(() => {
    if (!imagePaths.length || typeof window === 'undefined') return;

    const shouldPreload = () => {
      // Sprawdź połączenie sieciowe
      if ('connection' in navigator) {
        const connection = navigator.connection;
        
        if (preloadOnlyOnWifi && connection.type === 'cellular') {
          return false;
        }
        
        if (preloadOnlyOnFastConnection && connection.effectiveType === '2g') {
          return false;
        }
      }
      
      return true;
    };

    const preloadImages = async () => {
      if (!shouldPreload()) return;
      
      setIsPreloading(true);
      
      const preloadPromises = imagePaths.map(async (path) => {
        try {
          const url = await getCachedImageUrl(path);
          if (url) {
            // Stwórz link preload
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
            
            // Dodaj do preloadowanych
            setPreloadedImages(prev => new Set(prev).add(path));
            
            return path;
          }
        } catch (error) {
          console.warn(`Failed to preload image: ${path}`, error);
        }
      });
      
      await Promise.allSettled(preloadPromises);
      setIsPreloading(false);
    };

    // Opóźnij preloadowanie, żeby nie blokować krytycznych zasobów
    const timer = setTimeout(preloadImages, delay);
    
    return () => {
      clearTimeout(timer);
      setIsPreloading(false);
    };
  }, [imagePaths, preloadOnlyOnWifi, preloadOnlyOnFastConnection, delay]);

  return {
    preloadedImages,
    isPreloading,
    isImagePreloaded: (path) => preloadedImages.has(path),
  };
}

/**
 * Hook do lazy loadowania obrazów w galerii
 * Ładuje obrazy gdy są blisko viewport
 */
export function useIntersectionImageLoader(ref, imagePath, options = {}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  
  const {
    rootMargin = '50px',
    threshold = 0.1,
  } = options;

  useEffect(() => {
    if (!ref.current || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !imagePath) return;

    const loadImage = async () => {
      try {
        const url = await getCachedImageUrl(imagePath);
        setImageUrl(url);
      } catch (error) {
        console.error(`Failed to load image: ${imagePath}`, error);
      }
    };

    loadImage();
  }, [shouldLoad, imagePath]);

  return { imageUrl, shouldLoad };
} 