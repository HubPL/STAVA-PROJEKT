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
// KOLEKCJA REZERWACJE - NOWA LOGIKA
// ==========================================

/**
 * Tworzy nową rezerwację z wieloma domkami
 * @param {Object} rezerwacjaData - Dane rezerwacji
 * @param {Array} selectedDomki - Array domków z datami i cenami
 * @returns {Promise<string>} ID utworzonej rezerwacji
 */
export const createRezerwacja = async (rezerwacjaData, selectedDomki) => {
  try {
    const rezerwacjeRef = collection(db, 'rezerwacje');
    
    // Oblicz sumy dla kompatybilności
    const cenaCałkowita = selectedDomki.reduce((sum, domek) => sum + domek.cenaCalkowitaDomku, 0);
    const liczbOsobCałkowita = selectedDomki.reduce((sum, domek) => sum + domek.liczbOsob, 0);
    
    const rezerwacjaZMetadanymi = {
      ...rezerwacjaData,
      selectedDomki: selectedDomki.map(domek => ({
        ...domek,
        startDate: Timestamp.fromDate(new Date(domek.startDate)),
        endDate: Timestamp.fromDate(new Date(domek.endDate))
      })),
      cenaCałkowita,
      liczbOsob: liczbOsobCałkowita,
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
 * Pobiera rezerwacje dla konkretnego domku w zadanym przedziale czasu (nowa logika)
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
      where('status', '==', 'potwierdzona')
    );
    
    const querySnapshot = await getDocs(q);
    const rezerwacje = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Sprawdź czy rezerwacja ma selectedDomki (nowa struktura)
      if (data.selectedDomki && Array.isArray(data.selectedDomki)) {
        data.selectedDomki.forEach(domek => {
          if (domek.domekId === domekId) {
            let rezStartDate, rezEndDate;
            
            try {
              if (domek.startDate && typeof domek.startDate.toDate === 'function') {
                rezStartDate = domek.startDate.toDate();
              } else if (domek.startDate instanceof Date) {
                rezStartDate = domek.startDate;
              } else {
                rezStartDate = new Date(domek.startDate);
              }
              
              if (domek.endDate && typeof domek.endDate.toDate === 'function') {
                rezEndDate = domek.endDate.toDate();
              } else if (domek.endDate instanceof Date) {
                rezEndDate = domek.endDate;
              } else {
                rezEndDate = new Date(domek.endDate);
              }
              
              const overlaps = rezStartDate < endDate && rezEndDate > startDate;
              
              if (overlaps) {
                rezerwacje.push({
                  id: doc.id,
                  ...data,
                  startDate: rezStartDate,
                  endDate: rezEndDate,
                  domekId: domek.domekId
                });
              }
              
            } catch (dateError) {
              console.error('Błąd konwersji dat dla domku:', domek.domekId, dateError);
            }
          }
        });
      }
    });
    
    return rezerwacje;
    
  } catch (error) {
    console.error('Błąd podczas pobierania rezerwacji dla domku:', error);
    throw error;
  }
};

/**
 * Pobiera wszystkie POTWIERDZONE rezerwacje dla kalendarza (nowa logika)
 * @param {Date} startDate - Data rozpoczęcia sprawdzania
 * @param {Date} endDate - Data zakończenia sprawdzania
 * @returns {Promise<Array>} Lista potwierdzonych rezerwacji z wszystkimi domkami
 */
export const getPotwierdzoneRezerwacje = async (startDate, endDate) => {
  try {
    const rezerwacjeRef = collection(db, 'rezerwacje');
    const q = query(
      rezerwacjeRef,
      where('status', '==', 'potwierdzona')
    );
    
    const querySnapshot = await getDocs(q);
    const rezerwacje = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Sprawdź czy rezerwacja ma selectedDomki (nowa struktura)
      if (data.selectedDomki && Array.isArray(data.selectedDomki)) {
        data.selectedDomki.forEach(domek => {
          let rezStartDate, rezEndDate;
          
          try {
            if (domek.startDate && typeof domek.startDate.toDate === 'function') {
              rezStartDate = domek.startDate.toDate();
            } else if (domek.startDate instanceof Date) {
              rezStartDate = domek.startDate;
            } else {
              rezStartDate = new Date(domek.startDate);
            }
            
            if (domek.endDate && typeof domek.endDate.toDate === 'function') {
              rezEndDate = domek.endDate.toDate();
            } else if (domek.endDate instanceof Date) {
              rezEndDate = domek.endDate;
            } else {
              rezEndDate = new Date(domek.endDate);
            }
            
            // Sprawdź czy ten domek zachodzi na sprawdzany okres
            if (rezEndDate > startDate && rezStartDate < endDate) {
              rezerwacje.push({
                id: doc.id,
                ...data,
                startDate: rezStartDate,
                endDate: rezEndDate,
                domekId: domek.domekId
              });
            }
            
          } catch (dateError) {
            console.error('Błąd konwersji dat:', dateError);
          }
        });
      }
    });
    
    return rezerwacje;
    
  } catch (error) {
    console.error('Błąd podczas pobierania potwierdzonych rezerwacji:', error);
    throw error;
  }
};

