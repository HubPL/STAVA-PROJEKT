'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import { getAllDomki, getNiedostepnosci, setDomekNiedostepny, usunNiedostepnosc } from '@/lib/firestore';

export default function DostepnoscPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [domki, setDomki] = useState([]);
  const [niedostepnosci, setNiedostepnosci] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, id: null });
  
  const [formData, setFormData] = useState({
    domek_id: '',
    od: new Date().toISOString().split('T')[0],
    do: new Date().toISOString().split('T')[0],
    powod: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadInitialData();
      }
    });
    return () => unsubscribe();
  }, []);
  
  const loadInitialData = async () => {
    try {
      const [domkiData, niedostepnosciData] = await Promise.all([
        getAllDomki(),
        getNiedostepnosci()
      ]);
      
      setDomki(domkiData);
      setNiedostepnosci(niedostepnosciData);

      if (domkiData.length > 0) {
        setFormData(prev => ({ ...prev, domek_id: domkiData[0].id }));
      }
    } catch (error) {
      console.error("Błąd ładowania danych:", error);
      setMessage({ type: 'error', text: 'Błąd ładowania danych. Sprawdź konsolę.' });
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddNiedostepnosc = async (e) => {
    e.preventDefault();
    if (!formData.domek_id || !formData.od || !formData.do) {
      setMessage({ type: 'error', text: 'Proszę wypełnić wszystkie wymagane pola (domek, data od, data do).' });
      return;
    }
    setFormLoading(true);
    try {
      await setDomekNiedostepny({
        domekId: formData.domek_id,
        startDate: formData.od,
        endDate: formData.do,
        powod: formData.powod
      });
      setMessage({ type: 'success', text: 'Pomyślnie dodano okres niedostępności!' });
      setFormData(prev => ({ // Resetuj daty, zostaw domek
        ...prev,
        od: new Date().toISOString().split('T')[0],
        do: new Date().toISOString().split('T')[0],
        powod: ''
      }));
      await loadInitialData(); // Odśwież listę
    } catch (error) {
      console.error("Błąd dodawania niedostępności:", error);
      setMessage({ type: 'error', text: 'Wystąpił błąd. Sprawdź konsolę.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveNiedostepnosc = async (id) => {
    setConfirmDialog({ show: true, id });
  };

  const confirmDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ show: false, id: null });
    
    try {
      await usunNiedostepnosc(id);
      setMessage({ type: 'success', text: 'Pomyślnie usunięto okres niedostępności.' });
      await loadInitialData();
    } catch (error) {
      console.error("Błąd usuwania niedostępności:", error);
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas usuwania. Sprawdź konsolę.' });
    }
  };

  const getDomekName = (domek_id) => {
    const domek = domki.find(d => d.id === domek_id);
    return domek ? domek.nazwa : 'Nieznany domek';
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-200 flex items-center justify-center"><p>Ładowanie...</p></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-700">Odmowa dostępu.</p>
          <Link href="/panel" className="text-blue-600 hover:underline">Zaloguj się</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-200">
      <div className="h-32"></div>
      <div className="container mx-auto px-4 py-8">
        
        {/* Nagłówek */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-brand-300">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-lumios text-brand-800">Zarządzanie Dostępnością Domków</h1>
              <p className="text-brand-600">Blokuj terminy dla poszczególnych domków w razie awarii lub remontu.</p>
            </div>
            <Link href="/panel" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition duration-200">
              Powrót do rezerwacji
            </Link>
          </div>
        </div>

        {/* Komunikaty */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 
            'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Dialog potwierdzenia */}
        {confirmDialog.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
              <p className="text-lg mb-4">Czy na pewno chcesz usunąć ten okres niedostępności?</p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setConfirmDialog({ show: false, id: null })}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Usuń
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formularz dodawania niedostępności */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-brand-300">
                          <h2 className="text-2xl font-lumios text-brand-800 mb-4">Dodaj nowy okres niedostępności</h2>
          <form onSubmit={handleAddNiedostepnosc} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="domek_id" className="block text-sm font-medium text-brand-700">Domek</label>
              <select name="domek_id" id="domek_id" value={formData.domek_id} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-brand-300 rounded-md">
                {domki.map(d => <option key={d.id} value={d.id}>{d.nazwa}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="od" className="block text-sm font-medium text-brand-700">Data od</label>
              <input type="date" name="od" id="od" value={formData.od} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-brand-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="do" className="block text-sm font-medium text-brand-700">Data do</label>
              <input type="date" name="do" id="do" value={formData.do} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-brand-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="powod" className="block text-sm font-medium text-brand-700">Powód (opcjonalnie)</label>
              <input type="text" name="powod" id="powod" value={formData.powod} onChange={handleFormChange} placeholder="np. Awaria" className="mt-1 block w-full px-3 py-2 border border-brand-300 rounded-md" />
            </div>
            <button type="submit" disabled={formLoading} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 disabled:opacity-50">
              {formLoading ? 'Dodawanie...' : 'Zablokuj termin'}
            </button>
          </form>
        </div>

        {/* Lista obecnych niedostępności */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-brand-300">
                      <h2 className="text-2xl font-lumios text-brand-800 mb-4">Aktualnie zablokowane terminy</h2>
          {niedostepnosci.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-200">
                <thead className="bg-brand-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Domek</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Od</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Do</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Powód</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Akcje</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-200">
                  {niedostepnosci.map(n => (
                    <tr key={n.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-900">{getDomekName(n.domek_id || n.domekId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">{new Date(n.od || n.startDate).toLocaleDateString('pl-PL')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">{new Date(n.do || n.endDate).toLocaleDateString('pl-PL')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">{n.powod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleRemoveNiedostepnosc(n.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Usuń
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-brand-500 py-8">
              <p>Brak ręcznie zablokowanych terminów.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
