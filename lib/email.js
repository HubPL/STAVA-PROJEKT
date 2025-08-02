import { Resend } from 'resend';

// Inicjalizacja Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@stavakiszewa.pl',
  admin: process.env.EMAIL_ADMIN || 'kontakt@stavakiszewa.pl',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://stavakiszewa.pl',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'STAVA Kiszewa'
};

// URL do logo STAVA - nieużywane, używamy tekstu STAVA
// const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Flogo.webp?alt=media';
// const LOGO_WHITE_URL = 'https://firebasestorage.googleapis.com/v0/b/stava-62c2a.firebasestorage.app/o/global%2Flogo_white.webp?alt=media';

// Funkcja walidacji i sanityzacji adresu email
const validateAndSanitizeEmail = (email) => {
  if (!email) {
    throw new Error('Adres email jest wymagany');
  }
  
  // Jeśli email jest tablicą, weź pierwszy element
  const emailStr = Array.isArray(email) ? email[0] : email;
  
  // Usuń białe znaki
  const cleanEmail = String(emailStr).trim();
  
  // Prosta walidacja formatu email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error(`Nieprawidłowy format adresu email: ${cleanEmail}`);
  }
  
  return cleanEmail;
};

// Funkcja przygotowania listy odbiorców dla Resend
const prepareRecipients = (emails) => {
  if (!emails) return [];
  
  const emailArray = Array.isArray(emails) ? emails : [emails];
  return emailArray
    .map(email => {
      try {
        return validateAndSanitizeEmail(email);
      } catch (error) {
        console.error('Błąd walidacji email:', error.message);
        return null;
      }
    })
    .filter(email => email !== null);
};

