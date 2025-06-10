import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);


const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@stavakiszewa.pl',
  admin: process.env.EMAIL_ADMIN || 'kontakt@stavakiszewa.pl',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://stavakiszewa.pl',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'STAVA Kiszewa'
};

/**
 * Wysyła email potwierdzenia rezerwacji do klienta
 * @param {Object} rezerwacjaData - Dane rezerwacji
 * @returns {Promise<Object>} Wynik wysyłania
 */
export const sendConfirmationEmailToGuest = async (rezerwacjaData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [rezerwacjaData.email],
      subject: `✅ Potwierdzenie rezerwacji w ${EMAIL_CONFIG.appName}`,
      html: generateGuestConfirmationHTML(rezerwacjaData),
    });

    if (error) {
      console.error('Błąd wysyłania emaila do gościa:', error);
      throw error;
    }

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
    const confirmationUrl = `${EMAIL_CONFIG.appUrl}/potwierdzenie/${rezerwacjaData.tokenPotwierdzenia}`;
    
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [EMAIL_CONFIG.admin],
      subject: `🏡 Nowa rezerwacja w ${EMAIL_CONFIG.appName}`,
      html: generateAdminNotificationHTML(rezerwacjaData, confirmationUrl),
    });

    if (error) {
      console.error('Błąd wysyłania emaila do admina:', error);
      throw error;
    }

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
    const subject = newStatus === 'potwierdzona' 
      ? `🎉 Twoja rezerwacja została potwierdzona!`
      : `😔 Informacja o rezerwacji`;

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [rezerwacjaData.email],
      subject,
      html: generateStatusUpdateHTML(rezerwacjaData, newStatus),
    });

    if (error) {
      console.error('Błąd wysyłania emaila o statusie:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Błąd w sendStatusUpdateEmail:', error);
    throw error;
  }
};

/**
 * Generuje HTML dla emaila potwierdzenia do gościa
 */
