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
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// ==========================================
// KOLEKCJA DOMKI
// ==========================================

/**
 * Pobiera wszystkie domki z bazy danych
 * @returns {Promise<Array>} Lista wszystkich domków
 */
export const getAllDomki = async () => {
  try {
    const domkiRef = collection(db, 'domki');
    const querySnapshot = await getDocs(domkiRef);
    
    const domki = [];
    querySnapshot.forEach((doc) => {
      domki.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return domki;
  } catch (error) {
    console.error('Błąd podczas pobierania domków:', error);
    throw error;
  }
};

/**
 * Pobiera szczegóły konkretnego domku
 * @param {string} domekId - ID domku
 * @returns {Promise<Object|null>} Dane domku lub null jeśli nie znaleziono
 */
export const getDomekById = async (domekId) => {
  try {
    const domekRef = doc(db, 'domki', domekId);
    const docSnapshot = await getDoc(domekRef);
    
    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Błąd podczas pobierania domku:', error);
    throw error;
  }
};

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
 * Aktualizuje status rezerwacji
 * @param {string} rezerwacjaId - ID rezerwacji
 * @param {string} newStatus - Nowy status ('potwierdzona', 'odrzucona')
 * @returns {Promise<void>}
 */
export const updateRezerwacjaStatus = async (rezerwacjaId, newStatus) => {
  try {
    const rezerwacjaRef = doc(db, 'rezerwacje', rezerwacjaId);
    await updateDoc(rezerwacjaRef, {
      status: newStatus,
      'metadane.updatedAt': Timestamp.now()
    });
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
      where('status', 'in', ['oczekujaca', 'potwierdzona'])
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

// ==========================================
// KOLEKCJA SETTINGS
// ==========================================

/**
 * Pobiera globalne ustawienia aplikacji
 * @returns {Promise<Object|null>} Ustawienia aplikacji
 */
export const getSettings = async () => {
  try {
    const settingsRef = doc(db, 'settings', 'global');
    const docSnapshot = await getDoc(settingsRef);
    
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.warn('Dokument settings/global nie istnieje');
      return null;
    }
  } catch (error) {
    console.error('Błąd podczas pobierania ustawień:', error);
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