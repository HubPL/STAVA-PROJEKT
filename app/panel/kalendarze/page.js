'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import { getConfig, getPotwierdzoneRezerwacje, getBlokadyWPrzedziale } from '@/lib/firestore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfDay, isToday } from 'date-fns';
import { pl } from 'date-fns/locale';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function KalendarzePanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rezerwacje, setRezerwacje] = useState([]);
  const [blokady, setBlokady] = useState([]);
  const [config, setConfig] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadData();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [currentMonth, user]);

  const loadData = async () => {
    try {
      const [configData, rezerwacjeData, blokadyData] = await Promise.all([
        getConfig(),
        getPotwierdzoneRezerwacje(
          startOfMonth(subMonths(currentMonth, 1)),
          endOfMonth(addMonths(currentMonth, 1))
        ),
        getBlokadyWPrzedziale(
          startOfMonth(subMonths(currentMonth, 1)),
          endOfMonth(addMonths(currentMonth, 1))
        )
      ]);
      
      setConfig(configData);
      setRezerwacje(rezerwacjeData);
      setBlokady(blokadyData);
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
    }
  };

  // Generowanie dni miesiąca
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Obliczanie pustych dni na początku
  const firstDayOfWeek = monthDays[0].getDay();
  const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Funkcja do sprawdzania czy dany dzień ma rezerwację dla domku
  const getReservationForDay = (domekId, date) => {
    return rezerwacje.find(rez => 
      rez.domekId === domekId && 
      date >= startOfDay(rez.startDate) && 
      date < startOfDay(rez.endDate)
    );
  };

  // Funkcja do sprawdzania czy dany dzień ma blokadę dla domku
  const getBlockedDay = (domekId, date) => {
    return blokady.find(blokada => 
      blokada.domek_id === domekId && 
      date >= startOfDay(blokada.od) && 
      date < startOfDay(blokada.do)
    );
  };

  // Funkcja do obsługi kliknięcia w dzień
  const handleDayClick = (domekId, date) => {
    const reservation = getReservationForDay(domekId, date);
    const blocked = getBlockedDay(domekId, date);
    
    if (reservation) {
      setSelectedReservation(reservation);
    } else if (blocked) {
      setSelectedReservation({
        ...blocked,
        isBlocked: true,
        imie: 'BLOKADA',
        nazwisko: blocked.powod || 'Brak powodu',
        email: 'Administratorska blokada',
        startDate: blocked.od,
        endDate: blocked.do,
        domekId: blocked.domek_id
      });
    }
  };

  // Nawigacja po miesiącach
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Renderowanie pojedynczego kalendarza
  const renderCalendar = (domekId, domekNazwa) => {
    return (
      <div key={domekId} className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-[#3c3333] mb-4 text-center">
          Domek {domekId.replace('D', '')}
        </h3>

        {/* Dni tygodnia */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Kalendarz */}
        <div className="grid grid-cols-7 gap-1">
          {/* Puste dni na początku */}
          {[...Array(emptyDays)].map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Dni miesiąca */}
          {monthDays.map(date => {
            const reservation = getReservationForDay(domekId, date);
            const blocked = getBlockedDay(domekId, date);
            const isReserved = !!reservation;
            const isBlocked = !!blocked;
            const isStartDate = reservation && isSameDay(date, reservation.startDate);
            const isEndDate = reservation && isSameDay(date, reservation.endDate);
            const isBlockedStartDate = blocked && isSameDay(date, blocked.od);
            const isBlockedEndDate = blocked && isSameDay(date, blocked.do);

            let classes = 'relative w-full aspect-square flex items-center justify-center text-sm font-medium rounded-lg border transition-all duration-200 cursor-pointer ';
            
            if (isReserved) {
              if (isStartDate || isEndDate) {
                classes += 'bg-blue-600 text-white border-blue-700 transform scale-105 shadow-lg z-10';
              } else {
                classes += 'bg-blue-100 text-blue-800 border-blue-300';
              }
            } else if (isBlocked) {
              if (isBlockedStartDate || isBlockedEndDate) {
                classes += 'bg-red-600 text-white border-red-700 transform scale-105 shadow-lg z-10';
              } else {
                classes += 'bg-red-100 text-red-800 border-red-300';
              }
            } else {
              classes += 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100';
            }

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDayClick(domekId, date)}
                className={classes}
                disabled={!isReserved && !isBlocked}
              >
                <span className={isToday(date) ? 'font-bold' : ''}>
                  {format(date, 'd')}
                </span>
                {isToday(date) && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center">
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#3c3333]">Odmowa dostępu.</p>
          <Link href="/panel" className="text-blue-600 hover:underline">Zaloguj się</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E8] pt-40 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Nagłówek */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3c3333]">Kalendarze Rezerwacji</h1>
            <p className="text-[#3c3333]">Przeglądaj potwierdzone rezerwacje w każdym domku</p>
          </div>
          <Link href="/panel" className="px-4 py-2 bg-[#3c3333] hover:bg-[#3c3333]/90 text-white rounded-lg transition duration-200">
            Powrót do panelu
          </Link>
        </div>

        {/* Nawigacja miesiąca */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Poprzedni miesiąc"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: pl })}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Następny miesiąc"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kalendarze domków */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {config?.nazwy_domkow?.map(domekId => renderCalendar(domekId, domekId)) || 
           ['D1', 'D2', 'D3'].map(domekId => renderCalendar(domekId, domekId))}
        </div>

        {/* Legenda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Legenda:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600"></div>
              <span>Przyjazd/wyjazd gości</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
              <span>Dni pobytu gości</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600"></div>
              <span>Początek/koniec blokady</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span>Dni blokady</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200"></div>
              <span>Wolne</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">
            Kliknij na dzień z rezerwacją lub blokadą aby zobaczyć szczegóły
          </p>
        </div>

        {/* Szczegóły wybranej rezerwacji */}
        {selectedReservation && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-[#3c3333]">
                {selectedReservation.isBlocked ? 'Szczegóły blokady' : 'Szczegóły rezerwacji'}
              </h3>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  {selectedReservation.isBlocked ? 'Informacje o blokadzie:' : 'Dane gościa:'}
                </h4>
                <div className="space-y-2 text-sm">
                  {selectedReservation.isBlocked ? (
                    <>
                      <p><strong>Typ:</strong> <span className="text-red-600 font-semibold">Blokada administratorska</span></p>
                      <p><strong>Powód:</strong> {selectedReservation.nazwisko}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Imię i nazwisko:</strong> {selectedReservation.imie} {selectedReservation.nazwisko}</p>
                      <p><strong>Email:</strong> {selectedReservation.email}</p>
                      <p><strong>Telefon:</strong> {selectedReservation.telefon}</p>
                      {selectedReservation.bookingMetadata?.source === 'booking.com' && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-800 text-xs font-semibold">📱 REZERWACJA Z BOOKING.COM</p>
                          <p className="text-blue-600 text-xs">
                            <strong>ID:</strong> {selectedReservation.bookingMetadata.reservationId}
                          </p>
                          {selectedReservation.bookingMetadata.commission > 0 && (
                            <p className="text-orange-600 text-xs">
                              <strong>Prowizja:</strong> {selectedReservation.bookingMetadata.commission} PLN
                            </p>
                          )}
                        </div>
                      )}
                      {selectedReservation.uwagi && (
                        <p><strong>Uwagi:</strong> {selectedReservation.uwagi}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  {selectedReservation.isBlocked ? 'Okres blokady:' : 'Szczegóły pobytu:'}
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Domek:</strong> {selectedReservation.domekId.replace('D', '')}</p>
                  <p><strong>{selectedReservation.isBlocked ? 'Początek blokady:' : 'Przyjazd:'}</strong> {selectedReservation.startDate.toLocaleDateString('pl-PL')}</p>
                  <p><strong>{selectedReservation.isBlocked ? 'Koniec blokady:' : 'Wyjazd:'}</strong> {selectedReservation.endDate.toLocaleDateString('pl-PL')}</p>
                  {!selectedReservation.isBlocked && (
                    <>
                      <p><strong>Liczba osób:</strong> {selectedReservation.liczbOsob}</p>
                      <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Potwierdzona</span></p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 