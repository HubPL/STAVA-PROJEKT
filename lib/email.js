import { Resend } from 'resend';

// Inicjalizacja Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Konfiguracja emaili
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@stavakiszewa.pl',
  admin: process.env.EMAIL_ADMIN || 'kontakt@stavakiszewa.pl',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
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
      console.error('❌ Błąd wysyłania emaila do gościa:', error);
      throw error;
    }

    console.log('✅ Email do gościa wysłany:', data);
    return data;
  } catch (error) {
    console.error('❌ Błąd w sendConfirmationEmailToGuest:', error);
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
      console.error('❌ Błąd wysyłania emaila do admina:', error);
      throw error;
    }

    console.log('✅ Email do admina wysłany:', data);
    return data;
  } catch (error) {
    console.error('❌ Błąd w sendNewReservationEmailToAdmin:', error);
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
      console.error('❌ Błąd wysyłania emaila o statusie:', error);
      throw error;
    }

    console.log('✅ Email o statusie wysłany:', data);
    return data;
  } catch (error) {
    console.error('❌ Błąd w sendStatusUpdateEmail:', error);
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
          
          <h3>👤 Dane klienta</h3>
          <p><strong>Imię i nazwisko:</strong> ${rezerwacja.imie} ${rezerwacja.nazwisko}</p>
          <p><strong>Email:</strong> ${rezerwacja.email}</p>
          <p><strong>Telefon:</strong> ${rezerwacja.telefon}</p>
          
          <div class="highlight">
            <h3>📋 Szczegóły rezerwacji</h3>
            <p><strong>Domek:</strong> ${rezerwacja.domekNazwa}</p>
            <p><strong>Liczba osób:</strong> ${rezerwacja.liczbOsob}</p>
            <p><strong>Termin:</strong> ${startDate} - ${endDate}</p>
            <p><strong>Liczba nocy:</strong> ${rezerwacja.iloscNocy}</p>
            <p><strong>Cena całkowita:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
            ${rezerwacja.uwagi ? `<p><strong>Uwagi klienta:</strong> ${rezerwacja.uwagi}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" class="button">✅ Zarządzaj Rezerwacją</a>
          </div>
          
          <p><small>Link do zarządzania: <a href="${confirmationUrl}">${confirmationUrl}</a></small></p>
        </div>
        
        <div class="footer">
          <p>🤖 Automatyczna wiadomość z systemu rezerwacji</p>
          <p>${EMAIL_CONFIG.appName}</p>
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
  
  const statusInfo = {
    potwierdzona: {
      icon: '🎉',
      title: 'Rezerwacja potwierdzona!',
      message: 'Świetne wieści! Twoja rezerwacja została potwierdzona.',
      color: '#16a34a',
      bgColor: '#f0fdf4'
    },
    odrzucona: {
      icon: '😔',
      title: 'Informacja o rezerwacji',
      message: 'Niestety, nie możemy potwierdzić Twojej rezerwacji na wybrany termin.',
      color: '#dc2626',
      bgColor: '#fef2f2'
    }
  };
  
  const status = statusInfo[newStatus] || statusInfo.odrzucona;
  
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
        .status-box { background: ${status.bgColor}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${status.color}; text-align: center; }
        .highlight { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌲 ${EMAIL_CONFIG.appName}</h1>
        </div>
        
        <div class="content">
          <h2>Cześć ${rezerwacja.imie}!</h2>
          
          <div class="status-box">
            <h2>${status.icon} ${status.title}</h2>
            <p style="font-size: 18px; margin: 0;">${status.message}</p>
          </div>
          
          <div class="highlight">
            <h3>📋 Szczegóły rezerwacji</h3>
            <p><strong>Domek:</strong> ${rezerwacja.domekNazwa}</p>
            <p><strong>Termin:</strong> ${startDate} - ${endDate}</p>
            <p><strong>Liczba osób:</strong> ${rezerwacja.liczbOsob}</p>
            <p><strong>Cena całkowita:</strong> ${rezerwacja.cenaCałkowita} PLN</p>
          </div>
          
          ${newStatus === 'potwierdzona' ? `
            <h3>📞 Następne kroki</h3>
            <p>Skontaktujemy się z Tobą w ciągu 24 godzin, aby omówić szczegóły przyjazdu i płatności.</p>
            <p>Przygotuj się na wspaniały wypoczynek w naturze! 🌲</p>
          ` : `
            <h3>💡 Alternatywne terminy</h3>
            <p>Jeśli jesteś zainteresowany innymi terminami, śmiało skontaktuj się z nami. Chętnie pomożemy znaleźć idealny termin dla Twojego pobytu.</p>
          `}
          
          <p>Jeśli masz pytania, nie wahaj się z nami skontaktować!</p>
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