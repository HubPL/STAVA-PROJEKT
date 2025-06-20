'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { getRezerwacjaByToken } from '@/lib/firestore';

export default function PotwierdzeniePage({ params }) {
  const resolvedParams = use(params);
  const { token } = resolvedParams;
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      const getReservation = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getRezerwacjaByToken(token);
          if (data) {
            setReservation(data);
          } else {
            setError('Nie znaleziono rezerwacji dla podanego tokenu lub token jest nieprawidłowy.');
          }
        } catch (err) {
          console.error("Error fetching reservation:", err);
          setError('Wystąpił błąd podczas pobierania danych rezerwacji.');
        }
        setLoading(false);
      };
      getReservation();
    }
  }, [token]);

  const formatDate = (date) => {
    if (!date) return 'Brak daty';
    
    // Jeśli data jest znacznikiem czasowym
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString('pl-PL');
    }
    
    // Jeśli data jest już obiektem daty
    if (date instanceof Date) {
      return date.toLocaleDateString('pl-PL');
    }
    
    // Jeśli data jest tekstem
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('pl-PL');
    }
    
    return 'Nieprawidłowa data';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-200 flex flex-col items-center justify-center px-4">
        <div className="h-32"></div>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-lumios text-brand-800 mb-4">
            Weryfikacja Rezerwacji
          </h1>
          <p className="text-brand-600 font-playfair text-lg">
            Trwa ładowanie danych rezerwacji...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-200 flex flex-col items-center justify-center px-4">
        <div className="h-32"></div>
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-lumios text-brand-800 mb-4">
            Błąd Weryfikacji
          </h1>
          <p className="text-red-600 font-playfair mb-6">{error}</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-lumios rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Powrót na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-brand-200 flex flex-col items-center justify-center px-4">
        <div className="h-32"></div>
        <div className="text-center">
          <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-lumios text-brand-800 mb-4">
            Weryfikacja Rezerwacji
          </h1>
          <p className="text-brand-600 font-playfair mb-6">Nie znaleziono rezerwacji.</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-lumios rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Powrót na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  const statusClasses = {
    oczekujaca: 'bg-amber-600 text-white',
    potwierdzona: 'bg-green-600 text-white',
    odrzucona: 'bg-red-600 text-white',
  };

  const statusIcons = {
    oczekujaca: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    potwierdzona: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    odrzucona: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-brand-200 py-12 px-4">
      <div className="h-32"></div>
      
      {/* Powiadomienie o przestarzałym systemie */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Uwaga:</strong> Ten system zarządzania rezerwacjami został zastąpiony bezpieczniejszym panelem administracyjnym. 
                Możesz jedynie przeglądać szczegóły rezerwacji, ale nie można już zmieniać statusu przez ten link.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl border border-brand-300 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {statusIcons[reservation.status] || (
                <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-lumios text-brand-800 mb-4">
              Szczegóły Rezerwacji
            </h1>
            <p className="text-brand-600 font-playfair">
              Token: <span className="font-mono text-sm bg-brand-100 px-2 py-1 rounded">{token}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Status rezerwacji */}
            <div className="space-y-4">
              <h3 className="text-2xl font-lumios text-brand-800 mb-4">Status Rezerwacji</h3>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-lg font-medium flex items-center gap-2 ${statusClasses[reservation.status] || 'bg-brand-600 text-white'}`}>
                  {statusIcons[reservation.status]} {
                    reservation.status === 'oczekujaca' ? 'Oczekująca' :
                    reservation.status === 'potwierdzona' ? 'Potwierdzona' :
                    reservation.status === 'odrzucona' ? 'Odrzucona' :
                    reservation.status
                  }
                </span>
              </div>
              
              {reservation.status === 'oczekujaca' && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Informacja:</strong> Zarządzanie rezerwacjami odbywa się teraz przez bezpieczny panel administracyjny. 
                    Administrator zostanie powiadomiony o Twojej rezerwacji i skontaktuje się z Tobą w ciągu 24 godzin.
                  </p>
                </div>
              )}
            </div>

            {/* Dane osobowe */}
            <div className="space-y-4">
              <h3 className="text-2xl font-lumios text-brand-800 mb-4">Dane Gościa</h3>
              <div className="space-y-2 text-brand-600">
                <p><strong>Imię i nazwisko:</strong> {reservation.imie} {reservation.nazwisko}</p>
                <p><strong>Email:</strong> {reservation.email}</p>
                <p><strong>Telefon:</strong> {reservation.telefon}</p>
              </div>
            </div>
          </div>

          {/* Szczegóły rezerwacji */}
          <div className="mt-8 pt-8 border-t border-brand-200">
            <h3 className="text-2xl font-lumios text-brand-800 mb-6">Szczegóły Pobytu</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-brand-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-brand-200 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h4 className="font-semibold text-brand-800">Domek</h4>
                <p className="text-brand-600">{reservation.domekNazwa || 'Nie określono'}</p>
              </div>
              
              <div className="bg-brand-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-brand-200 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-brand-800">Liczba osób</h4>
                <p className="text-brand-600">{reservation.liczbOsob || 'Nie określono'}</p>
              </div>
              
              <div className="bg-brand-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-brand-200 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-brand-800">Termin</h4>
                <p className="text-brand-600 text-sm">
                  {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                </p>
              </div>
              
              <div className="bg-brand-50 p-4 rounded-lg">
                <div className="w-8 h-8 bg-brand-200 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-semibold text-brand-800">Cena całkowita</h4>
                <p className="text-brand-600 font-bold">{reservation.cenaCałkowita || 'Nie określono'} PLN</p>
              </div>
            </div>
          </div>

          {/* Uwagi */}
          {reservation.uwagi && (
            <div className="mt-8 pt-8 border-t border-brand-200">
              <h3 className="text-2xl font-lumios text-brand-800 mb-4">Uwagi do rezerwacji</h3>
              <div className="bg-brand-50 p-4 rounded-lg">
                <p className="text-brand-600">{reservation.uwagi}</p>
              </div>
            </div>
          )}

          {/* Powrót */}
          <div className="mt-8 pt-8 border-t border-brand-200 text-center">
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-lumios rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Powrót na stronę główną
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 