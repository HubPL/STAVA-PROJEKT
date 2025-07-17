'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';
import Head from 'next/head';
import { FiUser, FiMail, FiPhone, FiUsers, FiMessageSquare, FiCheck, FiHome, FiDollarSign, FiMapPin } from 'react-icons/fi';
import PageHero from '../components/PageHero';
import MultiDomekCalendar from '../components/ReservationCalendar';
import { createRezerwacja, generateConfirmationToken, getConfig } from '@/lib/firestore';
import { DOMEK_INFO, formatujSzczegolyCeny, kalkulujCeneZOsobami } from '@/lib/domek-config';

// Schemat walidacji
const rezerwacjaSchema = z.object({
  imie: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  nazwisko: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  email: z.string()
    .email('Nieprawidłowy adres email')
    .refine((email) => {
      // Sprawdź czy email ma poprawny format z domeną
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }, 'Podaj prawidłowy adres email z domeną'),
  telefon: z.string()
    .refine((phone) => {
      // Usuń wszystkie spacje, myślniki i znaki specjalne
      const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
      
      // Sprawdź czy to polski numer telefonu
      // Może zaczynać się od 48 (kod kraju) lub być 9-cyfrowy
      const polishPhoneRegex = /^(48)?[4-9]\d{8}$/;
      
      return polishPhoneRegex.test(cleaned);
    }, 'Podaj prawidłowy polski numer telefonu (np. +48 123 456 789 lub 123 456 789)'),
  uwagi: z.string().optional(),
  acceptRegulamin: z.boolean().refine(val => val === true, 'Musisz zaakceptować regulamin')
});

