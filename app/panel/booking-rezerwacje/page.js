'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginAdmin, logoutAdmin, onAuthChange } from '@/lib/auth';
import { createRezerwacja, generateConfirmationToken, getConfig } from '@/lib/firestore';
// Import DOMEK_INFO usunięty - nie jest już potrzebny
import { FiUser, FiMail, FiPhone, FiUsers, FiMessageSquare, FiDollarSign, FiCalendar, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

// Schemat walidacji dla rezerwacji Booking.com
const bookingReservationSchema = z.object({
  imie: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  nazwisko: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  email: z.string().email('Nieprawidłowy adres email'),
  telefon: z.string().min(8, 'Podaj prawidłowy numer telefonu'),
  
  // Pola specyficzne dla Booking.com
  bookingReservationId: z.string().min(1, 'ID rezerwacji Booking.com jest wymagane'),
  bookingCommission: z.number().min(0, 'Prowizja nie może być ujemna').optional().default(0),
  
  // Dane rezerwacji
  domekId: z.string().min(1, 'Wybierz domek'),
  startDate: z.string().min(1, 'Data przyjazdu jest wymagana'),
  endDate: z.string().min(1, 'Data wyjazdu jest wymagana'),
  liczbOsob: z.number().min(1, 'Liczba osób musi być większa niż 0').max(8, 'Maksymalnie 8 osób'),
  cenaCałkowita: z.number().min(1, 'Cena musi być większa niż 0'),
  
  uwagi: z.string().optional()
});

export default function BookingRezerwacjePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [config, setConfig] = useState(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(bookingReservationSchema),
    defaultValues: {
      imie: '',
      nazwisko: '',
      email: '',
      telefon: '',
      bookingReservationId: '',
      bookingCommission: 0,
      domekId: '',
      startDate: '',
      endDate: '',
      liczbOsob: 2,
      cenaCałkowita: 0,
      uwagi: ''
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

    if (user) {
      fetchConfig();
    }
  }, [user]);

  // Oblicz liczbę nocy
  const calculateNights = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const iloscNocy = calculateNights(watchedValues.startDate, watchedValues.endDate);

  // Funkcja logowania
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');
      await loginAdmin(email, password);
    } catch (error) {
      console.error('Błąd logowania:', error);
      setMessage({ type: 'error', text: 'Nieprawidłowe dane logowania' });
    } finally {
      setLoading(false);
    }
  };

  // Obsługa wysyłania formularza
  const onSubmit = async (data) => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = generateConfirmationToken();
      
      // Przygotowanie danych rezerwacji z Booking.com
      const rezerwacjaData = {
        imie: data.imie,
        nazwisko: data.nazwisko,
        email: data.email,
        telefon: data.telefon,
        uwagi: data.uwagi || '',
        tokenPotwierdzenia: token,
        // Metadane Booking.com
        bookingMetadata: {
          reservationId: data.bookingReservationId,
          commission: data.bookingCommission,
          source: 'booking.com',
          manuallyAdded: true,
          addedBy: user.email,
          addedAt: new Date().toISOString()
        }
      };

      // Przygotowanie danych domku (kompatybilne z nową strukturą)
      const selectedDomki = [{
        domekId: data.domekId,
        startDate: data.startDate,
        endDate: data.endDate,
        liczbOsob: data.liczbOsob,
        iloscNocy: iloscNocy,
        cenaCałkowita: data.cenaCałkowita,
        cenaCalkowitaDomku: data.cenaCałkowita,
        // Dodatkowe dane dla kompatybilności
        domekNazwa: `Domek ${data.domekId.replace('D', '')}`,
        cenaZaNoc: Math.round(data.cenaCałkowita / iloscNocy)
      }];

      // Utworzenie rezerwacji
      const rezerwacjaId = await createRezerwacja(rezerwacjaData, selectedDomki);

      setMessage({ 
        type: 'success', 
        text: `Rezerwacja z Booking.com została dodana pomyślnie! ID: ${rezerwacjaId}` 
      });

      // Wyczyść formularz po sukcesie
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Błąd podczas dodawania rezerwacji:', error);
      setMessage({ 
        type: 'error', 
        text: 'Wystąpił błąd podczas dodawania rezerwacji. Spróbuj ponownie.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3c3333] mx-auto"></div>
          <p className="mt-4 text-[#3c3333]">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF9E8] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#3c3333] mb-6 text-center">Panel Administracyjny</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#3c3333] text-[#FFF9E8] py-2 px-4 rounded-lg hover:bg-[#2a2525] transition-colors"
            >
              Zaloguj się
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E8] pt-40 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Nagłówek */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3c3333] flex items-center gap-3">
              <FiExternalLink className="text-blue-600" />
              Dodaj rezerwację z Booking.com
            </h1>
            <p className="text-gray-600 mt-2">Ręczne dodawanie rezerwacji otrzymanych przez Booking.com</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/panel"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <FiArrowLeft />
              Powrót do panelu
            </Link>
            <button
              onClick={logoutAdmin}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Wyloguj
            </button>
          </div>
        </div>

        {/* Komunikaty */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
            'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formularz */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Sekcja 1: Dane Booking.com */}
            <div>
              <h2 className="text-xl font-bold text-[#3c3333] mb-4 flex items-center gap-2">
                <FiExternalLink />
                Dane z Booking.com
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Rezerwacji Booking.com *
                  </label>
                  <input
                    {...register('bookingReservationId')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                    placeholder="np. 1234567890"
                  />
                  {errors.bookingReservationId && <p className="mt-1 text-sm text-red-600">{errors.bookingReservationId.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="inline mr-1" />
                    Prowizja Booking.com (PLN)
                  </label>
                  <input
                    {...register('bookingCommission', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                  {errors.bookingCommission && <p className="mt-1 text-sm text-red-600">{errors.bookingCommission.message}</p>}
                </div>
              </div>
            </div>

            {/* Sekcja 2: Dane gościa */}
            <div>
              <h2 className="text-xl font-bold text-[#3c3333] mb-4 flex items-center gap-2">
                <FiUser />
                Dane gościa
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imię *
                  </label>
                  <input
                    {...register('imie')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                    placeholder="Jan"
                  />
                  {errors.imie && <p className="mt-1 text-sm text-red-600">{errors.imie.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nazwisko *
                  </label>
                  <input
                    {...register('nazwisko')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                    placeholder="Kowalski"
                  />
                  {errors.nazwisko && <p className="mt-1 text-sm text-red-600">{errors.nazwisko.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="inline mr-1" />
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiPhone className="inline mr-1" />
                    Telefon *
                  </label>
                  <input
                    {...register('telefon')}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                    placeholder="+48 123 456 789"
                  />
                  {errors.telefon && <p className="mt-1 text-sm text-red-600">{errors.telefon.message}</p>}
                </div>
              </div>
            </div>

            {/* Sekcja 3: Szczegóły rezerwacji */}
            <div>
              <h2 className="text-xl font-bold text-[#3c3333] mb-4 flex items-center gap-2">
                <FiCalendar />
                Szczegóły rezerwacji
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domek *
                  </label>
                  <select
                    {...register('domekId')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                  >
                    <option value="">Wybierz domek</option>
                    {config?.nazwy_domkow?.map((domekId) => (
                      <option key={domekId} value={domekId}>
                        Domek {domekId.replace('D', '')} (maks. 6 osób)
                      </option>
                    )) || [
                      <option key="D1" value="D1">Domek 1 (maks. 6 osób)</option>,
                      <option key="D2" value="D2">Domek 2 (maks. 6 osób)</option>,
                      <option key="D3" value="D3">Domek 3 (maks. 6 osób)</option>
                    ]}
                  </select>
                  {errors.domekId && <p className="mt-1 text-sm text-red-600">{errors.domekId.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUsers className="inline mr-1" />
                    Liczba osób *
                  </label>
                  <input
                    {...register('liczbOsob', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                    placeholder="2"
                  />
                  {errors.liczbOsob && <p className="mt-1 text-sm text-red-600">{errors.liczbOsob.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data przyjazdu *
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data wyjazdu *
                  </label>
                  <input
                    {...register('endDate')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="inline mr-1" />
                    Cena całkowita (PLN) *
                  </label>
                  <input
                    {...register('cenaCałkowita', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                    placeholder="500.00"
                  />
                  {errors.cenaCałkowita && <p className="mt-1 text-sm text-red-600">{errors.cenaCałkowita.message}</p>}
                  {iloscNocy > 0 && watchedValues.cenaCałkowita > 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      Liczba nocy: {iloscNocy} | Cena za noc: {Math.round(watchedValues.cenaCałkowita / iloscNocy)} PLN
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sekcja 4: Uwagi */}
            <div>
              <h2 className="text-xl font-bold text-[#3c3333] mb-4 flex items-center gap-2">
                <FiMessageSquare />
                Dodatkowe informacje
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uwagi
                </label>
                <textarea
                  {...register('uwagi')}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent transition-all"
                  placeholder="Dodatkowe informacje o rezerwacji..."
                />
              </div>
            </div>

            {/* Przycisk wysłania */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#3c3333] text-[#FFF9E8] py-4 px-6 rounded-lg hover:bg-[#2a2525] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Dodawanie rezerwacji...
                  </>
                ) : (
                  <>
                    <FiExternalLink />
                    Dodaj rezerwację z Booking.com
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}