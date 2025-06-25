import { NextResponse } from 'next/server';
import { sendContactEmail, sendConfirmationEmailToGuest, sendNewReservationEmailToAdmin } from '@/lib/email';
import { rateLimitStoreFunction, getClientIP } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    // Rate limiting - 5 wiadomości na godzinę
    const clientIP = getClientIP(request);
    const isAllowed = rateLimitStoreFunction(`contact_${clientIP}`, 5, 60 * 60 * 1000);
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Za dużo wiadomości. Spróbuj ponownie za godzinę.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Sprawdź typ żądania
    if (body.type === 'reservation') {
      // Obsługa emaili rezerwacyjnych
      const { formData } = body;
      
      // Walidacja danych rezerwacji
      if (!formData.email || !formData.tokenPotwierdzenia) {
        return NextResponse.json(
          { error: 'Brak wymaganych danych rezerwacji (email, token)' },
          { status: 400 }
        );
      }
      
      const results = {};
      
      // Wysyłanie emaila do gościa
      try {
        const guestEmailResult = await sendConfirmationEmailToGuest(formData);
        results.guestEmail = guestEmailResult;
      } catch (error) {
        console.error('Błąd wysyłania emaila do gościa:', error);
        results.guestEmailError = error.message;
      }
      
      // Wysyłanie emaila do administratora
      try {
        const adminEmailResult = await sendNewReservationEmailToAdmin(formData);
        results.adminEmail = adminEmailResult;
      } catch (error) {
        console.error('Błąd wysyłania emaila do administratora:', error);
        results.adminEmailError = error.message;
      }
      
      // Sprawdzenie rezultatów
      const hasSuccess = results.guestEmail || results.adminEmail;
      const hasErrors = results.guestEmailError || results.adminEmailError;
      
      if (hasSuccess) {
        return NextResponse.json({
          success: true,
          message: 'Emaile rezerwacyjne zostały wysłane',
          results
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Błąd podczas wysyłania emaili rezerwacyjnych',
          results
        }, { status: 500 });
      }
      
    } else {
      // Obsługa standardowego formularza kontaktowego
      const { name, email, subject, message } = body;

      // Walidacja danych
      if (!name || !email || !subject || !message) {
        return NextResponse.json(
          { error: 'Wszystkie pola są wymagane.' },
          { status: 400 }
        );
      }

      // Walidacja emaila
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Nieprawidłowy adres email.' },
          { status: 400 }
        );
      }

      // Walidacja długości
      if (name.length > 100 || subject.length > 200 || message.length > 2000) {
        return NextResponse.json(
          { error: 'Dane są zbyt długie.' },
          { status: 400 }
        );
      }

      // Sanityzacja danych
      const contactData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim()
      };

      // Wysyłanie emaila kontaktowego
      await sendContactEmail(contactData);

      return NextResponse.json(
        { message: 'Wiadomość została wysłana pomyślnie!' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Błąd w API contact:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.' },
      { status: 500 }
    );
  }
} 