import { Resend } from 'resend';

// Inicjalizacja Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@stavakiszewa.pl',
  admin: process.env.EMAIL_ADMIN || 'kontakt@stavakiszewa.pl',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://stavakiszewa.pl',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'STAVA Kiszewa'
};

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

// Wspólne style dla wszystkich emaili - dopasowane do strony
const getEmailStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.6;
      color: #3c3333;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #fdf2d0;
    }
    
    .email-header {
      background: linear-gradient(135deg, #3c3333 0%, #3c3333 100%);
      color: #fdf2d0;
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
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(227,224,216,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(227,224,216,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(227,224,216,0.1)"/></svg>');
      pointer-events: none;
    }
    
    .email-header h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;
    }
    
    .email-header p {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 0.05em;
      opacity: 0.9;
      position: relative;
      z-index: 1;
    }
    
    .email-content {
      padding: 40px 30px;
      background-color: #ffffff;
    }
    
    .email-footer {
      background-color: #fdf2d0;
      padding: 30px;
      text-align: center;
      border-top: 2px solid #fdf2d0;
    }
    
    .content-section {
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      margin: 24px 0;
      border-left: 4px solid #3c3333;
      position: relative;
    }
    
    .content-section.highlight {
      background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
      border-left-color: #3c3333;
    }
    
    .content-section.success {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left-color: #0284c7;
    }
    
    .content-section.warning {
      background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
      border-left-color: #eab308;
    }
    
    .content-section.error {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-left-color: #dc2626;
    }
    
    h2, h3, h4 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #3c3333;
      margin-bottom: 16px;
    }
    
    h2 {
      font-size: 22px;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 18px;
    }
    
    h4 {
      font-size: 16px;
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
      background: linear-gradient(135deg, #3c3333 0%, #3c3333 100%);
      color: #fdf2d0 !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-align: center;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .email-button:hover {
      background: linear-gradient(135deg, #3c3333 0%, #3c3333 100%);
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
      background: #3c3333;
      color: #fdf2d0;
      padding: 8px 16px;
      border-radius: 20px;
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
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #fdf2d0;
      margin: 20px 0;
      font-style: italic;
      border-left: 4px solid #3c3333;
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
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #3c3333;
      text-align: center;
      margin: 20px 0;
    }
    
    .decorative-line {
      width: 60px;
      height: 2px;
      background: linear-gradient(135deg, #3c3333 0%, #3c3333 100%);
      margin: 20px auto;
    }
    
    a {
      color: #3c3333;
      text-decoration: underline;
      transition: color 0.3s ease;
    }
    
    a:hover {
      color: #3c3333;
    }
    
    .contact-info {
      background: #fdf2d0;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      margin: 16px 0;
    }
    
    .contact-info p {
      margin-bottom: 4px;
      font-size: 14px;
    }
    
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 10px;
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
      subject: `🌲 Otrzymaliśmy Twoją prośbę o rezerwację w ${EMAIL_CONFIG.appName}`,
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
      subject: `🏡 Nowa prośba o rezerwację w ${EMAIL_CONFIG.appName} [Wymaga akcji]`,
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
      ? `🎉 Twoja rezerwacja w ${EMAIL_CONFIG.appName} została potwierdzona!`
      : `😔 Informacja o rezerwacji w ${EMAIL_CONFIG.appName}`;

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
          <h1>📧 ${EMAIL_CONFIG.appName}</h1>
          <p>Nowa wiadomość z formularza kontaktowego</p>
        </div>
        
        <div class="email-content">
          <h2>Szczegóły wiadomości</h2>
          
          <div class="content-section highlight">
            <h3>📝 Informacje podstawowe</h3>
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
            <h3>👤 Dane nadawcy</h3>
            <p><strong>Imię:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
          </div>
          
          <div class="message-box">
            <h3>💬 Treść wiadomości</h3>
            <p style="white-space: pre-line; margin-top: 12px;">${contactData.message}</p>
          </div>
          
          <div class="content-section success">
            <h3>📞 Jak odpowiedzieć</h3>
            <p>Możesz odpowiedzieć bezpośrednio na ten email - zostanie on automatycznie wysłany na adres: <strong>${contactData.email}</strong></p>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
          <div class="decorative-line"></div>
          <p class="footer-text">Wiadomość automatycznie wysłana z formularza kontaktowego</p>
          <p class="footer-text small">System zarządzania wiadomościami</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * HTML dla emaila potwierdzenia do gościa
 */
function generateGuestConfirmationHTML(rezerwacja) {
  const startDate = new Date(rezerwacja.startDate).toLocaleDateString('pl-PL', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const endDate = new Date(rezerwacja.endDate).toLocaleDateString('pl-PL', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
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
          <h1>🌲 ${EMAIL_CONFIG.appName}</h1>
          <p>Dziękujemy za Twoje zapytanie o rezerwację</p>
        </div>
        
        <div class="email-content">
          <h2>Cześć ${rezerwacja.imie}!</h2>
          
          <p>Otrzymaliśmy Twoją prośbę o rezerwację i bardzo się cieszymy, że chcesz spędzić z nami czas w otoczeniu natury. Oto podsumowanie Twojego zapytania:</p>
          
          <div class="content-section highlight">
            <h3>📋 Szczegóły Twojego zapytania</h3>
            <p><strong>Liczba osób:</strong> ${rezerwacja.liczbOsob} ${rezerwacja.liczbOsob === 1 ? 'osoba' : rezerwacja.liczbOsob <= 4 ? 'osoby' : 'osób'}</p>
            <p><strong>Termin przyjazdu:</strong> ${startDate}</p>
            <p><strong>Termin wyjazdu:</strong> ${endDate}</p>
            <p><strong>Liczba nocy:</strong> ${rezerwacja.iloscNocy} ${rezerwacja.iloscNocy === 1 ? 'noc' : 'nocy'}</p>
            <p><strong>Szacowana cena całkowita:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
          </div>
          
          <div class="content-section">
            <h3>📞 Twoje dane kontaktowe</h3>
            <p><strong>Email:</strong> ${rezerwacja.email}</p>
            <p><strong>Telefon:</strong> ${rezerwacja.telefon}</p>
            ${rezerwacja.uwagi ? `<p><strong>Twoje uwagi:</strong> ${rezerwacja.uwagi}</p>` : ''}
          </div>
          
          <div class="content-section warning">
            <h3>⏳ Co dzieje się dalej?</h3>
            <p>Twoja prośba o rezerwację ma obecnie status: <span class="status-badge">Oczekująca</span></p>
            <p>W ciągu najbliższych <strong>24 godzin</strong> sprawdzimy dostępność w wybranym terminie i wyślemy Ci ostateczne potwierdzenie wraz z:</p>
            <p>• Informacją o przydzielonym domku<br/>
            • Szczegółami dotyczącymi płatności<br/>
            • Instrukcjami dojazdu i zameldowania</p>
          </div>
          
          <div class="content-section success">
            <h3>💡 Przydatne informacje</h3>
            <p><strong>Zameldowanie:</strong> od 15:00<br/>
            <strong>Wymeldowanie:</strong> do 11:00<br/>
            <strong>Kontakt w razie pytań:</strong> odpowiedz na tę wiadomość</p>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
          <div class="decorative-line"></div>
          <div class="contact-info">
            <p class="footer-text"><strong>📧</strong> ${EMAIL_CONFIG.admin}</p>
            <p class="footer-text"><strong>📞</strong> +48 886 627 447</p>
            <p class="footer-text"><strong>📍</strong> ul. Wygonińska 38, 83-430 Stara Kiszewa</p>
          </div>
          <p class="footer-text small">Twój spokojny zakątek w naturze</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * HTML dla emaila do administratora
 */
function generateAdminNotificationHTML(rezerwacja, panelUrl) {
  const startDate = new Date(rezerwacja.startDate).toLocaleDateString('pl-PL', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const endDate = new Date(rezerwacja.endDate).toLocaleDateString('pl-PL', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
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
          <h1>🏡 ${EMAIL_CONFIG.appName}</h1>
          <p>Panel Administracyjny - Nowa Rezerwacja</p>
        </div>
        
        <div class="email-content">
          <div class="content-section error">
            <h2>⚡ Wymagana akcja!</h2>
            <p><strong>Otrzymano nową prośbę o rezerwację.</strong> Zaloguj się do panelu administracyjnego, aby sprawdzić dostępne domki w tym terminie i przydzielić odpowiedni domek do tej rezerwacji.</p>
          </div>
          
          <div class="content-section highlight">
            <h3>👤 Dane gościa</h3>
            <p><strong>Imię i nazwisko:</strong> ${rezerwacja.imie} ${rezerwacja.nazwisko}</p>
            <p><strong>Email:</strong> <a href="mailto:${rezerwacja.email}">${rezerwacja.email}</a></p>
            <p><strong>Telefon:</strong> <a href="tel:${rezerwacja.telefon}">${rezerwacja.telefon}</a></p>
          </div>
          
          <div class="content-section">
            <h3>🏠 Szczegóły rezerwacji</h3>
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
            <h3>🔒 Bezpieczeństwo i zarządzanie</h3>
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

/**
 * HTML dla emaila o zmianie statusu
 */
function generateStatusUpdateHTML(rezerwacja, newStatus) {
  const startDate = new Date(rezerwacja.startDate).toLocaleDateString('pl-PL', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const endDate = new Date(rezerwacja.endDate).toLocaleDateString('pl-PL', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  const isConfirmed = newStatus === 'potwierdzona';
  const statusText = isConfirmed ? 'POTWIERDZONA' : 'ODRZUCONA';
  const statusIcon = isConfirmed ? '🎉' : '😔';
  
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
          <h1>${statusIcon} ${EMAIL_CONFIG.appName}</h1>
          <p>Aktualizacja statusu Twojej rezerwacji</p>
        </div>
        
        <div class="email-content">
          <h2>Cześć ${rezerwacja.imie}!</h2>
          
          <div class="content-section ${isConfirmed ? 'success' : 'error'}">
            <h3>Status Twojej rezerwacji</h3>
            <p>Twoja rezerwacja została: <span class="status-badge ${isConfirmed ? 'success' : 'error'}">${statusText}</span></p>
          </div>
          
          ${isConfirmed ? `
            <p>Świetne wiadomości! Twoja rezerwacja została potwierdzona i już nie możemy się doczekać, kiedy Cię ugościmy w naszym leśnym zakątku!</p>
            
            <div class="content-section highlight">
              <h3>📋 Szczegóły Twojej potwierdzonej rezerwacji</h3>
              <p><strong>Przydzielony domek:</strong> ${rezerwacja.domekNazwa || 'Zostanie przydzielony wkrótce'}</p>
              <p><strong>Przyjazd:</strong> ${startDate} (od 15:00)</p>
              <p><strong>Wyjazd:</strong> ${endDate} (do 11:00)</p>
              <p><strong>Liczba osób:</strong> ${rezerwacja.liczbOsob} ${rezerwacja.liczbOsob === 1 ? 'osoba' : rezerwacja.liczbOsob <= 4 ? 'osoby' : 'osób'}</p>
              <p><strong>Liczba nocy:</strong> ${rezerwacja.iloscNocy} ${rezerwacja.iloscNocy === 1 ? 'noc' : 'nocy'}</p>
              <p><strong>Cena całkowita:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
            </div>
            
            <div class="content-section success">
              <h3>📞 Następne kroki</h3>
              <p>W najbliższych dniach skontaktujemy się z Tobą telefonicznie lub mailowo, aby omówić:</p>
              <p>• Szczegóły płatności<br/>
              • Instrukcje dojazdu<br/>
              • Informacje o zameldowaniu<br/>
              • Odpowiedzi na ewentualne pytania</p>
            </div>
            
            <div class="content-section">
              <h3>🌲 Przygotuj się na wspaniały pobyt!</h3>
              <p>Czeka na Ciebie komfortowy domek w sercu lasu, otoczony naturalnym pięknem Starej Kiszewy. Możesz już zacząć planować spacery po lesie, relaks w balii pod gwiazdami czy wieczory przy kominku.</p>
            </div>
            
            <p><strong>Dziękujemy za wybór ${EMAIL_CONFIG.appName}!</strong> 🌲</p>
          ` : `
            <p>Bardzo żałujemy, ale musimy poinformować Cię, że Twoja rezerwacja w terminie ${startDate} - ${endDate} nie mogła zostać potwierdzona.</p>
            
            <div class="content-section warning">
              <h3>📝 Możliwe przyczyny</h3>
              <p>• Wybrany termin jest już w pełni zarezerwowany<br/>
              • W tym czasie planowane są prace konserwacyjne<br/>
              • Wystąpiły nieprzewidziane okoliczności techniczne<br/>
              • Ograniczenia związane z pogodą lub sezonowością</p>
            </div>
            
            <div class="content-section success">
              <h3>💡 Co możesz zrobić?</h3>
              <p>• Sprawdź inne dostępne terminy na naszej stronie internetowej<br/>
              • Skontaktuj się z nami bezpośrednio w celu znalezienia alternatywnych dat<br/>
              • Zapisz się na listę powiadomień o wolnych terminach</p>
            </div>
            
            <p>Przepraszamy za niedogodności i bardzo mamy nadzieję, że uda nam się gościć Cię w przyszłości. Las zawsze tu będzie czekał! 🌲</p>
          `}
        </div>
        
        <div class="email-footer">
          <div class="brand-signature">${EMAIL_CONFIG.appName}</div>
          <div class="decorative-line"></div>
          <div class="contact-info">
            <p class="footer-text"><strong>📧</strong> ${EMAIL_CONFIG.admin}</p>
            <p class="footer-text"><strong>📞</strong> +48 886 627 447</p>
            <p class="footer-text"><strong>📍</strong> ul. Wygonińska 38, 83-430 Stara Kiszewa</p>
          </div>
          <p class="footer-text small">Twój spokojny zakątek w naturze</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 