/**
 * Aktualizuje status rezerwacji (nowa logika - nie przypisuje już domków)
 * @param {string} rezerwacjaId - ID rezerwacji
 * @param {string} newStatus - Nowy status ('potwierdzona', 'odrzucona')
 * @returns {Promise<void>}
 */
export const updateRezerwacjaStatus = async (rezerwacjaId, newStatus) => {
  try {
    const rezerwacjaRef = doc(db, 'rezerwacje', rezerwacjaId);
    
    const updateData = {
      status: newStatus,
      'metadane.updatedAt': Timestamp.now()
    };

    await updateDoc(rezerwacjaRef, updateData);
  } catch (error) {
    console.error('Błąd podczas aktualizacji statusu rezerwacji:', error);
    throw error;
  }
};

/**
 * Pobiera rezerwację po ID
 * @param {string} id - ID rezerwacji
 * @returns {Promise<Object|null>} Dane rezerwacji lub null
 */
export const getRezerwacjaById = async (id) => {
  try {
    const rezerwacjaRef = doc(db, 'rezerwacje', id);
    const docSnapshot = await getDoc(rezerwacjaRef);
    
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      
      // Konwertuj daty w selectedDomki jeśli istnieją
      if (data.selectedDomki && Array.isArray(data.selectedDomki)) {
        data.selectedDomki = data.selectedDomki.map(domek => ({
          ...domek,
          startDate: domek.startDate?.toDate ? domek.startDate.toDate() : new Date(domek.startDate),
          endDate: domek.endDate?.toDate ? domek.endDate.toDate() : new Date(domek.endDate)
        }));
      }
      
      return {
        id: docSnapshot.id,
        ...data
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Błąd podczas pobierania rezerwacji po ID:', error);
    throw error;
  }
};

/**
 * Pobiera rezerwację po tokenie potwierdzenia (nowa logika)
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
      const data = doc.data();
      
      // Konwertuj daty w selectedDomki jeśli istnieją
      if (data.selectedDomki && Array.isArray(data.selectedDomki)) {
        data.selectedDomki = data.selectedDomki.map(domek => ({
          ...domek,
          startDate: domek.startDate?.toDate ? domek.startDate.toDate() : new Date(domek.startDate),
          endDate: domek.endDate?.toDate ? domek.endDate.toDate() : new Date(domek.endDate)
        }));
      }
      
      return {
        id: doc.id,
        ...data
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Błąd podczas pobierania rezerwacji po tokenie:', error);
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
 * Sprawdza czy w danym terminie są potwierdzone rezerwacje dla domku
 * @param {string} domekId - ID domku (np. "D1")
 * @param {string} startDate - Data rozpoczęcia (format YYYY-MM-DD)
 * @param {string} endDate - Data zakończenia (format YYYY-MM-DD)
 * @returns {Promise<Array>} Lista konfliktujących rezerwacji
 */
export const checkRezerwacjeConflict = async (domekId, startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const konfliktujaceRezerwacje = await getRezerwacjeForDomek(domekId, start, end);
    
    // Dodaj informacje o gościu
    const konfliktujaceZGoscmi = konfliktujaceRezerwacje.map(rez => ({
      ...rez,
      imieNazwisko: `${rez.imie || ''} ${rez.nazwisko || ''}`.trim(),
      email: rez.email || '',
      telefon: rez.telefon || ''
    }));
    
    return konfliktujaceZGoscmi;
  } catch (error) {
    console.error('Błąd sprawdzania konfliktów rezerwacji:', error);
    throw error;
  }
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
  return start1 < end2 && end1 > start2;
};

/**
 * Automatycznie odrzuca oczekujące rezerwacje starsze niż 24 godziny
 * @returns {Promise<Object>} Wynik operacji z liczbą odrzuconych rezerwacji
 */
