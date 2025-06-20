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
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getPotwierdzoneRezerwacje, getBlokadyWPrzedziale, getConfig } from '@/lib/firestore';
import { getAktualnaCena, kalkulujCeneZOsobami } from '@/lib/domek-config';

const LICZBA_DOMKOW = 3;

// Profesjonalna paleta kolorów
const COLORS = {
  available: {
    full: 'bg-emerald-100 hover:bg-emerald-100 text-emerald-900 border-emerald-300',
    partial: 'bg-amber-100 hover:bg-amber-100 text-amber-900 border-amber-300', 
    low: 'bg-orange-200 hover:bg-orange-200 text-orange-900 border-orange-300',
    none: 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
  },
  selected: {
    start: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
    end: 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700',
    range: 'bg-blue-100 text-blue-900 border-blue-200 hover:bg-blue-200'
  },
  hover: {
    range: 'bg-blue-50 border-blue-300'
  },
  today: 'ring-2 ring-offset-2 ring-blue-500',
  past: 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
};

const ReservationCalendar = ({ onDatesChange, liczbOsob = 4 }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  // Pobieranie konfiguracji i dostępności
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Pobierz konfigurację
        const configData = await getConfig();
        setConfig(configData);
        
        const from = startOfMonth(new Date());
        const to = endOfMonth(addMonths(from, 12));
        
        const [rezerwacje, blokady] = await Promise.all([
          getPotwierdzoneRezerwacje(from, to),
          getBlokadyWPrzedziale(from, to)
        ]);

        const counts = {};
        
        // Przetwarzanie rezerwacji
        rezerwacje.forEach(rez => {
          let current = rez.startDate instanceof Date ? rez.startDate : parseISO(rez.startDate);
          const finalEnd = rez.endDate instanceof Date ? rez.endDate : parseISO(rez.endDate);
          
          while (current < finalEnd) {
            const dateString = format(current, 'yyyy-MM-dd');
            counts[dateString] = (counts[dateString] || 0) + 1;
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
            counts[dateString] = (counts[dateString] || 0) + 1;
            current = new Date(current);
            current.setDate(current.getDate() + 1);
          }
        });

        setAvailability(counts);
      } catch (err) {
        console.error('Błąd pobierania dostępności:', err);
        setError('Nie udało się załadować kalendarza');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Obliczanie dostępności dla dnia
  const getDayAvailability = useCallback((date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const occupied = availability[dateString] || 0;
    const totalDomki = config?.liczba_domkow || LICZBA_DOMKOW;
    return Math.max(0, totalDomki - occupied);
  }, [availability, config]);

  // Sprawdzanie czy zakres jest dostępny
  const isRangeAvailable = useCallback((start, end) => {
    let current = new Date(start);
    current.setDate(current.getDate() + 1); // Pomijamy dzień przyjazdu
    
    while (current < end) {
      if (getDayAvailability(current) === 0) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  }, [getDayAvailability]);

  // Funkcja do obliczania ceny na podstawie aktualnej konfiguracji
  const obliczCene = useCallback((startDate, endDate, liczbOsob, config) => {
    if (!startDate || !endDate || !config) return null;
    
    const nights = differenceInDays(endDate, startDate);
    const obliczenia = kalkulujCeneZOsobami(config, liczbOsob, nights, startDate, endDate);
    
    // Fallback jeśli nie ma konfiguracji lub kalkulacja nie działa
    if (!obliczenia) {
      const fallbackPrice = config?.ceny?.podstawowa || 350;
      return {
        startDate,
        endDate,
        nights,
        totalPrice: nights * fallbackPrice,
        obliczeniaCeny: null
      };
    }
    
    return {
      startDate,
      endDate,
      nights,
      totalPrice: obliczenia.cenaCałkowita,
      obliczeniaCeny: obliczenia
    };
  }, []);

  // Effect do przeliczania ceny gdy zmieni się liczba osób
  useEffect(() => {
    if (startDate && endDate && config) {
      const result = obliczCene(startDate, endDate, liczbOsob, config);
      if (result) {
        onDatesChange(result);
      }
    }
  }, [liczbOsob, startDate, endDate, config, obliczCene, onDatesChange]);

  // Obsługa kliknięcia w dzień
  const handleDayClick = useCallback((date) => {
    const isPast = isBefore(date, startOfDay(new Date()));
    const isUnavailable = getDayAvailability(date) === 0;
    
    if (isPast || isUnavailable) return;

    // Reset po pełnym wyborze lub pierwsze kliknięcie
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setError(null);
      onDatesChange(null);
      return;
    }

    // Drugie kliknięcie - wybór daty końcowej
    if (startDate && !endDate) {
      // Jeśli kliknięto przed datą początkową
      if (isBefore(date, startDate)) {
        setStartDate(date);
        setEndDate(null);
        return;
      }

      // Sprawdzenie minimalnej długości pobytu
      const nights = differenceInDays(date, startDate);
      const minNights = config?.min_nocy || 2;
      
      if (nights < minNights) {
        setError(`Minimalny pobyt to ${minNights} noce`);
        return;
      }

      // Sprawdzenie dostępności zakresu
      if (!isRangeAvailable(startDate, date)) {
        setError('W wybranym okresie są niedostępne dni');
        return;
      }

      // Wszystko OK - ustawiamy datę końcową
      setEndDate(date);
      setError(null);
      
      // Oblicz cenę (useEffect zajmie się resztą)
    }
  }, [startDate, endDate, getDayAvailability, isRangeAvailable, config]);

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
  const getDayStyle = useCallback((date) => {
    const isPast = isBefore(date, startOfDay(new Date()));
    const availability = getDayAvailability(date);
    const isStart = startDate && isSameDay(date, startDate);
    const isEnd = endDate && isSameDay(date, endDate);
    const isInRange = startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate });
    const isHoverRange = startDate && !endDate && hoveredDate && 
      isAfter(hoveredDate, startDate) && 
      isWithinInterval(date, { start: startDate, end: hoveredDate });

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
    switch (availability) {
      case 3: return baseClasses + COLORS.available.full;
      case 2: return baseClasses + COLORS.available.partial;
      case 1: return baseClasses + COLORS.available.low;
      default: return baseClasses + COLORS.available.none;
    }
  }, [startDate, endDate, hoveredDate, getDayAvailability]);

  // Obsługa nawigacji
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

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

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
      {/* Nagłówek z nawigacją */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Poprzedni miesiąc"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
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

      {/* Dni tygodnia */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Kalendarz */}
      <div className="grid grid-cols-7 gap-2">
        {/* Puste dni na początku */}
        {[...Array(emptyDays)].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Dni miesiąca */}
        {monthDays.map(date => {
          const dayAvailability = getDayAvailability(date);
          const isPast = isBefore(date, startOfDay(new Date()));
          const isClickable = !isPast && dayAvailability > 0;

          return (
            <button
              key={date.toISOString()}
              onClick={() => isClickable && handleDayClick(date)}
              onMouseEnter={() => isClickable && setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              disabled={!isClickable}
              className={getDayStyle(date)}
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

      {/* Komunikat o błędzie */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Legenda */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legenda:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-emerald-50 border-emerald-200"></div>
            <span>Pełna dostępność</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-amber-50 border-amber-200"></div>
            <span>Średnia dostępność</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-orange-100 border-orange-300"></div>
            <span>Ostatnie miejsca</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-gray-100 border-gray-200"></div>
            <span>Brak miejsc</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 italic">
          * Minimalny pobyt: 2 noce | Dzisiejsza data oznaczona kropką
        </p>
      </div>
    </div>
  );
};

export default ReservationCalendar; 
