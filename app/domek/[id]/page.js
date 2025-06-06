'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { getDomekById } from '@/lib/firestore';
import { getStorageUrl } from '@/lib/storage';

export default function DomekSzczegolyPage({ params }) {
  const resolvedParams = use(params);
  const [domek, setDomek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Firebase Storage: URLs for images loaded dynamically
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchDomek = async () => {
      try {
        setLoading(true);
        const data = await getDomekById(resolvedParams.id);
        if (data) {
          setDomek(data);
          
          // Firebase Storage: Load main image from domki/{domekId}/main.jpg
          try {
            const mainImg = await getStorageUrl(`domki/${data.id}/main.jpg`);
            setMainImageUrl(mainImg);
          } catch (error) {
            console.error(`Error loading main image for domek ${data.id}:`, error);
          }

          // Firebase Storage: Load gallery images from domki/{domekId}/ (numbered 1.jpg, 2.jpg, etc.)
          const galleryPromises = [];
          for (let i = 1; i <= 10; i++) { // Try to load up to 10 gallery images
            galleryPromises.push(
              getStorageUrl(`domki/${data.id}/${i}.jpg`).catch(() => null)
            );
          }
          
          try {
            const galleryUrls = await Promise.all(galleryPromises);
            const validGalleryUrls = galleryUrls.filter(url => url !== null);
            setGalleryImages(validGalleryUrls);
          } catch (error) {
            console.error(`Error loading gallery images for domek ${data.id}:`, error);
          }
        } else {
          setError(`Nie znaleziono domku o ID: ${resolvedParams.id}`);
        }
      } catch (err) {
        console.error('Błąd podczas pobierania szczegółów domku:', err);
        setError('Nie udało się załadować szczegółów domku. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchDomek();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="loading-forest mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Ładujemy Szczegóły Domku
          </h1>
          <p className="text-stone-700 font-body text-lg">Przygotowujemy wszystkie informacje...</p>
        </div>
      </div>
    );
  }

  if (error || !domek) {
    return (
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Ups! Coś poszło nie tak
          </h1>
          <p className="text-red-600 font-body mb-6">{error}</p>
          <Link href="/domki" className="btn-forest">
            🏠 Powrót do listy domków
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Main Image */}
      <section className="relative h-[60vh] overflow-hidden">
        {mainImageUrl ? (
          <Image 
            src={mainImageUrl} 
            alt={`Główne zdjęcie domku ${domek.nazwa}`} 
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }} 
            priority
            className="image-forest"
          />
        ) : (
          // Firebase Storage: Placeholder when main image not available
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-400 flex items-center justify-center">
            <div className="text-center text-stone-600">
              <div className="text-8xl mb-4">🏡</div>
              <p className="text-xl">Główne zdjęcie domku</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-display mb-4 heading-forest">{domek.nazwa}</h1>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="bg-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
                {domek.cenaZaDobe} PLN/noc
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                👥 {domek.iloscOsob} osób
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                📐 {domek.powierzchnia} m²
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <div className="card-forest p-8">
                <h2 className="text-3xl font-display text-stone-800 mb-6 heading-forest">Opis Domku</h2>
                <p className="text-stone-700 font-body text-lg leading-relaxed whitespace-pre-line">
                  {domek.opis}
                </p>
              </div>

              {/* Gallery Section */}
              <div className="card-forest p-8">
                <h2 className="text-3xl font-display text-stone-800 mb-6 heading-forest">Galeria Zdjęć</h2>
                {galleryImages && galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {galleryImages.map((url, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                        <Image 
                          src={url} 
                          alt={`Zdjęcie ${index + 1} domku ${domek.nazwa}`} 
                          fill 
                          sizes="(max-width: 640px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }} 
                          className="image-forest group-hover:scale-110 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-stone-600">
                    <div className="text-4xl mb-4">📸</div>
                    <p className="font-body">Brak dodatkowych zdjęć w galerii tego domku.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="card-forest p-6 sticky top-24">
                <h3 className="text-xl font-display text-stone-800 mb-4">Podstawowe informacje</h3>
                <div className="space-y-3 text-stone-700 font-body">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <span>Maksymalna ilość osób:</span>
                    <span className="font-semibold">{domek.iloscOsob}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <span>Powierzchnia:</span>
                    <span className="font-semibold">{domek.powierzchnia} m²</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <span>Cena za dobę:</span>
                    <span className="font-semibold text-amber-800">{domek.cenaZaDobe} PLN</span>
                  </div>
                  {!domek.dostepny && (
                    <div className="text-red-600 font-medium bg-red-50 p-3 rounded-lg">
                      Status: Aktualnie niedostępny
                    </div>
                  )}
                </div>

                <Link 
                  href={`/rezerwacja?domek=${domek.id}`} 
                  className={`w-full mt-6 btn-forest text-center block ${
                    !domek.dostepny ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={!domek.dostepny ? (e) => e.preventDefault() : undefined}
                >
                  {domek.dostepny ? '📅 Zarezerwuj Ten Domek' : 'Domek Niedostępny'}
                </Link>
              </div>

              {/* Equipment */}
              {domek.wyposazenie && domek.wyposazenie.length > 0 && (
                <div className="card-forest p-6">
                  <h3 className="text-xl font-display text-stone-800 mb-4">Wyposażenie</h3>
                  <ul className="space-y-2 text-stone-700 font-body text-sm">
                    {domek.wyposazenie.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-amber-800">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Amenities */}
              {domek.udogodnienia && domek.udogodnienia.length > 0 && (
                <div className="card-forest p-6">
                  <h3 className="text-xl font-display text-stone-800 mb-4">Udogodnienia</h3>
                  <ul className="space-y-2 text-stone-700 font-body text-sm">
                    {domek.udogodnienia.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-amber-800">★</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Opcjonalnie: Generowanie statycznych ścieżek, jeśli ID domków są znane w czasie budowy
// export async function generateStaticParams() {
//   return Object.keys(placeholderCabinData).map((id) => ({ id }));
// } 