'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { getRezerwacjaByToken, updateRezerwacjaStatus } from '@/lib/firestore';

export default function PotwierdzeniePage({ params }) {
  const resolvedParams = use(params);
  const { token } = resolvedParams;
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const getReservation = async () => {
        setLoading(true);
        setError(null);
        setActionMessage('');
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

  const handleConfirm = async () => {
    if (!reservation || actionLoading) return;
    
    setActionLoading(true);
    try {
      await updateRezerwacjaStatus(reservation.id, 'potwierdzona');
      setReservation({ ...reservation, status: 'potwierdzona' });
      setActionMessage('Rezerwacja została POTWIERDZONA.');
      
      // Wyślij email do klienta o potwierdzeniu
      try {
        const emailResponse = await fetch('/api/send-status-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rezerwacjaData: reservation,
            newStatus: 'potwierdzona'
          }),
        });
        
        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          console.log('✅ Email o potwierdzeniu wysłany do klienta');
        } else {
          console.warn('⚠️ Problem z wysyłaniem emaila o potwierdzeniu:', emailResult);
        }
      } catch (emailError) {
        console.error('❌ Błąd podczas wysyłania emaila o potwierdzeniu:', emailError);
      }
      
    } catch (error) {
      console.error('Błąd podczas potwierdzania rezerwacji:', error);
      setActionMessage('Wystąpił błąd podczas potwierdzania rezerwacji.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reservation || actionLoading) return;
    
    setActionLoading(true);
    try {
      await updateRezerwacjaStatus(reservation.id, 'odrzucona');
      setReservation({ ...reservation, status: 'odrzucona' });
      setActionMessage('Rezerwacja została ODRZUCONA.');
      
      // Wyślij email do klienta o odrzuceniu
      try {
        const emailResponse = await fetch('/api/send-status-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rezerwacjaData: reservation,
            newStatus: 'odrzucona'
          }),
        });
        
        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          console.log('✅ Email o odrzuceniu wysłany do klienta');
        } else {
          console.warn('⚠️ Problem z wysyłaniem emaila o odrzuceniu:', emailResult);
        }
      } catch (emailError) {
        console.error('❌ Błąd podczas wysyłania emaila o odrzuceniu:', emailError);
      }
      
    } catch (error) {
      console.error('Błąd podczas odrzucania rezerwacji:', error);
      setActionMessage('Wystąpił błąd podczas odrzucania rezerwacji.');
    } finally {
      setActionLoading(false);
    }
  };

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
            Weryfikacja Rezerwacji
          </h1>
          <p className="text-stone-700 font-body text-lg">
            Trwa ładowanie danych rezerwacji dla tokenu: {token}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen section-forest flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-4 heading-forest">
            Błąd Weryfikacji
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
            Weryfikacja Rezerwacji
          </h1>
          <p className="text-stone-700 font-body mb-6">Nie znaleziono rezerwacji.</p>
          <Link href="/" className="btn-forest-outline">
            🏠 Powrót na stronę główną
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
    oczekujaca: '⏳',
    potwierdzona: '✅',
    odrzucona: '❌',
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-6 heading-forest">
            Panel <span className="text-amber-800">Gospodarza</span>
          </h1>
          <p className="text-xl font-primary text-stone-700 max-w-2xl mx-auto">
            Zarządzaj rezerwacjami w ośrodku STAVA
          </p>
        </div>

        <div className="max-w-4xl mx-auto card-forest p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">📋</span>
            <h2 className="text-2xl font-display text-stone-800">
              Szczegóły Rezerwacji #{reservation.id}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Dane domku */}
            <div className="space-y-4">
              <h3 className="text-lg font-primary font-semibold text-stone-800 border-b border-stone-200 pb-2">
                📍 Informacje o domku
              </h3>
              <div className="space-y-2 text-stone-700">
                <p><span className="font-medium">Domek:</span> {reservation.domekNazwa || reservation.domekId}</p>
                <p><span className="font-medium">Liczba osób:</span> {reservation.liczbOsob || 'Nie podano'}</p>
                <p><span className="font-medium">Termin:</span> {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}</p>
                {reservation.iloscNocy && (
                  <p><span className="font-medium">Liczba nocy:</span> {reservation.iloscNocy}</p>
                )}
              </div>
            </div>

            {/* Dane klienta */}
            <div className="space-y-4">
              <h3 className="text-lg font-primary font-semibold text-stone-800 border-b border-stone-200 pb-2">
                👤 Dane klienta
              </h3>
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

          {/* Status i akcje */}
          <div className="section-forest p-6 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{statusIcons[reservation.status]}</span>
                <div>
                  <span className="text-stone-700 font-medium">Status rezerwacji:</span>
                  <span className={`ml-3 font-semibold px-3 py-1 rounded-full text-sm ${statusClasses[reservation.status] || 'bg-stone-500 text-white'}`}>
                    {reservation.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {reservation.cenaCałkowita && (
                <div className="text-right">
                  <span className="text-stone-700 font-medium">Kwota całkowita:</span>
                  <p className="text-2xl font-bold text-amber-800">{reservation.cenaCałkowita} PLN</p>
                </div>
              )}
            </div>
          </div>

          {actionMessage && (
            <div className={`text-center font-medium mb-6 p-4 rounded-xl ${
              reservation.status === 'potwierdzona' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : reservation.status === 'odrzucona' 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-stone-100 text-stone-800 border border-stone-200'
            }`}>
              <span className="text-lg mr-2">
                {reservation.status === 'potwierdzona' ? '✅' : reservation.status === 'odrzucona' ? '❌' : 'ℹ️'}
              </span>
              {actionMessage}
            </div>
          )}

          {reservation.status === 'oczekujaca' && !actionMessage && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button 
                onClick={handleConfirm}
                disabled={actionLoading}
                className={`flex-1 btn-forest-secondary text-lg py-3 ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="loading-forest w-5 h-5"></div>
                    Przetwarzanie...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✅</span>
                    Potwierdź Rezerwację
                  </span>
                )}
              </button>
              <button 
                onClick={handleReject}
                disabled={actionLoading}
                className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="loading-forest w-5 h-5"></div>
                    Przetwarzanie...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>❌</span>
                    Odrzuć Rezerwację
                  </span>
                )}
              </button>
            </div>
          )}
          
          <div className="text-center pt-6 border-t border-stone-200">
            <p className="text-xs text-stone-500 mb-4">
              Ta strona jest przeznaczona dla gospodarza do zarządzania rezerwacjami.<br/>
              Token: <code className="bg-stone-100 px-2 py-1 rounded">{token}</code>
            </p>
            <Link href="/" className="btn-forest-outline">
              🏠 Powrót na stronę główną
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 