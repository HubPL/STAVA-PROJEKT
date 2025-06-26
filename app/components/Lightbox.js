'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2, FiMinimize2, FiDownload } from 'react-icons/fi';

/**
 * Profesjonalny komponent Lightbox z nawigacją i animacjami
 * @param {Array} images - Tablica obrazów z polami: src, alt, title
 * @param {number} selectedIndex - Index aktualnie wybranego obrazu
 * @param {Function} onClose - Funkcja zamykania lightbox
 * @param {Function} onNavigate - Funkcja nawigacji (index)
 */
export default function Lightbox({ images, selectedIndex, onClose, onNavigate }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(null);

  const currentImage = images[selectedIndex];

  // Funkcje nawigacji (muszą być przed handleKeyPress)
  const handlePrevious = useCallback(() => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
    onNavigate(newIndex);
  }, [selectedIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
    onNavigate(newIndex);
  }, [selectedIndex, images.length, onNavigate]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = currentImage.title || `stava-image-${selectedIndex + 1}`;
    link.click();
  }, [currentImage.src, currentImage.title, selectedIndex]);

  // Nawigacja klawiaturą
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === ' ') {
      e.preventDefault();
      setIsZoomed(prev => !prev);
    }
  }, [onClose, handlePrevious, handleNext]);

  // Obsługa scroll wheel dla zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        setIsZoomed(true); // Scroll up = zoom in
      } else {
        setIsZoomed(false); // Scroll down = zoom out
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.body.style.overflow = 'hidden'; // Blokuj scroll

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyPress, handleWheel]);

  // Reset zoom przy zmianie obrazu
  useEffect(() => {
    setIsZoomed(false);
    setImageLoaded(false);
    setImageAspectRatio(null);
  }, [selectedIndex]);

  // Obsługa załadowania obrazu z wykrywaniem proporcji
  const handleImageLoad = (e) => {
    const img = e.target;
    const { naturalWidth, naturalHeight } = img;
    
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      setImageAspectRatio(ratio);
    }
    
    setImageLoaded(true);
  };

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
        {/* Overlay z możliwością zamykania */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Header z kontrolkami - tylko na desktop */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent hidden md:block"
        >
          <div className="flex items-center justify-end p-4 md:p-6">
            {/* Kontrolki */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                title="Pobierz obraz"
              >
                <FiDownload size={20} />
              </button>
              
              <button
                onClick={() => setIsZoomed(prev => !prev)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                title={isZoomed ? "Pomniejsz" : "Powiększ"}
              >
                {isZoomed ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
              </button>

              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                title="Zamknij (Esc)"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Główny obraz */}
        <div className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-24">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isZoomed ? 1.2 : 1, 
              opacity: imageLoaded ? 1 : 0.5 
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.3 }
            }}
            className={`relative w-full h-full flex items-center justify-center ${
              isZoomed ? 'cursor-zoom-out overflow-auto' : 'cursor-zoom-in'
            }`}
            style={isZoomed ? { 
              maxHeight: '100%',
              overflowY: 'auto',
              overflowX: 'auto'
            } : {}}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(prev => !prev);
            }}
          >
            {/* Przycisk X dla mobile - w rogu zdjęcia */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-2 right-2 z-30 p-2 bg-black/70 backdrop-blur-sm text-white rounded-full md:hidden"
              title="Zamknij"
            >
              <FiX size={20} />
            </motion.button>
            {/* Uproszczony kontener dla obrazu */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={1200}
                height={800}
                quality={95}
                priority
                className="max-w-full max-h-full object-contain"
                onLoad={handleImageLoad}
                sizes="100vw"
                style={{
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </div>

            {/* Loading spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}


          </motion.div>
        </div>

        {/* Nawigacja - poprzedni */}
        {images.length > 1 && (
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
            title="Poprzedni obraz (←)"
          >
            <FiChevronLeft size={32} />
          </motion.button>
        )}

        {/* Nawigacja - następny */}
        {images.length > 1 && (
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
            title="Następny obraz (→)"
          >
            <FiChevronRight size={32} />
          </motion.button>
        )}

        {/* Footer z miniaturkami */}
        {images.length > 1 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent"
          >
            <div className="p-4">
              <div className="flex justify-center space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(index)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all ${
                      index === selectedIndex 
                        ? 'ring-2 ring-white opacity-100' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}


      </div>
    </AnimatePresence>
  );
} 