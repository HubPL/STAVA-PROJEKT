'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthChange } from '@/lib/auth';
import { getConfig, updateConfig } from '@/lib/firestore';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';

export default function CenyPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, action: null, id: null });
  
  // Stan edycji ceny podstawowej
  const [editingBase, setEditingBase] = useState(false);
  const [basePriceTemp, setBasePriceTemp] = useState('');
  
  // Stan edycji ceny za dodatkową osobę
  const [editingExtraPerson, setEditingExtraPerson] = useState(false);
  const [extraPersonPriceTemp, setExtraPersonPriceTemp] = useState('');
  
  // Stan formularza nowego sezonu
  const [showNewSeason, setShowNewSeason] = useState(false);
  const [newSeason, setNewSeason] = useState({
    nazwa: '',
    od: '',
    do: '',
    cena: ''
  });
  
  // Stan edycji sezonu
  const [editingSeasonId, setEditingSeasonId] = useState(null);
  const [editingSeason, setEditingSeason] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadConfig();
      }
    });
    return () => unsubscribe();
  }, []);
  
  const loadConfig = async () => {
    try {
      const configData = await getConfig();
      setConfig(configData);
    } catch (error) {
      console.error("Błąd ładowania konfiguracji:", error);
      setMessage({ type: 'error', text: 'Błąd ładowania konfiguracji' });
    }
  };
  
  // Zapisywanie ceny podstawowej
  const saveBasePrice = async () => {
    const newPrice = parseInt(basePriceTemp);
    if (isNaN(newPrice) || newPrice < 1) {
      setMessage({ type: 'error', text: 'Podaj prawidłową cenę' });
      return;
    }
    
    setSaving(true);
    try {
      await updateConfig({
        ...config,
        ceny: {
          ...config.ceny,
          podstawowa: newPrice
        }
      });
      await loadConfig();
      setEditingBase(false);
      setMessage({ type: 'success', text: 'Cena podstawowa zaktualizowana!' });
    } catch (error) {
      console.error("Błąd aktualizacji ceny:", error);
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas zapisu' });
    } finally {
      setSaving(false);
    }
  };

  // Zapisywanie ceny za dodatkową osobę
  const saveExtraPersonPrice = async () => {
    const newPrice = parseInt(extraPersonPriceTemp);
    if (isNaN(newPrice) || newPrice < 0) {
      setMessage({ type: 'error', text: 'Podaj prawidłową cenę (może być 0)' });
      return;
    }
    
    setSaving(true);
    try {
      await updateConfig({
        ...config,
        ceny: {
          ...config.ceny,
          cena_za_dodatkowa_osoba: newPrice
        },
        bazowa_liczba_osob: config.bazowa_liczba_osob || 4
      });
      await loadConfig();
      setEditingExtraPerson(false);
      setMessage({ type: 'success', text: 'Cena za dodatkową osobę zaktualizowana!' });
    } catch (error) {
      console.error("Błąd aktualizacji ceny za dodatkową osobę:", error);
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas zapisu' });
    } finally {
      setSaving(false);
    }
  };
  
  // Dodawanie nowego sezonu
  const addNewSeason = async () => {
    const newSeasonName = newSeason.nazwa;
    const newSeasonFrom = newSeason.od;
    const newSeasonTo = newSeason.do;
    const newSeasonPrice = newSeason.cena;

    if (!newSeasonName || !newSeasonFrom || !newSeasonTo) {
      setMessage({ type: 'error', text: 'Wypełnij wszystkie pola' });
      return;
    }

    if (!newSeasonPrice || isNaN(parseFloat(newSeasonPrice)) || parseFloat(newSeasonPrice) <= 0) {
      setMessage({ type: 'error', text: 'Podaj prawidłową cenę' });
      return;
    }
    
    setSaving(true);
    try {
      const newSeasonWithId = {
        ...newSeason,
        id: `season_${Date.now()}`,
        cena: parseFloat(newSeasonPrice)
      };
      
      await updateConfig({
        ...config,
        ceny: {
          ...config.ceny,
          sezonowe: [...(config.ceny?.sezonowe || []), newSeasonWithId]
        }
      });
      
      await loadConfig();
      setShowNewSeason(false);
      setNewSeason({ nazwa: '', od: '', do: '', cena: '' });
      setMessage({ type: 'success', text: 'Sezon dodany!' });
    } catch (error) {
      console.error("Błąd dodawania sezonu:", error);
      setMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setSaving(false);
    }
  };
  
  // Usuwanie sezonu
  const handleDeleteSeason = (seasonId) => {
    setConfirmDialog({ 
      show: true, 
      action: 'delete', 
      id: seasonId,
      message: 'Czy na pewno chcesz usunąć ten sezon?'
    });
  };

  const confirmDelete = async () => {
    const { id } = confirmDialog;
    setConfirmDialog({ show: false, action: null, id: null });
    
    try {
      await updateConfig({
        ...config,
        ceny: {
          ...config.ceny,
          sezonowe: config.ceny.sezonowe.filter(s => s.id !== id)
        }
      });
      await loadConfig();
      setMessage({ type: 'success', text: 'Sezon usunięty!' });
    } catch (error) {
      console.error("Błąd usuwania sezonu:", error);
      setMessage({ type: 'error', text: 'Wystąpił błąd' });
    }
  };
  
  // Aktualizacja sezonu
  const updateSeason = async () => {
    const updatedPrice = parseInt(editingSeason.cena);
    if (isNaN(updatedPrice) || updatedPrice < 1) {
      setMessage({ type: 'error', text: 'Podaj prawidłową cenę' });
      return;
    }
    
    setSaving(true);
    try {
      await updateConfig({
        ...config,
        ceny: {
          ...config.ceny,
          sezonowe: config.ceny.sezonowe.map(s => 
            s.id === editingSeasonId 
              ? { ...editingSeason, cena: updatedPrice }
              : s
          )
        }
      });
      await loadConfig();
      setEditingSeasonId(null);
      setMessage({ type: 'success', text: 'Sezon zaktualizowany!' });
    } catch (error) {
      console.error("Błąd aktualizacji sezonu:", error);
      setMessage({ type: 'error', text: 'Wystąpił błąd' });
    } finally {
      setSaving(false);
    }
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
              <h1 className="text-3xl font-lumios text-brand-800">Zarządzanie Cenami</h1>
              <p className="text-brand-600">Ustaw cenę podstawową i ceny sezonowe</p>
            </div>
            <Link href="/panel" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition duration-200">
              Powrót do panelu
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
              <p className="text-lg mb-4">{confirmDialog.message}</p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setConfirmDialog({ show: false, action: null, id: null })}
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

        {/* Cena podstawowa */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-brand-300">
          <h2 className="text-2xl font-lumios text-brand-800 mb-4">Cena podstawowa</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-600 mb-2">Domyślna cena za dobę (PLN)</p>
              {editingBase ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={basePriceTemp}
                    onChange={(e) => setBasePriceTemp(e.target.value)}
                    className="px-3 py-2 border border-brand-300 rounded-md"
                    placeholder="Cena"
                  />
                  <button
                    onClick={saveBasePrice}
                    disabled={saving}
                    className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <FiSave />
                  </button>
                  <button
                    onClick={() => setEditingBase(false)}
                    className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-brand-800">{config?.ceny?.podstawowa || 380} PLN</span>
                  <button
                    onClick={() => {
                      setEditingBase(true);
                      setBasePriceTemp(config?.ceny?.podstawowa || 380);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FiEdit2 />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cena za dodatkową osobę */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-brand-300">
          <h2 className="text-2xl font-lumios text-brand-800 mb-4">Opłata za dodatkowe osoby</h2>
          <div className="mb-4">
            <p className="text-sm text-brand-600 mb-2">
              Cena bazowa obejmuje pobyt do <strong>{config?.bazowa_liczba_osob || 4} osób</strong>. 
              Za każdą dodatkową osobę (powyżej {config?.bazowa_liczba_osob || 4}, maksymalnie {config?.max_osob || 6}) pobierana jest dodatkowa opłata.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-600 mb-2">Cena za każdą dodatkową osobę (PLN)</p>
              {editingExtraPerson ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={extraPersonPriceTemp}
                    onChange={(e) => setExtraPersonPriceTemp(e.target.value)}
                    className="px-3 py-2 border border-brand-300 rounded-md"
                    placeholder="Cena za dodatkową osobę"
                    min="0"
                  />
                  <button
                    onClick={saveExtraPersonPrice}
                    disabled={saving}
                    className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <FiSave />
                  </button>
                  <button
                    onClick={() => setEditingExtraPerson(false)}
                    className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-brand-800">
                    +{config?.ceny?.cena_za_dodatkowa_osoba || 0} PLN
                  </span>
                  <button
                    onClick={() => {
                      setEditingExtraPerson(true);
                      setExtraPersonPriceTemp(config?.ceny?.cena_za_dodatkowa_osoba || 0);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FiEdit2 />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Przykład kalkulacji */}
          <div className="mt-6 p-4 bg-brand-50 rounded-lg">
            <h4 className="font-semibold text-brand-800 mb-2">Przykład kalkulacji:</h4>
            <div className="text-sm text-brand-600 space-y-1">
              <p>• {config?.bazowa_liczba_osob || 4} osoby: {config?.ceny?.podstawowa || 380} PLN za dobę</p>
              <p>• 5 osób: {config?.ceny?.podstawowa || 380} + {config?.ceny?.cena_za_dodatkowa_osoba || 0} = {(config?.ceny?.podstawowa || 380) + (config?.ceny?.cena_za_dodatkowa_osoba || 0)} PLN za dobę</p>
              <p>• 6 osób: {config?.ceny?.podstawowa || 380} + 2×{config?.ceny?.cena_za_dodatkowa_osoba || 0} = {(config?.ceny?.podstawowa || 380) + 2*(config?.ceny?.cena_za_dodatkowa_osoba || 0)} PLN za dobę</p>
            </div>
          </div>
        </div>

        {/* Ceny sezonowe */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-brand-300">
          <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-lumios text-brand-800">Ceny sezonowe</h2>
            <button
              onClick={() => setShowNewSeason(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200 flex items-center gap-2"
            >
              <FiPlus /> Dodaj sezon
            </button>
          </div>

          {/* Formularz nowego sezonu */}
          {showNewSeason && (
            <div className="bg-brand-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">Nowy sezon</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                  type="text"
                  placeholder="Nazwa sezonu"
                  value={newSeason.nazwa}
                  onChange={(e) => setNewSeason({...newSeason, nazwa: e.target.value})}
                  className="px-3 py-2 border border-brand-300 rounded-md"
                />
                <input
                  type="date"
                  value={newSeason.od}
                  onChange={(e) => setNewSeason({...newSeason, od: e.target.value})}
                  className="px-3 py-2 border border-brand-300 rounded-md"
                />
                <input
                  type="date"
                  value={newSeason.do}
                  onChange={(e) => setNewSeason({...newSeason, do: e.target.value})}
                  className="px-3 py-2 border border-brand-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Cena PLN"
                  value={newSeason.cena}
                  onChange={(e) => setNewSeason({...newSeason, cena: e.target.value})}
                  className="px-3 py-2 border border-brand-300 rounded-md"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addNewSeason}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Dodaj
                  </button>
                  <button
                    onClick={() => {
                      setShowNewSeason(false);
                      setNewSeason({ nazwa: '', od: '', do: '', cena: '' });
                    }}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista sezonów */}
          {config?.ceny?.sezonowe?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-200">
                <thead className="bg-brand-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Nazwa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Od</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Do</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Cena</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Akcje</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-200">
                  {config.ceny.sezonowe.map(sezon => (
                    <tr key={sezon.id}>
                      {editingSeasonId === sezon.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editingSeason.nazwa}
                              onChange={(e) => setEditingSeason({...editingSeason, nazwa: e.target.value})}
                              className="px-2 py-1 border border-brand-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={editingSeason.od}
                              onChange={(e) => setEditingSeason({...editingSeason, od: e.target.value})}
                              className="px-2 py-1 border border-brand-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={editingSeason.do}
                              onChange={(e) => setEditingSeason({...editingSeason, do: e.target.value})}
                              className="px-2 py-1 border border-brand-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={editingSeason.cena}
                              onChange={(e) => setEditingSeason({...editingSeason, cena: e.target.value})}
                              className="px-2 py-1 border border-brand-300 rounded w-24"
                            />
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={updateSeason}
                              disabled={saving}
                              className="text-green-600 hover:text-green-800"
                            >
                              <FiSave />
                            </button>
                            <button
                              onClick={() => setEditingSeasonId(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <FiX />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 font-medium">{sezon.nazwa}</td>
                          <td className="px-6 py-4">{sezon.od}</td>
                          <td className="px-6 py-4">{sezon.do}</td>
                          <td className="px-6 py-4 font-semibold">{sezon.cena} PLN</td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => {
                                setEditingSeasonId(sezon.id);
                                setEditingSeason(sezon);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDeleteSeason(sezon.id)}
                              className="text-red-600 hover:underline"
                            >
                              Usuń
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-brand-500 py-8">Brak zdefiniowanych cen sezonowych</p>
          )}
        </div>
      </div>
    </div>
  );
} 
