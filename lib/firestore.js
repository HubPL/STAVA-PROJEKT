import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

// ==========================================
// KOLEKCJA CONFIG
// ==========================================

/**
 * Pobiera konfigurację domków z bazy danych
 * @returns {Promise<Object>} Konfiguracja domków
 */
export const getConfig = async () => {
  try {
    const configRef = doc(db, 'config', 'domki');
    const docSnapshot = await getDoc(configRef);
    
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      
      // Uzupełnij brakujące pola domyślnymi wartościami
      return {
        liczba_domkow: data.liczba_domkow || 3,
        nazwy_domkow: data.nazwy_domkow || ["D1", "D2", "D3"],
        max_osob: data.max_osob || 6,
        powierzchnia: data.powierzchnia || 67,
        min_nocy: data.min_nocy || 2,
        bazowa_liczba_osob: data.bazowa_liczba_osob || 4,
        ceny: {
          podstawowa: data.ceny?.podstawowa || 350,
          cena_za_dodatkowa_osoba: data.ceny?.cena_za_dodatkowa_osoba || 0,
          sezonowe: data.ceny?.sezonowe || []
        }
      };
    } else {
      // Zwróć domyślną konfigurację jeśli nie ma w bazie
      return {
        liczba_domkow: 3,
        nazwy_domkow: ["D1", "D2", "D3"],
        max_osob: 6,
        powierzchnia: 67,
        min_nocy: 2,
        bazowa_liczba_osob: 4,
        ceny: {
          podstawowa: 350,
          cena_za_dodatkowa_osoba: 0,
          sezonowe: []
        }
      };
    }
  } catch (error) {
    console.error('Błąd podczas pobierania konfiguracji:', error);
    throw error;
  }
};

/**
 * Aktualizuje konfigurację domków
 * @param {Object} configData - Nowa konfiguracja
 * @returns {Promise<void>}
 */
export const updateConfig = async (configData) => {
  try {
    const configRef = doc(db, 'config', 'domki');
    await updateDoc(configRef, configData);
  } catch (error) {
    console.error('Błąd podczas aktualizacji konfiguracji:', error);
    throw error;
  }
};

// ==========================================
// KOMPATYBILNOŚĆ ZE STARYM KODEM
// ==========================================

/**
 * Pobiera "wszystkie domki" - teraz zwraca listę na podstawie konfiguracji
 * @returns {Promise<Array>} Lista domków
 */
export const getAllDomki = async () => {
  try {
    const config = await getConfig();
    
    // Zwracamy prostą listę domków dla kompatybilności z panelem
    return config.nazwy_domkow.map(nazwa => ({
      id: nazwa,
      nazwa: nazwa,
      dostepny: true,
      iloscOsob: config.max_osob,
      cenaZaDobe: config.ceny?.podstawowa || 380
    }));
  } catch (error) {
    console.error('Błąd podczas pobierania domków:', error);
    throw error;
  }
};



// ==========================================
// KOLEKCJA BLOKADY (zamiast niedostepnosci)
// ==========================================

/**
 * Pobiera wszystkie blokady domków
 * @returns {Promise<Array>} Lista blokad
 */
export const getBlokady = async () => {
  try {
    const blokadyRef = collection(db, 'blokady');
    const querySnapshot = await getDocs(query(blokadyRef, orderBy('od', 'desc')));
    
    const blokady = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      blokady.push({
        id: doc.id,
        ...data,
        od: data.od.toDate(),
        do: data.do.toDate()
      });
    });
    
    return blokady;
  } catch (error) {
    console.error('Błąd podczas pobierania blokad:', error);
    throw error;
  }
};

/**
 * Pobiera blokady w danym przedziale czasowym
 * @param {Date} startDate - Data początkowa
 * @param {Date} endDate - Data końcowa
 * @returns {Promise<Array>} Lista blokad
 */
