'use client';

import { useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin, onAuthChange } from '@/lib/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateRezerwacjaStatus } from '@/lib/firestore';
import Link from 'next/link';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rezerwacje, setRezerwacje] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        fetchRezerwacje();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchRezerwacje = async () => {
    try {
      const rezerwacjeRef = collection(db, 'rezerwacje');
      const q = query(rezerwacjeRef, orderBy('metadane.createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const rezerwacjeData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Konwertuj daty w selectedDomki jeśli istnieją
        if (data.selectedDomki && Array.isArray(data.selectedDomki)) {
          data.selectedDomki = data.selectedDomki.map(domek => ({
            ...domek,
            startDate: domek.startDate?.toDate ? domek.startDate.toDate() : new Date(domek.startDate),
            endDate: domek.endDate?.toDate ? domek.endDate.toDate() : new Date(domek.endDate)
          }));
        }
        
        rezerwacjeData.push({
          id: doc.id,
          ...data
        });
      });
      
      setRezerwacje(rezerwacjeData);
    } catch (error) {
      console.error('Błąd pobierania rezerwacji:', error);
    }
  };

  const handleStatusChange = async (rezerwacjaId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [rezerwacjaId]: true }));
    
    try {
      await updateRezerwacjaStatus(rezerwacjaId, newStatus);
      
      // Aktualizuj stan lokalny
      setRezerwacje(prev => prev.map(rez => 
        rez.id === rezerwacjaId ? { ...rez, status: newStatus } : rez
      ));

      // Wyślij email o statusie (jeśli potrzebne)
      if (newStatus === 'potwierdzona' || newStatus === 'odrzucona') {
        try {
          const emailResponse = await fetch('/api/send-status-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rezerwacjaId,
              status: newStatus
            })
          });

          if (!emailResponse.ok) {
            const errorData = await emailResponse.json();
            console.error('Błąd API send-status-email:', errorData);
          }
        } catch (emailError) {
          console.error('Błąd wysyłania emaila o statusie:', emailError);
        }
      }
      
    } catch (error) {
      console.error('Błąd aktualizacji statusu:', error);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [rezerwacjaId]: false }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      await loginAdmin(email, password);
    } catch (error) {
      alert('Błąd logowania: ' + error.message);
    }
  };

  const filteredRezerwacje = rezerwacje.filter(rez => {
    const matchesSearch = !searchTerm || 
      rez.imie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rez.nazwisko?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rez.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || rez.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf2d0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3c3333] mx-auto"></div>
          <p className="mt-4 text-[#3c3333]">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdf2d0] flex items-center justify-center">
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
              className="w-full bg-[#3c3333] text-[#fdf2d0] py-2 px-4 rounded-lg hover:bg-[#2a2525] transition-colors"
            >
              Zaloguj się
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf2d0] pt-40 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Nagłówek */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#3c3333]">Panel Administracyjny</h1>
          <div className="flex gap-4">
            <Link
              href="/panel/ceny"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zarządzaj cenami
            </Link>
            <Link
              href="/panel/dostepnosc"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Zarządzaj dostępnością
            </Link>
            <Link
              href="/panel/kalendarze"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Kalendarze rezerwacji
            </Link>
            <button
              onClick={logoutAdmin}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Wyloguj się
            </button>
          </div>
        </div>

        {/* Filtry */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szukaj po imieniu, nazwisku lub emailu
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Wpisz szukany tekst..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtruj po statusie
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c3333] focus:border-transparent"
              >
                <option value="all">Wszystkie</option>
                <option value="oczekujaca">Oczekujące</option>
                <option value="potwierdzona">Potwierdzone</option>
                <option value="odrzucona">Odrzucone</option>
              </select>
            </div>
          </div>
          
          {filteredRezerwacje.length !== rezerwacje.length && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Znaleziono {filteredRezerwacje.length} z {rezerwacje.length} rezerwacji
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Wyczyść filtry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lista rezerwacji */}
        <div className="space-y-6">
          {filteredRezerwacje.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <p className="text-gray-500">Brak rezerwacji do wyświetlenia</p>
            </div>
          ) : (
            filteredRezerwacje.map((rezerwacja) => {
              // Sprawdź czy ma nową strukturę z selectedDomki
              if (rezerwacja.selectedDomki && Array.isArray(rezerwacja.selectedDomki)) {
                // Nowa struktura - pokaz jako jedną kartę
                return (
                  <div key={rezerwacja.id} className="bg-white rounded-xl shadow-lg p-6">
                    {/* Nagłówek rezerwacji */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 pb-4 border-b">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {rezerwacja.imie} {rezerwacja.nazwisko}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📧 {rezerwacja.email}</p>
                          <p>📞 {rezerwacja.telefon}</p>
                          {rezerwacja.uwagi && (
                            <p className="text-xs italic">💬 {rezerwacja.uwagi}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 text-right">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          rezerwacja.status === 'potwierdzona' 
                            ? 'bg-green-100 text-green-800'
                            : rezerwacja.status === 'odrzucona'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rezerwacja.status === 'potwierdzona' && 'Potwierdzona'}
                          {rezerwacja.status === 'odrzucona' && 'Odrzucona'}
                          {rezerwacja.status === 'oczekujaca' && 'Oczekująca'}
                        </span>
                        <div className="mt-2 text-lg font-bold text-gray-900">
                          ŁĄCZNIE: {rezerwacja.cenaCałkowita} PLN
                        </div>
                        <div className="text-xs text-gray-500">
                          {rezerwacja.liczbOsob} osób • {rezerwacja.selectedDomki.length} domków
                        </div>
                      </div>
                    </div>

                    {/* Lista domków */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {rezerwacja.selectedDomki.map((domek, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-lg text-gray-900 mb-2">
                            🏠 Domek {domek.domekId.replace('D', '')}
                          </h4>
                          <div className="text-sm space-y-1">
                            <p><strong>Przyjazd:</strong> {domek.startDate.toLocaleDateString('pl-PL')}</p>
                            <p><strong>Wyjazd:</strong> {domek.endDate.toLocaleDateString('pl-PL')}</p>
                            <p><strong>Noce:</strong> {domek.iloscNocy}</p>
                            <p><strong>Osoby:</strong> {domek.liczbOsob}</p>
                            <p><strong>Cena:</strong> {domek.cenaCałkowita || domek.cenaCalkowitaDomku} PLN</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Akcje */}
                    <div className="flex justify-center">
                      {rezerwacja.status === 'oczekujaca' ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleStatusChange(rezerwacja.id, 'potwierdzona')}
                            disabled={updatingStatus[rezerwacja.id]}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                          >
                            {updatingStatus[rezerwacja.id] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Przetwarzanie...
                              </>
                            ) : (
                              '✅ Potwierdź całą rezerwację'
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusChange(rezerwacja.id, 'odrzucona')}
                            disabled={updatingStatus[rezerwacja.id]}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                          >
                            {updatingStatus[rezerwacja.id] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Przetwarzanie...
                              </>
                            ) : (
                              '❌ Odrzuć rezerwację'
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-lg">
                          Rezerwacja została rozpatrzona
                        </span>
                      )}
                    </div>
                  </div>
                );
              } else {
                // Stara struktura - pokaż jako ostrzeżenie
                return (
                  <div key={rezerwacja.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-600">⚠️</div>
                      <div>
                        <h3 className="font-medium text-yellow-800">
                          Stara struktura rezerwacji - {rezerwacja.imie} {rezerwacja.nazwisko}
                        </h3>
                        <p className="text-sm text-yellow-700">
                          Ta rezerwacja używa starej struktury danych i powinna zostać usunięta lub zaktualizowana.
                        </p>
                      </div>
                    </div>
                  </div>
                );
                             }
             })
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