const ReservationPage = () => {
  const [selectedDomki, setSelectedDomki] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [config, setConfig] = useState(null);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(rezerwacjaSchema),
    defaultValues: {
      imie: '',
      nazwisko: '',
      email: '',
      telefon: '',
      uwagi: '',
      acceptRegulamin: false
    }
  });

  const watchedValues = watch();

  // Pobieranie konfiguracji
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await getConfig();
        setConfig(configData);
      } catch (error) {
        console.error('Błąd ładowania konfiguracji:', error);
      }
    };

    fetchConfig();
  }, []);

  // Obsługa zmiany wyboru domków
  const handleSelectionChange = useCallback((domkiData) => {
    setSelectedDomki(domkiData);
  }, []);

  // Obliczanie łącznej ceny
  const cenaCałkowita = selectedDomki.reduce((sum, domek) => sum + (domek.cenaCałkowita || 0), 0);
  const liczbOsobCałkowita = selectedDomki.reduce((sum, domek) => sum + domek.liczbOsob, 0);

  // Obsługa wysyłania formularza
  const onSubmit = async (data) => {
    if (selectedDomki.length === 0) {
      setMessage({ type: 'error', text: 'Musisz wybrać co najmniej jeden domek.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = generateConfirmationToken();
      
      // Przygotowanie danych rezerwacji
      const rezerwacjaData = {
        ...data,
        tokenPotwierdzenia: token
      };

      // Przygotowanie domków z dodatkowymi polami
      const selectedDomkiWithDetails = selectedDomki.map(domek => ({
        ...domek,
        cenaCalkowitaDomku: domek.cenaCałkowita
      }));

      // Utworzenie rezerwacji
      const rezerwacjaId = await createRezerwacja(rezerwacjaData, selectedDomkiWithDetails);

      // Wysłanie emaila potwierdzającego
      const emailResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reservation',
          formData: {
            ...data,
            selectedDomki: selectedDomkiWithDetails,
            cenaCałkowita,
            liczbOsob: liczbOsobCałkowita,
            tokenPotwierdzenia: token
          }
        })
      });

      if (!emailResponse.ok) {
        throw new Error('Błąd wysyłania emaila');
      }

      // Przekierowanie na stronę potwierdzenia
      window.location.href = '/potwierdzenie-goscia';

    } catch (error) {
      console.error('Błąd podczas rezerwacji:', error);
      setMessage({ 
        type: 'error', 
        text: 'Wystąpił błąd podczas przetwarzania rezerwacji. Spróbuj ponownie.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Rezerwacja Online Domku | STAVA Stara Kiszewa</title>
        <meta name="description" content="Zarezerwuj online komfortowy domek wypoczynkowy w sercu lasu kaszubskiego. Sprawdź dostępność, wybierz termin i dokonaj rezerwacji. STAVA Stara Kiszewa - wypoczynek w naturze." />
        <meta name="keywords" content="rezerwacja domku online, rezerwacja STAVA, domek Stara Kiszewa booking, rezerwacja domku Kaszuby, online booking domek wypoczynkowy" />
        <meta property="og:title" content="Rezerwacja Online Domku STAVA | Łatwo i Szybko" />
        <meta property="og:description" content="System rezerwacji online dla domku wypoczynkowego STAVA. Sprawdź dostępność w czasie rzeczywistym i zarezerwuj swój wymarzony pobyt." />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/hero%2Fhero.jpg?alt=media" />
        <meta property="og:url" content="https://stavakiszewa.pl/rezerwacja" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://stavakiszewa.pl/rezerwacja" />
      </Head>
      <div className="min-h-screen bg-[#FFF9E8] font-serif text-[#3c3333]">
        <PageHero
          title="Rezerwacja"
          subtitle="Zarezerwuj swój wymarzony pobyt w domkach STAVA"
        />

        <main className="container mx-auto px-6 sm:px-8 lg:px-4 py-12 md:py-20 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Lewa kolumna - Kalendarze i Formularz */}
            <div className="lg:col-span-2 space-y-8">
              {/* Sekcja 1: Kalendarze */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#3c3333] text-[#FFF9E8] rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h2 className="text-2xl font-bold font-lumios">Wybierz domki i terminy</h2>
                </div>
                <MultiDomekCalendar onSelectionChange={handleSelectionChange} />
              </section>

              {/* Sekcja 2: Formularz */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#3c3333] text-[#FFF9E8] rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h2 className="text-2xl font-bold font-lumios">Dane kontaktowe</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Imię */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiUser className="inline mr-2" />
                        Imię *
                      </label>
                      <input
                        {...register('imie')}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                        placeholder="Wprowadź swoje imię"
                      />
                      {errors.imie && <p className="mt-1 text-sm text-red-600">{errors.imie.message}</p>}
                    </div>

                    {/* Nazwisko */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiUser className="inline mr-2" />
                        Nazwisko *
                      </label>
                      <input
                        {...register('nazwisko')}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                        placeholder="Wprowadź swoje nazwisko"
                      />
                      {errors.nazwisko && <p className="mt-1 text-sm text-red-600">{errors.nazwisko.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiMail className="inline mr-2" />
                        Email *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                        placeholder="jan.kowalski@example.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    {/* Telefon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiPhone className="inline mr-2" />
                        Telefon *
                      </label>
                      <input
                        {...register('telefon')}
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                        placeholder="123 456 789 lub +48 123 456 789"
                      />
                      {errors.telefon && <p className="mt-1 text-sm text-red-600">{errors.telefon.message}</p>}
                    </div>


                  </div>

                  {/* Uwagi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uwagi dodatkowe
                    </label>
                    <textarea
                      {...register('uwagi')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all resize-none"
                      placeholder="Dodatkowe informacje, prośby specjalne..."
                    />
                  </div>

                  {/* Checkbox regulamin */}
                  <div className="flex items-start space-x-3">
                    <input
                      {...register('acceptRegulamin')}
                      type="checkbox"
                      id="acceptRegulamin"
                      className="h-5 w-5 mt-0.5 text-[#3c3333] border-gray-300 rounded focus:ring-[#3c3333] cursor-pointer"
                    />
                    <label htmlFor="acceptRegulamin" className="text-sm text-gray-700 cursor-pointer">
                      Potwierdzam, że zapoznałem się i akceptuję{' '}
                      <Link href="/regulamin" className="text-[#3c3333] underline hover:text-[#2a2525] font-medium" target="_blank">
                        regulamin
                      </Link>
                      {' '}STAVA Kiszewa. *
                    </label>
                  </div>
                  {errors.acceptRegulamin && <p className="mt-1 text-sm text-red-600">{errors.acceptRegulamin.message}</p>}

                  {/* Komunikaty */}
                  {message.text && (
                    <div className={`p-4 rounded-lg text-sm ${
                      message.type === 'error' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {message.text}
                    </div>
                  )}
                </form>
              </section>
            </div>

            {/* Prawa kolumna - Podsumowanie */}
            <div className="lg:col-span-1">
              <section className="sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#3c3333] text-[#FFF9E8] rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <h2 className="text-2xl font-bold font-lumios">Podsumowanie</h2>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  {selectedDomki.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <FiHome className="mx-auto mb-4 text-4xl" />
                      <p className="text-lg font-medium mb-2">Wybierz domki</p>
                      <p className="text-sm">Zaznacz daty w kalendarzach powyżej</p>
                    </div>
                  ) : (
                    <>
                      {/* Lista wybranych domków */}
                      <div className="space-y-4">
                        {selectedDomki.map((domek, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-lg font-semibold mb-3">
                              <FiHome />
                              <span>Domek {domek.domekId.replace('D', '')}</span>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Przyjazd:</span>
                                <span className="font-medium">
                                  {format(domek.startDate, 'dd MMMM yyyy', { locale: pl })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Wyjazd:</span>
                                <span className="font-medium">
                                  {format(domek.endDate, 'dd MMMM yyyy', { locale: pl })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Liczba nocy:</span>
                                <span className="font-medium">{domek.iloscNocy}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Liczba osób:</span>
                                <span className="font-medium">{domek.liczbOsob}</span>
                              </div>
                              
                              {/* Szczegóły cenowe */}
                              {domek.cenaZaDobe && (
                                <div className="pt-2 border-t border-gray-100">
                                                                {/* Rozliczenie sezonowe jeśli istnieje */}
                              {domek.rozliczenieSezonowe && domek.rozliczenieSezonowe.length > 0 ? (
                                <>
                                  {domek.rozliczenieSezonowe.map((sezon, idx) => (
                                    <div key={idx} className="mb-2">
                                      <div className="text-xs text-gray-600 font-medium">{sezon.nazwa}:</div>
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>
                                          {sezon.dni} {sezon.dni === 1 ? 'noc' : 'nocy'} × {sezon.cena} PLN
                                          {sezon.oplataZaDodatkoweOsoby > 0 && ` + ${domek.dodatkoweOsoby} osób × ${domek.cenaZaDodatkowaOsoba} PLN`}
                                        </span>
                                        <span>{sezon.cenaCałkowita} PLN</span>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                /* Standardowe rozliczenie - tylko jeśli nie ma sezonów */
                                <>
                                  {domek.cenaBazowa ? (
                                    <>
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>
                                          Cena bazowa ({domek.bazowaLiczbaOsob || 4} osób):
                                        </span>
                                        <span>{domek.cenaBazowa} PLN/noc</span>
                                      </div>
                                      {domek.dodatkoweOsoby > 0 && (
                                        <div className="flex justify-between text-xs text-gray-500">
                                          <span>
                                            +{domek.dodatkoweOsoby} {domek.dodatkoweOsoby === 1 ? 'osoba' : 'osoby'} × {domek.cenaZaDodatkowaOsoba} PLN/noc:
                                          </span>
                                          <span>+{domek.cenaZaDodatkowaOsoba * domek.dodatkoweOsoby} PLN/noc</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-1 mt-1">
                                        <span>
                                          Łącznie za dobę ({domek.cenaBazowa}{domek.dodatkoweOsoby > 0 ? ` + ${domek.dodatkoweOsoby}×${domek.cenaZaDodatkowaOsoba}` : ''}):
                                        </span>
                                        <span>{domek.cenaZaDobe} PLN</span>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>{domek.iloscNocy} {domek.iloscNocy === 1 ? 'noc' : 'nocy'}:</span>
                                        <span>{domek.iloscNocy} × {domek.cenaZaDobe} PLN</span>
                                      </div>
                                    </>
                                  ) : (
                                    /* Fallback gdy cenaBazowa jest null (sezonowe) */
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>Szczegóły cenowe dostępne po wyborze dat</span>
                                    </div>
                                  )}
                                </>
                              )}
                                </div>
                              )}
                              
                              <div className="flex justify-between font-semibold text-[#3c3333] pt-2 border-t border-gray-200">
                                <span>Cena za domek:</span>
                                <span>{domek.cenaCałkowita} PLN</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Podsumowanie łączne */}
                      <div className="border-t border-gray-300 pt-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Liczba domków:</span>
                            <span className="font-medium">{selectedDomki.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Łączna liczba osób:</span>
                            <span className="font-medium">{liczbOsobCałkowita}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xl font-bold text-[#3c3333] mt-4 pt-4 border-t border-gray-200">
                          <span>ŁĄCZNIE:</span>
                          <span>{cenaCałkowita} PLN</span>
                        </div>
                      </div>

                      {/* Informacje dodatkowe */}
                      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                        <p className="font-medium mb-2">Informacje:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Informacje o płatności w mailu rezerwacyjnym</li>
                          <li>• Istnieje możliwość anulowania rezerwacji i zwrot połowy kosztów do 7 dni przed przyjazdem.</li>
                          <li>• Check-in: 15:00, Check-out: 11:00</li>
                          <li>• Każdy domek jest identyczny i w pełni wyposażony</li>
                        </ul>
                      </div>

                      {/* Przycisk rezerwacji */}
                      <button
                        type="submit"
                        disabled={loading || selectedDomki.length === 0}
                        className="w-full bg-[#3c3333] text-[#FFF9E8] py-3 px-6 rounded-lg font-bold hover:bg-[#2a2525] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        onClick={handleSubmit(onSubmit)}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Przetwarzanie...
                          </>
                        ) : (
                          <>
                            <FiDollarSign />
                            Zarezerwuj {selectedDomki.length > 0 && `(${cenaCałkowita} PLN)`}
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ReservationPage; 
