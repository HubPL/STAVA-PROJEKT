'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRezerwacjaByToken } from '@/lib/firestore';

export default function PotwierdzenieGosciaContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
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
            setError('Nie znaleziono rezerwacji dla podanego tokenu.');
          }
        } catch (err) {
          console.error("Error fetching reservation:", err);
          setError('Wystąpił błąd podczas pobierania danych rezerwacji.');
        }
        setLoading(false);
      };
      getReservation();
    } else {
      setError('Brak tokenu rezerwacji.');
      setLoading(false);
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
      <div className="min-h-screen bg-[#fdf2d0] flex flex-col items-center justify-center px-6 sm:px-8 lg:px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#3c3333] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl tracking-widest">Sprawdzam potwierdzenie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf2d0] flex flex-col items-center justify-center px-6 sm:px-8 lg:px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-widest uppercase mb-4 font-lumios">Ups! Coś poszło nie tak</h1>
          <p className="text-lg tracking-wider mb-8">{error}</p>
          <Link href="/" className="inline-block px-8 py-3 bg-[#3c3333] text-[#fdf2d0] rounded-lg hover:bg-opacity-90 transition-colors font-montserrat font-semibold">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#fdf2d0] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#ffffff] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#3c3333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-lumios text-[#3c3333] mb-4">
            Nie znaleziono rezerwacji
          </h1>
          <p className="text-[#3c3333] font-inter mb-6">Sprawdź link lub skontaktuj się z nami.</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-[#3c3333] hover:bg-[#3c3333]/90 text-white font-montserrat font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Powrót na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = {
    oczekujaca: {
      icon: (
        <svg className="w-16 h-16 text-[#3c3333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Rezerwacja oczekuje na potwierdzenie',
      message: 'Twoja rezerwacja została przyjęta i oczekuje na potwierdzenie przez nasz zespół.',
      color: 'text-[#3c3333]',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    potwierdzona: {
      icon: (
        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Rezerwacja potwierdzona!',
      message: 'Świetnie! Twoja rezerwacja została potwierdzona.',
      color: 'text-green-800',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    odrzucona: {
      icon: (
        <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Rezerwacja odrzucona',
      message: 'Niestety, nie możemy potwierdzić Twojej rezerwacji na wybrany termin.',
      color: 'text-red-800',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  const status = statusInfo[reservation.status] || statusInfo.oczekujaca;

  return (
    <div className="min-h-screen py-12 px-6 sm:px-8 lg:px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-widest uppercase mb-6 font-lumios">
            Potwierdź swoją rezerwację
          </h1>
          <p className="text-lg tracking-wider">
            Kliknij przycisk poniżej, aby potwierdzić swoją rezerwację w STAVA.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Pole statusu */}
          <div className={`${status.bgColor} ${status.borderColor} border-2 rounded-2xl p-8 mb-8 text-center`}>
            <div className="flex justify-center mb-4">{status.icon}</div>
            <h2 className={`text-2xl font-lumios ${status.color} mb-4`}>
              {status.title}
            </h2>
            <p className={`text-lg font-inter ${status.color}`}>
              {status.message}
            </p>
          </div>

          {/* Szczegóły rezerwacji */}
          <div className="bg-white shadow-xl rounded-3xl border border-[#3c3333]/20 p-8 mb-8">
            <h3 className="text-2xl font-lumios text-[#3c3333] mb-6">
              Szczegóły Twojej rezerwacji
            </h3>
            
            {/* Sprawdź czy ma nową strukturę z selectedDomki */}
            {reservation.selectedDomki && Array.isArray(reservation.selectedDomki) ? (
              // Nowa struktura - wiele domków
              <div className="space-y-8">
                {/* Podsumowanie ogólne */}
                <div className="bg-[#fdf2d0]/30 rounded-xl p-6 border border-[#3c3333]/20">
                  <h4 className="text-lg font-lumios font-semibold text-[#3c3333] mb-4">
                    Podsumowanie rezerwacji
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-[#3c3333]">
                    <div>
                      <span className="font-medium">Liczba domków:</span> {reservation.selectedDomki.length}
                    </div>
                    <div>
                      <span className="font-medium">Łączna liczba osób:</span> {reservation.liczbOsob}
                    </div>
                    <div>
                      <span className="font-medium">Łączna cena:</span> <span className="font-bold">{reservation.cenaCałkowita} PLN</span>
                    </div>
                  </div>
                </div>

                {/* Lista domków */}
                <div className="space-y-6">
                  <h4 className="text-lg font-lumios font-semibold text-[#3c3333] border-b border-[#3c3333]/20 pb-2">
                    Szczegóły domków
                  </h4>
                  {reservation.selectedDomki.map((domek, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h5 className="text-lg font-semibold text-[#3c3333] mb-4">
                        🏠 Domek {domek.domekId.replace('D', '')}
                      </h5>
                      <div className="grid md:grid-cols-2 gap-4 text-[#3c3333]">
                        <div className="space-y-2">
                          <p><span className="font-medium">Liczba osób:</span> {domek.liczbOsob}</p>
                          <p><span className="font-medium">Liczba nocy:</span> {domek.iloscNocy}</p>
                          <p><span className="font-medium">Cena za domek:</span> <span className="font-bold">{domek.cenaCałkowita || domek.cenaCalkowitaDomku} PLN</span></p>
                        </div>
                        <div className="space-y-2">
                          <p><span className="font-medium">Przyjazd:</span> {formatDate(domek.startDate)}</p>
                          <p><span className="font-medium">Wyjazd:</span> {formatDate(domek.endDate)}</p>
                          {reservation.status === 'potwierdzona' && (
                            <p><span className="font-medium">Status:</span> <span className="text-green-600 font-bold">Potwierdzony</span></p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dane gościa */}
                <div className="grid md:grid-cols-1 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-lumios font-semibold text-[#3c3333] border-b border-[#3c3333]/20 pb-2">
                      Twoje dane
                    </h4>
                    <div className="space-y-2 text-[#3c3333]">
                      <p><span className="font-medium">Imię i nazwisko:</span> {reservation.imie} {reservation.nazwisko}</p>
                      <p><span className="font-medium">Email:</span> {reservation.email}</p>
                      <p><span className="font-medium">Telefon:</span> {reservation.telefon}</p>
                      {reservation.uwagi && (
                        <div>
                          <span className="font-medium">Uwagi:</span>
                          <p className="mt-1 p-3 bg-[#fdf2d0]/30 rounded-lg text-sm">{reservation.uwagi}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Stara struktura - jeden domek (dla kompatybilności)
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-lumios font-semibold text-[#3c3333] border-b border-[#3c3333]/20 pb-2">
                    Informacje o pobycie
                  </h4>
                  <div className="space-y-2 text-[#3c3333]">
                    {reservation.domekNazwa && <p><span className="font-medium">Przydzielony domek:</span> {reservation.domekNazwa}</p>}
                    <p><span className="font-medium">Liczba osób:</span> {reservation.liczbOsob}</p>
                    <p><span className="font-medium">Termin:</span> {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}</p>
                    {reservation.iloscNocy && (
                      <p><span className="font-medium">Liczba nocy:</span> {reservation.iloscNocy}</p>
                    )}
                    {reservation.cenaCałkowita && (
                      <p><span className="font-medium">Cena całkowita:</span> <span className="text-[#3c3333] font-bold">{reservation.cenaCałkowita} PLN</span></p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-lumios font-semibold text-[#3c3333] border-b border-[#3c3333]/20 pb-2">
                    Twoje dane
                  </h4>
                  <div className="space-y-2 text-[#3c3333]">
                    <p><span className="font-medium">Imię i nazwisko:</span> {reservation.imie} {reservation.nazwisko}</p>
                    <p><span className="font-medium">Email:</span> {reservation.email}</p>
                    <p><span className="font-medium">Telefon:</span> {reservation.telefon}</p>
                    {reservation.uwagi && (
                      <div>
                        <span className="font-medium">Uwagi:</span>
                        <p className="mt-1 p-3 bg-[#fdf2d0]/30 rounded-lg text-sm">{reservation.uwagi}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informacje dodatkowe */}
          <div className="bg-[#fdf2d0]/30 rounded-2xl p-6 mb-8 border border-[#3c3333]/20">
            <h4 className="text-lg font-lumios font-semibold text-[#3c3333] mb-4">Ważne informacje</h4>
            <div className="space-y-3 text-[#3c3333] font-inter">
              <p>
                <strong>Numer rezerwacji:</strong> {reservation.tokenPotwierdzenia ? reservation.tokenPotwierdzenia.substring(0, 8).toUpperCase() : 'Brak'}
              </p>
              <p>
                ✅ <strong>Email z potwierdzeniem</strong> został wysłany na adres: <span className="font-medium">{reservation.email}</span>
              </p>
              <p>
                📞 W razie pytań skontaktuj się z nami telefonicznie lub przez formularz kontaktowy.
              </p>
              <p>
                🚗 Szczegóły dotyczące dojazdu i check-in otrzymasz w osobnym emailu przed przyjazdem.
              </p>
            </div>
          </div>

          {/* Linki akcji */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-[#3c3333] hover:bg-[#3c3333]/90 text-white font-montserrat font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Wróć na stronę główną
            </Link>
            <Link 
              href="/#kontakt" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-[#3c3333]/20 text-[#3c3333] hover:bg-[#fdf2d0]/30 font-montserrat font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Skontaktuj się z nami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 