// Wspólne style dla wszystkich emaili - dopasowane do stylistyki strony
const getEmailStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.7;
      color: #3c3333;
      background-color: #FFF9E8;
      margin: 0;
      padding: 20px 0;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 249, 232, 0.8);
    }
    
    .email-header {
      background: linear-gradient(135deg, #3c3333 0%, #2d2626 100%);
      color: #FFF9E8;
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,249,232,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,249,232,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,249,232,0.1)"/></svg>');
      pointer-events: none;
    }
    
    .email-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 0.1em;
      margin: 0 0 16px 0;
      color: #FFF9E8;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    
    .email-header p {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: #FFF9E8;
      position: relative;
      z-index: 1;
    }
    
    .email-content {
      padding: 40px 30px;
      background-color: #ffffff;
    }
    
    .email-footer {
      background: linear-gradient(135deg, #FFF9E8 0%, #fbeabb 100%);
      padding: 30px;
      text-align: center;
      border-top: 1px solid rgba(60, 51, 51, 0.1);
    }
    
    .content-section {
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      margin: 24px 0;
      position: relative;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    
    .content-section.highlight {
      background: linear-gradient(135deg, #FFF9E8 0%, #fefefe 100%);
    }
    
    .content-section.success {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    }
    
    .content-section.warning {
      background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
    }
    
    .content-section.error {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    }
    
    .total-cost-section {
      background: linear-gradient(135deg, #FFF9E8 0%, #f7de9c 100%);
      font-weight: 600;
    }
    
    h2, h3, h4 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      letter-spacing: 0.025em;
      color: #3c3333;
      margin-bottom: 16px;
    }
    
    h2 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 18px;
      font-weight: 600;
    }
    
    h4 {
      font-size: 16px;
      font-weight: 600;
    }
    
    p {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.7;
      margin-bottom: 12px;
      color: #3c3333;
    }
    
    strong {
      font-weight: 600;
      color: #3c3333;
    }
    
    .email-button {
      display: inline-block;
      background: linear-gradient(135deg, #3c3333 0%, #2d2626 100%);
      color: #FFF9E8 !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 12px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.05em;
      text-align: center;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .email-button:hover {
      background: linear-gradient(135deg, #2d2626 0%, #1f1a1a 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .email-button.success {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      color: #ffffff !important;
    }
    
    .email-button.warning {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: #ffffff !important;
    }
    
    .status-badge {
      background: linear-gradient(135deg, #3c3333 0%, #2d2626 100%);
      color: #FFF9E8;
      padding: 8px 16px;
      border-radius: 25px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      display: inline-block;
      margin: 8px 0;
    }
    
    .status-badge.success {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
    
    .status-badge.error {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }
    
    .message-box {
      background: rgba(255, 249, 232, 0.5);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid rgba(60, 51, 51, 0.1);
      margin: 20px 0;
      font-style: italic;
    }
    
    .footer-text {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #3c3333;
      line-height: 1.6;
      margin-bottom: 8px;
    }
    
    .footer-text.small {
      font-size: 12px;
      opacity: 0.8;
    }
    
    .brand-signature {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 0.05em;
      color: #3c3333;
      text-align: center;
      margin: 20px 0;
    }
    
    .decorative-line {
      width: 80px;
      height: 3px;
      background: linear-gradient(135deg, #3c3333 0%, #2d2626 100%);
      margin: 20px auto;
      border-radius: 2px;
    }
    
    a {
      color: #3c3333;
      text-decoration: underline;
      transition: color 0.3s ease;
    }
    
    a:hover {
      color: #2d2626;
    }
    
    .contact-info {
      background: rgba(255, 249, 232, 0.7);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin: 20px 0;
      border: 1px solid rgba(60, 51, 51, 0.1);
    }
    
    .contact-info p {
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .preparation-section {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    }
    
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px 0;
      }
      
      .email-container {
        margin: 0 10px;
        border-radius: 12px;
      }
      
      .email-header, .email-content, .email-footer {
        padding: 20px;
      }
      
      .email-header h1 {
        font-size: 24px;
      }
      
      .content-section {
        padding: 16px;
        margin: 16px 0;
      }
      
      .email-button {
        padding: 12px 24px;
        font-size: 13px;
      }
    }
  </style>
`;

/**
 * Wysyła email z formularza kontaktowego
 * @param {Object} contactData - Dane z formularza kontaktowego
 * @returns {Promise<Object>} Wynik wysyłania
 */
export const sendContactEmail = async (contactData) => {
  try {
    // Walidacja danych wejściowych
    if (!contactData.email || !contactData.name) {
      throw new Error('Brak wymaganych danych kontaktowych');
    }

    const adminEmails = prepareRecipients(EMAIL_CONFIG.admin);
    if (adminEmails.length === 0) {
      throw new Error('Nie można wysłać emaila - nieprawidłowy adres administratora');
    }

    const replyToEmail = validateAndSanitizeEmail(contactData.email);

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: adminEmails,
      replyTo: replyToEmail,
      subject: `Nowa wiadomość z formularza kontaktowego: ${contactData.subject}`,
      html: generateContactEmailHTML(contactData),
    });

    if (error) {
      console.error('Błąd wysyłania emaila kontaktowego:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Błąd w sendContactEmail:', error);
    throw error;
  }
};

/**
 * Wysyła email potwierdzenia rezerwacji do klienta
 * @param {Object} rezerwacjaData - Dane rezerwacji
 * @returns {Promise<Object>} Wynik wysyłania
 */
export const sendConfirmationEmailToGuest = async (rezerwacjaData) => {
  try {
    // Walidacja danych wejściowych
    if (!rezerwacjaData.email) {
      throw new Error('Brak adresu email gościa');
    }

    const guestEmails = prepareRecipients(rezerwacjaData.email);
    if (guestEmails.length === 0) {
      throw new Error(`Nieprawidłowy adres email gościa: ${rezerwacjaData.email}`);
    }

    console.log('Wysyłanie emaila do gościa:', guestEmails[0]);

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: guestEmails,
      subject: `Otrzymaliśmy Twoją prośbę o rezerwację w ${EMAIL_CONFIG.appName}`,
      html: generateGuestConfirmationHTML(rezerwacjaData),
    });

    if (error) {
      console.error('Błąd wysyłania emaila do gościa:', error);
      throw error;
    }

    console.log('Email do gościa wysłany pomyślnie:', data);
    return data;
  } catch (error) {
    console.error('Błąd w sendConfirmationEmailToGuest:', error);
    throw error;
  }
};

/**
 * Wysyła email z nową rezerwacją do administratora
 * @param {Object} rezerwacjaData - Dane rezerwacji
 * @returns {Promise<Object>} Wynik wysyłania
 */
export const sendNewReservationEmailToAdmin = async (rezerwacjaData) => {
  try {
    const adminEmails = prepareRecipients(EMAIL_CONFIG.admin);
    if (adminEmails.length === 0) {
      throw new Error('Nie można wysłać emaila - nieprawidłowy adres administratora');
    }

    const panelUrl = `${EMAIL_CONFIG.appUrl}/panel`;
    
    console.log('Wysyłanie emaila do administratora:', adminEmails[0]);

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: adminEmails,
      subject: `Nowa prośba o rezerwację w ${EMAIL_CONFIG.appName} [Wymaga akcji]`,
      html: generateAdminNotificationHTML(rezerwacjaData, panelUrl),
    });

    if (error) {
      console.error('Błąd wysyłania emaila do admina:', error);
      throw error;
    }

    console.log('Email do administratora wysłany pomyślnie:', data);
    return data;
  } catch (error) {
    console.error('Błąd w sendNewReservationEmailToAdmin:', error);
    throw error;
  }
};

/**
 * Wysyła email z aktualizacją statusu rezerwacji
 * @param {Object} rezerwacjaData - Dane rezerwacji
 * @param {string} newStatus - Nowy status
 * @returns {Promise<Object>} Wynik wysyłania
 */
export const sendStatusUpdateEmail = async (rezerwacjaData, newStatus) => {
  try {
    // Walidacja danych wejściowych
    if (!rezerwacjaData.email) {
      throw new Error('Brak adresu email gościa');
    }

    const guestEmails = prepareRecipients(rezerwacjaData.email);
    if (guestEmails.length === 0) {
      throw new Error(`Nieprawidłowy adres email gościa: ${rezerwacjaData.email}`);
    }

    const subject = newStatus === 'potwierdzona' 
      ? `Twoja rezerwacja w ${EMAIL_CONFIG.appName} została potwierdzona!`
      : newStatus === 'anulowana'
      ? `Twoja rezerwacja w ${EMAIL_CONFIG.appName} została anulowana`
      : `Informacja o rezerwacji w ${EMAIL_CONFIG.appName}`;

    console.log('Wysyłanie emaila o statusie do gościa:', guestEmails[0], 'Status:', newStatus);

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: guestEmails,
      subject,
      html: generateStatusUpdateHTML(rezerwacjaData, newStatus),
    });

    if (error) {
      console.error('Błąd wysyłania emaila o statusie:', error);
      throw error;
    }

    console.log('Email o statusie wysłany pomyślnie:', data);
    return data;
  } catch (error) {
    console.error('Błąd w sendStatusUpdateEmail:', error);
    throw error;
  }
};

/**
 * HTML dla emaila z formularza kontaktowego
 */
function generateContactEmailHTML(contactData) {
  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nowa wiadomość kontaktowa - ${EMAIL_CONFIG.appName}</title>
      ${getEmailStyles()}
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>STAVA</h1>
          <p>Nowa wiadomość z formularza kontaktowego</p>
        </div>
        
        <div class="email-content">
          <h2>Szczegóły wiadomości</h2>
          
          <div class="content-section highlight">
            <h3>Informacje podstawowe</h3>
            <p><strong>Temat:</strong> ${contactData.subject}</p>
            <p><strong>Data otrzymania:</strong> ${new Date().toLocaleDateString('pl-PL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div class="content-section">
            <h3>Dane nadawcy</h3>
            <p><strong>Imię:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
          </div>
          
          <div class="message-box">
            <h3>Treść wiadomości</h3>
            <p style="white-space: pre-line; margin-top: 12px;">${contactData.message}</p>
          </div>
          
          <div class="content-section success">
            <h3>Kontakt z nadawcą</h3>
            <p>Adres email nadawcy: <strong>${contactData.email}</strong></p>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
          <div class="decorative-line"></div>
          <p class="footer-text">System zarządzania wiadomościami</p>
          <p class="footer-text small">Wiadomość automatycznie wysłana z formularza kontaktowego</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Funkcja pomocnicza do konwersji dat z uwzględnieniem strefy czasowej
const formatDateForEmail = (dateInput) => {
  let date;
  
  // Sprawdź typ daty i skonwertuj odpowiednio
  if (dateInput?.toDate) {
    // Firebase Timestamp
    date = dateInput.toDate();
  } else if (dateInput instanceof Date) {
    // Obiekt Date
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    // String - parsuj jako date-only bez czasu
    if (dateInput.includes('T')) {
      // ISO string z czasem - użyj tylko części datowej
      const dateOnly = dateInput.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);
      date = new Date(year, month - 1, day); // miesiące są 0-indexed
    } else {
      // Prawdopodobnie format YYYY-MM-DD
      const [year, month, day] = dateInput.split('-').map(Number);
      date = new Date(year, month - 1, day);
    }
  } else {
    // Fallback
    date = new Date(dateInput);
  }
  
  return date.toLocaleDateString('pl-PL', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
};

/**
 * HTML dla emaila potwierdzenia do gościa (nowa logika - wiele domków)
 */
function generateGuestConfirmationHTML(rezerwacja) {
  // Sprawdź czy to nowa struktura z selectedDomki
  if (rezerwacja.selectedDomki && Array.isArray(rezerwacja.selectedDomki)) {
    // Nowa struktura - wiele domków - szczegóły w jednej sekcji jak w admin mailu
    let domkiDetailsHTML = '';
    
    rezerwacja.selectedDomki.forEach((domek, index) => {
      const startDate = formatDateForEmail(domek.startDate);
      const endDate = formatDateForEmail(domek.endDate);
      
      domkiDetailsHTML += `
        <div style="margin-bottom: 15px; ${index > 0 ? 'border-top: 1px solid #e0e0e0; padding-top: 15px;' : ''}">
          <h4>Domek ${domek.domekId.replace('D', '')}</h4>
          <p><strong>Osoby:</strong> ${domek.liczbOsob} | <strong>Noce:</strong> ${domek.iloscNocy} | <strong>Cena:</strong> ${domek.cenaCałkowita || domek.cenaCalkowitaDomku} PLN</p>
          <p><strong>Przyjazd:</strong> ${startDate}</p>
          <p><strong>Wyjazd:</strong> ${endDate}</p>
        </div>
      `;
    });
    
    return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Potwierdzenie rezerwacji - ${EMAIL_CONFIG.appName}</title>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>STAVA</h1>
            <p>Potwierdzenie rezerwacji</p>
          </div>
          
          <div class="email-content">
            <h2>Cześć ${rezerwacja.imie}!</h2>
            
            <p>Dziękujemy za wybór naszej oferty!</p>
            
            <div class="content-section total-cost-section">
              <h3>Podsumowanie rezerwacji</h3>
              <p><strong>Liczba domków:</strong> ${rezerwacja.selectedDomki.length}</p>
              <p><strong>Łączna liczba osób:</strong> ${rezerwacja.liczbOsob} ${rezerwacja.liczbOsob === 1 ? 'osoba' : rezerwacja.liczbOsob <= 4 ? 'osoby' : 'osób'}</p>
              <p><strong>Łączna cena:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
            </div>
            
            <div class="content-section warning">
              <h3>Co się dzieje dalej?</h3>
              <p style="font-size: 18px; font-weight: 600; color: #3c3333;">
                Prosimy o dokonanie wpłaty w ciągu <strong>24 godzin</strong> od momentu otrzymania tego maila.
              </p>
              <p style="font-size: 16px; font-weight: 500; color: #3c3333;">
                W przypadku braku wpłaty rezerwacja zostanie automatycznie anulowana.
              </p>
            </div>
            
            <div class="content-section highlight">
              <h3>Dane do przelewu</h3>
              <p><strong>Odbiorca:</strong> NOVA Maciej Cybulski</p>
              <p><strong>Bank:</strong> Bank Millennium</p>
              <p><strong>Numer rachunku:</strong> 76 1160 2202 0000 0005 3342 0769</p>
              <p style="font-size: 18px;"><strong>Kwota całkowita:</strong> <span style="font-size: 20px; color: #3c3333;">${rezerwacja.cenaCałkowita} PLN</span></p>
              <p><strong>Tytuł przelewu:</strong> Rezerwacja ${rezerwacja.imie} ${rezerwacja.nazwisko}</p>
            </div>
            
            <div class="content-section preparation-section">
              <h3>PRZYGOTUJ SIĘ NA WSPANIAŁY POBYT!</h3>
              <p>Czeka na Ciebie komfortowy domek w sercu lasu, otoczony naturalnym pięknem Pojezierza Kaszubskiego. Możesz już zacząć planować spacery po lesie, zbieranie grzybów, relaks w wannie pod gwiazdami czy wieczory przy kominku.</p>
              <p><strong>Dziękujemy za wybór STAVA!</strong></p>
            </div>
          </div>
          
          <div class="email-footer">
            <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
            <div class="decorative-line"></div>
            <div class="contact-info">
              <p class="footer-text">Email: ${EMAIL_CONFIG.admin}</p>
              <p class="footer-text">Telefon: +48 886 627 447</p>
              <p class="footer-text">Adres: ul. Wygonińska 38, 83-430 Stara Kiszewa</p>
            </div>
            <p class="footer-text small">Twój spokojny zakątek w naturze</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    // Stara struktura (dla kompatybilności)
    const startDate = formatDateForEmail(rezerwacja.startDate);
    const endDate = formatDateForEmail(rezerwacja.endDate);
    
    return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Potwierdzenie rezerwacji - ${EMAIL_CONFIG.appName}</title>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>STAVA</h1>
            <p>Potwierdzenie rezerwacji</p>
          </div>
          
          <div class="email-content">
            <h2>Cześć ${rezerwacja.imie}!</h2>
            
            <p>Dziękujemy za wybór naszej oferty!</p>
            
            <div class="content-section total-cost-section">
              <h3>Podsumowanie rezerwacji</h3>
              <p><strong>Łączna cena:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
            </div>
            
            <div class="content-section warning">
              <h3>Co się dzieje dalej?</h3>
              <p style="font-size: 18px; font-weight: 600; color: #3c3333;">
                Prosimy o dokonanie wpłaty w ciągu <strong>24 godzin</strong> od momentu otrzymania tego maila.
              </p>
              <p style="font-size: 16px; font-weight: 500; color: #3c3333;">
                W przypadku braku wpłaty rezerwacja zostanie automatycznie anulowana.
              </p>
            </div>
            
            <div class="content-section highlight">
              <h3>Dane do przelewu</h3>
              <p><strong>Odbiorca:</strong> NOVA Maciej Cybulski</p>
              <p><strong>Bank:</strong> Bank Millennium</p>
              <p><strong>Numer rachunku:</strong> 76 1160 2202 0000 0005 3342 0769</p>
              <p style="font-size: 18px;"><strong>Kwota całkowita:</strong> <span style="font-size: 20px; color: #3c3333;">${rezerwacja.cenaCałkowita} PLN</span></p>
              <p><strong>Tytuł przelewu:</strong> Rezerwacja ${rezerwacja.imie} ${rezerwacja.nazwisko}</p>
            </div>
            
            <div class="content-section preparation-section">
              <h3>PRZYGOTUJ SIĘ NA WSPANIAŁY POBYT!</h3>
              <p>Czeka na Ciebie komfortowy domek w sercu lasu, otoczony naturalnym pięknem Pojezierza Kaszubskiego. Możesz już zacząć planować spacery po lesie, zbieranie grzybów, relaks w wannie pod gwiazdami czy wieczory przy kominku.</p>
              <p><strong>Dziękujemy za wybór STAVA!</strong></p>
            </div>
          </div>
          
          <div class="email-footer">
            <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
            <div class="decorative-line"></div>
            <div class="contact-info">
              <p class="footer-text">Email: ${EMAIL_CONFIG.admin}</p>
              <p class="footer-text">Telefon: +48 886 627 447</p>
              <p class="footer-text">Adres: ul. Wygonińska 38, 83-430 Stara Kiszewa</p>
            </div>
            <p class="footer-text small">Twój spokojny zakątek w naturze</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

/**
 * HTML dla emaila do administratora (nowa logika - wiele domków)
 */
function generateAdminNotificationHTML(rezerwacja, panelUrl) {
  // Sprawdź czy to nowa struktura z selectedDomki
  if (rezerwacja.selectedDomki && Array.isArray(rezerwacja.selectedDomki)) {
    // Nowa struktura - wiele domków
    let domkiListHTML = '';
    
    rezerwacja.selectedDomki.forEach((domek, index) => {
      const startDate = formatDateForEmail(domek.startDate);
      const endDate = formatDateForEmail(domek.endDate);
      
      domkiListHTML += `
        <div style="margin-bottom: 15px; ${index > 0 ? 'border-top: 1px solid #e0e0e0; padding-top: 15px;' : ''}">
          <h4>Domek ${domek.domekId.replace('D', '')}</h4>
          <p><strong>Osoby:</strong> ${domek.liczbOsob} | <strong>Noce:</strong> ${domek.iloscNocy} | <strong>Cena:</strong> ${domek.cenaCałkowita || domek.cenaCalkowitaDomku} PLN</p>
          <p><strong>Przyjazd:</strong> ${startDate}</p>
          <p><strong>Wyjazd:</strong> ${endDate}</p>
        </div>
      `;
    });
    
    return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nowa rezerwacja - ${EMAIL_CONFIG.appName}</title>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>STAVA</h1>
            <p>Panel Administracyjny - Nowa Rezerwacja</p>
          </div>
          
          <div class="email-content">
            <div class="content-section error">
              <h2>Wymagana akcja!</h2>
              <p><strong>Otrzymano nową prośbę o rezerwację ${rezerwacja.selectedDomki.length} domków.</strong> Zaloguj się do panelu administracyjnego, aby sprawdzić dostępność wszystkich domków w podanych terminach i potwierdzić lub odrzucić całą rezerwację.</p>
            </div>
            
            <div class="content-section highlight">
              <h3>Dane gościa</h3>
              <p><strong>Imię i nazwisko:</strong> ${rezerwacja.imie} ${rezerwacja.nazwisko}</p>
              <p><strong>Email:</strong> <a href="mailto:${rezerwacja.email}">${rezerwacja.email}</a></p>
              <p><strong>Telefon:</strong> <a href="tel:${rezerwacja.telefon}">${rezerwacja.telefon}</a></p>
            </div>
            
            <div class="content-section total-cost-section">
              <h3>Podsumowanie rezerwacji</h3>
              <p><strong>Liczba domków:</strong> ${rezerwacja.selectedDomki.length}</p>
              <p><strong>Łączna liczba osób:</strong> ${rezerwacja.liczbOsob} ${rezerwacja.liczbOsob === 1 ? 'osoba' : rezerwacja.liczbOsob <= 4 ? 'osoby' : 'osób'}</p>
              <p><strong>Łączna cena:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
              ${rezerwacja.uwagi ? `<p><strong>Uwagi gościa:</strong><br/><em>"${rezerwacja.uwagi}"</em></p>` : ''}
            </div>
            
            <div class="content-section">
              <h3>Szczegóły domków</h3>
              ${domkiListHTML}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${panelUrl}" class="email-button">
                Otwórz Panel Administracyjny
              </a>
            </div>
            
            <div class="content-section success">
              <h3>Bezpieczeństwo i zarządzanie</h3>
              <p>Użyj powyższego linku, aby bezpiecznie zalogować się do panelu administracyjnego i zarządzać tą oraz innymi rezerwacjami.</p>
              <p><strong>Link do panelu:</strong><br/>
              <a href="${panelUrl}">${panelUrl}</a></p>
            </div>
          </div>
          
          <div class="email-footer">
            <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
            <div class="decorative-line"></div>
            <p class="footer-text">System zarządzania rezerwacjami</p>
            <p class="footer-text small">Automatyczna notyfikacja z systemu rezerwacji</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    // Stara struktura (dla kompatybilności)
    const startDate = formatDateForEmail(rezerwacja.startDate);
    const endDate = formatDateForEmail(rezerwacja.endDate);
    
    return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nowa rezerwacja - ${EMAIL_CONFIG.appName}</title>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>STAVA</h1>
            <p>Panel Administracyjny - Nowa Rezerwacja</p>
          </div>
          
          <div class="email-content">
            <div class="content-section error">
              <h2>Wymagana akcja!</h2>
              <p><strong>Otrzymano nową prośbę o rezerwację.</strong> Zaloguj się do panelu administracyjnego, aby sprawdzić dostępne domki w tym terminie i przydzielić odpowiedni domek do tej rezerwacji.</p>
            </div>
            
            <div class="content-section highlight">
              <h3>Dane gościa</h3>
              <p><strong>Imię i nazwisko:</strong> ${rezerwacja.imie} ${rezerwacja.nazwisko}</p>
              <p><strong>Email:</strong> <a href="mailto:${rezerwacja.email}">${rezerwacja.email}</a></p>
              <p><strong>Telefon:</strong> <a href="tel:${rezerwacja.telefon}">${rezerwacja.telefon}</a></p>
            </div>
            
            <div class="content-section total-cost-section">
              <h3>Szczegóły rezerwacji</h3>
              <p><strong>Liczba osób:</strong> ${rezerwacja.liczbOsob} ${rezerwacja.liczbOsob === 1 ? 'osoba' : rezerwacja.liczbOsob <= 4 ? 'osoby' : 'osób'}</p>
              <p><strong>Przyjazd:</strong> ${startDate}</p>
              <p><strong>Wyjazd:</strong> ${endDate}</p>
              <p><strong>Liczba nocy:</strong> ${rezerwacja.iloscNocy} ${rezerwacja.iloscNocy === 1 ? 'noc' : 'nocy'}</p>
              <p><strong>Cena całkowita:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
              ${rezerwacja.uwagi ? `<p><strong>Uwagi gościa:</strong><br/><em>"${rezerwacja.uwagi}"</em></p>` : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${panelUrl}" class="email-button">
                Otwórz Panel Administracyjny
              </a>
            </div>
            
            <div class="content-section success">
              <h3>Bezpieczeństwo i zarządzanie</h3>
              <p>Użyj powyższego linku, aby bezpiecznie zalogować się do panelu administracyjnego i zarządzać tą oraz innymi rezerwacjami.</p>
              <p><strong>Link do panelu:</strong><br/>
              <a href="${panelUrl}">${panelUrl}</a></p>
            </div>
          </div>
          
          <div class="email-footer">
            <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
            <div class="decorative-line"></div>
            <p class="footer-text">System zarządzania rezerwacjami</p>
            <p class="footer-text small">Automatyczna notyfikacja z systemu rezerwacji</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

/**
 * HTML dla emaila o zmianie statusu (nowa logika - wiele domków)
 */
function generateStatusUpdateHTML(rezerwacja, newStatus) {
  const isConfirmed = newStatus === 'potwierdzona';
  const isCancelled = newStatus === 'anulowana';
  const statusText = isConfirmed ? 'POTWIERDZONA' : (isCancelled ? 'ANULOWANA' : 'ODRZUCONA');
  
  // Sprawdź czy to nowa struktura z selectedDomki
  if (rezerwacja.selectedDomki && Array.isArray(rezerwacja.selectedDomki)) {
    // Nowa struktura - wiele domków
    let domkiListHTML = '';
    
    if (isConfirmed) {
      rezerwacja.selectedDomki.forEach((domek, index) => {
        const startDate = formatDateForEmail(domek.startDate);
        const endDate = formatDateForEmail(domek.endDate);
        
        domkiListHTML += `
          <div style="margin-bottom: 15px; ${index > 0 ? 'border-top: 1px solid #e0e0e0; padding-top: 15px;' : ''}">
            <h4>Domek ${domek.domekId.replace('D', '')}</h4>
            <p><strong>Osoby:</strong> ${domek.liczbOsob} | <strong>Noce:</strong> ${domek.iloscNocy} | <strong>Cena:</strong> ${domek.cenaCałkowita || domek.cenaCalkowitaDomku} PLN</p>
            <p><strong>Przyjazd:</strong> ${startDate}</p>
            <p><strong>Wyjazd:</strong> ${endDate}</p>
          </div>
        `;
      });
    }
    
    // Treść dla różnych statusów rezerwacji
    let statusContent = '';
    
    if (isConfirmed) {
      // Rezerwacja potwierdzona
      statusContent = 
        '<div class="content-section total-cost-section">' +
          '<h3>Szczegóły rezerwacji</h3>' +
          domkiListHTML +
          '<p><strong>Liczba osób:</strong> ' + rezerwacja.liczbOsob + '</p>' +
          '<p><strong>Kwota całkowita:</strong> ' + rezerwacja.cenaCałkowita + ' PLN</p>' +
        '</div>' +
        
        '<div class="content-section success">' +
          '<h3>Kontakt w razie pytań</h3>' +
          '<p>W razie jakichkolwiek pytań lub potrzeby dodatkowych informacji, prosimy o kontakt pod numer +48 886 627 447.</p>' +
        '</div>' +
        
        '<div class="content-section preparation-section">' +
          '<h3>PRZYGOTUJ SIĘ NA WSPANIAŁY POBYT!</h3>' +
          '<p>Czeka na Ciebie komfortowy domek w sercu lasu, otoczony naturalnym pięknem Pojezierza Kaszubskiego. Możesz już zacząć planować spacery po lesie, zbieranie grzybów, relaks w wannie pod gwiazdami czy wieczory przy kominku.</p>' +
          '<p><strong>Dziękujemy za wybór STAVA!</strong></p>' +
        '</div>';
    } else if (isCancelled) {
      // Rezerwacja anulowana
      statusContent = 
        '<div class="content-section error">' +
          '<h3>Przyczyna anulacji</h3>' +
          '<p>Rezerwacja została anulowana przez administratora obiektu. Może to być spowodowane między innymi:</p>' +
          '<p>• Brakiem wpłaty w wyznaczonym terminie 24 godzin<br/>' +
          '• Planowanymi pracami konserwacyjnymi<br/>' +
          '• Nieprzewidzianymi okolicznościami technicznymi</p>' +
        '</div>' +
        
        '<div class="content-section success">' +
          '<h3>Co możesz zrobić?</h3>' +
          '<p>• Sprawdź inne dostępne terminy na naszej stronie internetowej<br/>' +
          '• Skontaktuj się z nami bezpośrednio pod numerem +48 886 627 447<br/>' +
          '• Jeśli dokonałeś wpłaty, skontaktuj się z nami w celu rozliczenia</p>' +
        '</div>';
    } else {
      // Rezerwacja odrzucona
      statusContent = 
        '<div class="content-section warning">' +
          '<h3>Możliwe przyczyny odrzucenia</h3>' +
          '<p>• Rezerwacja nie została opłacona w wyznaczonym terminie<br/>' +
          '• W tym czasie planowane są prace konserwacyjne<br/>' +
          '• Wystąpiły nieprzewidziane okoliczności techniczne</p>' +
        '</div>' +
        
        '<div class="content-section success">' +
          '<h3>Co możesz zrobić?</h3>' +
          '<p>• Sprawdź inne dostępne terminy na naszej stronie internetowej<br/>' +
          '• Skontaktuj się z nami bezpośrednio w celu znalezienia alternatywnych dat</p>' +
        '</div>';
    }
    
    return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aktualizacja rezerwacji - ${EMAIL_CONFIG.appName}</title>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>STAVA</h1>
            <p>Aktualizacja statusu Twojej rezerwacji</p>
          </div>
          
          <div class="email-content">
            <h2>Cześć ${rezerwacja.imie}!</h2>
            
            <div class="content-section ${isConfirmed ? 'success' : (isCancelled ? 'error' : 'error')}">
              <h3>Status Twojej rezerwacji</h3>
              <p>Twoja rezerwacja została: <span class="status-badge ${isConfirmed ? 'success' : (isCancelled ? 'error' : 'error')}">${statusText}</span></p>
            </div>
            
            ${statusContent}
          </div>
          
          <div class="email-footer">
            <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
            <div class="decorative-line"></div>
            <div class="contact-info">
              <p class="footer-text">Email: ${EMAIL_CONFIG.admin}</p>
              <p class="footer-text">Telefon: +48 886 627 447</p>
              <p class="footer-text">Adres: ul. Wygonińska 38, 83-430 Stara Kiszewa</p>
            </div>
            <p class="footer-text small">Twój spokojny zakątek w naturze</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    // Stara struktura (fallback)
    const startDate = formatDateForEmail(rezerwacja.startDate);
    const endDate = formatDateForEmail(rezerwacja.endDate);
    
    // Treść dla różnych statusów (stara struktura)
    let statusContentOld = '';
    
    if (isConfirmed) {
      // Rezerwacja potwierdzona
      statusContentOld = 
        '<div class="content-section total-cost-section">' +
          '<h3>Podsumowanie rezerwacji</h3>' +
          '<p><strong>Domek:</strong> ' + (rezerwacja.domekId ? rezerwacja.domekId.replace('D', '') : 'Do przydzielenia') + '</p>' +
          '<p><strong>Przyjazd:</strong> ' + startDate + '</p>' +
          '<p><strong>Wyjazd:</strong> ' + endDate + '</p>' +
          '<p><strong>Liczba osób:</strong> ' + rezerwacja.liczbOsob + '</p>' +
          '<p><strong>Liczba nocy:</strong> ' + rezerwacja.iloscNocy + '</p>' +
          '<p><strong>Kwota całkowita:</strong> ' + rezerwacja.cenaCałkowita + ' PLN</p>' +
        '</div>' +
        
        '<div class="content-section success">' +
          '<h3>Kontakt w razie pytań</h3>' +
          '<p>W razie jakichkolwiek pytań lub potrzeby dodatkowych informacji, prosimy o kontakt pod numer +48 886 627 447.</p>' +
        '</div>' +
        
        '<div class="content-section preparation-section">' +
          '<h3>PRZYGOTUJ SIĘ NA WSPANIAŁY POBYT!</h3>' +
          '<p>Czeka na Ciebie komfortowy domek w sercu lasu, otoczony naturalnym pięknem Pojezierza Kaszubskiego. Możesz już zacząć planować spacery po lesie, zbieranie grzybów, relaks w wannie pod gwiazdami czy wieczory przy kominku.</p>' +
          '<p><strong>Dziękujemy za wybór STAVA!</strong></p>' +
        '</div>';
    } else if (isCancelled) {
      // Rezerwacja anulowana
      statusContentOld = 
        '<div class="content-section error">' +
          '<h3>Przyczyna anulacji</h3>' +
          '<p>Rezerwacja została anulowana przez administratora obiektu. Może to być spowodowane między innymi:</p>' +
          '<p>• Brakiem wpłaty w wyznaczonym terminie 24 godzin<br/>' +
          '• Planowanymi pracami konserwacyjnymi<br/>' +
          '• Nieprzewidzianymi okolicznościami technicznymi</p>' +
        '</div>' +
        
        '<div class="content-section success">' +
          '<h3>Co możesz zrobić?</h3>' +
          '<p>• Sprawdź inne dostępne terminy na naszej stronie internetowej<br/>' +
          '• Skontaktuj się z nami bezpośrednio pod numerem +48 886 627 447<br/>' +
          '• Jeśli dokonałeś wpłaty, skontaktuj się z nami w celu rozliczenia</p>' +
        '</div>';
    } else {
      // Rezerwacja odrzucona
      statusContentOld = 
        '<div class="content-section warning">' +
          '<h3>Możliwe przyczyny odrzucenia</h3>' +
          '<p>• Rezerwacja nie została opłacona w wyznaczonym terminie<br/>' +
          '• W tym czasie planowane są prace konserwacyjne<br/>' +
          '• Wystąpiły nieprzewidziane okoliczności techniczne</p>' +
        '</div>' +
        
        '<div class="content-section success">' +
          '<h3>Co możesz zrobić?</h3>' +
          '<p>• Sprawdź inne dostępne terminy na naszej stronie internetowej<br/>' +
          '• Skontaktuj się z nami bezpośrednio w celu znalezienia alternatywnych dat</p>' +
        '</div>';
    }
    
    return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aktualizacja rezerwacji - ${EMAIL_CONFIG.appName}</title>
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>STAVA</h1>
            <p>Aktualizacja statusu Twojej rezerwacji</p>
          </div>
          
          <div class="email-content">
            <h2>Cześć ${rezerwacja.imie}!</h2>
            
            <div class="content-section ${isConfirmed ? 'success' : (isCancelled ? 'error' : 'error')}">
              <h3>Status Twojej rezerwacji</h3>
              <p>Twoja rezerwacja została: <span class="status-badge ${isConfirmed ? 'success' : (isCancelled ? 'error' : 'error')}">${statusText}</span></p>
            </div>
            
            ${statusContentOld}
          </div>
          
          <div class="email-footer">
            <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
            <div class="decorative-line"></div>
            <div class="contact-info">
              <p class="footer-text">Email: ${EMAIL_CONFIG.admin}</p>
              <p class="footer-text">Telefon: +48 886 627 447</p>
              <p class="footer-text">Adres: ul. Wygonińska 38, 83-430 Stara Kiszewa</p>
            </div>
            <p class="footer-text small">Twój spokojny zakątek w naturze</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
} 