export const cleanupExpiredReservations = async () => {
  try {
    const rezerwacjeRef = collection(db, 'rezerwacje');
    
    // Pobierz wszystkie oczekujące rezerwacje
    const q = query(
      rezerwacjeRef,
      where('status', '==', 'oczekujaca')
    );
    
    const querySnapshot = await getDocs(q);
    const now = new Date();
    const expiredReservations = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Sprawdź czy rezerwacja ma metadane.createdAt
      if (data.metadane && data.metadane.createdAt) {
        const createdAt = data.metadane.createdAt.toDate();
        const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60); // różnica w godzinach
        
        // Jeśli upłynęło więcej niż 24 godziny
        if (hoursSinceCreation > 24) {
          expiredReservations.push({
            id: doc.id,
            data: data,
            createdAt: createdAt,
            hoursSinceCreation: hoursSinceCreation
          });
        }
      }
    });
    
    // Odrzuć przeterminowane rezerwacje - wysyłamy TYLKO niezbędne pola
    let rejectedCount = 0;
    const updatePromises = expiredReservations.map(async (reservation) => {
      try {
        const docRef = doc(db, 'rezerwacje', reservation.id);
        
        // Wysyłamy tylko minimalne pola potrzebne do spełnienia reguły
        await updateDoc(docRef, {
          status: 'odrzucona',
          metadane: {
            ...reservation.data.metadane,
            updatedAt: Timestamp.now(),
            autoRejectedAt: Timestamp.now(),
            autoRejectedReason: 'Automatycznie odrzucone - brak opłaty w terminie 24 godzin'
          }
        });
        rejectedCount++;
        
        // Wyślij email o odrzuceniu rezerwacji
        try {
          const { sendStatusUpdateEmail } = await import('./email');
          await sendStatusUpdateEmail(reservation.data, 'odrzucona');
          console.log(`Wysłano email o automatycznym odrzuceniu do: ${reservation.data.email}`);
        } catch (emailError) {
          console.error(`Błąd wysyłania emaila o odrzuceniu dla rezerwacji ${reservation.id}:`, emailError);
          // Nie przerywamy procesu jeśli email się nie wyślije
        }
        
        console.log(`Automatycznie odrzucono przeterminowaną rezerwację:`, {
          id: reservation.id,
          guest: `${reservation.data.imie} ${reservation.data.nazwisko}`,
          email: reservation.data.email,
          createdAt: reservation.createdAt,
          hoursExpired: Math.round(reservation.hoursSinceCreation)
        });
        
        return { success: true, id: reservation.id };
      } catch (updateError) {
        console.error(`Błąd odrzucania rezerwacji ${reservation.id}:`, updateError);
        return { success: false, id: reservation.id, error: updateError };
      }
    });
    
    const updateResults = await Promise.all(updatePromises);
    
    const result = {
      success: true,
      foundExpired: expiredReservations.length,
      rejectedCount: rejectedCount,
      failedUpdates: updateResults.filter(r => !r.success),
      message: `Znaleziono ${expiredReservations.length} przeterminowanych rezerwacji, automatycznie odrzucono ${rejectedCount}`
    };
    
    console.log('Cleanup expired reservations result:', result);
    return result;
    
  } catch (error) {
    console.error('Błąd podczas automatycznego odrzucania przeterminowanych rezerwacji:', error);
    return {
      success: false,
      error: error.message,
      foundExpired: 0,
      rejectedCount: 0,
      message: `Błąd podczas automatycznego odrzucania: ${error.message}`
    };
  }
};

// ==========================================
// FUNKCJE MINIMALNEGO POBYTU
// ==========================================

/**
 * Pobiera wszystkie okresy minimalnego pobytu
 * @returns {Promise<Array>} Lista okresów minimalnego pobytu
 */
export const getMinimalnyPobyt = async () => {
  try {
    const minimalnyPobytRef = collection(db, 'minimalny_pobyt');
    const querySnapshot = await getDocs(minimalnyPobytRef);
    
    const okresy = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      okresy.push({
        id: doc.id,
        domek_id: data.domek_id,
        od: data.od?.toDate ? data.od.toDate() : new Date(data.od),
        do: data.do?.toDate ? data.do.toDate() : new Date(data.do),
        min_nocy: data.min_nocy,
        priorytet: data.priorytet || 0,
        nazwa: data.nazwa || '',
        aktywny: data.aktywny !== false
      });
    });
    
    return okresy;
  } catch (error) {
    console.error('Błąd podczas pobierania okresów minimalnego pobytu:', error);
    return [];
  }
};

/**
 * Dodaje nowy okres minimalnego pobytu
 * @param {Object} data - Dane okresu minimalnego pobytu
 * @param {string} data.domek_id - ID domku (np. "D1")
 * @param {Date} data.od - Data rozpoczęcia okresu
 * @param {Date} data.do - Data zakończenia okresu
 * @param {number} data.min_nocy - Minimalna liczba nocy
 * @param {number} data.priorytet - Priorytet (wyższy = ważniejszy)
 * @param {string} data.nazwa - Nazwa okresu
 * @returns {Promise<string>} ID nowego dokumentu
 */
