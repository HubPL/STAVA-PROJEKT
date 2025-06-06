'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { getRezerwacjaByToken } from '@/lib/firestore';

function PotwierdzenieGosciaContent() {
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
    
    // Jeśli date jest Firestore Timestamp
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString('pl-PL');
    }
    
    // Jeśli date jest już obiektem Date
    if (date instanceof Date) {
      return date.toLocaleDateString('pl-PL');
    }
    
    // Jeśli date jest stringiem
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('pl-PL');
    }
    
    return 'Nieprawidłowa data';
  };

  if (loading) {
    return (
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="loading-forest mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Ładowanie...
          </h1>
          <p className="text-stone-700 font-body text-lg">
            Pobieramy szczegóły Twojej rezerwacji...
          </p>
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
          <Link href="/" className="btn-forest-outline">
            🏠 Powrót na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Nie znaleziono rezerwacji
          </h1>
          <p className="text-stone-700 font-body mb-6">Sprawdź link lub skontaktuj się z nami.</p>
          <Link href="/" className="btn-forest-outline">
            🏠 Powrót na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = {
    oczekujaca: {
      icon: '⏳',
      title: 'Rezerwacja oczekuje na potwierdzenie',
      message: 'Twoja rezerwacja została przyjęta i oczekuje na potwierdzenie przez nasz zespół.',
      color: 'text-amber-800',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    potwierdzona: {
      icon: '✅',
      title: 'Rezerwacja potwierdzona!',
      message: 'Świetnie! Twoja rezerwacja została potwierdzona.',
      color: 'text-green-800',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    odrzucona: {
      icon: '❌',
      title: 'Rezerwacja odrzucona',
      message: 'Niestety, nie możemy potwierdzić Twojej rezerwacji na wybrany termin.',
      color: 'text-red-800',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  const status = statusInfo[reservation.status] || statusInfo.oczekujaca;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-6 heading-forest">
            Dziękujemy za <span className="text-amber-800">Rezerwację!</span>
          </h1>
          <p className="text-xl font-primary text-stone-700 max-w-2xl mx-auto">
            Oto potwierdzenie Twojej rezerwacji w STAVA
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Status Box */}
          <div className={`${status.bgColor} ${status.borderColor} border-2 rounded-2xl p-8 mb-8 text-center`}>
            <div className="text-6xl mb-4">{status.icon}</div>
            <h2 className={`text-2xl font-display ${status.color} mb-4`}>
              {status.title}
            </h2>
            <p className={`text-lg font-body ${status.color}`}>
              {status.message}
            </p>
          </div>

          {/* Szczegóły rezerwacji */}
          <div className="card-forest p-8 mb-8">
            <h3 className="text-2xl font-display text-stone-800 mb-6 heading-forest">
              📋 Szczegóły Twojej rezerwacji
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-primary font-semibold text-stone-800 border-b border-stone-200 pb-2">
                  🏡 Informacje o domku
                </h4>
                <div className="space-y-2 text-stone-700">
                  <p><span className="font-medium">Domek:</span> {reservation.domekNazwa}</p>
                  <p><span className="font-medium">Liczba osób:</span> {reservation.liczbOsob}</p>
                  <p><span className="font-medium">Termin:</span> {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}</p>
                  {reservation.iloscNocy && (
                    <p><span className="font-medium">Liczba nocy:</span> {reservation.iloscNocy}</p>
                  )}
                  {reservation.cenaCałkowita && (
                    <p><span className="font-medium">Cena całkowita:</span> <span className="text-amber-800 font-bold">{reservation.cenaCałkowita} PLN</span></p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-primary font-semibold text-stone-800 border-b border-stone-200 pb-2">
                  👤 Twoje dane
                </h4>
                <div className="space-y-2 text-stone-700">
                  <p><span className="font-medium">Imię i nazwisko:</span> {reservation.imie} {reservation.nazwisko}</p>
                  <p><span className="font-medium">Email:</span> {reservation.email}</p>
                  <p><span className="font-medium">Telefon:</span> {reservation.telefon}</p>
                  {reservation.uwagi && (
                    <div>
                      <span className="font-medium">Uwagi:</span>
                      <p className="mt-1 p-3 bg-stone-50 rounded-lg text-sm">{reservation.uwagi}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Co dalej */}
          <div className="section-forest p-8 rounded-2xl mb-8">
            <h3 className="text-2xl font-display text-stone-800 mb-6 heading-forest">
              📞 Co dalej?
            </h3>
            
            {reservation.status === 'oczekujaca' && (
              <div className="space-y-4 text-stone-700">
                <p className="text-lg">
                  <strong>📧 Email potwierdzenia</strong> został wysłany na Twój adres email.
                </p>
                <p>
                  Skontaktujemy się z Tobą w ciągu <strong>24 godzin</strong>, aby potwierdzić dostępność i przekazać dalsze instrukcje dotyczące płatności i przyjazdu.
                </p>
                <p>
                  Jeśli masz pilne pytania, śmiało się z nami skontaktuj!
                </p>
              </div>
            )}
            
            {reservation.status === 'potwierdzona' && (
              <div className="space-y-4 text-stone-700">
                <p className="text-lg text-green-800">
                  <strong>🎉 Gratulacje!</strong> Twoja rezerwacja została potwierdzona.
                </p>
                <p>
                  Skontaktujemy się z Tobą wkrótce, aby omówić szczegóły przyjazdu, płatności i przekazać wszystkie potrzebne informacje.
                </p>
                <p>
                  Przygotuj się na wspaniały wypoczynek w naturze! 🌲
                </p>
              </div>
            )}
            
            {reservation.status === 'odrzucona' && (
              <div className="space-y-4 text-stone-700">
                <p className="text-lg text-red-800">
                  <strong>😔 Przykro nam</strong>, ale nie możemy potwierdzić Twojej rezerwacji na wybrany termin.
                </p>
                <p>
                  Jeśli jesteś zainteresowany innymi terminami, śmiało się z nami skontaktuj. Chętnie pomożemy znaleźć idealny termin dla Twojego pobytu.
                </p>
              </div>
            )}
          </div>

          {/* Kontakt */}
          <div className="card-forest p-8 text-center">
            <h3 className="text-2xl font-display text-stone-800 mb-4">
              Masz pytania?
            </h3>
            <p className="text-stone-700 mb-6">
              Jesteśmy tutaj, aby pomóc! Skontaktuj się z nami w dowolny sposób.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:kontakt@stavakiszewa.pl" 
                className="btn-forest-outline"
              >
                📧 kontakt@stavakiszewa.pl
              </a>
              <a 
                href="tel:+48123456789" 
                className="btn-forest-outline"
              >
                📞 +48 123 456 789
              </a>
            </div>
          </div>

          {/* Powrót */}
          <div className="text-center mt-8">
            <Link href="/" className="btn-forest">
              🏠 Powrót na stronę główną
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PotwierdzenieGosciaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="loading-forest mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Ładowanie...
          </h1>
          <p className="text-stone-700 font-body text-lg">
            Pobieramy szczegóły Twojej rezerwacji...
          </p>
        </div>
      </div>
    }>
      <PotwierdzenieGosciaContent />
    </Suspense>
  );
} 