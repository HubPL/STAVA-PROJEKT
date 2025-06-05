'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { getDomekById } from '@/lib/firestore';

export default function DomekSzczegolyPage({ params }) {
  const resolvedParams = use(params);
  const [domek, setDomek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomek = async () => {
      try {
        setLoading(true);
        const data = await getDomekById(resolvedParams.id);
        if (data) {
          setDomek(data);
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
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Szczegóły Domku</h1>
        <p className="text-gray-600">Ładowanie szczegółów domku...</p>
      </div>
    );
  }

  if (error || !domek) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Błąd</h1>
        <p className="text-red-600 mb-4">{error}</p>
        <Link 
          href="/domki" 
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Powrót do listy domków
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">{domek.nazwa}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200">
          <Image 
            src={domek.zdjecieGlowneURL || 'https://via.placeholder.com/600x400/cccccc/666666?text=Domek'} 
            alt={`Główne zdjęcie domku ${domek.nazwa}`} 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }} 
            priority
          />
        </div>
        <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Opis Domku</h2>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
            {domek.opis}
          </p>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Podstawowe informacje:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1">
            <li>Maksymalna ilość osób: {domek.iloscOsob}</li>
            <li>Powierzchnia: {domek.powierzchnia} m²</li>
            <li>Cena za dobę: {domek.cenaZaDobe} PLN</li>
            {!domek.dostepny && (
              <li className="text-red-600 font-medium">Status: Aktualnie niedostępny</li>
            )}
          </ul>

          <Link 
            href={`/rezerwacja?domek=${domek.id}`} 
            className={`inline-block font-semibold py-2.5 px-5 rounded-md text-base transition-colors ${
              domek.dostepny 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
            onClick={!domek.dostepny ? (e) => e.preventDefault() : undefined}
          >
            {domek.dostepny ? 'Zarezerwuj Ten Domek' : 'Domek Niedostępny'}
          </Link>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Galeria Zdjęć Domku</h2>
      {domek.zdjeciaURLs && domek.zdjeciaURLs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {domek.zdjeciaURLs.map((url, index) => (
            <div key={index} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md border border-gray-200">
              <Image 
                src={url} 
                alt={`Zdjęcie ${index + 1} domku ${domek.nazwa}`} 
                fill 
                sizes="(max-width: 640px) 50vw, 33vw"
                style={{ objectFit: 'cover' }} 
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mb-12 text-sm">Brak dodatkowych zdjęć w galerii tego domku.</p>
      )}
      
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Wyposażenie</h2>
        {domek.wyposazenie && domek.wyposazenie.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
            {domek.wyposazenie.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">Brak informacji o wyposażeniu.</p>
        )}
      </div>

      {domek.udogodnienia && domek.udogodnienia.length > 0 && (
        <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Udogodnienia</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
            {domek.udogodnienia.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Opcjonalnie: Generowanie statycznych ścieżek, jeśli ID domków są znane w czasie budowy
// export async function generateStaticParams() {
//   return Object.keys(placeholderCabinData).map((id) => ({ id }));
// } 