'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getAllDomki } from '@/lib/firestore';
import { getStorageUrl } from '@/lib/storage';

export default function DomkiPage() {
  const [domki, setDomki] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomki = async () => {
      try {
        setLoading(true);
        const domkiData = await getAllDomki();
        
        const domkiWithImages = await Promise.all(
          domkiData.map(async (domek) => {
            try {
              const mainImagePath = `domki/${domek.id}/main.jpg`;
              const imageUrl = await getStorageUrl(mainImagePath);
              return {
                ...domek,
                zdjecieGlowneURL: imageUrl
              };
            } catch (error) {
              return {
                ...domek,
                zdjecieGlowneURL: 'https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Fdomek-placeholder.jpg?alt=media'
              };
            }
          })
        );
        
        setDomki(domkiWithImages);
      } catch (err) {
        console.error('Błąd podczas pobierania domków:', err);
        setError('Nie udało się załadować domków. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    fetchDomki();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="loading-forest mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Ładujemy Nasze Domki
          </h1>
          <p className="text-stone-700 font-body text-lg">Przygotowujemy dla Ciebie najlepsze opcje...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Ups! Coś poszło nie tak
          </h1>
          <p className="text-red-600 font-body mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-forest"
          >
            🔄 Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Nagłówek */}
      <section className="section-forest py-20 texture-forest relative overflow-hidden">
        <div className="absolute top-10 left-10 w-6 h-6 bg-amber-700 rounded-full opacity-30 nature-pulse"></div>
        <div className="absolute top-32 right-16 w-4 h-4 bg-orange-800 rounded-full opacity-40 nature-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-5 h-5 bg-stone-700 rounded-full opacity-35 nature-pulse" style={{animationDelay: '0.5s'}}></div>
        
        <div className="container mx-auto text-center px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-display text-stone-800 mb-6 heading-forest">
            Nasze <span className="text-amber-800">Domki</span>
          </h1>
          <p className="text-xl md:text-2xl font-primary text-stone-700 mb-8 max-w-3xl mx-auto">
            Wybierz swój idelany zakątek w sercu natury
          </p>
          <div className="flex items-center justify-center gap-2 text-stone-600">
            <span className="text-2xl">🏡</span>
            <span className="font-body text-lg">Każdy domek to wyjątkowe doświadczenie</span>
          </div>
        </div>
      </section>

      {/* Siatka domków */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {domki.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🏚️</div>
              <h2 className="text-3xl font-display text-stone-800 mb-4">Brak dostępnych domków</h2>
              <p className="text-stone-700 font-body mb-6">Dodaj domki w panelu administracyjnym Firestore.</p>
              <Link href="/" className="btn-forest-outline">
                🏠 Powrót do strony głównej
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <p className="text-lg font-body text-stone-700">
                  Znaleźliśmy <span className="font-bold text-stone-800">{domki.length}</span> {domki.length === 1 ? 'domek' : 'domków'} dla Ciebie
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {domki.map((domek, index) => (
                  <div 
                    key={domek.id} 
                    className="card-forest overflow-hidden group"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* Kontener zdjęcia */}
                    <div className="relative h-64 overflow-hidden">
                      <Image 
                        src={domek.zdjecieGlowneURL} 
                        alt={`Zdjęcie domku ${domek.nazwa}`} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="image-forest group-hover:scale-110 transition-all duration-500"
                      />
                      
                      {/* Znaczek ceny */}
                      <div className="absolute top-4 left-4 bg-amber-800 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {domek.cenaZaDobe} PLN/noc
                      </div>
                      
                      {/* Znaczek pojemności */}
                      <div className="absolute top-4 right-4 bg-white/90 text-stone-800 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        👥 {domek.iloscOsob} osób
                      </div>
                      

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Treść */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h2 className="text-2xl font-primary font-semibold text-stone-800 mb-2 group-hover:text-amber-800 transition-colors">
                          {domek.nazwa}
                        </h2>
                        <p className="text-stone-700 font-body text-sm leading-relaxed line-clamp-3">
                          {domek.opisKrotki}
                        </p>
                      </div>
                      
                      {/* Wyposażenie */}
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded-full">
                          📐 {domek.powierzchnia} m²
                        </div>
                        {domek.wyposazenie && domek.wyposazenie.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full">
                            {item}
                          </div>
                        ))}
                        {domek.wyposazenie && domek.wyposazenie.length > 2 && (
                          <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{domek.wyposazenie.length - 2} więcej
                          </div>
                        )}
                      </div>

                      {/* Przyciski akcji */}
                      <div className="flex gap-3 pt-4 border-t border-stone-200">
                        <Link 
                          href={`/domek/${domek.id}`} 
                          className="flex-1 text-center btn-forest-outline text-sm py-2 px-4"
                        >
                          🔍 Szczegóły
                        </Link>
                        <Link 
                          href={`/rezerwacja?domek=${domek.id}`} 
                          className="flex-1 text-center btn-forest text-sm py-2 px-4"
                        >
                          📅 Rezerwuj
                        </Link>
                      </div>
                    </div>


                    <div className="absolute inset-0 border-2 border-amber-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
              

              <div className="text-center mt-16 p-8 card-forest max-w-2xl mx-auto">
                <h3 className="text-2xl font-display text-stone-800 mb-4">Nie znalazłeś idealnego domku?</h3>
                <p className="text-stone-700 font-body mb-6">
                  Skontaktuj się z nami, a pomożemy Ci wybrać najlepszą opcję dla Twojego pobytu.
                </p>
                <Link href="/kontakt" className="btn-forest">
                  💬 Skontaktuj się z nami
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
} 