'use client';

import Image from 'next/image';
import { useState, forwardRef, useRef, useEffect } from 'react';
import { getImagePlaceholder } from '@/lib/storage';

/**
 * Zoptymalizowany komponent Image dla Firebase Storage
 * Wykorzystuje bezpośrednie URL-e z dodatkowymi optymalizacjami
 */
const OptimizedImage = forwardRef(function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  quality = 85,
  sizes = '100vw',
  onLoad,
  lazy = true, // nowy prop
  ...props
}, ref) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority);
  const imgRef = useRef(null);

  // Intersection Observer dla lazy loading
  useEffect(() => {
    if (!lazy || priority || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // ładuj 50px przed wejściem w viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, shouldLoad]);

  // Placeholder dla ładowania
  const placeholder = getImagePlaceholder(width, height);

  // Error fallback
  const errorSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="14" 
            fill="#6b7280" text-anchor="middle" dy=".3em">Error</text>
    </svg>
  `;
  const errorPlaceholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(errorSvg)}`;

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {shouldLoad ? (
        <Image
          ref={ref}
          src={hasError ? errorPlaceholder : src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={placeholder}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-all duration-500 ${
            isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'
          }`}
          {...props}
        />
      ) : (
        // Placeholder podczas oczekiwania na lazy load
        <div 
          className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      {/* Loading overlay */}
      {shouldLoad && isLoading && !hasError && (
        <div className="absolute inset-0 bg-[#FFF9E8] animate-pulse" />
      )}
    </div>
  );
});

export default OptimizedImage; 