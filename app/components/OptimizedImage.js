'use client';

import Image from 'next/image';
import { useState, forwardRef } from 'react';
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
  ...props
}, ref) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    <div className={`relative overflow-hidden ${className}`}>
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
      
      {/* Loading overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-[#e3e0d8] animate-pulse" />
      )}
    </div>
  );
});

export default OptimizedImage; 