const SMS_CONFIG = {
  token: process.env.SMS_API_TOKEN,
  adminPhone: process.env.ADMIN_PHONE,
  sender: process.env.SMS_SENDER || 'Test',
  apiUrl: 'https://api.smsapi.pl/sms.do'
};

/**
 * Wysyła SMS do administratora o nowej rezerwacji
 * @param {Object} rezerwacjaData - Dane rezerwacji
 * @returns {Promise<Object>} Wynik wysyłania SMS
 */
export const sendAdminSMSNotification = async (rezerwacjaData) => {
  try {
    // Debug: sprawdź czy token jest ładowany
    console.log('SMS Config debug:', {
      hasToken: !!SMS_CONFIG.token,
      tokenLength: SMS_CONFIG.token ? SMS_CONFIG.token.length : 0,
      tokenStart: SMS_CONFIG.token ? SMS_CONFIG.token.substring(0, 10) + '...' : 'BRAK',
      adminPhone: SMS_CONFIG.adminPhone,
      sender: SMS_CONFIG.sender
    });

    // Sprawdź czy SMS jest skonfigurowany
    if (!SMS_CONFIG.token || !SMS_CONFIG.adminPhone) {
      console.log('SMS nie skonfigurowany - pomijam wysyłanie');
      return { success: false, reason: 'SMS not configured' };
    }

    // Przygotuj treść SMS
    const message = createSMSMessage(rezerwacjaData);
    
    console.log('Wysyłanie SMS do administratora:', SMS_CONFIG.adminPhone);

    // Wywołanie API SMSApi.pl - poprawny format autoryzacji
    const response = await fetch(SMS_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${SMS_CONFIG.token}` // Poprawny format autoryzacji
      },
      body: new URLSearchParams({
        'to': SMS_CONFIG.adminPhone,
        'message': message,
        'from': SMS_CONFIG.sender,
        'encoding': 'utf-8',
        'format': 'json', // Dodane dla lepszego parsowania odpowiedzi
        'test': '1' // Tryb testowy - nie wysyła faktycznie SMS
      }),
    });

    // Sprawdź typ odpowiedzi
    const responseText = await response.text();
    console.log('SMS API response:', responseText);

    // Jeśli zaczyna się od ERROR, to błąd tekstowy
    if (responseText.startsWith('ERROR:')) {
      const errorCode = responseText.replace('ERROR:', '');
      const errorMessage = getSMSErrorMessage(errorCode);
      console.error('SMS API Error:', errorCode, '-', errorMessage);
      throw new Error(`SMS API Error ${errorCode}: ${errorMessage}`);
    }

    // Spróbuj sparsować jako JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Nie można sparsować odpowiedzi SMS API:', responseText);
      throw new Error('Nieprawidłowa odpowiedź z SMS API');
    }

    if (response.ok && result.count > 0) {
      console.log('SMS wysłany pomyślnie:', result);
      return { success: true, result };
    } else {
      console.error('Błąd API SMS:', result);
      throw new Error(result.message || 'Błąd wysyłania SMS');
    }

  } catch (error) {
    console.error('Błąd wysyłania SMS:', error);
    // Nie przerywamy procesu jeśli SMS się nie powiedzie
    return { success: false, error: error.message };
  }
};

/**
 * Tworzy treść SMS o nowej rezerwacji
 * @param {Object} rezerwacja - Dane rezerwacji
 * @returns {string} Treść SMS
 */
function createSMSMessage(rezerwacja) {
  const panelUrl = process.env.NEXT_PUBLIC_APP_URL + '/panel';
  
  // Sprawdź czy to nowa struktura z wieloma domkami
  if (rezerwacja.selectedDomki && Array.isArray(rezerwacja.selectedDomki)) {
    // Nowa struktura - wiele domków
    const firstDomek = rezerwacja.selectedDomki[0];
    const startDate = new Date(firstDomek.startDate).toLocaleDateString('pl-PL', {
      day: '2-digit', month: '2-digit'
    });
    
    const domkiText = rezerwacja.selectedDomki.length > 1 
      ? `${rezerwacja.selectedDomki.length} domków` 
      : `domek ${firstDomek.domekId.replace('D', '')}`;

    return `🏠 NOWA REZERWACJA STAVA!

${rezerwacja.imie} ${rezerwacja.nazwisko}
📅 ${startDate} (${domkiText})
💰 ${rezerwacja.cenaCałkowita} PLN
📱 ${rezerwacja.telefon}

Panel: ${panelUrl}`;

  } else {
    // Stara struktura (fallback)
    const startDate = new Date(rezerwacja.startDate).toLocaleDateString('pl-PL', {
      day: '2-digit', month: '2-digit'
    });

    return `🏠 NOWA REZERWACJA STAVA!

${rezerwacja.imie} ${rezerwacja.nazwisko}
📅 ${startDate}
💰 ${rezerwacja.cenaCałkowita} PLN
📱 ${rezerwacja.telefon}

Panel: ${panelUrl}`;
  }
}

/**
 * Tłumaczy kody błędów SMS API na czytelne komunikaty
 * @param {string} errorCode - Kod błędu
 * @returns {string} Opis błędu
 */
function getSMSErrorMessage(errorCode) {
  const errors = {
    '1': 'Nieprawidłowy login',
    '2': 'Nieprawidłowe hasło', 
    '3': 'Brak dostępu do usługi',
    '4': 'Brak środków na koncie',
    '5': 'Nieprawidłowy numer odbiorcy',
    '6': 'Wiadomość jest za długa',
    '7': 'Nieprawidłowy nadawca',
    '8': 'Wiadomość zawiera niedozwolone znaki',
    '9': 'Wiadomość została odrzucona',
    '10': 'Błąd systemu',
    '11': 'Przekroczono limit wysyłania',
    '12': 'Nieprawidłowy format numeru',
    '13': 'Numer jest na czarnej liście',
    '14': 'Nieprawidłowy token autoryzacji',
    '15': 'Usługa niedostępna',
    '16': 'Przekroczono limit czasu',
    '101': 'Nieprawidłowy format żądania'
  };

  return errors[errorCode] || `Nieznany błąd (kod: ${errorCode})`;
} 