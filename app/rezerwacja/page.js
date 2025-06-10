'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDomekById, createRezerwacja, generateConfirmationToken } from '@/lib/firestore';
import { getStorageUrl } from '@/lib/storage';
import DateRangePicker from '@/app/components/DateRangePicker';
import { Suspense } from 'react';

function ReservationFormContent() {
  const searchParams = useSearchParams();
  const domekId = searchParams.get('domek');
  const [domek, setDomek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [liczbOsob, setLiczbaOsob] = useState(1);

  useEffect(() => {
    const fetchDomek = async () => {
      if (!domekId) {
        setError('Nie wybrano domku do rezerwacji.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const domekData = await getDomekById(domekId);
        if (domekData) {
          // Ładujemy główne zdjęcie domku
          try {
            const mainImagePath = `domki/${domekData.id}/main.jpg`;
            const imageUrl = await getStorageUrl(mainImagePath);
            setDomek({
              ...domekData,
              zdjecieGlowneURL: imageUrl
            });
          } catch (imageError) {
            // Jeśli nie ma main.jpg, używamy fallback
            setDomek({
              ...domekData,
              zdjecieGlowneURL: 'https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Fdomek-placeholder.jpg?alt=media'
            });
          }
        } else {
          setError('Domek o podanym ID nie istnieje.');
        }
      } catch (err) {
        console.error('Błąd podczas pobierania domku:', err);
        setError('Nie udało się załadować danych domku. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    fetchDomek();
  }, [domekId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Walidacja dat
    if (!selectedDates) {
      alert('Proszę wybrać daty pobytu');
      return;
    }
    
    // Walidacja liczby osób
    if (liczbOsob < 1) {
      alert('Liczba osób musi być większa od 0');
      return;
    }
    
    if (liczbOsob > domek.iloscOsob) {
      alert(`Domek ${domek.nazwa} pomieści maksymalnie ${domek.iloscOsob} osób`);
      return;
    }
    
    setSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const rezerwacjaData = {
        domekId: domek.id,
        domekNazwa: domek.nazwa,
        imie: formData.get('imie'),
        nazwisko: formData.get('nazwisko'),
        email: formData.get('email'),
        telefon: formData.get('telefon'),
        uwagi: formData.get('uwagi') || '',
        tokenPotwierdzenia: generateConfirmationToken(),
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
        iloscNocy: selectedDates.nights,
        cenaCałkowita: selectedDates.totalPrice,
        liczbOsob: liczbOsob
      };

      const rezerwacjaId = await createRezerwacja(rezerwacjaData);
      console.log('✅ Rezerwacja utworzona z ID:', rezerwacjaId);
      
      // Wyślij emaile
      try {
        console.log('📧 Wysyłanie emaili...');
        const emailResponse = await fetch('/api/send-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rezerwacjaData),
        });
        
        const emailResult = await emailResponse.json();
        
        if (emailResult.success) {
          console.log('✅ Emaile wysłane pomyślnie:', emailResult);
        } else {
          console.warn('⚠️ Problemy z wysyłaniem emaili:', emailResult);
        }
      } catch (emailError) {
        console.error('❌ Błąd podczas wysyłania emaili:', emailError);
        // Nie przerywamy procesu - rezerwacja została utworzona
      }
      
      // Stwórz stronę potwierdzenia dla gościa (bez panelu gospodarza)
      window.location.href = `/potwierdzenie-goscia?token=${rezerwacjaData.tokenPotwierdzenia}`;
      
    } catch (error) {
      console.error('Błąd podczas tworzenia rezerwacji:', error);
      alert('Wystąpił błąd podczas wysyłania rezerwacji. Spróbuj ponownie.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="loading-forest mb-6"></div>
        <p className="text-stone-700 font-body">Ładowanie danych domku...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">😔</div>
        <p className="text-red-600 font-body mb-6">{error}</p>
        <Link href="/domki" className="btn-forest-outline">
          🏡 Zobacz listę dostępnych domków
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
              {/* Nagłówek informacji o domku */}
      <div className="card-forest p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img 
              src={domek.zdjecieGlowneURL} 
              alt={`Zdjęcie domku ${domek.nazwa}`}
              className="w-full h-48 object-cover rounded-xl image-forest"
            />
          </div>
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-2xl font-display text-stone-800 heading-forest">
              Rezerwujesz: {domek.nazwa}
            </h2>
            <p className="text-stone-700 font-body">{domek.opisKrotki}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-lg">👥</span>
                <span className="font-medium">{domek.iloscOsob} osób</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-lg">📐</span>
                <span className="font-medium">{domek.powierzchnia} m²</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <span className="text-lg">💰</span>
                <span className="font-bold">{domek.cenaZaDobe} PLN/noc</span>
              </div>
            </div>
          </div>
        </div>
      </div>

              {/* Formularz rezerwacji */}
      <form onSubmit={handleSubmit} className="card-forest p-8">
        <h3 className="text-2xl font-display text-stone-800 mb-6 heading-forest">
          Formularz Rezerwacji
        </h3>
        
        <div className="mb-6">
          <label htmlFor="termin" className="block text-sm font-medium text-stone-700 mb-2">
            Wybierz termin pobytu (min. 3 noce):
          </label>
          <DateRangePicker 
            domekId={domek.id}
            onDateChange={setSelectedDates}
            cenaZaDobe={domek.cenaZaDobe}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="liczbOsob" className="block text-sm font-medium text-stone-700 mb-2">
            Liczba osób *
          </label>
          <div className="relative">
            <select 
              id="liczbOsob" 
              value={liczbOsob}
              onChange={(e) => setLiczbaOsob(parseInt(e.target.value))}
              className="input-forest pr-10"
              required
            >
              {Array.from({ length: domek.iloscOsob }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'osoba' : num <= 4 ? 'osoby' : 'osób'}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-stone-500">👥</span>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Maksymalna pojemność domku: {domek.iloscOsob} osób
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="imie" className="block text-sm font-medium text-stone-700 mb-2">
              Imię *
            </label>
            <input 
              type="text" 
              id="imie" 
              name="imie" 
              required 
              className="input-forest"
              placeholder="Wprowadź swoje imię"
            />
          </div>
          <div>
            <label htmlFor="nazwisko" className="block text-sm font-medium text-stone-700 mb-2">
              Nazwisko *
            </label>
            <input 
              type="text" 
              id="nazwisko" 
              name="nazwisko" 
              required 
              className="input-forest"
              placeholder="Wprowadź swoje nazwisko"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
            Email *
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="input-forest"
            placeholder="twoj@email.com"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="telefon" className="block text-sm font-medium text-stone-700 mb-2">
            Telefon *
          </label>
          <input 
            type="tel" 
            id="telefon" 
            name="telefon" 
            required 
            className="input-forest"
            placeholder="+48 123 456 789"
          />
        </div>

        <div className="mb-8">
          <label htmlFor="uwagi" className="block text-sm font-medium text-stone-700 mb-2">
            Uwagi do rezerwacji (opcjonalnie)
          </label>
          <textarea 
            id="uwagi" 
            name="uwagi" 
            rows="4" 
            className="input-forest"
            placeholder="Dodatkowe informacje, preferencje, specjalne życzenia..."
          ></textarea>
        </div>

        <div className="section-forest p-6 rounded-xl mb-8 border border-stone-200">
          <h4 className="font-semibold text-stone-800 mb-4 text-lg flex items-center gap-2">
            <span>📋</span> Podsumowanie rezerwacji
          </h4>
          <div className="space-y-2 text-stone-700">
            <p><span className="font-medium">Domek:</span> {domek.nazwa}</p>
            <p><span className="font-medium">Liczba osób:</span> {liczbOsob} {liczbOsob === 1 ? 'osoba' : liczbOsob <= 4 ? 'osoby' : 'osób'}</p>
            <p><span className="font-medium">Termin:</span> {
              selectedDates 
                ? `${selectedDates.startDate.toLocaleDateString('pl-PL')} - ${selectedDates.endDate.toLocaleDateString('pl-PL')}`
                : 'Wybierz w kalendarzu powyżej'
            }</p>
            <p><span className="font-medium">Liczba nocy:</span> {selectedDates ? selectedDates.nights : 0}</p>
            <p><span className="font-medium">Cena za noc:</span> {domek.cenaZaDobe} PLN</p>
            <p><span className="font-medium">Cena całkowita:</span> <span className="text-amber-800 font-bold text-lg">{selectedDates ? selectedDates.totalPrice : 0} PLN</span></p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className={`w-full btn-forest text-lg py-4 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="loading-forest w-5 h-5"></div>
              Wysyłanie rezerwacji...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>📧</span>
              Potwierdź i Wyślij Rezerwację
            </span>
          )}
        </button>

        <p className="text-xs text-stone-500 mt-4 text-center leading-relaxed">
          Po kliknięciu przycisku, Twoja rezerwacja zostanie wysłana. 
          Otrzymasz email z potwierdzeniem i dalszymi instrukcjami.
        </p>
      </form>
    </div>
  );
}

export default function RezerwacjaPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-stone-800 mb-6 heading-forest">
            Rezerwacja <span className="text-amber-800">Domku</span>
          </h1>
          <p className="text-xl font-primary text-stone-700 max-w-2xl mx-auto">
            Wypełnij formularz poniżej, aby zarezerwować swój pobyt w STAVA
          </p>
        </div>
        
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="loading-forest mb-6"></div>
            <p className="text-stone-700 font-body">Ładowanie formularza rezerwacji...</p>
          </div>
        }>
          <ReservationFormContent />
        </Suspense>
      </div>
    </div>
  );
} 