function generateGuestConfirmationHTML(rezerwacja) {
  const startDate = new Date(rezerwacja.startDate).toLocaleDateString('pl-PL');
  const endDate = new Date(rezerwacja.endDate).toLocaleDateString('pl-PL');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #365314 0%, #3f6212 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e5e5; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 14px; color: #666; }
        .highlight { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #92400e 0%, #7c2d12 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌲 ${EMAIL_CONFIG.appName}</h1>
          <p>Dziękujemy za rezerwację!</p>
        </div>
        
        <div class="content">
          <h2>Cześć ${rezerwacja.imie}!</h2>
          
          <p>Otrzymaliśmy Twoją rezerwację i już się nią zajmujemy. Oto szczegóły:</p>
          
          <div class="highlight">
            <h3>📋 Szczegóły rezerwacji</h3>
            <p><strong>Domek:</strong> ${rezerwacja.domekNazwa}</p>
            <p><strong>Liczba osób:</strong> ${rezerwacja.liczbOsob}</p>
            <p><strong>Termin:</strong> ${startDate} - ${endDate}</p>
            <p><strong>Liczba nocy:</strong> ${rezerwacja.iloscNocy}</p>
            <p><strong>Cena całkowita:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
          </div>
          
          <h3>📞 Dane kontaktowe</h3>
          <p><strong>Email:</strong> ${rezerwacja.email}</p>
          <p><strong>Telefon:</strong> ${rezerwacja.telefon}</p>
          ${rezerwacja.uwagi ? `<p><strong>Uwagi:</strong> ${rezerwacja.uwagi}</p>` : ''}
          
          <h3>⏳ Co dalej?</h3>
          <p>Twoja rezerwacja ma status <strong>"oczekująca"</strong>. Skontaktujemy się z Tobą w ciągu 24 godzin, aby potwierdzić dostępność i przekazać dalsze instrukcje.</p>
          
          <p>Jeśli masz pytania, śmiało się z nami skontaktuj!</p>
        </div>
        
        <div class="footer">
          <p>📧 ${EMAIL_CONFIG.admin} | 📞 +48 123 456 789</p>
          <p>🌲 ${EMAIL_CONFIG.appName} - Twój spokojny zakątek w naturze</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generuje HTML dla emaila do administratora
 */
function generateAdminNotificationHTML(rezerwacja, confirmationUrl) {
  const startDate = new Date(rezerwacja.startDate).toLocaleDateString('pl-PL');
  const endDate = new Date(rezerwacja.endDate).toLocaleDateString('pl-PL');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #92400e 0%, #7c2d12 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e5e5; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 14px; color: #666; }
        .highlight { background: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #92400e; }
        .button { display: inline-block; background: linear-gradient(135deg, #365314 0%, #3f6212 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 5px; }
        .urgent { background: #fef2f2; border-left-color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏡 Nowa Rezerwacja!</h1>
          <p>${EMAIL_CONFIG.appName}</p>
        </div>
        
        <div class="content">
          <div class="highlight urgent">
            <h2>⚡ Wymagana akcja!</h2>
            <p>Otrzymano nową rezerwację, która wymaga Twojego potwierdzenia.</p>
          </div>
          
          <div class="highlight">
            <h3>👤 Dane gościa</h3>
            <p><strong>Imię:</strong> ${rezerwacja.imie}</p>
            <p><strong>Nazwisko:</strong> ${rezerwacja.nazwisko}</p>
            <p><strong>Email:</strong> ${rezerwacja.email}</p>
            <p><strong>Telefon:</strong> ${rezerwacja.telefon}</p>
          </div>
          
          <div class="highlight">
            <h3>🏠 Szczegóły rezerwacji</h3>
            <p><strong>Domek:</strong> ${rezerwacja.domekNazwa}</p>
            <p><strong>Liczba osób:</strong> ${rezerwacja.liczbOsob}</p>
            <p><strong>Termin:</strong> ${startDate} - ${endDate}</p>
            <p><strong>Liczba nocy:</strong> ${rezerwacja.iloscNocy}</p>
            <p><strong>Cena całkowita:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
            ${rezerwacja.uwagi ? `<p><strong>Uwagi gościa:</strong> ${rezerwacja.uwagi}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}?action=confirm" class="button">✅ Potwierdź rezerwację</a>
            <a href="${confirmationUrl}?action=reject" class="button" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">❌ Odrzuć rezerwację</a>
          </div>
          
          <p><strong>Link do zarządzania:</strong><br>
          <a href="${confirmationUrl}">${confirmationUrl}</a></p>
        </div>
        
        <div class="footer">
          <p>System zarządzania rezerwacjami ${EMAIL_CONFIG.appName}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generuje HTML dla emaila o zmianie statusu
 */
function generateStatusUpdateHTML(rezerwacja, newStatus) {
  const startDate = new Date(rezerwacja.startDate).toLocaleDateString('pl-PL');
  const endDate = new Date(rezerwacja.endDate).toLocaleDateString('pl-PL');
  
  const isConfirmed = newStatus === 'potwierdzona';
  const headerColor = isConfirmed ? '#365314' : '#dc2626';
  const statusText = isConfirmed ? 'POTWIERDZONA' : 'ODRZUCONA';
  const statusIcon = isConfirmed ? '🎉' : '😔';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${headerColor}; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e5e5; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 14px; color: #666; }
        .highlight { background: ${isConfirmed ? '#f0f9ff' : '#fef2f2'}; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .status-badge { background: ${headerColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusIcon} ${EMAIL_CONFIG.appName}</h1>
          <p>Aktualizacja statusu rezerwacji</p>
        </div>
        
        <div class="content">
          <h2>Cześć ${rezerwacja.imie}!</h2>
          
          <div class="highlight">
            <h3>Status Twojej rezerwacji: <span class="status-badge">${statusText}</span></h3>
          </div>
          
          ${isConfirmed ? `
            <p>Świetne wiadomości! Twoja rezerwacja została potwierdzona. Czekamy na Ciebie w wyznaczonym terminie!</p>
            
            <h3>📋 Przypomnienie szczegółów</h3>
            <div class="highlight">
              <p><strong>Domek:</strong> ${rezerwacja.domekNazwa}</p>
              <p><strong>Termin:</strong> ${startDate} - ${endDate}</p>
              <p><strong>Liczba osób:</strong> ${rezerwacja.liczbOsob}</p>
              <p><strong>Liczba nocy:</strong> ${rezerwacja.iloscNocy}</p>
              <p><strong>Cena całkowita:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
            </div>
            
            <h3>📞 Dalsze kroki</h3>
            <p>W najbliższych dniach skontaktujemy się z Tobą, aby omówić szczegóły przyjazdu i płatności.</p>
            
            <p>Dziękujemy za wybór ${EMAIL_CONFIG.appName}! 🌲</p>
          ` : `
            <p>Niestety, musimy poinformować Cię, że Twoja rezerwacja nie została potwierdzona.</p>
            
            <h3>Możliwe przyczyny:</h3>
            <ul>
              <li>Termin jest już zajęty</li>
              <li>Prowadzone są prace konserwacyjne</li>
              <li>Inne okoliczności techniczne</li>
            </ul>
            
            <p>Zachęcamy do sprawdzenia innych dostępnych terminów na naszej stronie lub skontaktowania się z nami w celu znalezienia alternatywnego rozwiązania.</p>
            
            <p>Przepraszamy za niedogodności i mamy nadzieję na współpracę w przyszłości.</p>
          `}
        </div>
        
        <div class="footer">
          <p>📧 ${EMAIL_CONFIG.admin} | 📞 +48 123 456 789</p>
          <p>🌲 ${EMAIL_CONFIG.appName} - Twój spokojny zakątek w naturze</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 