export const getBlokadyWPrzedziale = async (startDate, endDate) => {
  try {
    const blokadyRef = collection(db, 'blokady');
    const q = query(
      blokadyRef,
      where('od', '<', Timestamp.fromDate(endDate))
    );
    
    const querySnapshot = await getDocs(q);
    const blokady = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const blokadaOd = data.od.toDate();
      const blokadaDo = data.do.toDate();
      
      // Sprawdź czy blokada zachodzi na sprawdzany okres
      if (blokadaDo > startDate) {
        blokady.push({
          id: doc.id,
          ...data,
          od: blokadaOd,
          do: blokadaDo,
          // Dodaj ilość domków dla kompatybilności
          iloscDomkow: 1
        });
      }
    });
    
    return blokady;
  } catch (error) {
    console.error('Błąd podczas pobierania blokad w przedziale:', error);
    throw error;
  }
};

/**
 * Dodaje nową blokadę dla domku
 * @param {Object} data - Dane blokady { domek_id, od, do, powod }
 * @returns {Promise<string>} ID utworzonej blokady
 */
export const dodajBlokade = async (data) => {
  try {
    const blokadyRef = collection(db, 'blokady');
    const docRef = await addDoc(blokadyRef, {
      domek_id: data.domek_id,
      od: Timestamp.fromDate(new Date(data.od)),
      do: Timestamp.fromDate(new Date(data.do)),
      powod: data.powod || 'Brak powodu',
      utworzono: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Błąd podczas dodawania blokady:', error);
    throw error;
  }
};

/**
 * Usuwa blokadę
 * @param {string} id - ID blokady
 * @returns {Promise<void>}
 */
export const usunBlokade = async (id) => {
  try {
    const docRef = doc(db, 'blokady', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Błąd podczas usuwania blokady:', error);
    throw error;
  }
};

// ==========================================
// FUNKCJE KOMPATYBILNOŚCI (dla starego kodu)
// ==========================================

// Stare funkcje przekierowujemy na nowe
export const getNiedostepnosci = getBlokady;
export const setDomekNiedostepny = async (data) => {
  return dodajBlokade({
    domek_id: data.domekId,
    od: data.startDate,
    do: data.endDate,
    powod: data.powod
  });
};
export const usunNiedostepnosc = usunBlokade;

// ==========================================
// KOLEKCJA REZERWACJE
// ==========================================

/**
 * Tworzy nową rezerwację
 * @param {Object} rezerwacjaData - Dane rezerwacji
 * @returns {Promise<string>} ID utworzonej rezerwacji
 */
export const createRezerwacja = async (rezerwacjaData) => {
  try {
    const rezerwacjeRef = collection(db, 'rezerwacje');
    
    const rezerwacjaZMetadanymi = {
      ...rezerwacjaData,
      startDate: Timestamp.fromDate(new Date(rezerwacjaData.startDate)),
      endDate: Timestamp.fromDate(new Date(rezerwacjaData.endDate)),
      status: 'oczekujaca',
      domekId: null,
      metadane: {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    };
    
    const docRef = await addDoc(rezerwacjeRef, rezerwacjaZMetadanymi);
    return docRef.id;
  } catch (error) {
    console.error('Błąd podczas tworzenia rezerwacji:', error);
    throw error;
  }
};

/**
 * Pobiera rezerwację po tokenie potwierdzenia
 * @param {string} token - Token potwierdzenia
 * @returns {Promise<Object|null>} Dane rezerwacji lub null
 */
export const getRezerwacjaByToken = async (token) => {
  try {
    const rezerwacjeRef = collection(db, 'rezerwacje');
    const q = query(rezerwacjeRef, where('tokenPotwierdzenia', '==', token));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Błąd podczas pobierania rezerwacji po tokenie:', error);
    throw error;
  }
};

/**
 * Aktualizuje status rezerwacji i przypisuje domek
 * @param {string} rezerwacjaId - ID rezerwacji
 * @param {string} newStatus - Nowy status ('potwierdzona', 'odrzucona')
 * @param {string|null} domekId - ID przypisanego domku (tylko dla statusu 'potwierdzona')
 * @param {string|null} domekNazwa - Nazwa przypisanego domku (tylko dla statusu 'potwierdzona')
 * @returns {Promise<void>}
 */
export const updateRezerwacjaStatus = async (rezerwacjaId, newStatus, domekId = null, domekNazwa = null) => {
  try {
    const rezerwacjaRef = doc(db, 'rezerwacje', rezerwacjaId);
    
    const updateData = {
      status: newStatus,
      'metadane.updatedAt': Timestamp.now()
    };

    if (newStatus === 'potwierdzona' && domekId) {
      updateData.domekId = domekId;
      updateData.domekNazwa = domekNazwa || domekId; // Użyj nazwy lub ID jako fallback
    }

    await updateDoc(rezerwacjaRef, updateData);
  } catch (error) {
    console.error('Błąd podczas aktualizacji statusu rezerwacji:', error);
    throw error;
  }
};

/**
 * Pobiera rezerwacje dla konkretnego domku w zadanym przedziale czasu
 * @param {string} domekId - ID domku
 * @param {Date} startDate - Data rozpoczęcia sprawdzania
 * @param {Date} endDate - Data zakończenia sprawdzania
 * @returns {Promise<Array>} Lista rezerwacji
 */
export const getRezerwacjeForDomek = async (domekId, startDate, endDate) => {
  try {
    const rezerwacjeRef = collection(db, 'rezerwacje');
    
    const q = query(
      rezerwacjeRef,
      where('domekId', '==', domekId),
      where('status', '==', 'potwierdzona')
    );
    
    const querySnapshot = await getDocs(q);
    const rezerwacje = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      let rezStartDate, rezEndDate;
      
      try {
        if (data.startDate && typeof data.startDate.toDate === 'function') {
          rezStartDate = data.startDate.toDate();
        } else if (data.startDate instanceof Date) {
          rezStartDate = data.startDate;
        } else {
          rezStartDate = new Date(data.startDate);
        }
        
        if (data.endDate && typeof data.endDate.toDate === 'function') {
          rezEndDate = data.endDate.toDate();
        } else if (data.endDate instanceof Date) {
          rezEndDate = data.endDate;
        } else {
          rezEndDate = new Date(data.endDate);
        }
        
        const overlaps = rezStartDate < endDate && rezEndDate > startDate;
        
        if (overlaps) {
          rezerwacje.push({
            id: doc.id,
            ...data,
            startDate: rezStartDate,
            endDate: rezEndDate
          });
        }
        
      } catch (dateError) {
        console.error('Błąd konwersji dat dla rezerwacji:', doc.id, dateError);
      }
    });
    
    return rezerwacje;
    
  } catch (error) {
    console.error('Błąd podczas pobierania rezerwacji dla domku:', error);
    throw error;
  }
};

/**
 * Pobiera wszystkie POTWIERDZONE rezerwacje w zadanym przedziale czasu
 * @param {Date} startDate - Data rozpoczęcia sprawdzania
 * @param {Date} endDate - Data zakończenia sprawdzania
 * @returns {Promise<Array>} Lista potwierdzonych rezerwacji
 */
export const getPotwierdzoneRezerwacje = async (startDate, endDate) => {
  try {
    const rezerwacjeRef = collection(db, 'rezerwacje');
    
    const q = query(
      rezerwacjeRef,
      where('status', '==', 'potwierdzona'),
      where('startDate', '<', Timestamp.fromDate(endDate))
    );
    
    const querySnapshot = await getDocs(q);
    const rezerwacje = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      const rezStartDate = data.startDate.toDate();
      const rezEndDate = data.endDate.toDate();

      // Dodatkowa walidacja po stronie klienta, ponieważ Firestore nie obsługuje złożonych zapytań OR
      if (rezEndDate > startDate) {
        rezerwacje.push({
          id: doc.id,
          ...data,
          startDate: rezStartDate,
          endDate: rezEndDate
        });
      }
    });
    
    return rezerwacje;
    
  } catch (error) {
    console.error('Błąd podczas pobierania potwierdzonych rezerwacji:', error);
    throw error;
  }
};

// ==========================================
// FUNKCJE POMOCNICZE
// ==========================================

/**
 * Generuje unikalny token potwierdzenia
 * @returns {string} Token UUID
 */
export const generateConfirmationToken = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Sprawdza czy daty się nakładają
 * @param {Date} start1 
 * @param {Date} end1 
 * @param {Date} start2 
 * @param {Date} end2 
 * @returns {boolean}
 */
export const datesOverlap = (start1, end1, start2, end2) => {
  return start1 <= end2 && end1 >= start2;
}; 