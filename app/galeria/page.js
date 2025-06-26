'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageUrl } from '@/lib/storage';
import { GALLERY_IMAGES, getGalleryImages } from '@/lib/image-paths';
import { useTranslation } from '@/lib/i18n';
import DynamicImage from '../components/DynamicImage';
import Lightbox from '../components/Lightbox';
import PageHero from '../components/PageHero';
import useLightbox from '../hooks/useLightbox';

export default function GaleriaPage() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

    // Przygotuj obrazy z metadanymi
  const prepareImages = async () => {
    const galleryPaths = getGalleryImages();
    const imagePromises = galleryPaths.map(async (path, index) => {
      try {
        const url = await getStorageUrl(path);
        return {
          id: `gallery-${index + 1}`,
          src: url,
          alt: `Galeria STAVA ${index + 1}`,
          title: `Zdjęcie ${index + 1}`,
        };
      } catch (error) {
        console.warn(`Nie można załadować obrazu: ${path}`);
        return null;
      }
    });

    const loadedImages = await Promise.all(imagePromises);
    return loadedImages.filter(img => img !== null);
  };

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const preparedImages = await prepareImages();
        setImages(preparedImages);
      } catch (error) {
        console.error('Błąd podczas ładowania galerii:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Lightbox hook
  const lightbox = useLightbox(images);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center font-serif text-[#3c3333]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#3c3333] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl tracking-widest">{t('gallery.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Galeria Zdjęć Domku | STAVA Stara Kiszewa</title>
        <meta name="description" content="Zobacz galerię zdjęć naszego komfortowego domku wypoczynkowego w lesie kaszubskim. Wnętrza, tarasy i piękne otoczenie natury w Starej Kiszewie." />
        <meta name="keywords" content="galeria domku wypoczynkowego, zdjęcia STAVA, domek Stara Kiszewa, wnętrza domku, tarasy zdjęcia, Kaszuby galeria" />
        <meta property="og:title" content="Galeria Zdjęć Domku STAVA | Piękne Wnętrza i Natura" />
        <meta property="og:description" content="Odkryj wnętrza i otoczenie naszego domku wypoczynkowego. Komfortowe wyposażenie i przepiękne tereny leśne." />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/galeria%2Fgaleria-1.jpg?alt=media" />
        <meta property="og:url" content="https://stavakiszewa.pl/galeria" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://stavakiszewa.pl/galeria" />
      </Head>
              <div className="bg-[#FFF9E8] font-serif text-[#3c3333]">
      <PageHero 
        titleKey="gallery.title"
      />
      
      {/* Gallery Content */}
      <section className="container mx-auto px-6 sm:px-8 lg:px-4 py-16">
        {/* Galeria */}
        {images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl tracking-widest text-gray-600">
              {t('gallery.no_photos')}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  layoutId={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <DynamicImage
                    src={image.src}
                    alt={image.alt}
                    fixedAspectRatio="aspect-[4/3]"
                    onClick={() => lightbox.openLightbox(index)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox.isOpen && (
        <Lightbox
          images={images}
          selectedIndex={lightbox.selectedIndex}
          onClose={lightbox.closeLightbox}
          onNavigate={lightbox.navigateToIndex}
        />
      )}
    </div>
    </>
  );
} 
