'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getRezerwacjeForDomek } from '@/lib/firestore';

const DateRangePicker = ({ domekId, onDateChange, cenaZaDobe, refreshTrigger }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pobiera zablokowane daty dla domku
  useEffect(() => {
    const fetchBlockedDates = async () => {
      if (!domekId) return;
      
      try {
        setLoading(true);
        
        const now = new Date();
        const futureDate = new Date();
        futureDate.setFullYear(now.getFullYear() + 1);
        
        const rezerwacje = await getRezerwacjeForDomek(domekId, now, futureDate);
        
        const blocked = [];
        rezerwacje.forEach(rez => {
          const current = new Date(rez.startDate);
          const end = new Date(rez.endDate);
          
          while (current <= end) {
            blocked.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        
        setBlockedDates(blocked);
        
      } catch (err) {
        console.error('Błąd podczas pobierania zablokowanych dat:', err);
        setError('Nie udało się załadować dostępności kalendarza');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedDates();
  }, [domekId, refreshTrigger]);

  /**
   * Sprawdza czy data jest zablokowana
   */
  const isDateBlocked = (date) => {
    return blockedDates.some(blockedDate => 
      blockedDate.toDateString() === date.toDateString()
    );
  };

  /**
   * Oblicza liczbę nocy i cenę całkowitą
   */
  const calculateStay = (start, end) => {
    if (!start || !end) return { nights: 0, totalPrice: 0 };
    
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = nights * cenaZaDobe;
    
    return { nights, totalPrice };
  };

  /**
   * Obsługuje zmianę wybranych dat
   */
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    if (start && end) {
      const { nights, totalPrice } = calculateStay(start, end);
      
      if (nights < 3) {
        setError('Minimalny czas rezerwacji to 3 noce');
        onDateChange(null);
        return;
      }
      
      const current = new Date(start);
      let hasBlockedDate = false;
      
      while (current < end) {
        if (isDateBlocked(current)) {
          hasBlockedDate = true;
          break;
        }
        current.setDate(current.getDate() + 1);
      }
      
      if (hasBlockedDate) {
        setError('W wybranym okresie domek jest już zarezerwowany');
        onDateChange(null);
        return;
      }
      
      setError(null);
      onDateChange({
        startDate: start,
        endDate: end,
        nights,
        totalPrice
      });
    } else {
      onDateChange(null);
    }
  };

  /**
   * Odświeża dostępność kalendarza
   */
  const refreshCalendar = () => {
    setLoading(true);
    setBlockedDates([]);
    
    setTimeout(async () => {
      try {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setFullYear(now.getFullYear() + 1);
        
        const rezerwacje = await getRezerwacjeForDomek(domekId, now, futureDate);
        
        const blocked = [];
        rezerwacje.forEach(rez => {
          const current = new Date(rez.startDate);
          const end = new Date(rez.endDate);
          
          while (current <= end) {
            blocked.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        
        setBlockedDates(blocked);
      } catch (err) {
        console.error('Błąd podczas odświeżania kalendarza:', err);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="bg-stone-100 p-6 rounded-xl text-center border border-stone-200">
        <div className="loading-forest mb-4"></div>
        <p className="text-stone-600 text-sm">Ładowanie kalendarza...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-stone-200">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={new Date()}
          excludeDates={blockedDates}
          placeholderText="Wybierz daty pobytu"
          className="w-full"
          calendarClassName="forest-calendar"
        />
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <span className="font-medium">⚠️ {error}</span>
        </div>
      )}
      
      {startDate && endDate && !error && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span>✅</span>
            <span className="font-medium">Wybrane daty są dostępne!</span>
          </div>
          <div className="space-y-1 text-xs">
            <p><span className="font-medium">Przyjazd:</span> {startDate.toLocaleDateString('pl-PL')}</p>
            <p><span className="font-medium">Wyjazd:</span> {endDate.toLocaleDateString('pl-PL')}</p>
            <p><span className="font-medium">Liczba nocy:</span> {calculateStay(startDate, endDate).nights}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-stone-500 space-y-1">
          <p>• Minimalny czas rezerwacji: 3 noce</p>
          <p>• Daty zaznaczone na szaro są niedostępne</p>
          <p>• Ceny mogą się różnić w zależności od sezonu</p>
        </div>
        <button
          onClick={refreshCalendar}
          className="text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-1 rounded-lg transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Odświeżanie...' : 'Odśwież'}
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker; 