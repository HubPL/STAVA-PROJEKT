'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUsers } from 'react-icons/fi';
import { 
  getMinimalnyPobyt, 
  dodajMinimalnyPobyt, 
  usunMinimalnyPobyt, 
  updateMinimalnyPobyt 
} from '@/lib/firestore';

const MinimalnyPobytPage = () => {
  const [okresy, setOkresy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOkres, setEditingOkres] = useState(null);
  const [formData, setFormData] = useState({
    domek_id: 'D1',
    od: '',
    do: '',
    min_nocy: 2,
    priorytet: 0,
    nazwa: '',
    aktywny: true
  });

  // Ładowanie okresów
  useEffect(() => {
    loadOkresy();
  }, []);

  const loadOkresy = async () => {
    setLoading(true);
    try {
      const data = await getMinimalnyPobyt();
      // Sortuj po priorytecie i dacie
      const sorted = data.sort((a, b) => {
        if (a.priorytet !== b.priorytet) return b.priorytet - a.priorytet;
        return new Date(a.od) - new Date(b.od);
      });
      setOkresy(sorted);
    } catch (error) {
      console.error('Błąd ładowania okresów:', error);
      alert('Błąd ładowania okresów minimalnego pobytu');
    } finally {
      setLoading(false);
    }
  };

  // Resetowanie formularza
  const resetForm = () => {
    setFormData({
      domek_id: 'D1',
      od: '',
      do: '',
      min_nocy: 2,
      priorytet: 0,
      nazwa: '',
      aktywny: true
    });
    setEditingOkres(null);
    setShowForm(false);
  };

  // Obsługa zapisywania
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.od || !formData.do || !formData.nazwa) {
      alert('Wypełnij wszystkie wymagane pola');
      return;
    }

    const od = new Date(formData.od);
    const dataDo = new Date(formData.do);

    if (od >= dataDo) {
      alert('Data końcowa musi być późniejsza niż data początkowa');
      return;
    }

    try {
      const data = {
        domek_id: formData.domek_id,
        od,
        do: dataDo,
        min_nocy: parseInt(formData.min_nocy),
        priorytet: parseInt(formData.priorytet),
        nazwa: formData.nazwa,
        aktywny: formData.aktywny
      };

      if (editingOkres) {
        await updateMinimalnyPobyt(editingOkres.id, data);
      } else {
        await dodajMinimalnyPobyt(data);
      }

      await loadOkresy();
      resetForm();
    } catch (error) {
      console.error('Błąd zapisywania:', error);
      alert('Błąd zapisywania okresu');
    }
  };

  // Obsługa edycji
  const handleEdit = (okres) => {
    setFormData({
      domek_id: okres.domek_id,
      od: format(okres.od, 'yyyy-MM-dd'),
      do: format(okres.do, 'yyyy-MM-dd'),
      min_nocy: okres.min_nocy,
      priorytet: okres.priorytet,
      nazwa: okres.nazwa,
      aktywny: okres.aktywny
    });
    setEditingOkres(okres);
    setShowForm(true);
  };

  // Obsługa usuwania
  const handleDelete = async (id, nazwa) => {
    if (!confirm(`Czy na pewno chcesz usunąć okres "${nazwa}"?`)) return;

    try {
      await usunMinimalnyPobyt(id);
      await loadOkresy();
    } catch (error) {
      console.error('Błąd usuwania:', error);
      alert('Błąd usuwania okresu');
    }
  };

  // Przełączanie aktywności
  const toggleAktywny = async (okres) => {
    try {
      await updateMinimalnyPobyt(okres.id, { aktywny: !okres.aktywny });
      await loadOkresy();
    } catch (error) {
      console.error('Błąd zmiany aktywności:', error);
      alert('Błąd zmiany statusu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Nagłówek */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#3c3333]">
            Minimalny pobyt
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#3c3333] text-white px-4 py-2 rounded-lg hover:bg-[#2d2626] transition-colors"
          >
            <FiPlus size={20} />
            Dodaj okres
          </button>
        </div>

        {/* Instrukcja */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Jak to działa:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Można ustawić różne minimalne okresy dla każdego domku w określonych datach</li>
            <li>• Priorytet decyduje który okres ma pierwszeństwo przy nakładających się datach</li>
            <li>• Jeśli brak specjalnego okresu, używany jest globalny minimalny pobyt (2 noce)</li>
            <li>• Okresy można dezaktywować bez usuwania</li>
          </ul>
        </div>

        {/* Lista okresów */}
        <div className="bg-white rounded-lg shadow-sm">
          {okresy.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiCalendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Brak okresów minimalnego pobytu</p>
              <p className="text-sm">Dodaj pierwszy okres aby rozpocząć zarządzanie</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {okresy.map((okres) => (
                <div
                  key={okres.id}
                  className={`p-4 ${!okres.aktywny ? 'bg-gray-50 opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="bg-[#3c3333] text-white px-2 py-1 rounded text-sm font-medium">
                          Domek {okres.domek_id.replace('D', '')}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {okres.nazwa}
                        </span>
                        {okres.priorytet > 0 && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                            Priorytet: {okres.priorytet}
                          </span>
                        )}
                        {!okres.aktywny && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            Nieaktywny
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={16} />
                          <span>
                            {format(okres.od, 'd MMM yyyy', { locale: pl })} - {format(okres.do, 'd MMM yyyy', { locale: pl })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiUsers size={16} />
                          <span>{okres.min_nocy} nocy minimum</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAktywny(okres)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          okres.aktywny
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {okres.aktywny ? 'Aktywny' : 'Nieaktywny'}
                      </button>
                      <button
                        onClick={() => handleEdit(okres)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(okres.id, okres.nazwa)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal formularza */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingOkres ? 'Edytuj okres' : 'Dodaj nowy okres'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domek
                  </label>
                  <select
                    value={formData.domek_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, domek_id: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="D1">Domek 1</option>
                    <option value="D2">Domek 2</option>
                    <option value="D3">Domek 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa okresu *
                  </label>
                  <input
                    type="text"
                    value={formData.nazwa}
                    onChange={(e) => setFormData(prev => ({ ...prev, nazwa: e.target.value }))}
                    placeholder="np. Święta Bożego Narodzenia"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data od *
                    </label>
                    <input
                      type="date"
                      value={formData.od}
                      onChange={(e) => setFormData(prev => ({ ...prev, od: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data do *
                    </label>
                    <input
                      type="date"
                      value={formData.do}
                      onChange={(e) => setFormData(prev => ({ ...prev, do: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimalne noce
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={formData.min_nocy}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_nocy: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priorytet
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.priorytet}
                      onChange={(e) => setFormData(prev => ({ ...prev, priorytet: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aktywny"
                    checked={formData.aktywny}
                    onChange={(e) => setFormData(prev => ({ ...prev, aktywny: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="aktywny" className="text-sm text-gray-700">
                    Okres aktywny
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#3c3333] text-white py-2 rounded-lg hover:bg-[#2d2626] transition-colors"
                  >
                    {editingOkres ? 'Zapisz zmiany' : 'Dodaj okres'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalnyPobytPage; 