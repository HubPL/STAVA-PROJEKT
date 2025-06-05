'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

const placeholderGalleryImages = {
  domki: [
    { id: 'd1', src: 'https://via.placeholder.com/600x400/e7e5e4/365314?text=🏡+Domek+Nowoczesny', alt: 'Zdjęcie nowoczesnego domku z zewnątrz', category: 'domki' },
    { id: 'd2', src: 'https://via.placeholder.com/600x400/d6d3d1/7c2d12?text=🛏️+Wnętrze+Domku', alt: 'Przytulne wnętrze domku', category: 'domki' },
    { id: 'd3', src: 'https://via.placeholder.com/600x400/f6f3f0/92400e?text=🏡+Domek+Widok', alt: 'Domek z tarasem i widokiem', category: 'domki' },
    { id: 'd4', src: 'https://via.placeholder.com/600x400/e7e5e4/365314?text=🍽️+Kuchnia', alt: 'Drewniana kuchnia w domku', category: 'domki' },
    { id: 'd5', src: 'https://via.placeholder.com/600x400/d6d3d1/7c2d12?text=🛌+Sypialnia', alt: 'Sypialnia w domku', category: 'domki' },
    { id: 'd6', src: 'https://via.placeholder.com/600x400/f6f3f0/92400e?text=🪟+Detal', alt: 'Detal okna domku', category: 'domki' },
  ],
  okolica: [
    { id: 'o1', src: 'https://via.placeholder.com/600x400/365314/e7e5e4?text=🏞️+Jezioro+Las', alt: 'Malownicze jezioro w kaszubskim lesie', category: 'okolica' },
    { id: 'o2', src: 'https://via.placeholder.com/600x400/7c2d12/f6f3f0?text=🌲+Ścieżka+Leśna', alt: 'Leśna ścieżka spacerowa latem', category: 'okolica' },
    { id: 'o3', src: 'https://via.placeholder.com/600x400/92400e/d6d3d1?text=🌅+Zachód+Słońca', alt: 'Zachód słońca nad rzeką na Kaszubach', category: 'okolica' },
    { id: 'o4', src: 'https://via.placeholder.com/600x400/365314/e7e5e4?text=🛶+Spływ+Kajakowy', alt: 'Spływ kajakowy rzeką', category: 'okolica' },
  ],
  osrodek: [
    { id: 's1', src: 'https://via.placeholder.com/600x400/7c2d12/f6f3f0?text=🏠+Ośrodek+Widok', alt: 'Widok ogólny na ośrodek z lotu ptaka', category: 'osrodek' },
    { id: 's2', src: 'https://via.placeholder.com/600x400/92400e/d6d3d1?text=🎠+Plac+Zabaw', alt: 'Plac zabaw dla dzieci na terenie ośrodka', category: 'osrodek' },
    { id: 's3', src: 'https://via.placeholder.com/600x400/365314/e7e5e4?text=🔥+Ognisko', alt: 'Miejsce na ognisko wieczorem', category: 'osrodek' },
    { id: 's4', src: 'https://via.placeholder.com/600x400/7c2d12/f6f3f0?text=🏢+Recepcja', alt: 'Recepcja ośrodka', category: 'osrodek' },
  ],
};

const allImages = [
  ...placeholderGalleryImages.domki,
  ...placeholderGalleryImages.okolica,
  ...placeholderGalleryImages.osrodek,
];

const categories = [
  { key: 'all', name: 'Wszystkie', icon: '🖼️', count: allImages.length },
  { key: 'domki', name: 'Domki', icon: '🏡', count: placeholderGalleryImages.domki.length },
  { key: 'okolica', name: 'Okolica', icon: '🌲', count: placeholderGalleryImages.okolica.length },
  { key: 'osrodek', name: 'Ośrodek', icon: '🏠', count: placeholderGalleryImages.osrodek.length },
];

function GalleryContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const filteredImages = selectedCategory === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image) => setLightboxImage(image);
  const closeLightbox = () => setLightboxImage(null);

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(category => (
          <button 
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`group relative btn-forest-outline transition-all duration-300 ${
              selectedCategory === category.key 
                ? 'bg-amber-800 text-white border-amber-800 shadow-lg scale-105' 
                : 'hover:scale-105'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg group-hover:scale-125 transition-transform duration-300">
                {category.icon}
              </span>
              <span className="font-medium">{category.name}</span>
              <span className="text-xs bg-white/20 text-current px-2 py-1 rounded-full">
                {category.count}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id} 
              className="group relative card-forest p-2 cursor-pointer overflow-hidden"
              onClick={() => openLightbox(image)}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image 
                  src={image.src} 
                  alt={image.alt} 
                  fill 
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  style={{ objectFit: 'cover' }} 
                  className="image-forest group-hover:scale-110 transition-all duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Hover Content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95">
                  <div className="text-center text-white p-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto backdrop-blur-sm">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <p className="text-sm font-body line-clamp-2">{image.alt}</p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-amber-800/90 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  {categories.find(cat => cat.key === image.category)?.icon} {categories.find(cat => cat.key === image.category)?.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">📸</div>
          <h3 className="text-2xl font-display text-stone-800 mb-4">Brak zdjęć w tej kategorii</h3>
          <p className="text-stone-700 font-body">Spróbuj wybrać inną kategorię lub dodać nowe zdjęcia.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4 cursor-pointer"
          onClick={closeLightbox}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-800 to-stone-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categories.find(cat => cat.key === lightboxImage.category)?.icon}</span>
                  <span className="font-primary font-semibold">{categories.find(cat => cat.key === lightboxImage.category)?.name}</span>
                </div>
                <button 
                  onClick={closeLightbox} 
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  aria-label="Zamknij podgląd obrazu"
                >
                  <span className="text-lg">✖️</span>
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex-1 min-h-0">
              <Image 
                src={lightboxImage.src} 
                alt={lightboxImage.alt} 
                width={1200}
                height={800}
                style={{ 
                  objectFit: 'contain', 
                  width: 'auto', 
                  height: 'auto', 
                  maxWidth: 'calc(90vw - 40px)', 
                  maxHeight: 'calc(90vh - 120px)' 
                }} 
                className="rounded-lg"
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t">
              <p className="text-center text-stone-800 font-body text-sm">{lightboxImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function GaleriaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="section-forest py-20 texture-forest relative overflow-hidden">
        <div className="absolute top-16 left-16 w-8 h-8 bg-amber-700 rounded-full opacity-30 nature-pulse"></div>
        <div className="absolute top-32 right-12 w-6 h-6 bg-orange-800 rounded-full opacity-40 nature-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-24 left-1/3 w-5 h-5 bg-stone-700 rounded-full opacity-35 nature-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto text-center px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-display text-stone-800 mb-6 heading-forest">
            Galeria <span className="text-amber-800">Zdjęć</span>
          </h1>
          <p className="text-xl md:text-2xl font-primary text-stone-700 mb-8 max-w-3xl mx-auto">
            Odkryj piękno naszego ośrodka przez obiektyw
          </p>
          <div className="flex items-center justify-center gap-2 text-stone-600">
            <span className="text-2xl">📸</span>
            <span className="font-body text-lg">Każde zdjęcie opowiada historię</span>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <GalleryContent />
          
          {/* Call to Action */}
          <div className="text-center mt-16 p-8 card-forest max-w-2xl mx-auto">
            <h3 className="text-2xl font-display text-stone-800 mb-4">Chcesz zobaczyć więcej?</h3>
            <p className="text-stone-700 font-body mb-6">
              Odwiedź nas osobiście i doświadcz tego piękna na własne oczy. 
              Zarezerwuj swój pobyt już dziś!
            </p>
            <Link href="/rezerwacja" className="btn-forest">
              📅 Zarezerwuj pobyt
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 