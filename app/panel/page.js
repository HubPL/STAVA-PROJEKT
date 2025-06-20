'use client';

import { useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin, onAuthChange } from '@/lib/auth';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateRezerwacjaStatus, getRezerwacjeForDomek, getAllDomki } from '@/lib/firestore';
import Link from 'next/link';

// Komponent do zarządzania akcjami dla pojedynczej rezerwacji
const ReservationActions = ({ rezerwacja, onStatusChange, domki }) => {
  const [loading, setLoading] = useState(false);
  const [availableDomki, setAvailableDomki] = useState([]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (rezerwacja.status !== 'oczekujaca') return;

      setLoading(true);
      const available = [];
      
      for (const domek of domki) {
        // Sprawdzamy, czy w danym terminie są już jakieś rezerwacje dla tego domku
        const rezerwacjeWTerminie = await getRezerwacjeForDomek(domek.id, rezerwacja.startDate, rezerwacja.endDate);
        if (rezerwacjeWTerminie.length === 0) {
          available.push(domek);
        }
      }
      
      setAvailableDomki(available);
      setLoading(false);
    };

    checkAvailability();
  }, [rezerwacja, domki]);

  if (rezerwacja.status === 'potwierdzona' || rezerwacja.status === 'odrzucona') {
    return <span className="text-sm text-gray-500">-</span>;
  }

  if (loading) {
    return <span className="text-sm text-gray-500">Sprawdzanie...</span>;
  }

  return (
    <div className="flex flex-col space-y-2 items-start">
      {availableDomki.length > 0 ? (
        availableDomki.map(domek => (
          <button
            key={domek.id}
            onClick={() => onStatusChange(rezerwacja.id, 'potwierdzona', rezerwacja, domek.id, domek.nazwa)}
            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Przydziel {domek.nazwa}
          </button>
        ))
      ) : (
        <span className="text-xs text-red-500">Brak wolnych domków</span>
      )}
      <button
        onClick={() => onStatusChange(rezerwacja.id, 'odrzucona', rezerwacja)}
        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
      >
        Odrzuć rezerwację
      </button>
    </div>
  );
};

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [rezerwacje, setRezerwacje] = useState([]);
  const [domki, setDomki] = useState([]);
  const [rezervationsLoading, setRezervationsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Słuchacz zmian autentyfikacji
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadRezerwacje();
        loadDomki();
      }
    });

    return () => unsubscribe();
  }, []);

  // Ładowanie domków
  const loadDomki = async () => {
    try {
      const domkiData = await getAllDomki();
      setDomki(domkiData);
    } catch (error) {
      console.error('Błąd ładowania domków:', error);
    }
  };

  // Ładowanie rezerwacji
  const loadRezerwacje = async () => {
    setRezervationsLoading(true);
    try {
      const rezerwacjeRef = collection(db, 'rezerwacje');
      const q = query(rezerwacjeRef, orderBy('metadane.createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const rezerwacjeData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        rezerwacjeData.push({
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate() || new Date(data.startDate),
          endDate: data.endDate?.toDate() || new Date(data.endDate),
          createdAt: data.metadane?.createdAt?.toDate() || new Date()
        });
      });
      
      setRezerwacje(rezerwacjeData);
    } catch (error) {
      console.error('Błąd ładowania rezerwacji:', error);
    } finally {
      setRezervationsLoading(false);
    }
  };

  // Obsługa logowania
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      await loginAdmin(loginForm.email, loginForm.password);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Obsługa wylogowania
  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };

  // Zmiana statusu rezerwacji
  const handleStatusChange = async (rezerwacjaId, newStatus, rezerwacjaData, domekId = null, domekNazwa = null) => {
    try {
      // Aktualizujemy status i ewentualnie przypisujemy domek
      await updateRezerwacjaStatus(rezerwacjaId, newStatus, domekId, domekNazwa);
      
      // Przygotowujemy dane do wysyłki emaila
      const emailData = {
        ...rezerwacjaData,
        startDate: rezerwacjaData.startDate.toISOString(),
        endDate: rezerwacjaData.endDate.toISOString(),
        // Jeśli potwierdzamy, upewniamy się, że w mailu jest nazwa domku
        domekNazwa: newStatus === 'potwierdzona' ? domekNazwa : rezerwacjaData.domekNazwa, 
      };

      // Wysłanie emaila o zmianie statusu przez API
      try {
        const emailResponse = await fetch('/api/send-status-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rezerwacjaData: emailData,
            newStatus
          }),
        });
        
        const emailResult = await emailResponse.json();
        if (!emailResult.success) {
          console.warn('Problem z wysyłaniem emaila:', emailResult);
        }
      } catch (emailError) {
        console.error('Błąd wysyłania emaila:', emailError);
      }
      
      await loadRezerwacje();
      setMessage({ type: 'success', text: 'Status rezerwacji został zmieniony pomyślnie' });
    } catch (error) {
      console.error('Błąd zmiany statusu:', error);
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas zmiany statusu rezerwacji' });
    }
  };

  // Formatowanie statusu
  const getStatusBadge = (status) => {
    const statusConfig = {
      'oczekujaca': { label: 'Oczekująca', color: 'bg-yellow-100 text-yellow-800' },
      'potwierdzona': { label: 'Potwierdzona', color: 'bg-green-100 text-green-800' },
      'odrzucona': { label: 'Odrzucona', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="mt-4 text-brand-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-200 flex items-center justify-center">
        <div className="h-32"></div>
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-brand-300">
            <div className="text-center">
                              <h2 className="text-3xl font-lumios text-brand-800">Panel Administracyjny</h2>
              <p className="mt-2 text-sm text-brand-600">Zaloguj się aby zarządzać rezerwacjami</p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm placeholder-brand-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                    placeholder="admin@stavakiszewa.pl"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-brand-700">
                    Hasło
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-brand-300 rounded-md shadow-sm placeholder-brand-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? 'Logowanie...' : 'Zaloguj się'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-200">
      <div className="h-32"></div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-brand-300">
          <div className="flex justify-between items-center">
            <div>
                              <h1 className="text-3xl font-lumios text-brand-800">Panel Administracyjny</h1>
              <p className="text-brand-600">Zalogowany jako: {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
               <Link href="/panel/ceny" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200">
                Zarządzaj cenami
              </Link>
               <Link href="/panel/dostepnosc" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200">
                Zarządzaj dostępnością
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
              >
                Wyloguj się
              </button>
            </div>
          </div>
        </div>

        {/* Lista rezerwacji */}
        <div className="bg-white rounded-3xl shadow-xl border border-brand-300">
          <div className="p-6 border-b border-brand-200">
            <div className="flex justify-between items-center">
                              <h2 className="text-2xl font-lumios text-brand-800">Lista Rezerwacji</h2>
              <button
                onClick={loadRezerwacje}
                disabled={rezervationsLoading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition duration-200 disabled:opacity-50"
              >
                {rezervationsLoading ? 'Ładowanie...' : 'Odśwież'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {rezervationsLoading ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-brand-600">Ładowanie rezerwacji...</p>
              </div>
            ) : rezerwacje.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-brand-600">Brak rezerwacji</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-200">
                  <thead className="bg-brand-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Gość
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Domek
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Termin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Osoby
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Cena
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">
                        Akcje
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-brand-200">
                    {rezerwacje.map((rezerwacja) => (
                      <tr key={rezerwacja.id} className="hover:bg-brand-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-brand-900">
                            {rezerwacja.imie} {rezerwacja.nazwisko}
                          </div>
                          <div className="text-sm text-brand-500">{rezerwacja.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">
                          {rezerwacja.domekNazwa || <span className="text-gray-400 italic">Nieprzydzielony</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">
                          {rezerwacja.startDate?.toLocaleDateString('pl-PL')} - {rezerwacja.endDate?.toLocaleDateString('pl-PL')}
                          <div className="text-xs text-brand-400">
                            {rezerwacja.iloscNocy} {rezerwacja.iloscNocy === 1 ? 'noc' : 'nocy'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">
                          {rezerwacja.liczbOsob}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-800">
                          {rezerwacja.cenaCałkowita} PLN
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(rezerwacja.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ReservationActions
                            rezerwacja={rezerwacja}
                            onStatusChange={handleStatusChange}
                            domki={domki}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Komunikaty */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 
            'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
} 
