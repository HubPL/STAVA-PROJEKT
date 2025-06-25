'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameDay, 
  isBefore, 
  isAfter,
  isWithinInterval,
  isToday,
  addMonths,
  subMonths,
  differenceInDays,
  startOfDay,
  parseISO
} from 'date-fns';
import { pl } from 'date-fns/locale';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { getPotwierdzoneRezerwacje, getBlokadyWPrzedziale, getConfig } from '@/lib/firestore';
import { kalkulujCeneZOsobami } from '@/lib/domek-config';

// Nowa paleta kolorów
const COLORS = {
  available: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300 cursor-pointer',
  occupied: 'bg-red-100 text-red-600 border-red-300 cursor-not-allowed',
  past: 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed',
  selected: {
    start: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
    end: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
    range: 'bg-blue-100 text-blue-900 border-blue-200 hover:bg-blue-200'
  },
  hover: {
    range: 'bg-blue-50 border-blue-300'
  },
  today: 'ring-2 ring-offset-2 ring-blue-500'
};

const MultiDomekCalendar = ({ onSelectionChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDomki, setSelectedDomki] = useState({
    'D1': { startDate: null, endDate: null, liczbOsob: 4 },
    'D2': { startDate: null, endDate: null, liczbOsob: 4 },
    'D3': { startDate: null, endDate: null, liczbOsob: 4 }
  });
  const [hoveredDate, setHoveredDate] = useState({ domekId: null, date: null });
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [activeDomekMobile, setActiveDomekMobile] = useState('D1');

  // Pobieranie konfiguracji i dostępności
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const configData = await getConfig();
        setConfig(configData);
        
        const from = startOfMonth(new Date());
        const to = endOfMonth(addMonths(from, 12));
        
        const [rezerwacje, blokady] = await Promise.all([
          getPotwierdzoneRezerwacje(from, to),
          getBlokadyWPrzedziale(from, to)
        ]);

        const occupiedDates = {};
        
        // Przetwarzanie rezerwacji
        rezerwacje.forEach(rez => {
          let current = rez.startDate instanceof Date ? rez.startDate : parseISO(rez.startDate);
          const finalEnd = rez.endDate instanceof Date ? rez.endDate : parseISO(rez.endDate);
          
          while (current < finalEnd) {
            const dateString = format(current, 'yyyy-MM-dd');
            if (!occupiedDates[dateString]) occupiedDates[dateString] = new Set();
            occupiedDates[dateString].add(rez.domekId);
            current = new Date(current);
            current.setDate(current.getDate() + 1);
          }
        });

        // Przetwarzanie blokad
        blokady.forEach(blokada => {
          let current = blokada.od;
          const finalEnd = blokada.do;
          
          while (current < finalEnd) {
            const dateString = format(current, 'yyyy-MM-dd');
            if (!occupiedDates[dateString]) occupiedDates[dateString] = new Set();
            occupiedDates[dateString].add(blokada.domek_id);
            current = new Date(current);
            current.setDate(current.getDate() + 1);
          }
        });

        setAvailability(occupiedDates);
      } catch (err) {
        console.error('Błąd pobierania dostępności:', err);
        setError('Nie udało się załadować kalendarza');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sprawdzanie dostępności dnia dla konkretnego domku
  const isDayAvailable = useCallback((date, domekId) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const occupiedDomki = availability[dateString];
    return !occupiedDomki || !occupiedDomki.has(domekId);
  }, [availability]);

  // Sprawdzanie czy zakres jest dostępny dla domku
  const isRangeAvailable = useCallback((start, end, domekId) => {
    let current = new Date(start);
    current.setDate(current.getDate() + 1); // Pomijamy dzień przyjazdu
    
    while (current < end) {
      if (!isDayAvailable(current, domekId)) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  }, [isDayAvailable]);

  // Obliczanie ceny dla domku
  const obliczCeneDomku = useCallback((startDate, endDate, liczbOsob, config) => {
    if (!startDate || !endDate || !config) return null;
    
    const nights = differenceInDays(endDate, startDate);
    const obliczenia = kalkulujCeneZOsobami(config, liczbOsob, nights, startDate, endDate);
    
    return {
      domekId: null, // będzie ustawione przez wywołującego
      startDate,
      endDate,
      liczbOsob,
      iloscNocy: nights,
      ...obliczenia
    };
  }, []);

  // Obsługa kliknięcia w dzień
  const handleDayClick = useCallback((date, domekId) => {
    const isPast = isBefore(date, startOfDay(new Date()));
    const isUnavailable = !isDayAvailable(date, domekId);
    
    if (isPast || isUnavailable) return;

    const currentSelection = selectedDomki[domekId];
    
    // Reset po pełnym wyborze lub pierwsze kliknięcie
    if (!currentSelection.startDate || (currentSelection.startDate && currentSelection.endDate)) {
      setSelectedDomki(prev => ({
        ...prev,
        [domekId]: { 
          ...prev[domekId],
          startDate: date, 
          endDate: null 
        }
      }));
      setError(null);
      return;
    }

    // Drugie kliknięcie - wybór daty końcowej
    if (currentSelection.startDate && !currentSelection.endDate) {
      // Jeśli kliknięto przed datą początkową
      if (isBefore(date, currentSelection.startDate)) {
        setSelectedDomki(prev => ({
          ...prev,
          [domekId]: { 
            ...prev[domekId],
            startDate: date, 
            endDate: null 
          }
        }));
        return;
      }

      // Sprawdzenie minimalnej długości pobytu
      const nights = differenceInDays(date, currentSelection.startDate);
      const minNights = config?.min_nocy || 2;
      
      if (nights < minNights) {
        setError(`Minimalny pobyt to ${minNights} noce`);
        return;
      }

      // Sprawdzenie dostępności zakresu
      if (!isRangeAvailable(currentSelection.startDate, date, domekId)) {
        setError('W wybranym okresie są niedostępne dni');
        return;
      }

      // Wszystko OK - ustawiamy datę końcową
      setSelectedDomki(prev => ({
        ...prev,
        [domekId]: { 
          ...prev[domekId],
          endDate: date 
        }
      }));
      setError(null);
    }
  }, [selectedDomki, isDayAvailable, isRangeAvailable, config]);

  // Usuwanie wyboru dla domku
  const clearSelection = useCallback((domekId) => {
    setSelectedDomki(prev => ({
      ...prev,
      [domekId]: { 
        ...prev[domekId],
        startDate: null, 
        endDate: null 
      }
    }));
    setError(null);
  }, []);

  // Obsługa zmiany liczby osób
  const handleLiczbOsobChange = useCallback((domekId, liczbOsob) => {
    setSelectedDomki(prev => ({
      ...prev,
      [domekId]: { 
        ...prev[domekId],
        liczbOsob 
      }
    }));
  }, []);

  // Effect do wywołania callback przy zmianie selekcji
  useEffect(() => {
    const completedDomki = Object.entries(selectedDomki)
      .filter(([_, selection]) => selection.startDate && selection.endDate)
      .map(([domekId, selection]) => {
        const calculation = obliczCeneDomku(
          selection.startDate, 
          selection.endDate, 
          selection.liczbOsob, 
          config
        );
        return calculation ? { ...calculation, domekId } : null;
      })
      .filter(Boolean);

    onSelectionChange(completedDomki);
  }, [selectedDomki, config, obliczCeneDomku, onSelectionChange]);

  // Generowanie dni miesiąca
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Obliczanie pustych dni na początku
  const firstDayOfWeek = monthDays[0].getDay();
  const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Określanie stylu dla dnia
  const getDayStyle = useCallback((date, domekId) => {
    const isPast = isBefore(date, startOfDay(new Date()));
    const isAvailable = isDayAvailable(date, domekId);
    const selection = selectedDomki[domekId];
    const isStart = selection.startDate && isSameDay(date, selection.startDate);
    const isEnd = selection.endDate && isSameDay(date, selection.endDate);
    const isInRange = selection.startDate && selection.endDate && 
      isWithinInterval(date, { start: selection.startDate, end: selection.endDate });
    const isHoverRange = selection.startDate && !selection.endDate && 
      hoveredDate.domekId === domekId && hoveredDate.date &&
      isAfter(hoveredDate.date, selection.startDate) && 
      isWithinInterval(date, { start: selection.startDate, end: hoveredDate.date });

    let baseClasses = 'relative w-full aspect-square flex items-center justify-center text-sm font-medium rounded-lg border transition-all duration-200 ';

    // Przeszłe dni
    if (isPast) {
      return baseClasses + COLORS.past;
    }

    // Wybrane dni
    if (isStart || isEnd) {
      return baseClasses + COLORS.selected.start + ' transform scale-105 shadow-lg z-10';
    }

    // Zakres
    if (isInRange) {
      return baseClasses + COLORS.selected.range;
    }

    // Hover zakres
    if (isHoverRange) {
      return baseClasses + COLORS.hover.range;
    }

    // Dostępność
    if (isAvailable) {
      return baseClasses + COLORS.available;
    } else {
      return baseClasses + COLORS.occupied;
    }
  }, [selectedDomki, hoveredDate, isDayAvailable]);

  // Obsługa nawigacji
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Obsługa nawigacji mobilnej
  const handlePrevDomekMobile = () => {
    const domki = ['D1', 'D2', 'D3'];
    const currentIndex = domki.indexOf(activeDomekMobile);
    const prevIndex = currentIndex === 0 ? domki.length - 1 : currentIndex - 1;
    setActiveDomekMobile(domki[prevIndex]);
  };

  const handleNextDomekMobile = () => {
    const domki = ['D1', 'D2', 'D3'];
    const currentIndex = domki.indexOf(activeDomekMobile);
    const nextIndex = currentIndex === domki.length - 1 ? 0 : currentIndex + 1;
    setActiveDomekMobile(domki[nextIndex]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Renderowanie pojedynczego kalendarza
  const renderCalendar = (domekId) => {
    const selection = selectedDomki[domekId];
    
    return (
      <div key={domekId} className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        {/* Nagłówek z nazwą domku */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg md:text-xl font-bold text-[#3c3333]">
              Domek {domekId.replace('D', '')}
            </h3>
          </div>
          
          {/* Liczba osób */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Osoby:</label>
            <select
              value={selection.liczbOsob}
              onChange={(e) => handleLiczbOsobChange(domekId, parseInt(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Nawigacja miesiąca */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Poprzedni miesiąc"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          
          <h4 className="text-lg font-semibold text-gray-800 capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale: pl })}
          </h4>
          
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Następny miesiąc"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>

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
            const isPast = isBefore(date, startOfDay(new Date()));
            const isAvailable = isDayAvailable(date, domekId);
            const isClickable = !isPast && isAvailable;

            return (
              <button
                key={date.toISOString()}
                onClick={() => isClickable && handleDayClick(date, domekId)}
                onMouseEnter={() => isClickable && setHoveredDate({ domekId, date })}
                onMouseLeave={() => setHoveredDate({ domekId: null, date: null })}
                disabled={!isClickable}
                className={getDayStyle(date, domekId)}
              >
                <span className={isToday(date) ? 'font-bold' : ''}>
                  {format(date, 'd')}
                </span>
                {isToday(date) && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status wyboru */}
        {selection.startDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <div>Przyjazd: {format(selection.startDate, 'dd MMMM yyyy', { locale: pl })}</div>
              {selection.endDate && (
                <>
                  <div>Wyjazd: {format(selection.endDate, 'dd MMMM yyyy', { locale: pl })}</div>
                  <div>Noce: {differenceInDays(selection.endDate, selection.startDate)}</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Przycisk anulowania pod kalendarzem (desktop) */}
        {selection.startDate && (
          <div className="mt-4 text-center">
            <button
              onClick={() => clearSelection(domekId)}
              className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              title="Anuluj wybór dat dla tego domku"
            >
              <FiX className="w-4 h-4" />
              Anuluj wybór
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Desktop - 3 kalendarze obok siebie */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {['D1', 'D2', 'D3'].map(domekId => renderCalendar(domekId))}
      </div>

      {/* Mobile - jeden kalendarz z nawigacją */}
      <div className="lg:hidden">
        {/* Nawigacja mobilna */}
        <div className="flex items-center justify-between mb-4 bg-white rounded-xl shadow-lg p-4">
          <button
            onClick={handlePrevDomekMobile}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Poprzedni domek"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-bold text-[#3c3333]">
            Domek {activeDomekMobile.replace('D', '')} z 3
          </h2>
          
          <button
            onClick={handleNextDomekMobile}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Następny domek"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Aktualny kalendarz */}
        {renderCalendar(activeDomekMobile)}
      </div>

      {/* Komunikat o błędzie */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Legenda */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legenda:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-green-100 border-green-300"></div>
            <span>Dostępne</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-red-100 border-red-300"></div>
            <span>Zajęte</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-gray-100 border-gray-200"></div>
            <span>Minione dni</span>
          </div>
        </div>
        <div className="mt-3 space-y-1 text-xs text-gray-600">
          <p className="italic">
            * Minimalny pobyt: 2 noce | Dzisiejsza data oznaczona kropką
          </p>
          <p className="italic">
            * Cena za domek obejmuje 4 osoby. Dodatkowe osoby: {config?.ceny?.cena_za_dodatkowa_osoba || 'koszt ustalany w panelu administracyjnym'} PLN/osobę/noc
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiDomekCalendar; 