export const dodajMinimalnyPobyt = async (data) => {
  try {
    const minimalnyPobytRef = collection(db, 'minimalny_pobyt');
    const docRef = await addDoc(minimalnyPobytRef, {
      domek_id: data.domek_id,
      od: Timestamp.fromDate(data.od),
      do: Timestamp.fromDate(data.do),
      min_nocy: data.min_nocy,
      priorytet: data.priorytet || 0,
      nazwa: data.nazwa || '',
      aktywny: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Dodano okres minimalnego pobytu:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Błąd podczas dodawania okresu minimalnego pobytu:', error);
    throw error;
  }
};

/**
 * Usuwa okres minimalnego pobytu
 * @param {string} id - ID dokumentu do usunięcia
 * @returns {Promise<boolean>} Czy operacja się powiodła
 */
export const usunMinimalnyPobyt = async (id) => {
  try {
    const docRef = doc(db, 'minimalny_pobyt', id);
    await deleteDoc(docRef);
    console.log('Usunięto okres minimalnego pobytu:', id);
    return true;
  } catch (error) {
    console.error('Błąd podczas usuwania okresu minimalnego pobytu:', error);
    return false;
  }
};

/**
 * Aktualizuje okres minimalnego pobytu
 * @param {string} id - ID dokumentu do aktualizacji
 * @param {Object} data - Nowe dane
 * @returns {Promise<boolean>} Czy operacja się powiodła
 */
export const updateMinimalnyPobyt = async (id, data) => {
  try {
    const docRef = doc(db, 'minimalny_pobyt', id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };
    
    // Konwertuj daty na Timestamp jeśli są Date
    if (data.od && data.od instanceof Date) {
      updateData.od = Timestamp.fromDate(data.od);
    }
    if (data.do && data.do instanceof Date) {
      updateData.do = Timestamp.fromDate(data.do);
    }
    
    await updateDoc(docRef, updateData);
    console.log('Zaktualizowano okres minimalnego pobytu:', id);
    return true;
  } catch (error) {
    console.error('Błąd podczas aktualizacji okresu minimalnego pobytu:', error);
    return false;
  }
};

/**
 * Sprawdza minimalny pobyt dla konkretnego domku w określonym terminie
 * @param {string} domekId - ID domku (np. "D1")
 * @param {Date} startDate - Data rozpoczęcia pobytu
 * @param {Date} endDate - Data zakończenia pobytu
 * @returns {Promise<number>} Minimalna liczba nocy dla tego okresu
 */
export const getMinimalnyPobytForDomek = async (domekId, startDate, endDate) => {
  try {
    // Pobierz globalną konfigurację jako fallback
    const config = await getConfig();
    const defaultMinNocy = config.min_nocy || 2;
    
    // Pobierz wszystkie okresy minimalnego pobytu dla tego domku
    const minimalnyPobytRef = collection(db, 'minimalny_pobyt');
    const q = query(
      minimalnyPobytRef,
      where('domek_id', '==', domekId),
      where('aktywny', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return defaultMinNocy;
    }
    
    const okresy = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      okresy.push({
        id: doc.id,
        od: data.od.toDate(),
        do: data.do.toDate(),
        min_nocy: data.min_nocy,
        priorytet: data.priorytet || 0,
        nazwa: data.nazwa || ''
      });
    });
    
    // Znajdź okresy które nakładają się z podanym terminem
    const nakładajaceOkresy = okresy.filter(okres => {
      return datesOverlap(startDate, endDate, okres.od, okres.do);
    });
    
    if (nakładajaceOkresy.length === 0) {
      return defaultMinNocy;
    }
    
    // Znajdź okres z najwyższym priorytetem
    const najwazniejszyOkres = nakładajaceOkresy.reduce((prev, current) => {
      return (current.priorytet > prev.priorytet) ? current : prev;
    });
    
    console.log(`Zastosowano minimalny pobyt: ${najwazniejszyOkres.min_nocy} nocy dla domku ${domekId} w okresie ${najwazniejszyOkres.nazwa}`);
    return najwazniejszyOkres.min_nocy;
    
  } catch (error) {
    console.error('Błąd podczas sprawdzania minimalnego pobytu:', error);
    // W przypadku błędu, zwróć globalną konfigurację
    const config = await getConfig();
    return config.min_nocy || 2;
  }
}; 