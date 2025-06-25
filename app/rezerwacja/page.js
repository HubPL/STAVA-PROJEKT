'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { FiUser, FiMail, FiPhone, FiUsers, FiMessageSquare, FiCheck, FiCalendar, FiHome } from 'react-icons/fi';
import ReservationCalendar from '@/app/components/ReservationCalendar';
import PageHero from '@/app/components/PageHero';
import { getConfig, createRezerwacja, generateConfirmationToken } from '@/lib/firestore';
import { DOMEK_INFO, formatujSzczegolyCeny, kalkulujCeneZOsobami } from '@/lib/domek-config';

// Schema walidacji formularza
const reservationSchema = yup.object({
  imie: yup.string()
    .required('Imię jest wymagane')
    .min(2, 'Imię musi mieć minimum 2 znaki')
    .max(50, 'Imię może mieć maksymalnie 50 znaków'),
  nazwisko: yup.string()
    .required('Nazwisko jest wymagane')
    .min(2, 'Nazwisko musi mieć minimum 2 znaki')
    .max(50, 'Nazwisko może mieć maksymalnie 50 znaków'),
  email: yup.string()
    .required('Email jest wymagany')
    .email('Podaj poprawny adres email'),
  telefon: yup.string()
    .required('Telefon jest wymagany')
    .matches(
      /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      'Podaj poprawny numer telefonu'
    ),
  liczbOsob: yup.number()
    .required('Liczba osób jest wymagana')
    .min(1, 'Minimum 1 osoba')
    .max(8, 'Maksymalnie 8 osób'),
  uwagi: yup.string()
    .max(500, 'Uwagi mogą mieć maksymalnie 500 znaków')
});

const ReservationPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(reservationSchema),
    defaultValues: {
      imie: '',
      nazwisko: '',
      email: '',
      telefon: '',
      liczbOsob: 2,
      uwagi: ''
    }
  });

  // Obserwowanie wartości formularza dla podsumowania
  const watchedValues = watch();

  // Pobieranie konfiguracji
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await getConfig();
        setConfig(configData);
      } catch (error) {
        console.error('Błąd pobierania konfiguracji:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Aktualizacja podsumowania gdy są wybrane daty i wypełnione podstawowe dane
  useEffect(() => {
    if (selectedDates && watchedValues.imie && watchedValues.nazwisko && watchedValues.email) {
      setShowSummary(true);
    } else {
      setShowSummary(false);
    }
  }, [selectedDates, watchedValues]);

  // Obsługa wysyłania formularza
  const onSubmit = async (data) => {
    if (!selectedDates) {
      setSubmitError('Proszę wybrać termin pobytu');
      return;
    }

    setSubmitError(null);
    try {
      // Przelicz cenę końcową na podstawie aktualnej konfiguracji i danych formularza
      const obliczenia = kalkulujCeneZOsobami(config, data.liczbOsob, selectedDates.nights, selectedDates.startDate, selectedDates.endDate);
      const cenaCałkowita = obliczenia ? obliczenia.cenaCałkowita : selectedDates.totalPrice;

      const rezerwacjaData = {
        ...data,
        tokenPotwierdzenia: generateConfirmationToken(),
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
        iloscNocy: selectedDates.nights,
        cenaCałkowita: cenaCałkowita,
        obliczeniaCeny: obliczenia, // Zapisujemy szczegóły kalkulacji
        dataUtworzenia: new Date(),
        status: 'oczekujaca'
      };

      // Tworzenie rezerwacji w Firestore
      await createRezerwacja(rezerwacjaData);

      // Wysyłanie emaili
      await fetch('/api/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rezerwacjaData,
          domekNazwa: DOMEK_INFO.nazwa
        }),
      });

      // Przekierowanie do strony potwierdzenia
      window.location.href = `/potwierdzenie-goscia?token=${rezerwacjaData.tokenPotwierdzenia}`;
    } catch (error) {
      console.error('Błąd tworzenia rezerwacji:', error);
      setSubmitError('Wystąpił błąd podczas tworzenia rezerwacji. Spróbuj ponownie.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf2d0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3c3333] mx-auto"></div>
          <p className="mt-4 text-[#3c3333]">Ładowanie formularza rezerwacji...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Rezerwacja Online Domku | STAVA Stara Kiszewa</title>
        <meta name="description" content="Zarezerwuj online komfortowy domek letniskowy w sercu lasu kaszubskiego. Sprawdź dostępność, wybierz termin i dokonaj rezerwacji. STAVA Stara Kiszewa - wypoczynek w naturze." />
        <meta name="keywords" content="rezerwacja domku online, rezerwacja STAVA, domki Stara Kiszewa booking, rezerwacja domku Kaszuby, online booking domki letniskowe" />
        <meta property="og:title" content="Rezerwacja Online Domku STAVA | Łatwo i Szybko" />
        <meta property="og:description" content="System rezerwacji online dla domków letniskowych STAVA. Sprawdź dostępność w czasie rzeczywistym i zarezerwuj swój wymarzony pobyt." />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/hero%2Fhero.jpg?alt=media" />
        <meta property="og:url" content="https://stavakiszewa.pl/rezerwacja" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://stavakiszewa.pl/rezerwacja" />
      </Head>
      <div className="min-h-screen bg-[#fdf2d0] font-serif text-[#3c3333]">
      <PageHero
        title="Rezerwacja"
        subtitle="Zarezerwuj swój wymarzony pobyt w domkach STAVA"
      />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Lewa kolumna - Kalendarz i Formularz */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sekcja 1: Kalendarz */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#3c3333] text-[#fdf2d0] rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold font-lumios">Wybierz termin pobytu</h2>
              </div>
              <ReservationCalendar
                onDatesChange={setSelectedDates}
                liczbOsob={watchedValues.liczbOsob || 2}
              />
            </section>

            {/* Sekcja 2: Formularz */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#3c3333] text-[#fdf2d0] rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold font-lumios">Podaj dane kontaktowe</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                {/* Imię i Nazwisko */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Imię</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('imie')}
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-colors ${
                          errors.imie ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Jan"
                      />
                    </div>
                    {errors.imie && (
                      <p className="mt-1 text-sm text-red-500">{errors.imie.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Nazwisko</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('nazwisko')}
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-colors ${
                          errors.nazwisko ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Kowalski"
                      />
                    </div>
                    {errors.nazwisko && (
                      <p className="mt-1 text-sm text-red-500">{errors.nazwisko.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="jan.kowalski@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Telefon</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('telefon')}
                      type="tel"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-colors ${
                        errors.telefon ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+48 123 456 789"
                    />
                  </div>
                  {errors.telefon && (
                    <p className="mt-1 text-sm text-red-500">{errors.telefon.message}</p>
                  )}
                </div>

                {/* Liczba osób */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Liczba osób (max. {config?.max_osob || 6})
                  </label>
                  <div className="relative">
                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('liczbOsob', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max={config?.max_osob || 6}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-colors ${
                        errors.liczbOsob ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.liczbOsob && (
                    <p className="mt-1 text-sm text-red-500">{errors.liczbOsob.message}</p>
                  )}
                </div>

                {/* Uwagi */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Dodatkowe uwagi (opcjonalne)
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      {...register('uwagi')}
                      rows="4"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-colors resize-none ${
                        errors.uwagi ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Specjalne życzenia, godzina przyjazdu itp."
                    />
                  </div>
                  {errors.uwagi && (
                    <p className="mt-1 text-sm text-red-500">{errors.uwagi.message}</p>
                  )}
                </div>

                {/* Komunikat o błędzie */}
                {submitError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {submitError}
                  </div>
                )}
              </form>
            </section>
          </div>

          {/* Prawa kolumna - Podsumowanie */}
          <div className="lg:col-span-1">
            <section className="sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#3c3333] text-[#fdf2d0] rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-2xl font-bold font-lumios">Podsumowanie</h2>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                {/* Informacje o domku */}
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                    <FiHome />
                    <span>{DOMEK_INFO.nazwa}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Komfortowy domek dla {config?.max_osob || 6} osób
                  </p>
                </div>

                {/* Termin pobytu */}
                {selectedDates ? (
                  <div className="pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                      <FiCalendar />
                      <span>Termin pobytu</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Przyjazd:</span>
                        <span className="font-medium">
                          {format(selectedDates.startDate, 'dd MMMM yyyy', { locale: pl })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wyjazd:</span>
                        <span className="font-medium">
                          {format(selectedDates.endDate, 'dd MMMM yyyy', { locale: pl })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Liczba nocy:</span>
                        <span className="font-medium">{selectedDates.nights}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pb-6 border-b border-gray-200 text-center text-gray-500">
                    <FiCalendar className="mx-auto mb-2 text-2xl" />
                    <p className="text-sm">Wybierz termin pobytu</p>
                  </div>
                )}

                {/* Dane gościa */}
                {showSummary && (
                  <div className="pb-6 border-b border-gray-200">
                    <h4 className="text-sm font-semibold mb-3 font-lumios">Dane rezerwującego</h4>
                    <div className="space-y-1 text-sm">
                      <p>{watchedValues.imie} {watchedValues.nazwisko}</p>
                      <p className="text-gray-600">{watchedValues.email}</p>
                      <p className="text-gray-600">{watchedValues.telefon}</p>
                      <p className="text-gray-600">Liczba osób: {watchedValues.liczbOsob}</p>
                    </div>
                  </div>
                )}

                {/* Cena */}
                {selectedDates && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 font-lumios">Kalkulacja ceny</h4>
                    
                    {/* Szczegóły kalkulacji */}
                    {selectedDates.obliczeniaCeny && formatujSzczegolyCeny(selectedDates.obliczeniaCeny) ? (
                      <div className="space-y-2 text-sm mb-4">
                        {formatujSzczegolyCeny(selectedDates.obliczeniaCeny).map((szczegol, index) => (
                          <div key={index} className={`flex justify-between ${szczegol.typ === 'sezon' ? 'font-medium' : ''}`}>
                            <span className={szczegol.typ === 'sezon' ? 'text-blue-700' : 'text-gray-600'}>
                              {szczegol.opis}
                            </span>
                            <span className={szczegol.typ === 'sezon' ? 'text-blue-700 font-medium' : ''}>
                              {szczegol.cena} zł
                            </span>
                          </div>
                        ))}
                        
                        {/* Pokaż podsumowanie tylko jeśli NIE ma rozliczenia sezonowego */}
                        {!selectedDates.obliczeniaCeny.rozliczenieSezonowe && (
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">
                              Cena za dobę × {selectedDates.nights} {selectedDates.nights === 1 ? 'noc' : 'nocy'}
                            </span>
                            <span>{selectedDates.obliczeniaCeny.cenaZaDobe} × {selectedDates.nights} = {selectedDates.totalPrice} zł</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600">
                          {Math.round(selectedDates.totalPrice / selectedDates.nights)} zł × {selectedDates.nights} nocy
                        </span>
                        <span>{selectedDates.totalPrice} zł</span>
                      </div>
                    )}
                    
                    {/* Informacja o sezonach jeśli występują */}
                    {selectedDates.obliczeniaCeny?.rozliczenieSezonowe && selectedDates.obliczeniaCeny.rozliczenieSezonowe.length > 1 && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-medium">
                          ℹ️ Twój pobyt obejmuje różne taryfy cenowe - każdy dzień naliczany jest według odpowiedniej stawki.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xl font-bold pt-3 border-t">
                      <span>Razem:</span>
                      <span>{selectedDates.totalPrice} zł</span>
                    </div>
                  </div>
                )}

                {/* Przycisk rezerwacji */}
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!selectedDates}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedDates ? 'bg-[#3c3333] text-[#fdf2d0] hover:bg-opacity-90 transform hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedDates ? (
                    <>
                      <FiCheck />
                      <span>Potwierdź rezerwację</span>
                    </>
                  ) : (
                    <span>Rezerwowanie...</span>
                  )}
                </button>

                {/* Informacje prawne */}
                <p className="text-xs text-center text-gray-500">
                  Klikając &quot;Potwierdź rezerwację&quot; akceptujesz{' '}
                  <Link href="/regulamin" className="underline hover:text-gray-700">
                    Regulamin
                  </Link>{' '}
                  oraz{' '}
                  <Link href="/polityka-prywatnosci" className="underline hover:text-gray-700">
                    Politykę Prywatności
                  </Link>
                </p>
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
