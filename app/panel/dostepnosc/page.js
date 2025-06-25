'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import { getAllDomki, getNiedostepnosci, setDomekNiedostepny, usunNiedostepnosc, checkRezerwacjeConflict } from '@/lib/firestore';

export default function DostepnoscPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [domki, setDomki] = useState([]);
  const [niedostepnosci, setNiedostepnosci] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, id: null });
  const [conflictDialog, setConflictDialog] = useState({ 
    show: false, 
    conflicts: [], 
    formData: null 
  });
  
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
      // Sprawdź czy są potwierdzone rezerwacje w tym terminie
      const conflicts = await checkRezerwacjeConflict(formData.domek_id, formData.od, formData.do);
      
      if (conflicts.length > 0) {
        // Pokaż dialog z ostrzeżeniem
        setConflictDialog({
          show: true,
          conflicts,
          formData: { ...formData }
        });
        setFormLoading(false);
        return;
      }
      
      // Brak konfliktów - dodaj blokadę
      await proceedWithBlocking(formData);
      
    } catch (error) {
      console.error("Błąd sprawdzania konfliktów:", error);
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas sprawdzania konfliktów. Sprawdź konsolę.' });
      setFormLoading(false);
    }
  };

  const proceedWithBlocking = async (dataToBlock) => {
    try {
      await setDomekNiedostepny({
        domekId: dataToBlock.domek_id,
        startDate: dataToBlock.od,
        endDate: dataToBlock.do,
        powod: dataToBlock.powod
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

  const handleForceBlock = async () => {
    setConflictDialog({ show: false, conflicts: [], formData: null });
    setFormLoading(true);
    await proceedWithBlocking(conflictDialog.formData);
  };

  const handleCancelBlock = () => {
    setConflictDialog({ show: false, conflicts: [], formData: null });
    setFormLoading(false);
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
    return <div className="min-h-screen bg-[#fdf2d0] flex items-center justify-center"><p>Ładowanie...</p></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdf2d0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#3c3333]">Odmowa dostępu.</p>
          <Link href="/panel" className="text-blue-600 hover:underline">Zaloguj się</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf2d0]">
      <div className="h-32"></div>
      <div className="container mx-auto px-4 py-8">
        
        {/* Nagłówek */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-[#3c3333]/20">
          <div className="flex justify-between items-center">
            <div>
                      <h1 className="text-3xl font-lumios text-[#3c3333]">Zarządzanie Dostępnością Domków</h1>
        <p className="text-[#3c3333]">Blokuj terminy dla poszczególnych domków w razie awarii lub remontu.</p>
            </div>
            <Link href="/panel" className="px-4 py-2 bg-[#3c3333] hover:bg-[#3c3333]/90 text-white rounded-lg transition duration-200">
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

        {/* Dialog potwierdzenia usunięcia */}
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

        {/* Dialog ostrzeżenia o konfliktach rezerwacji */}
        {conflictDialog.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-red-600 mb-2">⚠️ Ostrzeżenie!</h3>
                <p className="text-gray-700 mb-4">
                  W wybranym terminie ({new Date(conflictDialog.formData?.od).toLocaleDateString('pl-PL')} - {new Date(conflictDialog.formData?.do).toLocaleDateString('pl-PL')}) 
                  dla domku {getDomekName(conflictDialog.formData?.domek_id)} istnieją już potwierdzone rezerwacje:
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  {conflictDialog.conflicts.map((conflict, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="font-semibold text-red-800">
                        {conflict.imieNazwisko || 'Brak danych gościa'}
                      </div>
                      <div className="text-sm text-red-700">
                        📧 {conflict.email}<br/>
                        📞 {conflict.telefon}<br/>
                        📅 {conflict.startDate.toLocaleDateString('pl-PL')} - {conflict.endDate.toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-gray-700 text-sm">
                  Zablokowanie tego terminu może spowodować problemy z istniejącymi rezerwacjami. 
                  Czy na pewno chcesz kontynuować?
                </p>
              </div>
              
              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleCancelBlock}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleForceBlock}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  disabled={formLoading}
                >
                  {formLoading ? 'Blokowanie...' : 'Zablokuj mimo to'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formularz dodawania niedostępności */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-[#3c3333]/20">
                          <h2 className="text-2xl font-lumios text-[#3c3333] mb-4">Dodaj nowy okres niedostępności</h2>
          <form onSubmit={handleAddNiedostepnosc} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="domek_id" className="block text-sm font-medium text-[#3c3333]">Domek</label>
              <select name="domek_id" id="domek_id" value={formData.domek_id} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-[#3c3333]/20 rounded-md">
                {domki.map(d => <option key={d.id} value={d.id}>{d.nazwa}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="od" className="block text-sm font-medium text-[#3c3333]">Data od</label>
              <input type="date" name="od" id="od" value={formData.od} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-[#3c3333]/20 rounded-md" />
            </div>
            <div>
              <label htmlFor="do" className="block text-sm font-medium text-[#3c3333]">Data do</label>
              <input type="date" name="do" id="do" value={formData.do} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-[#3c3333]/20 rounded-md" />
            </div>
            <div>
              <label htmlFor="powod" className="block text-sm font-medium text-[#3c3333]">Powód (opcjonalnie)</label>
              <input type="text" name="powod" id="powod" value={formData.powod} onChange={handleFormChange} placeholder="np. Awaria" className="mt-1 block w-full px-3 py-2 border border-[#3c3333]/20 rounded-md" />
            </div>
            <button type="submit" disabled={formLoading} className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 disabled:opacity-50">
              {formLoading ? 'Dodawanie...' : 'Zablokuj termin'}
            </button>
          </form>
        </div>

        {/* Lista obecnych niedostępności */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#3c3333]/20">
                      <h2 className="text-2xl font-lumios text-[#3c3333] mb-4">Aktualnie zablokowane terminy</h2>
          {niedostepnosci.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#3c3333]/20">
                <thead className="bg-[#fdf2d0]/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#3c3333] uppercase tracking-wider">Domek</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#3c3333] uppercase tracking-wider">Od</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#3c3333] uppercase tracking-wider">Do</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#3c3333] uppercase tracking-wider">Powód</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#3c3333] uppercase tracking-wider">Akcje</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#3c3333]/20">
                  {niedostepnosci.map(n => (
                    <tr key={n.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3c3333]">{getDomekName(n.domek_id || n.domekId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3c3333]">{new Date(n.od || n.startDate).toLocaleDateString('pl-PL')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3c3333]">{new Date(n.do || n.endDate).toLocaleDateString('pl-PL')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3c3333]">{n.powod}</td>
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
            <div className="text-center text-[#3c3333] py-8">
              <p>Brak ręcznie zablokowanych terminów.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
