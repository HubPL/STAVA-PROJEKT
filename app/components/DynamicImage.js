'use client';

import { useState, useRef } from 'react';
import OptimizedImage from './OptimizedImage';

/**
 * Komponent obrazu który automatycznie dopasowuje aspect-ratio do rzeczywistych wymiarów obrazu
 */
export default function DynamicImage({ 
  src, 
  alt, 
  className = '', 
  onClick,
  fixedAspectRatio = null, // nowy prop dla stałego rozmiaru
  ...props 
}) {
  const [aspectRatio, setAspectRatio] = useState(fixedAspectRatio || 'aspect-square'); // domyślny kwadrat
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  const handleImageLoad = (e) => {
    // Jeśli jest ustalony stały aspect-ratio, nie zmieniamy go
    if (fixedAspectRatio) {
      setIsLoaded(true);
      return;
    }

    const img = e.target;
    const { naturalWidth, naturalHeight } = img;
    
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      
      // Określ aspect-ratio na podstawie rzeczywistych proporcji
      let newAspectRatio;
      
      if (ratio > 1.4) {
        // Bardzo szerokie obrazy
        newAspectRatio = 'aspect-[16/9]';
      } else if (ratio > 1.1) {
        // Średnio szerokie 
        newAspectRatio = 'aspect-[4/3]';
      } else if (ratio > 0.9) {
        // Prawie kwadratowe
        newAspectRatio = 'aspect-square';
      } else if (ratio > 0.7) {
        // Średnio wysokie
        newAspectRatio = 'aspect-[3/4]';
      } else {
        // Bardzo wysokie
        newAspectRatio = 'aspect-[9/16]';
      }
      
      setAspectRatio(newAspectRatio);
    }
    
    setIsLoaded(true);
  };

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer group rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${fixedAspectRatio ? '' : 'break-inside-avoid mb-4'} ${aspectRatio} ${className}`}
      onClick={onClick}
    >
      {src ? (
        <OptimizedImage
          ref={imgRef}
          src={src}
          alt={alt}
          width={400}
          height={300}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          quality={85}
          onLoad={handleImageLoad}
          {...props}
        />
      ) : (
        <div className="w-full h-full bg-[#FFF9E8] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#3c3333] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#FFF9E8] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#3c3333] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>
    </div>
  );
} 